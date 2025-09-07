import { Metadata } from "next";

import ShuoshuoManagePage from "@/components/shuoshuo-manage";

export const metadata: Metadata = {
    title: "xxx | 说说管理",
}

export default function ShuoshuoManage() {
    return (
        <>
            <ShuoshuoManagePage />
        </>
    )
}
