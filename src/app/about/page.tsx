export default function About() {
  return (
    <main className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-8 md:pt-[88px] pb-24">
        <div className="max-w-[640px]">
          {/* Photo placeholder */}
          <div className="w-[160px] h-[160px] rounded-lg bg-[var(--theme-border)] mb-10" />

          <div className="space-y-6 mb-16 leading-relaxed">
            <p>
              I&apos;m Nathan Ulrich, a product designer and builder based
              in New York City. I design and ship software that people
              actually want to use.
            </p>
            <p>
              My work sits at the intersection of product design and
              engineering. I prototype in code, think in systems, and care
              deeply about craft at every level of the stack.
            </p>
          </div>

          <div className="space-y-10">
            <div>
              <div className="flex items-baseline gap-3 mb-[20px]">
                <span className="font-medium">Patreon</span>
                <span className="opacity-40">2023 &ndash; Present</span>
              </div>
              <p className="leading-relaxed opacity-70">
                Leading design for creator tools and membership
                experiences. Focused on helping creators build
                sustainable businesses.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-[20px]">
                <span className="font-medium">Snap Inc.</span>
                <span className="opacity-40">2021 &ndash; 2023</span>
              </div>
              <p className="leading-relaxed opacity-70">
                Joined via the Saturn acquisition. Designed social
                features for Snapchat&apos;s younger audience, working
                across scheduling, profiles, and groups.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-[20px]">
                <span className="font-medium">Saturn</span>
                <span className="opacity-40">2019 &ndash; 2021</span>
              </div>
              <p className="leading-relaxed opacity-70">
                Led product design through rapid growth and an
                acquisition by Snap Inc. Owned the full design system,
                core scheduling experience, and social features.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-[20px]">
                <span className="font-medium">Resy</span>
                <span className="opacity-40">2017 &ndash; 2019</span>
              </div>
              <p className="leading-relaxed opacity-70">
                Redesigned the iOS app from the ground up, driving
                all-time high mobile usage. Worked across consumer
                and restaurant-facing products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
