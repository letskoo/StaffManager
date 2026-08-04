import {
    getCompanyInfo,
} from "./companyService";

const DOCUMENT_NUMBER_KEY = "documentNumber";

export function generateDocumentNumber() {

    const today = new Date();

    const date =

        `${today.getFullYear()}` +

        `${String(today.getMonth() + 1).padStart(2, "0")}` +

        `${String(today.getDate()).padStart(2, "0")}`;

    const currentNo =

        Number(

            localStorage.getItem(DOCUMENT_NUMBER_KEY)

        ) || 1;

    localStorage.setItem(

        DOCUMENT_NUMBER_KEY,

        currentNo + 1

    );

    const companyInfo =
        getCompanyInfo();

    const prefix =
        companyInfo.documentPrefix || "SM";

    return `${prefix}-${date}-${String(currentNo).padStart(6, "0")}`;

}