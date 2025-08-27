import {
    // NextRequest,
    NextResponse,
} from "next/server";

export async function GET() {
    const x = await fetch('http://127.0.0.1:5000/check-admin', {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
    });

    const data = await x.json();

    return NextResponse.json(data);
}
