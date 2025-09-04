import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { title, content, tags, author } = await req.json();

    const cc = await fetch('http://127.0.0.1:5000/note', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ title, content, tags, author })
    });

    const data = await cc.json();
    // console.log(data);

    return NextResponse.json(data);
}
