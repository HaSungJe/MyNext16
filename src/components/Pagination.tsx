'use client';
import { PaginationType } from "@/types/pagination";

type PaginationProps = {
    pagination: PaginationType;
    movePage: (page: string) => void;
}

/**
 * 페이지네이션
 * 
 * @param param0 
 * @returns 
 */
export default function Pagination({pagination, movePage}: PaginationProps): React.ReactNode {
    if (pagination) {
        const beforePage = pagination ? (pagination.page > 1 ? pagination.page - 1 : pagination.page) : 1;
        const afterPage = pagination ? (pagination.page < pagination.maxPage ? pagination.page + 1 : pagination.page) : 1;
    
        return (
            <>
                {/* 이전 */}
                <button 
                    key={`page_first`}
                    type="button" 
                    className="btn first"
                    onClick={() => movePage('1')}
                >처음페이지로
                </button>
                <button 
                    key={`page_prev`}
                    type="button" 
                    className="btn prev"
                    onClick={() => movePage(beforePage?.toString())}
                >이전페이지로
                </button>

                {/* 페이지 목록 */}
                <PageItem pagination={pagination} movePage={movePage}/>

                {/* 다음 */}
                <button 
                    key={`page_next`}
                    type="button" 
                    className="btn next"
                    onClick={() => movePage(afterPage?.toString())}
                >다음페이지로
                </button>
                <button 
                    key={`page_last`}
                    type="button" 
                    className="btn last"
                    onClick={() => movePage(pagination?.maxPage?.toString())}
                >마지막페이지로
                </button>
            </>
        );
    }
}

/**
 * 페이지 요소
 * 
 * @param param0 
 * @returns 
 */
function PageItem({pagination, movePage}: PaginationProps): React.ReactNode {
    if (pagination) {
        const pageList = [];
        for (let i = pagination.pageRange.start; i <= pagination.pageRange.end; i++) {
            pageList.push(i);
        }

        return (
            <>
                {
                    pageList.map((page) => {
                        if (page === pagination.page) {
                            return (
                                <button 
                                    key={`page-active-${page}`}
                                    type="button" 
                                    className="btn active"
                                >{page}
                                </button>
                            );
                        } else {
                            return (
                                <button 
                                    key={`page-${page}`}
                                    type="button" 
                                    className="btn"
                                    onClick={() => movePage(page?.toString())}
                                >{page}
                                </button>
                            )
                        }
                    })
                }
            </>
        );
    }
}