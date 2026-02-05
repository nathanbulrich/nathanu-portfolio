/* eslint-disable @next/next/no-img-element */

interface ProjectCardProps {
  title: string;
  images: string[];
  description: string;
  link?: {
    text: string;
    href: string;
  };
}

export default function ProjectCard({ title, images, description, link }: ProjectCardProps) {
  return (
    <div className="card-border bg-transparent md:rounded-lg md:px-8 pt-6 pb-4 md:pt-[80px] md:pb-[48px] mx-0 md:mx-12 lg:mx-16 mb-6">
      {/* iPhone mockups — edge-to-edge on mobile */}
      <div className="flex justify-center items-end gap-4 md:gap-6 mb-2 md:mb-8">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`${title} screenshot ${index + 1}`}
            className={`h-auto block ${
              index === 0 ? "w-full md:w-[300px]" : "hidden md:block md:w-[300px]"
            }`}
          />
        ))}
      </div>

      {/* Mobile: just the title */}
      <p className="text-center px-6 md:px-0 md:hidden">{title}</p>

      {/* Desktop: full description */}
      <p className="text-center hidden md:block">
        {description}
        {link && (
          <>
            {" "}
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70"
            >
              {link.text} →
            </a>
          </>
        )}
      </p>
    </div>
  );
}
