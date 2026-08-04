function CompanySeal({
    seal,
    companyName,
}) {

    if (!seal) {

        return null;

    }

    return (

        <img

            src={seal}

            alt={`${companyName || "회사"} 직인`}

            className="document-company-seal"

        />

    );

}

export default CompanySeal;