import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full border-b border-space-latte bg-deep-space z-999">
      <div className="flex flex-row items-center justify-center gap-4 px-4 py-2">
        <Link href="/">
          Home
        </Link>
        <Link href="/links">
          Links
        </Link>
      </div>
    </nav>
  );
}

