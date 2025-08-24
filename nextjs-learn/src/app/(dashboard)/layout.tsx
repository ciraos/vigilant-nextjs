import "../globals.css";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <html lang="zh-CN">
                <body className="">
                    {children}
                </body>
            </html>
        </>
    );
}
