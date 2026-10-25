'use client';

import { useTilt } from '../lib/useTilt';
import { useCallback, useState } from 'react';
import projectImages from '../lib/project-images.json';

interface ProjectCardProps {
  title: string;
  images: string[];
  description: string;
  priority?: boolean;
  link?: {
    text: string;
    href: string;
  };
}

// The other two screenshots only appear on desktop. A picture source prevents
// downloading them on mobile, where CSS hiding alone still fetches an img src.
const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
const IMAGE_SIZES = '(min-width: 1024px) min(300px, calc((100vw - 438px) / 3)), (min-width: 768px) min(300px, calc((100vw - 210px) / 3)), (min-width: 400px) 352px, calc(100vw - 48px)';

function TiltImage({ src, alt, desktopOnly, priority, onReady }: {
  src: string;
  alt: string;
  desktopOnly: boolean;
  priority: boolean;
  onReady: (src: string) => void;
}) {
  const image = projectImages[src as keyof typeof projectImages];
  // Decode before revealing, including images that loaded before hydration.
  const imageRef = useCallback((node: HTMLImageElement | null) => {
    if (!node?.complete || node.naturalWidth <= 1) return;
    const currentSrc = node.currentSrc;
    void node.decode().catch(() => {}).then(() => {
      if (node.currentSrc === currentSrc && node.complete && node.naturalWidth > 1) onReady(src);
    });
  }, [onReady, src]);
  const { ref, handlers, style, glareBackground, isHovering } = useTilt({
    maxTilt: 10,
    perspective: 800,
    returnSpeed: 1000,
    glare: true,
    glareOpacity: 0.1,
  });

  return (
    <div
      ref={ref}
      {...handlers}
      className="relative"
      style={{ cursor: 'default' }}
    >
      <div
        className="relative"
        style={{
          aspectRatio: `${image.width} / ${image.height}`,
          transform: style.transform,
          transition: style.transition,
          transformStyle: 'preserve-3d',
        }}
      >
        <span
          aria-hidden="true"
          className="project-image-skeleton absolute inset-0 bg-[var(--theme-border)]"
          style={{ clipPath: 'url(#squircle)' }}
        />
        <picture>
          <source
            media={desktopOnly ? '(min-width: 768px)' : undefined}
            srcSet={image.srcSet}
            sizes={IMAGE_SIZES}
            type="image/webp"
          />
          <img
            ref={imageRef}
            src={desktopOnly ? EMPTY_IMAGE : image.src}
            alt={alt}
            width={image.width}
            height={image.height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority && !desktopOnly ? 'high' : 'auto'}
            decoding="async"
            onLoad={(event) => imageRef(event.currentTarget)}
            onError={() => onReady(src)}
            className="project-image-reveal relative h-auto w-full block"
            style={{ clipPath: 'url(#squircle)' }}
          />
        </picture>
        {glareBackground !== 'none' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: glareBackground,
              clipPath: "url(#squircle)",
              opacity: isHovering ? 1 : 0,
              transition: 'opacity 300ms ease',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function ProjectCard({ title, images, description, link, priority = false }: ProjectCardProps) {
  const [readyImages, setReadyImages] = useState<string[]>([]);
  const onImageReady = useCallback((src: string) => {
    setReadyImages((current) => current.includes(src) ? current : [...current, src]);
  }, []);

  return (
    <div className="card-border bg-transparent md:rounded-lg md:px-8 pt-6 pb-4 md:pt-[80px] md:pb-[48px] mx-0 md:mx-12 lg:mx-12 mb-6">
      {/* Mobile: image + title grouped for alignment */}
      <div className="max-w-[400px] md:max-w-none px-6 md:px-0 md:w-full">
        <div
          className="project-image-group flex justify-start md:justify-center items-end gap-4 md:gap-6 mb-2 md:mb-8"
          data-mobile-ready={readyImages.includes(images[0])}
          data-desktop-ready={images.every((src) => readyImages.includes(src))}
        >
          {images.map((src, index) => (
            <div
              key={index}
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.07)) drop-shadow(0 10px 24px rgba(0,0,0,0.07))" }}
              className={`${
                index === 0 ? "w-full md:w-[300px]" : "hidden md:block md:w-[300px]"
              }`}
            >
              <TiltImage
                src={src}
                alt={`${title} screenshot ${index + 1}`}
                desktopOnly={index > 0}
                priority={priority}
                onReady={onImageReady}
              />
            </div>
          ))}
        </div>
        <p className="text-center md:hidden" style={{ fontSize: "16px" }}>{title}</p>
      </div>

      {/* Desktop: full description */}
      <p className="text-center hidden md:block" style={{ fontSize: "16px" }}>
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
