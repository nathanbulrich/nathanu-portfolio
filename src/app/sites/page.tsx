const sites = [
  { name: "Linear", url: "linear.app" },
  { name: "Vercel", url: "vercel.com" },
  { name: "Stripe", url: "stripe.com" },
  { name: "Cosmos", url: "cosmos.so" },
  { name: "Arc", url: "arc.net" },
  { name: "Readwise", url: "readwise.io" },
  { name: "Amie", url: "amie.so" },
  { name: "Figma", url: "figma.com" },
  { name: "Raycast", url: "raycast.com" },
  { name: "Clerk", url: "clerk.com" },
  { name: "Campsite", url: "campsite.co" },
  { name: "Family", url: "family.co" },
];

export default function Sites() {
  return (
    <main className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-8 md:pt-[88px] pb-24">
        <div className="max-w-[480px]">
          <table className="w-full">
            <tbody>
              {sites.map(({ name, url }) => (
                <tr
                  key={url}
                  className="border-b border-[var(--theme-border)]"
                >
                  <td className="py-3 pr-8">{name}</td>
                  <td className="py-3 opacity-40">
                    <a
                      href={`https://${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-100 transition-opacity"
                    >
                      {url}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
