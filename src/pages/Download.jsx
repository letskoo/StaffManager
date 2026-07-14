import { useEffect, useState } from "react";

import "../styles/download.css";

function Download() {

    const [deferredPrompt, setDeferredPrompt] = useState(null);

    const [installed, setInstalled] = useState(false);

    useEffect(() => {

        const handleBeforeInstall = (e) => {

            e.preventDefault();

            setDeferredPrompt(e);

        };

        const handleInstalled = () => {

            setInstalled(true);

        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstall
        );

        window.addEventListener(
            "appinstalled",
            handleInstalled
        );

        if (
            window.matchMedia("(display-mode: standalone)").matches
        ) {

            setInstalled(true);

        }

        return () => {

            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstall
            );

            window.removeEventListener(
                "appinstalled",
                handleInstalled
            );

        };

    }, []);

    const handleInstall = async () => {

        if (!deferredPrompt) {

            alert("설치 가능한 기기에서 접속해 주세요.");

            return;

        }

        deferredPrompt.prompt();

        await deferredPrompt.userChoice;

        setDeferredPrompt(null);

    };

    return (

        <div className="download-page">

            <img
                src="/pwa-512x512.png"
                className="download-logo"
            />

            <h1>

                Staff Manager

            </h1>

            <p>

                직원 · 근태 · 급여를
                하나의 프로그램으로 관리하세요.

            </p>

            {!installed ? (

                <button
                    className="download-btn"
                    onClick={handleInstall}
                >

                    무료 다운로드

                </button>

            ) : (

                <a
                    href="/"
                    className="download-btn"
                >

                    앱 실행하기

                </a>

            )}

        </div>

    );

}

export default Download;