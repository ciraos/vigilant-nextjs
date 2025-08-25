import "../globals.css";

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <html lang="zh-CN">
                <body className="w-full h-screen flex justify-center items-center">
                    {children}
                </body>
            </html>
        </>
    );
}
