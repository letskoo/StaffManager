function DocumentHeader({
    title,
    documentNumber,
    issueDate,
    subtitle = "",
}) {

    const formattedIssueDate = (() => {

        const date =
            issueDate instanceof Date
                ? issueDate
                : new Date(issueDate);

        if (Number.isNaN(date.getTime())) {

            return "-";

        }

        return date.toLocaleDateString("ko-KR");

    })();

    return (

        <div className="payroll-header">

            <h2>
                {title}
            </h2>

            {subtitle && (

                <p>
                    {subtitle}
                </p>

            )}

            <div className="payroll-issued">

                <div className="payroll-issued-row">

                    <span>
                        문서번호
                    </span>

                    <strong>
                        {documentNumber || "-"}
                    </strong>

                </div>

                <div className="payroll-issued-row">

                    <span>
                        발행일
                    </span>

                    <strong>
                        {formattedIssueDate}
                    </strong>

                </div>

            </div>

        </div>

    );

}

export default DocumentHeader;