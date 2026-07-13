import Header from "../components/Header";

function Setting() {
    return (
        <Header
            title="설정"
            registerText="문의하기"
            onRegister={() =>
                window.open(
                    "https://developer-projects.vercel.app/projects.html",
                    "_blank"
                )
            }
        />
    );
}

export default Setting;