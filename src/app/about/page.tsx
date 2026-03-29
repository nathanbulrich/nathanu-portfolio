export default function About() {
  return (
    <main className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-12 pt-8 md:pt-[88px] lg:pt-[92px] pb-24">
        <div className="max-w-[640px]">
          <img
            src="/images/site-pic.png"
            alt="Nathan Ulrich"
            className="w-[160px] h-[160px] rounded-lg object-cover mb-16"
            draggable={false}
          />

          <div className="space-y-6 leading-relaxed">
            <p>
              Hi I&apos;m Nathan. I&apos;m a designer in New York City who
              ships. My focus is on mobile, growing consumer products,
              and interactive prototyping. I&apos;ve lead the design for
              apps that are used by millions everyday including Resy,
              Saturn, and now Patreon.
            </p>
            <p>
              Right now I&apos;m focusing on leveling up my engineering
              skillset to help empower product orgs with AI tooling. I
              also like to tinker on iOS apps for fun.
            </p>
          </div>

          <hr className="border-t my-16 max-w-[160px]" style={{ borderColor: 'rgba(37, 42, 73, 0.15)' }} />

          <div className="space-y-16">
            <div>
              <div className="flex items-baseline gap-3 mb-[12px]">
                <span className="font-medium">Patreon</span>
                <span style={{ color: 'var(--theme-text-secondary)' }}>2025 &ndash; Present</span>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                Working on Discovery, Community, and AI design
                infra.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-[12px]">
                <span className="font-medium">Saturn (Acq. Snapchat)</span>
                <span style={{ color: 'var(--theme-text-secondary)' }}>2024 &ndash; 2025</span>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                Lead design of the most popular calendar for Gen-Z
                through an acquisition to Snap Inc.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-[12px]">
                <span className="font-medium">Resy</span>
                <span style={{ color: 'var(--theme-text-secondary)' }}>2022 &ndash; 2024</span>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                Lead the re-design of the core mobile apps, driving
                all-time high mobile adoption.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-[12px]">
                <span className="font-medium">NeuroFlow</span>
                <span style={{ color: 'var(--theme-text-secondary)' }}>2020 &ndash; 2022</span>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                Designed the mobile app connecting behavioral health
                patients to care providers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
