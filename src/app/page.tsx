import Header from "./components/Header";
import HeroCard from "./components/HeroCard";
import ProjectCard from "./components/ProjectCard";
import Footer from "./components/Footer";

const projects = [
  {
    images: [
      "/images/joon-1.svg",
      "/images/joon-2.svg",
      "/images/joon-3.svg",
    ],
    description: "Currently tinkering on Joon.",
    link: {
      text: "Try it here",
      href: "https://testflight.apple.com/join/cBy2uYxk",
    },
  },
  {
    images: [
      "/images/saturn-1.svg",
      "/images/saturn-2.svg",
      "/images/saturn-3.svg",
    ],
    description: "Led design at Saturn through an acquisition to Snap Inc.",
  },
  {
    images: [
      "/images/resy-1.svg",
      "/images/resy-2.svg",
      "/images/resy-3.svg",
    ],
    description: "Redesigned Resy iOS to drive all-time high mobile usage.",
  },
  {
    images: [
      "/images/rambler-1.svg",
      "/images/rambler-2.svg",
      "/images/rambler-3.svg",
    ],
    description: "Solo built Rambler as a personal project to learn SwiftUI",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <Header />

      <div className="max-w-[1200px] mx-auto">
        <HeroCard />

        {/* Recent work section */}
        <section className="mt-16">
          <h2 className="text-[#262626] opacity-80 text-base px-4 md:px-12 lg:px-16 mb-6">
            Recent work
          </h2>

          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              images={project.images}
              description={project.description}
              link={project.link}
            />
          ))}
        </section>

        <Footer />
      </div>
    </main>
  );
}
