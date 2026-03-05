import DotRow from "./DotRow";

export default function HeroCard() {
  return (
    <div className="px-6 md:px-12 lg:px-16 pt-8 pb-8 md:pt-[88px] md:pb-[56px]">
      <div className="space-y-6 max-w-[624px]">
        <p className="leading-relaxed">
          Hi, I&apos;m Nathan Ulrich. I&apos;m a designer in NYC who builds apps.
          Currently I&apos;m a Discovery lead at Patreon.
        </p>
        <p className="leading-relaxed">
          I believe great social software starts with focused
          personal utility. Tools create the strongest networks.
        </p>
      </div>

      {/* Dots — horizontal, left-aligned, below hero text */}
      <div className="mt-8">
        <DotRow dotSize="w-[16px] h-[16px]" gap="gap-[14px]" />
      </div>
    </div>
  );
}
