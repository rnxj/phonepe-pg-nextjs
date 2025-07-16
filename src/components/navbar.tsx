import { ThemeToggle } from '@/components/theme-toggle';
import { ButtonWithTooltip } from '@/components/tooltip-button';
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
        <div className="flex items-center gap-2">
          <ButtonWithTooltip
            tooltipText="Buy me a coffee"
            tooltipProps={{ side: 'bottom' }}
            className="h-8 w-8 rounded-full bg-background"
            variant="outline"
            size="icon"
            asChild
          >
            <Link
              href="https://buymeacoffee.com/reuelnixon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Image
                src="/buymeacoffee.svg"
                alt="Buy Me a Coffee"
                width={18}
                height={18}
                className="dark:invert"
              />
              <span className="sr-only">Buy me a coffee</span>
            </Link>
          </ButtonWithTooltip>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
