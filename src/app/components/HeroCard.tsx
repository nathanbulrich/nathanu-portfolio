export default function HeroCard() {
  return (
    <div
      className="bg-transparent rounded-lg px-8 md:px-12 pt-[64px] pb-[80px] mx-4 md:mx-12 lg:mx-16 my-8 transition-[border-color] duration-300"
      style={{ border: "1px solid var(--theme-border)" }}
    >
      <div className="max-w-[624px] mx-auto space-y-6">
        <p className="leading-relaxed">
          I&apos;m a semi-technical designer in NY who builds apps.
          Currently I&apos;m a Senior Product Designer at Patreon.
        </p>
        <p className="leading-relaxed">
          I believe great social software starts with focused
          personal utility. Tools create the strongest networks.
        </p>
      </div>
    </div>
  );
}
