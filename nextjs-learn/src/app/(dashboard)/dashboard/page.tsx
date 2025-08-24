"use client";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import "@ant-design/v5-patch-for-react-19";

export default function Dashbaord() {
    const router = useRouter();

    const handlerLogout = async () => {
        const c = await fetch('/api/logout', {
            method: 'DELETE'
        });
        const data = await c.json();
        if (data.success) {
            router.push('/login');
        }
    }

    return (
        <>
            <div></div>
            <Button type="primary" onClick={handlerLogout}>登出</Button>
        </>
    )
}
