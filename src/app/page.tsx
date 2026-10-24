import DeviceFrameTuner from "./components/DeviceFrameTuner";
import HeroCard from "./components/HeroCard";
import ProjectCard from "./components/ProjectCard";

const projects = [
  {
    title: "Cosmos",
    images: [
      "/images/cosmos-2.png",
      "/images/cosmos-3.png",
      "/images/cosmos-1.png",
    ],
    description: "Lead designer at Cosmos",
  },
  {
    title: "Joon",
    images: [
      "/images/joon-1.png",
      "/images/joon-2.png",
      "/images/joon-3.png",
    ],
    description: "Currently tinkering on Joon.",
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
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <DeviceFrameTuner />
      <div className="max-w-[1200px] mx-auto">
        <HeroCard />

        {/* Recent work section */}
        <section className="mt-[120px]">
          <h2 className="px-6 md:px-12 lg:px-12 mb-6">
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
