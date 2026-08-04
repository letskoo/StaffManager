import {
    getCompanyInfo,
} from "../companyService";

import CompanySeal
    from "./CompanySeal";

function DocumentFooter() {

    const companyInfo =
        getCompanyInfo();

    return (

        <div className="payroll-footer">

            <div className="document-footer-company">

                <span>

                    {companyInfo.companyName ||
                        "사업장명 미등록"}

                </span>

                <strong>

                    대표자&nbsp;

                    {companyInfo.ownerName || "-"}

                </strong>

                <CompanySeal

                    seal={companyInfo.seal}

                    companyName={
                        companyInfo.companyName
                    }

                />

            </div>

            <p>

                본 문서는&nbsp;

                <strong>
                    Staff Manager
                </strong>

                에서 생성되었습니다.

            </p>

        </div>

    );

}

export default DocumentFooter;