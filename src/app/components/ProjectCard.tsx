import Image from "next/image";

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
    <div className="bg-white rounded-2xl p-6 md:p-8 mx-4 md:mx-12 lg:mx-16 mb-6">
      {/* iPhone mockups */}
      <div className="flex justify-center items-end gap-4 md:gap-6 mb-8">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative w-[100px] md:w-[140px] lg:w-[180px] aspect-[300/651]"
          >
            <Image
              src={src}
              alt={`Project screenshot ${index + 1}`}
              fill
              className="object-contain rounded-[20px] md:rounded-[28px] shadow-lg"
            />
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="text-center text-[#262626] opacity-80 text-base md:text-lg">
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
              {link.text}
            </a>
            .
          </>
        )}
      </p>
    </div>
  );
}
