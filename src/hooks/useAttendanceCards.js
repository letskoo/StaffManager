import { useEffect, useState } from "react";

import {

    getAttendanceCards,

    saveAttendanceCards,

} from "../services/attendanceCardService";

export default function useAttendanceCards() {

    const [cards, setCards] = useState([]);

    useEffect(() => {

        setCards(getAttendanceCards());

    }, []);

    const saveCards = (list) => {

        setCards(list);

        saveAttendanceCards(list);

    };

    const updateCard = (id, content) => {

        const updated = cards.map((card) =>

            card.id === id

                ? {

                    ...card,

                    content,

                }

                : card

        );

        saveCards(updated);

    };

    const resetCards = () => {

        const defaults = getAttendanceCards();

        saveCards(defaults);

    };

    return {

        cards,

        saveCards,

        updateCard,

        resetCards,

    };

}