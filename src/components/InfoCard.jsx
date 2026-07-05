import "../styles/info-card.css";

function InfoCard({

    icon,

    title,

    type,

    children,

}) {

    return (

        <div className={`info-card ${type}`}>

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