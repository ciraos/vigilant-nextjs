
export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <div id="LOGIN" className="w-full h-screen flex items-center justify-center">
                {children}
            </div>
        </>
    );
}
