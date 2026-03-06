type PageRangeType = {
    start: number;
    end: number;
}

export type PaginationType = {
    original_total_count?: number;
    totalCount: number;
    page: number;
    maxPage: number;
    pageRange: PageRangeType;
    content_start_number: number;
    content_start_number_reverse: number;
}