"use client";

/* eslint-disable @next/next/no-img-element */

const sites = [
  { name: "Linear", url: "linear.app", note: "Best-in-class project tracking" },
  { name: "Vercel", url: "vercel.com", note: "Deploy preview perfection" },
  { name: "Stripe", url: "stripe.com", note: "Gold standard developer docs" },
  { name: "Cosmos", url: "cosmos.so", note: "Beautiful mood boarding" },
  { name: "Arc", url: "arc.net", note: "Rethinking the browser" },
  { name: "Readwise", url: "readwise.io", note: "Reading that sticks" },
  { name: "Amie", url: "amie.so", note: "Joyful calendar design" },
  { name: "Figma", url: "figma.com", note: "Multiplayer design toolkit" },
  { name: "Raycast", url: "raycast.com", note: "Launcher done right" },
  { name: "Clerk", url: "clerk.com", note: "Auth with great DX" },
  { name: "Campsite", url: "campsite.co", note: "Async team updates" },
  { name: "Family", url: "family.co", note: "Wallet with taste" },
];

export default function Sites() {
  return (
    <main className="min-h-screen">
      <div className="sites-layout pt-8 md:pt-[88px] lg:pt-[92px] pb-24 pl-0 md:pl-12 lg:pl-12 pr-0 md:pr-[44px]">
        <div className="card-border md:rounded-lg w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--theme-border)]">
                <th className="py-4 pl-6 md:pl-8 pr-8 text-left font-normal text-[var(--theme-text)]">Name</th>
                <th className="py-4 pr-8 text-left font-normal text-[var(--theme-text)]">Site</th>
                <th className="py-4 pr-6 md:pr-8 text-left font-normal text-[var(--theme-text)] hidden md:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(({ name, url, note }) => (
                <tr
                  key={url}
                  className="border-b border-[var(--theme-border)] last:border-b-0 cursor-pointer hover:bg-[color-mix(in_srgb,var(--theme-text)_5%,transparent)] transition-colors"
                  onClick={() => window.open(`https://${url}`, '_blank', 'noopener,noreferrer')}
                >
                  <td className="py-4 pl-6 md:pl-8 pr-8">
                    <span className="flex items-center gap-5">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${url}&sz=48`}
                        alt=""
                        width={24}
                        height={24}
                        className="shrink-0"
                      />
                      {name}
                    </span>
                  </td>
                  <td className="py-4 pr-8 opacity-40">
                    {url}
                  </td>
                  <td className="py-4 pr-6 md:pr-8 opacity-40 hidden md:table-cell">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
