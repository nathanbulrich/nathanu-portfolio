import DotRow from "./DotRow";

export default function HeroCard() {
  return (
    <div className="relative px-6 md:px-12 lg:px-16 pt-8 pb-8 md:pt-[88px] md:pb-[56px]">
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

      {/* Vertical dots — right-aligned, scrolls with content */}
      <div className="hidden md:flex absolute top-8 md:top-[88px] right-6 md:right-12 lg:right-16">
        <DotRow dotSize="w-[16px] h-[16px]" gap="gap-[14px]" className="flex-col" />
      </div>
    </div>
  );
}
