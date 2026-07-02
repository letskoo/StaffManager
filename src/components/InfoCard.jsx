import "../styles/info-card.css";

function InfoCard({

    icon,

    title,

    children,

}) {

    return (

        <div className="info-card">

            <div className="info-card-header">

                <span>{icon}</span>

                <h3>{title}</h3>

            </div>

            <div className="info-card-body">

                {children}

            </div>

        </div>

    );

}

export default InfoCard;