const HOLIDAY_KEY = "holidayCache";

function getDateText(date) {

    return `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}`;

}

export function getHolidayCache() {

    return JSON.parse(

        localStorage.getItem(HOLIDAY_KEY)

    ) || {};

}

export function saveHolidayCache(cache) {

    localStorage.setItem(

        HOLIDAY_KEY,

        JSON.stringify(cache)

    );

}

export function isSunday(date) {

    return date.getDay() === 0;

}

export function isCompanyHoliday(date) {

    const settings = JSON.parse(

        localStorage.getItem("settings")

    ) || {};

    const holidays =

        settings.companyHolidays || [];

    return holidays.includes(

        getDateText(date)

    );

}

export function isNationalHoliday(date) {

    const cache = getHolidayCache();

    return cache[getDateText(date)] === true;

}

export function isHoliday(date) {

    return (

        isSunday(date) ||

        isNationalHoliday(date) ||

        isCompanyHoliday(date)

    );

}

export async function syncNationalHolidays(year) {

    const cache = getHolidayCache();

    if (cache[`year-${year}`]) {

        return;

    }

    try {

        const response = await fetch(

            `https://date.nager.at/api/v3/PublicHolidays/${year}/KR`

        );

        const holidays = await response.json();

        holidays.forEach((holiday) => {

            cache[holiday.date] = true;

        });

        cache[`year-${year}`] = true;

        saveHolidayCache(cache);

    } catch (e) {

        console.error(

            "공휴일 동기화 실패",

            e

        );

    }

}