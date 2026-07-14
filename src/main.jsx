import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { registerSW } from "virtual:pwa-register";

import "./styles/global.css";

import App from "./App";

const UPDATE_INTERVAL =
    60 * 60 * 1000;

registerSW({

    immediate: true,

    onRegisteredSW(
        serviceWorkerUrl,
        registration
    ) {

        if (!registration) {

            return;

        }

        const checkForUpdate = async () => {

            if (!navigator.onLine) {

                return;

            }

            if (
                registration.installing ||
                registration.waiting
            ) {

                return;

            }

            try {

                await fetch(
                    serviceWorkerUrl,
                    {
                        cache: "no-store",
                    }
                );

                await registration.update();

            } catch (error) {

                console.error(
                    "앱 업데이트 확인 실패",
                    error
                );

            }

        };

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

    },

});

createRoot(
    document.getElementById("root")
).render(

    <StrictMode>

        <BrowserRouter>

            <App />

        </BrowserRouter>

    </StrictMode>

);