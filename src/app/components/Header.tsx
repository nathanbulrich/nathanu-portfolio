import DotRow from "./DotRow";
import CopyEmailButton from "./CopyEmailButton";

export default function Header() {
  return (
    <header className="relative flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">
      {/* Logo */}
      <div className="font-medium">
        // Nathan Ulrich
      </div>

      {/* Colored dots */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
        <DotRow
          dotSize="w-[16px] h-[16px]"
          gap="gap-[16px]"
        />
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-[16px]">
        <CopyEmailButton />
        <span>/</span>
        <a
          href="https://x.com/nbulrich"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Twitter
        </a>
        <span>/</span>
        <a
          href="https://www.cosmos.so/nathanu"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Cosmos
        </a>
      </nav>
    </header>
  );
}
