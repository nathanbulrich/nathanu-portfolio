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
    <header className="flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">
      {/* Logo */}
      <div className="text-lg font-medium text-[#262626]">
        // Nathan Ulrich
      </div>

      {/* Colored dots */}
      <div className="hidden md:flex items-center gap-2">
        {dotColors.map((color, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${color}`}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-2 text-[#262626]">
        <a
          href="mailto:nathan@nathanu.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Email
        </a>
        <span className="text-gray-400">/</span>
        <a
          href="https://twitter.com/nathanulrich"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Twitter
        </a>
        <span className="text-gray-400">/</span>
        <a
          href="https://cosmos.so/nathanulrich"
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
