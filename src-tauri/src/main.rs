// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::env;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command(async)]
fn create_file(name: &str) -> String {
    let mut dir = env::current_dir().unwrap().into_os_string().into_string().unwrap();
    dir.push_str("\\Data\\pantanos.exe");

    Command::new(dir)
                .arg(name)
                .status()
                .expect("command failed to start");
    name.into()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, create_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
