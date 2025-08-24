import { NextResponse } from "next/server";

export async function DELETE() {
    const res = NextResponse.json({
        message: "Logout successful",
        success: true,
    });

    res.cookies.set("token", "", {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        expires: new Date(0),
    });

    return res;
}
