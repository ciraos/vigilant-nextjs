import type { Metadata } from "next";
import ShuoshuoEdit from "@/components/shuoshuo-edit";

export const metadata: Metadata = {
    title: "xxx | 说说编辑",
}

export default async function ShuoshuoEditPage() {
    return (
        <>
            <ShuoshuoEdit />
        </>
    )
}
