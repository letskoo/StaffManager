#[cfg(target_os = "windows")]
fn clear_legacy_service_worker() {
    use std::path::PathBuf;

    let Ok(local_app_data) = std::env::var("LOCALAPPDATA") else {
        return;
    };

    let service_worker_path = PathBuf::from(local_app_data)
        .join("com.developerprojects.staffmanager")
        .join("EBWebView")
        .join("Default")
        .join("Service Worker");

    if !service_worker_path.exists() {
        return;
    }

    if let Err(error) = std::fs::remove_dir_all(&service_worker_path) {
        eprintln!(
            "legacy service worker cleanup failed: {}",
            error
        );
    }
}

#[cfg(not(target_os = "windows"))]
fn clear_legacy_service_worker() {}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    clear_legacy_service_worker();

    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
