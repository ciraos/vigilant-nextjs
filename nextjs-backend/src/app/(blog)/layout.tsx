
import "../globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
