import type { Metadata } from "next";

import DashboardPage from "@/components/dashboardpage";

export const metadata: Metadata = {
    title: "xxx | 仪表盘"
}

export default function Home() {
    return (
        <>
            <DashboardPage />
        </>
    )
}
