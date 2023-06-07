// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command(async)]
fn create_full_file(name: &str) {
    let mut dir = env::current_dir()
        .unwrap()
        .into_os_string()
        .into_string()
        .unwrap();
    dir.push_str("\\Data\\pantanosLauncher.bat");

    Command::new(dir)
        .arg(name)
        .status()
        .expect("failed to execute process");
}

#[tauri::command(async)]
fn create_prediction(name: &str, date: &str, number: &str) {
    let mut dir = env::current_dir()
        .unwrap()
        .into_os_string()
        .into_string()
        .unwrap();
    dir.push_str("\\Data\\predictionLauncher.bat");

    Command::new(dir)
        .arg(name)
        .arg(date)
        .arg(number)
        .status()
        .expect("command failed to start");
}

#[tauri::command]
fn tmp_path() -> String {
    let dir = env::temp_dir().display().to_string();
    dir.into()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            create_full_file,
            tmp_path,
            create_prediction
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
