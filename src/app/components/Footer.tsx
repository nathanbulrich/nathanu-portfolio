export default function Footer() {
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
    <footer className="bg-transparent border border-[rgba(37,42,73,0.13)] rounded-lg p-8 md:p-12 mx-4 md:mx-12 lg:mx-16 my-8">
      <div className="flex justify-center items-center gap-4 md:gap-6">
        {dotColors.map((color, index) => (
          <div
            key={index}
            className={`w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full ${color}`}
          />
        ))}
      </div>
    </footer>
  );
}
