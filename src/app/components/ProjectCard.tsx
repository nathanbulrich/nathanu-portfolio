/* eslint-disable @next/next/no-img-element */

interface ProjectCardProps {
  images: string[];
  description: string;
  link?: {
    text: string;
    href: string;
  };
}

export default function ProjectCard({ images, description, link }: ProjectCardProps) {
  return (
    <div
      className="bg-transparent rounded-lg px-6 md:px-8 pt-[80px] pb-[48px] mx-4 md:mx-12 lg:mx-16 mb-6 transition-[border-color] duration-300"
      style={{ border: "1px solid var(--theme-border)" }}
    >
      {/* iPhone mockups */}
      <div className="flex justify-center items-end gap-4 md:gap-6 mb-8">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Project screenshot ${index + 1}`}
            className="w-[300px] h-auto block"
          />
        ))}
      </div>

      {/* Description */}
      <p className="text-center">
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
