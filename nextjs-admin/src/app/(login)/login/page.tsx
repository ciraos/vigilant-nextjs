import type { Metadata } from "next";
import LoginPage from "@/components/loginpage";

export const metadata: Metadata = {
    title: "xxx | 登录",
    description: "",
    icons: "",
}

export default function Login() {
    return (
        <>
            < LoginPage />
        </>
    )
}
