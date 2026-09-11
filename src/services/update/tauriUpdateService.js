import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export async function checkTauriUpdate() {

    if (!window.__TAURI_INTERNALS__) {
        return false;
    }

    try {

        const update = await check();

        if (!update) {
            return false;
        }

        const shouldUpdate = window.confirm(
            `Staff Manager 새 버전 v${update.version}이 있습니다.\n\n지금 업데이트하시겠습니까?`
        );

        if (!shouldUpdate) {
            return false;
        }

        await update.downloadAndInstall();

        await relaunch();

        return true;

    } catch (error) {

        console.error(
            "Staff Manager 데스크톱 업데이트 확인 실패",
            error
        );

        return false;
    }
}