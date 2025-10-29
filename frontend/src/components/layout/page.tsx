export default function Page({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-16">
            <div className="flex flex-col items-center justify-center w-1/2">
                {children}
            </div>
        </main>
    );
}