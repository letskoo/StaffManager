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

            (card.content || card.title || "").toLowerCase().includes(keyword)

        );

    });

    return (

        <div className="employee-page">

            <input

                className="employee-search"

                placeholder="제목 검색"

                value={search}

                onChange={(e) =>

                    setSearch(e.target.value)

                }

            />

            <table className="employee-table">

                <thead>

                    <tr>

                        <th style={{ width: "15%" }}>구분</th>
                        <th style={{ width: "50%" }}>내용</th>
                        <th style={{ width: "15%" }}>등록일</th>
                        <th style={{ width: "20%" }}>관리</th>

                    </tr>

                </thead>

                <tbody>

                    {filteredCards.length === 0 ? (

                        <tr>

                            <td
                                colSpan="4"

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

                                <td>

                                    {card.category === "notice" && "공지"}

                                    {card.category === "bonus" && "보너스"}

                                    {card.category === "memo" && "개인메모"}

                                    {card.category === "praise" && "칭찬"}

                                </td>

                                <td>{card.content || card.title}</td>

                                <td>

                                    {card.createdAt?.slice(0, 10)}

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