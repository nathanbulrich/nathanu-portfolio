export default function HeroCard() {
  return (
    <div className="bg-white rounded-2xl p-8 md:p-12 mx-4 md:mx-12 lg:mx-16 my-8">
      <div className="max-w-2xl mx-auto space-y-6 text-[#262626] opacity-90">
        <p className="text-lg leading-relaxed">
          I&apos;m a semi-technical designer in NY who builds apps.
          Currently I&apos;m a Senior Product Designer at Patreon.
        </p>
        <p className="text-lg leading-relaxed">
          I believe great social software starts with focused
          personal utility. Tools create the strongest networks.
        </p>
      </div>
    </div>
  );
}
