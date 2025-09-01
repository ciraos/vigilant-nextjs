import type { Metadata } from "next";

import ShuoshuoManage from "@/components/shuoshuo-manage";

export const metadata: Metadata = {
    title: "xxx | 说说管理",
}

export default function ShuoshuoManagePage() {
    return (
        <>
            <ShuoshuoManage />
        </>
    )
}
