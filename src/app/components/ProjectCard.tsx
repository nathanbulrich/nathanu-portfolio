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
    <div className="card-border bg-transparent md:rounded-lg md:px-8 pt-6 pb-4 md:pt-[80px] md:pb-[48px] mx-0 md:mx-12 lg:mx-12 mb-6">
      {/* Mobile: image + title grouped for alignment */}
      <div className="max-w-[400px] md:max-w-none px-6 md:px-0 md:w-full">
        <div className="flex justify-start md:justify-center items-end gap-4 md:gap-6 mb-2 md:mb-8">
          {images.map((src, index) => (
            <div
              key={index}
              className={`[filter:drop-shadow(0_4px_25px_rgba(0,0,0,0.29))] ${
                index === 0 ? "w-full md:w-[300px]" : "hidden md:block md:w-[300px]"
              }`}
            >
              <img
                src={src}
                alt={`${title} screenshot ${index + 1}`}
                className="h-auto w-full block"
                style={{ clipPath: "url(#squircle)" }}
              />
            </div>
          ))}
        </div>
        <p className="text-center md:hidden">{title}</p>
      </div>

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
