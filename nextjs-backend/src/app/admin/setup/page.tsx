import { Metadata } from "next";

import SetupPage from "@/components/setuppage";

export const metadata: Metadata = {
    title: "xxx | 欢迎！"
}

export default function Setup() {
    return (
        <>
            <SetupPage />
        </>
    );
}
