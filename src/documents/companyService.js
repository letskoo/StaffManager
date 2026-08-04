const COMPANY_INFO_KEY = "companyInfo";

const DEFAULT_COMPANY_INFO = {

    companyName: "",

    ownerName: "",

    businessNumber: "",

    phone: "",

    address: "",

    logo: "",

    seal: "",

    manager: "",

    managerPosition: "",

    documentPrefix: "SM",

    documentNo: 1,

};

export function getCompanyInfo() {

    try {

        const savedCompanyInfo =
            localStorage.getItem(COMPANY_INFO_KEY);

        if (!savedCompanyInfo) {

            return {
                ...DEFAULT_COMPANY_INFO,
            };

        }

        const parsedCompanyInfo =
            JSON.parse(savedCompanyInfo);

        return {

            ...DEFAULT_COMPANY_INFO,

            ...parsedCompanyInfo,

        };

    } catch (error) {

        console.error(
            "회사 정보를 불러오지 못했습니다.",
            error
        );

        return {
            ...DEFAULT_COMPANY_INFO,
        };

    }

}

export function saveCompanyInfo(companyInfo) {

    const nextCompanyInfo = {

        ...DEFAULT_COMPANY_INFO,

        ...companyInfo,

    };

    localStorage.setItem(

        COMPANY_INFO_KEY,

        JSON.stringify(nextCompanyInfo)

    );

    window.dispatchEvent(

        new Event("companyInfoUpdated")

    );

    return nextCompanyInfo;

}

export function resetCompanyInfo() {

    localStorage.removeItem(COMPANY_INFO_KEY);

    window.dispatchEvent(

        new Event("companyInfoUpdated")

    );

    return {
        ...DEFAULT_COMPANY_INFO,
    };

}