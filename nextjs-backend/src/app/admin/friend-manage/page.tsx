import { Metadata } from "next";

import FriendManagePage from "@/components/friend-manage";

export const metadata: Metadata = {
    title: "xxx | 友链管理"
}

export default function FriendManage() {
    return (
        <>
            <FriendManagePage />
        </>
    )
}
