import {
    NextRequest,
    NextResponse,
} from "next/server";

export async function POST(req: NextRequest) {
    const { content, tags } = await req.json();

    const aa = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shuoshuo`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ content, tags })
    });

    const data = await aa.json();
    // console.log(data);

    return NextResponse.json(data);
}
