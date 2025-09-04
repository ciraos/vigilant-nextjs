import { Metadata } from "next";

import NoteManagePage from "@/components/notemanage";

export const metadata: Metadata = {
    title: "xxx | 日记管理",
};

export default function NoteManage() {
    return (
        <>
            <NoteManagePage />
        </>
    )
}
