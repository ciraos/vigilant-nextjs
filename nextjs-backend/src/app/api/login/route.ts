import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { username, password, email, website } = await req.json();

    const a = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ username, password, email, website })
    });

    const data = await a.json();
    // console.log(data);

    const res = NextResponse.json({
        success: true,
        msg: data.message
    });

    res.cookies.set('token', data.token, {
        path: '/',
        maxAge: 86400,
        httpOnly: true
    })

    return res;
}
