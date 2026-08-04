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