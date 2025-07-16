import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/og.png"
            alt="PhonePe"
            width={32}
            height={32}
            className="rounded-lg"
          />
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
