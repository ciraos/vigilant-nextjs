import { Metadata } from "next";

import ShuoshuoEdit from "@/components/shuoshuo-edit";

export const metadata: Metadata = {
    title: "xxx | 说说编辑",
}

export default function ShuoshuoEditPage() {
    return (
        <>
            <ShuoshuoEdit />
        </>
    )
}
