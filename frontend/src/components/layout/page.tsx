export default function Page({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen pt-25 p-18">
            <div className="flex flex-col items-center justify-center w-1/2">
                {children}
            </div>
        </main>
    );
}