import {
    NextResponse,
    NextRequest
} from "next/server";

export async function POST(req: NextRequest) {
    const { nickname, username, password, email, website } = await req.json();

    const z = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ nickname, username, password, email, website })
    });

    const data = await z.json();
    // console.log(data);

    const res = NextResponse.json(data);

    return res;
}
