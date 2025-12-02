"use client";

import "@styles/pages/create-party.scss";
import "@styles/tables/manager_table.scss"
import PaginationArrow from "@/src/app/lib/svgs/pagination_arrow";

type PaginationProps = {
    page: number;
    pagesCount: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
};

const Pagination: React.FC<PaginationProps> = ({
        page,
        setPage,
        pagesCount
    }) => {

        console.log(pagesCount)

    return (
        <div className="pagination">
            <button
                key={"prev"}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
            >
                <PaginationArrow
                    height={24}
                    width={24}
                    color="white"
                    hoverColor="black"
                    orientation="right"
                />
            </button>

            {pagesCount <= 5 ? (
                Array.from({ length: pagesCount }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setPage(idx + 1)}
                        disabled={page === idx + 1}
                        className={page === idx + 1 ? "active" : ""}
                    >
                        {idx + 1}
                    </button>
                ))
            ) : (
                <>
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setPage(idx + 1)}
                            disabled={page === idx + 1}
                            className={page === idx + 1 ? "active" : ""}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button style={{ pointerEvents: "none" }}>...</button>
                    <button
                        key={pagesCount - 1}
                        onClick={() => setPage(pagesCount)}
                        disabled={page === pagesCount}
                        className={page === pagesCount ? "active" : ""}
                    >
                        {pagesCount}
                    </button>
                </>
            )}

            <button
                key={"next"}
                onClick={() => setPage((p) => Math.min(pagesCount, p + 1))}
                disabled={page === pagesCount}
            >
                <PaginationArrow
                    height={24}
                    width={24}
                    color="white"
                    hoverColor="black"
                    orientation="left"
                />
            </button>
        </div>
    );
};

export default Pagination;