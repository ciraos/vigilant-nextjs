import { Metadata } from "next";

import ShuoshuoEditPage from "@/components/shuoshuo-edit";

export const metadata: Metadata = {
    title: "xxx | 说说编辑",
}

export default function ShuoshuoEdit() {
    return (
        <>
            <ShuoshuoEditPage />
        </>
    )
}
