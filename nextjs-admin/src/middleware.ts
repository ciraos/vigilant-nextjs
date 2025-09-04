import { NextRequest, NextResponse } from 'next/server';

//? 缓存是否存在注册用户的结果
let hasUsers: boolean | null = null;
//? 防止并发请求多次调用API
let checkInProgress = false;

//? 检查是否存在注册用户的函数
async function checkForRegisteredUsers() {
    if (hasUsers !== null) {
        return hasUsers;
    }
    //? 如果正在检查中，等待一段时间后重试
    if (checkInProgress) {
        let retries = 0;
        const maxRetries = 70; // 最多重试70次，避免无限等待
        while (checkInProgress && retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }
        //? 如果仍然在进行中，返回默认值
        if (checkInProgress) {
            return false;
        }
        //? 重新检查 has_users 状态
        if (hasUsers !== null) {
            return hasUsers;
        }
    }

    //? 设置检查进行中标志
    checkInProgress = true;

    try {
        //! 调用专门的API路由检查是否有注册用户
        const res = await fetch('http://127.0.0.1:5000/check-admin-and-user', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', },
            cache: 'no-store',
        });

        //? 检查响应状态
        if (!res.ok) {
            throw new Error(`HTTP错误！状态码: ${res.status}`);
        }

        const data = await res.json();
        // console.log(data);
        hasUsers = data.has_users;
        // console.log(hasUsers);
        return hasUsers;
    } catch (error) {
        console.error('检查是否有注册用户失败:', error);
        return false;
    } finally {
        checkInProgress = false;
    }
}

export async function middleware(req: NextRequest) {
    //? 从cookies获取用户认证信息
    const token = req.cookies.get('token')?.value;

    //? 定义特殊路由
    const isLoginPage = req.nextUrl.pathname === ('/login');
    const isSetupPage = req.nextUrl.pathname === ('/setup');

    //? 检查是否有注册用户
    const hasUser = await checkForRegisteredUsers();
    // console.log(hasUsers);

    //? 场景1: 没有注册用户
    if (!hasUser) {
        //? 如果不在引导页，跳转到引导页
        if (!isSetupPage) {
            return NextResponse.redirect(new URL('/setup', req.url));
        }
    }
    //? 场景2: 已有注册用户
    else {
        //? 已登录用户访问登录页，跳转到首页
        if (token && isLoginPage) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        //? 未登录用户访问非登录页，跳转到登录页
        if (!token && !isLoginPage) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - .next/static (static files)
         * - .next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|.next/static|.next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
