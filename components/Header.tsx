import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/mascot/favicon-32x32.png"
            alt="Smart Innosys mascot"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-bold text-deep-blue">Smart Innosys</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-deep-blue/80 sm:flex">
          <Link href="#highlight" className="hover:text-coral">
            About
          </Link>
          <Link href="#features" className="hover:text-coral">
            Services
          </Link>
          <Link href="#contact" className="hover:text-coral">
            Contact
          </Link>
        </nav>
        <Link
          href="#contact"
          className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral/90"
        >
          Get in touch
        </Link>
      </div>
    </header>
  );
}
