'use client';
import { Suspense } from "react";
import BoardListContent from "@/features/board/list/BoardListContent";

export default function BoardList(): React.ReactNode {
    return (
        <Suspense>
            <BoardListContent />
        </Suspense>
    )
}