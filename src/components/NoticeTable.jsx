import "../styles/employee.css";

function NoticeTable({

    cards,

    search,

    setSearch,

    onEdit,

    onDelete,

}) {

    const filteredCards = cards.filter((card) => {

        const keyword = search.toLowerCase();

        return (

            card.title.toLowerCase().includes(keyword)

            ||

            card.content.toLowerCase().includes(keyword)

        );

    });

    return (

        <div className="employee-page">

            <input

                className="employee-search"

                placeholder="제목, 내용 검색"

                value={search}

                onChange={(e) =>

                    setSearch(e.target.value)

                }

            />

            <table className="employee-table">

                <thead>

                    <tr>

                        <th>구분</th>

                        <th>제목</th>

                        <th>내용</th>

                        <th>등록일</th>

                        <th>관리</th>

                    </tr>

                </thead>

                <tbody>

                    {filteredCards.length === 0 ? (

                        <tr>

                            <td

                                colSpan="5"

                                style={{

                                    height: "80px",

                                    color: "#999",

                                }}

                            >

                                등록된 공지가 없습니다.

                            </td>

                        </tr>

                    ) : (

                        filteredCards.map((card) => (

                            <tr key={card.id}>

                                <td>{card.category}</td>

                                <td>{card.title}</td>

                                <td>

                                    {card.content.length > 50

                                        ? `${card.content.slice(0,50)}...`

                                        : card.content}

                                </td>

                                <td>

                                    {card.createdAt?.slice(0,10)}

                                </td>

                                <td>

                                    <button

                                        className="edit-btn"

                                        onClick={() => onEdit(card)}

                                    >

                                        수정

                                    </button>

                                    <button

                                        className="delete-btn"

                                        onClick={() => onDelete(card)}

                                    >

                                        삭제

                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default NoticeTable;