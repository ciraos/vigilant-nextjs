
export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <div id="REGISTER" className="w-full h-screen flex items-center justify-center">
                {children}
            </div>
        </>
    );
}
