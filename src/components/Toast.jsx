import "../styles/toast.css";

function Toast({
    show,
    message
}) {

    if (!show) return null;

    return (

        <div className="toast">

            ✅ {message}

        </div>

    );

}

export default Toast;