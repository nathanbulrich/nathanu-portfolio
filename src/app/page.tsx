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
