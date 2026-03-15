import Header from "./components/Header";
import HeroCard from "./components/HeroCard";
import ProjectCard from "./components/ProjectCard";

const projects = [
  {
    title: "Joon",
    images: [
      "/images/joon-1.png",
      "/images/joon-2.png",
      "/images/joon-3.png",
    ],
    description: "Currently tinkering on Joon.",
    link: {
      text: "Try it here",
      href: "https://testflight.apple.com/join/cBy2uYxk",
    },
  },
  {
    title: "Solitaire",
    images: [
      "/images/solitaire-1.png",
      "/images/solitaire-2.png",
      "/images/solitaire-3.png",
    ],
    description: "Built a delightfully simple Solitaire app on iOS.",
    link: {
      text: "Try it here",
      href: "https://apps.apple.com/us/app/solitaire-minimal/id6759523921",
    },
  },
  {
    title: "Saturn",
    images: [
      "/images/saturn-1.png",
      "/images/saturn-2.png",
      "/images/saturn-3.png",
    ],
    description: "Led design at Saturn through an acquisition to Snap Inc.",
  },
  {
    title: "Resy",
    images: [
      "/images/resy-1.png",
      "/images/resy-2.png",
      "/images/resy-3.png",
    ],
    description: "Redesigned Resy iOS to drive all-time high mobile usage.",
  },
  {
    title: "Rambler",
    images: [
      "/images/rambler-1.png",
      "/images/rambler-2.png",
      "/images/rambler-3.png",
    ],
    description: "Solo built Rambler as a personal project to learn SwiftUI",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* SVG defs for iOS-style continuous corner clip path */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="squircle" clipPathUnits="objectBoundingBox">
            <path d="M 0.14,0 L 0.86,0 C 0.954,0 1,0.023 1,0.065 L 1,0.935 C 1,0.977 0.954,1 0.86,1 L 0.14,1 C 0.046,1 0,0.977 0,0.935 L 0,0.065 C 0,0.023 0.046,0 0.14,0 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="max-w-[1200px] mx-auto">
        <Header />
        <HeroCard />

        {/* Recent work section */}
        <section className="mt-16">
          <h2 className="px-6 md:px-12 lg:px-16 mb-6">
            Recent work
          </h2>

          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              images={project.images}
              description={project.description}
              link={project.link}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
