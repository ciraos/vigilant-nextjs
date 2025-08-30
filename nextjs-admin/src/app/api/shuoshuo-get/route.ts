import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 向目标API发送请求
        const response = await fetch('http://127.0.0.1:5000/shuoshuo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('获取数据失败:', error);
        return NextResponse.json(
            { error: '获取数据失败' },
            { status: 500 }
        );
    }
}
