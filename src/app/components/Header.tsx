export default function Header() {
  const dotColors = [
    "bg-[#f9454d]", // red
    "bg-[#0ed76e]", // green
    "bg-[#4c4ec7]", // blue
    "bg-[#71d7ff]", // cyan
    "bg-[#fff204]", // yellow
    "bg-[#ff52b9]", // pink
    "bg-[#262626]", // charcoal
  ];

  return (
    <header className="relative flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">
      {/* Logo */}
      <div className="font-medium">
        // Nathan Ulrich
      </div>

      {/* Colored dots */}
      <div className="hidden md:flex items-center gap-[16px] absolute left-1/2 -translate-x-1/2">
        {dotColors.map((color, index) => (
          <div
            key={index}
            className={`w-[16px] h-[16px] rounded-full ${color}`}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-[16px]">
        <a
          href="mailto:nathan@nathanu.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Email
        </a>
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
