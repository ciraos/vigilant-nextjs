import { Metadata } from "next";
import OnboardingPage from "@/components/onboardingpage";

export const metadata: Metadata = {
    title: "xxx | 欢迎！",
    description: "",
    icons: ""
}

export default function Onboarding() {
    return (
        <>
            <OnboardingPage />
        </>
    );
}
