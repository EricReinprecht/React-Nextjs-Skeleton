"use client";

import { PaginationArrow } from "@frontend/svgs";

import "@styles/pages/create-party.scss";
import "@styles/tables/manager_table.scss"

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
                    orientation="right"
                />
            </button>

            {pagesCount <= 5 ? (
                Array.from({ length: pagesCount }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setPage(idx + 1)}
                        className={page === idx + 1 ? "active" : ""}
                        aria-current={page === idx + 1 ? "page" : undefined}
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
                            className={page === idx + 1 ? "active" : ""}
                            aria-current={page === idx + 1 ? "page" : undefined}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <span className="pagination-ellipsis" aria-hidden="true">…</span>
                    <button
                        key={pagesCount - 1}
                        onClick={() => setPage(pagesCount)}
                        className={page === pagesCount ? "active" : ""}
                        aria-current={page === pagesCount ? "page" : undefined}
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
                    orientation="left"
                />
            </button>
        </div>
    );
};

export default Pagination;
