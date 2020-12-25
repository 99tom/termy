use crate::{
    cell::{CellProps, Communication, ServerMessage},
    util::get_executables,
};
use anyhow::{bail, Result};
use serde::{Deserialize, Serialize};
use std::path::Path;

mod internal;

pub struct Command {
    kind: Kind,
    args: Vec<String>,
}

enum Kind {
    Path(String),
    View,
    Write,
    Shortcuts,
    External(String),
    NotFound,
}

impl Command {
    pub fn new(command: String, args: Vec<String>, current_dir: &str) -> Self {
        Self {
            kind: match command.as_str() {
                path if Path::new(path).exists() || Path::new(current_dir).join(path).exists() => {
                    Kind::Path(command)
                }
                "view" => Kind::View,
                "write" => Kind::Write,
                "shortcuts" => Kind::Shortcuts,
                str if get_executables().contains(&command) => Kind::External(command),
                _ => Kind::NotFound,
            },
            args,
        }
    }

    pub fn execute(&self, props: &CellProps, communication: Communication) -> Result<()> {
        let status = match &self.kind {
            Kind::Path(path) => {}
            Kind::External(command) => {}
            Kind::NotFound => {}
            _ => todo!(),
        };

        Ok(())
    }
}
