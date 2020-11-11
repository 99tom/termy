use anyhow::Result;
use fuzzy_matcher::{skim::SkimMatcherV2, FuzzyMatcher};
use serde::Serialize;
use std::{
    collections::HashMap,
    collections::HashSet,
    fs::{self, File},
    io::BufRead,
    path::Path,
    time::UNIX_EPOCH,
};
use std::{io, process::Command};

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Suggestion {
    score: i64,
    command: String,
    display: String,
    suggestion_type: SuggestionType, // `type` is reserved keyword smh...
    #[serde(skip_serializing_if = "Option::is_none")]
    date: Option<String>,
    // todo: fuzzy indexes (highlight match position)
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
enum SuggestionType {
    HistoryInternal,
    HistoryExternal,
    CommandInternal,
    CommandExternal,
    ArgumentInternal,
    ArgumentExternal,
    Dir,
}

pub fn get_suggestions(input: String, current_dir: String) -> Result<Vec<Suggestion>> {
    let mut suggestions = vec![];
    let matcher = SkimMatcherV2::default();

    let mut parts = input.trim().split_whitespace();
    let command = parts.next().expect("Failed to parse input");
    let mut args = parts;

    // bash
    if let Ok(lines) =
        read_lines(dirs::home_dir().unwrap().to_string_lossy().to_string() + "/.bash_history")
    {
        let mut commands: HashMap<String, Suggestion> = HashMap::new();

        for line in lines {
            if let Ok(bash_command) = line {
                if let Some(score) = matcher.fuzzy_match(&bash_command, &input) {
                    if let Some(c) = commands.get_mut(&bash_command) {
                        c.score += 1;
                    } else {
                        commands.insert(
                            bash_command.clone(),
                            Suggestion {
                                score,
                                command: bash_command.clone(),
                                display: bash_command,
                                suggestion_type: SuggestionType::HistoryExternal,
                                date: None,
                            },
                        );
                    }
                }
            }
        }

        for (_, s) in commands {
            suggestions.push(s);
        }
    }

    match command {
        command if !input.contains(" ") => {
            let mut entries = fs::read_dir(current_dir)?
                .filter_map(|e| {
                    let entry = e.unwrap();
                    if !entry.metadata().unwrap().is_dir() {
                        return None;
                    }
                    let name = entry.path().to_str().unwrap().to_string();
                    let score = if let Some(score) = matcher.fuzzy_match(name.as_str(), command) {
                        score
                    } else {
                        return None;
                    };

                    Some(Suggestion {
                        score,
                        command: entry.file_name().to_string_lossy().to_string(),
                        display: entry.file_name().to_string_lossy().to_string(),
                        suggestion_type: SuggestionType::Dir,
                        date: Some(
                            entry
                                .metadata()
                                .unwrap()
                                .modified()
                                .unwrap()
                                .duration_since(UNIX_EPOCH)
                                .unwrap()
                                .as_millis()
                                .to_string(),
                        ),
                    })
                })
                .collect::<Vec<Suggestion>>();
            suggestions.append(&mut entries);
        }
        // command if !input.contains(" ") => {
        // list all the commands 😁
        // let output = Command::new("bash")
        //     .args(&["-c", "compgen -A function -abck"])
        //     .output();
        // if let Err(err) = output {
        //     info!("{}", err);
        // } else {
        //     let mut commands = String::from_utf8(output.unwrap().stdout)?
        //         .lines()
        //         .filter_map(|line| {
        //             let name = line.to_string();
        //             let mut score =
        //                 if let Some(score) = matcher.fuzzy_match(name.as_str(), command) {
        //                     score
        //                 } else {
        //                     return None;
        //                 };
        //             if name == command {
        //                 score += 100;
        //             }
        //             Some(Suggestion {
        //                 name,
        //                 score,
        //                 command: command.to_string(),
        //             })
        //         })
        //         .collect::<Vec<Suggestion>>();

        //     suggestions.append(&mut commands);
        // }
        // }
        _ => (),
    }
    // todo: include only above threshold score
    suggestions.sort_by(|a, b| b.score.cmp(&a.score));

    Ok(suggestions)
}

fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}