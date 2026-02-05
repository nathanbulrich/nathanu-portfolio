export default function HeroCard() {
  return (
    <div className="card-border bg-transparent md:rounded-lg px-6 md:px-12 pt-8 pb-8 md:pt-[64px] md:pb-[80px] mx-0 md:mx-12 lg:mx-16 my-8">
      <div className="max-w-[624px] md:mx-auto space-y-6">
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
