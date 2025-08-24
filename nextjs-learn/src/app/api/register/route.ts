import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { username, password, email } = await req.json();

        const d = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ username, password, email })
        });

        const data = await d.json();
        // console.log({ data });

        if (!data.ok) {
            throw new Error(data.message || '注册失败！');
        }

        const res = NextResponse.json({
            message: "注册成功！",
            success: true,
        }, { status: 201 });
        return res;
    }

    catch (error: any) {
        const res1 = NextResponse.json({
            message: error.message,
            success: false,
        }, { status: 500 });
        return res1;
    }
}
