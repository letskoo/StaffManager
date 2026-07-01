import "../styles/confirm-modal.css";

function ConfirmModal({
    open,
    title,
    message,
    onCancel,
    onConfirm,
}) {

    if (!open) return null;

    return (

        <div
            className="confirm-backdrop"
            onClick={onCancel}
        >

            <div
                className="confirm-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <h2>{title}</h2>

                <p>{message}</p>

                <div className="confirm-actions">

                    <button
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        취소
                    </button>

                    <button
                        className="delete-btn"
                        onClick={onConfirm}
                    >
                        삭제
                    </button>

                </div>

            </div>

        </div>

    );

}

export default ConfirmModal;