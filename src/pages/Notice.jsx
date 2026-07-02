import { useState } from "react";

import Header from "../components/Header";

import NoticeTable from "../components/NoticeTable";
import NoticeModal from "../components/NoticeModal";

import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

import {

    getAttendanceCards,

    addAttendanceCard,

    updateAttendanceCard,

    deleteAttendanceCard,

} from "../services/attendanceCardService";

function Notice() {

    const [cards, setCards] = useState(

        getAttendanceCards()

    );

    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);

    const [selectedNotice, setSelectedNotice] = useState(null);

    const [deleteNotice, setDeleteNotice] = useState(null);

    const [showToast, setShowToast] = useState(false);

    const [toastMessage, setToastMessage] = useState("");

    const refresh = () => {

        setCards(getAttendanceCards());

    };

    const handleSave = (notice) => {

        addAttendanceCard(notice);

        refresh();

        setOpenModal(false);

        setToastMessage("공지가 등록되었습니다.");

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

        }, 3000);

    };

    const handleUpdate = (notice) => {

        updateAttendanceCard(notice);

        refresh();

        setSelectedNotice(null);

        setOpenModal(false);

        setToastMessage("공지가 수정되었습니다.");

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

        }, 3000);

    };

    const handleDelete = () => {

        deleteAttendanceCard(deleteNotice.id);

        refresh();

        setDeleteNotice(null);

        setToastMessage("공지가 삭제되었습니다.");

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

        }, 3000);

    };

    return (

        <>

            <Header

                title="공지"

                registerText="+ 공지등록"

                onRegister={() => {

                    setSelectedNotice(null);

                    setOpenModal(true);

                }}

            />

            <NoticeTable

                cards={cards}

                search={search}

                setSearch={setSearch}

                onEdit={(notice) => {

                    setSelectedNotice(notice);

                    setOpenModal(true);

                }}

                onDelete={(notice) => {

                    setDeleteNotice(notice);

                }}

            />

            <NoticeModal

                open={openModal}

                notice={selectedNotice}

                onClose={() => {

                    setSelectedNotice(null);

                    setOpenModal(false);

                }}

                onSave={handleSave}

                onUpdate={handleUpdate}

            />

            <ConfirmModal

                open={deleteNotice !== null}

                title="공지 삭제"

                message={`"${deleteNotice?.title}" 삭제하시겠습니까?`}

                onCancel={() =>

                    setDeleteNotice(null)

                }

                onConfirm={handleDelete}

            />

            <Toast

                show={showToast}

                message={toastMessage}

            />

        </>

    );

}

export default Notice;