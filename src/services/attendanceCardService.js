const STORAGE_KEY = "attendanceCards";

const defaultCards = [];

export function getAttendanceCards() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultCards)
        );

        return defaultCards;

    }

    return JSON.parse(saved);

}

export function saveAttendanceCards(cards) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cards)
    );

}

export function addAttendanceCard(card) {

    const cards = getAttendanceCards();

    cards.unshift({

        id: Date.now(),

        ...card,

        amount: Number(card.amount || 0),

        enabled: true,

        createdAt: new Date().toISOString()

    });

    saveAttendanceCards(cards);

}

export function updateAttendanceCard(updatedCard) {

    const cards = getAttendanceCards().map((card) =>

        card.id === updatedCard.id

            ? updatedCard

            : card

    );

    saveAttendanceCards(cards);

}

export function deleteAttendanceCard(id) {

    const cards = getAttendanceCards().filter(

        (card) => card.id !== id

    );

    saveAttendanceCards(cards);

}