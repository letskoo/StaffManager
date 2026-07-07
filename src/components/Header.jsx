import "../styles/header.css";

function Header({
    title,
    onRegister,
    registerText = "+ 직원등록",
    rightContent
}) {
    return (
        <header className="header">

            <div className="header-left">

                <h1>{title}</h1>

                <div className="header-divider"></div>

                <p>복잡한 직원관리, 프로그램으로 단순하게.</p>

            </div>

            {rightContent ? (

                rightContent

            ) : (

                <button
                    className="register-btn"
                    onClick={onRegister}
                >
                    {registerText}
                </button>

            )}

        </header>
    );
}

export default Header;