import DotRow from "./DotRow";
import CopyEmailButton from "./CopyEmailButton";

export default function Header() {
  return (
    <header className="flex flex-col items-start gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between md:relative md:px-12 lg:px-16">
      {/* Colored dots */}
      <div className="flex md:absolute md:left-1/2 md:-translate-x-1/2">
        <DotRow
          dotSize="w-[16px] h-[16px]"
          gap="gap-[16px]"
        />
      </div>

      {/* Logo */}
      <div className="font-medium">
        Nathan Ulrich
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-6 md:flex-row md:items-center md:gap-[16px]">
        <CopyEmailButton />
        <span className="hidden md:inline">/</span>
        <a
          href="https://x.com/nbulrich"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Twitter
        </a>
        <span className="hidden md:inline">/</span>
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
