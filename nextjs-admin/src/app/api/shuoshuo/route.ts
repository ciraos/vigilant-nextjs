import {
    NextRequest,
    NextResponse,
} from "next/server";

export async function POST(req: NextRequest) {
    const { content, tags } = await req.json();

    const aa = await fetch('http://127.0.0.1:5000/shuoshuo', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ content, tags })
    });

    const data = await aa.json();
    // console.log(data);

    return NextResponse.json(data);
}
