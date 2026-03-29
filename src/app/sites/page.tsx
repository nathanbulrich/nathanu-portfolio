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
                <th className="py-3 pl-6 md:pl-8 pr-8 text-left font-normal opacity-40">Name</th>
                <th className="py-3 pr-8 text-left font-normal opacity-40">Site</th>
                <th className="py-3 pr-6 md:pr-8 text-left font-normal opacity-40 hidden md:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(({ name, url, note }) => (
                <tr
                  key={url}
                  className="border-b border-[var(--theme-border)]"
                >
                  <td className="py-3 pl-6 md:pl-8 pr-8">
                    <span className="flex items-center gap-3">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${url}&sz=32`}
                        alt=""
                        width={16}
                        height={16}
                        className="rounded-sm shrink-0"
                      />
                      {name}
                    </span>
                  </td>
                  <td className="py-3 pr-8 opacity-40">
                    <a
                      href={`https://${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-100 transition-opacity"
                    >
                      {url}
                    </a>
                  </td>
                  <td className="py-3 pr-6 md:pr-8 opacity-40 hidden md:table-cell">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
