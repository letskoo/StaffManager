import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import "./styles/global.css";
import App from "./App";
import { checkTauriUpdate } from "./services/update/tauriUpdateService";

const UPDATE_INTERVAL = 5 * 60 * 1000;
const UPDATE_TIMEOUT = 10000;

let isStarting = true;
let isReloading = false;
let isChecking = false;
let hasRenderedApp = false;
let updateSW = null;
let registration = null;

const root = createRoot(
    document.getElementById("root")
);

function renderApp() {
    if (hasRenderedApp || isReloading) {
        return;
    }

    hasRenderedApp = true;

    root.render(
        <StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </StrictMode>
    );
}

function renderUpdateScreen(message) {
    root.render(
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                background: "#f5f6f8",
                color: "#333",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    fontSize: "22px",
                    fontWeight: "700",
                }}
            >
                Staff Manager
            </div>

            <div
                style={{
                    fontSize: "14px",
                    color: "#777",
                }}
            >
                {message}
            </div>
        </div>
    );
}

function reloadApp() {
    if (isReloading) {
        return;
    }

    isReloading = true;

    renderUpdateScreen(
        "새 버전을 적용하고 있습니다..."
    );

    window.location.reload();
}

function waitForWorker(worker) {
    if (!worker || worker.state === "installed") {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const onStateChange = () => {
            if (
                worker.state === "installed" ||
                worker.state === "activated" ||
                worker.state === "redundant"
            ) {
                worker.removeEventListener(
                    "statechange",
                    onStateChange
                );

                resolve();
            }
        };

        worker.addEventListener(
            "statechange",
            onStateChange
        );

        onStateChange();
    });
}

async function activateWaitingWorker() {
    if (
        !isStarting ||
        !registration?.waiting ||
        !updateSW ||
        isReloading
    ) {
        return;
    }

    renderUpdateScreen(
        "새 버전을 설치하고 있습니다..."
    );

    await updateSW(true);
}

async function checkForUpdate() {
    if (
        isChecking ||
        isReloading ||
        !registration ||
        !navigator.onLine
    ) {
        return;
    }

    isChecking = true;

    try {
        if (registration.waiting) {
            await activateWaitingWorker();
            return;
        }

        if (registration.installing) {
            if (isStarting) {
                await waitForWorker(
                    registration.installing
                );

                await activateWaitingWorker();
            }

            return;
        }

        await registration.update();

        if (isStarting && registration.installing) {
            await waitForWorker(
                registration.installing
            );
        }

        await activateWaitingWorker();

    } catch (error) {
        console.error(
            "앱 업데이트 확인 실패",
            error
        );
    } finally {
        isChecking = false;
    }
}

async function startApp() {
    renderUpdateScreen(
        "최신 버전을 확인하고 있습니다..."
    );

    try {
        await Promise.race([
            checkForUpdate(),

            new Promise((resolve) => {
                setTimeout(
                    resolve,
                    UPDATE_TIMEOUT
                );
            }),
        ]);
    } finally {
        if (!isReloading) {
            isStarting = false;
            renderApp();
        }
    }
}

navigator.serviceWorker?.addEventListener(
    "controllerchange",
    () => {
        if (isStarting) {
            reloadApp();
        }
    }
);

if (window.__TAURI_INTERNALS__) {

    checkTauriUpdate()
        .finally(() => {
            isStarting = false;
            renderApp();
        });

} else {

    updateSW = registerSW({
        immediate: true,

        onNeedRefresh() {
            if (isStarting) {
                activateWaitingWorker();
            }
        },

        onRegisteredSW(
            serviceWorkerUrl,
            registered
        ) {
            registration = registered;

            startApp();

            if (!registration) {
                return;
            }

            window.setInterval(
                checkForUpdate,
                UPDATE_INTERVAL
            );

            document.addEventListener(
                "visibilitychange",
                () => {
                    if (
                        document.visibilityState ===
                        "visible"
                    ) {
                        checkForUpdate();
                    }
                }
            );
        },

        onRegisterError(error) {
            console.error(
                "서비스 워커 등록 실패",
                error
            );

            isStarting = false;
            renderApp();
        },
    });

}