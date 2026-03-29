"use client";

/* eslint-disable @next/next/no-img-element */

const sites = [
  { name: "Adam Whitcroft", url: "adamwhitcroft.com", note: "Pristine app icon craft" },
  { name: "Daniel Destefanis", url: "danield.design", note: "Inventive product design explorations" },
  { name: "Yitong Zhang", url: "zhayitong.com", note: "Thoughtful product design leadership" },
  { name: "Marco Cornacchia", url: "marco.fyi", note: "Intentional, interactive portfolio" },
  { name: "Rasmus Andersson", url: "rsms.me", note: "Prolific type and tools" },
  { name: "David McGillivray", url: "dmcg.co", note: "Refined startup brand identity" },
  { name: "Philip Davis", url: "philipcdavis.com", note: "Polished interface experiments" },
  { name: "Atilla Taskiran", url: "atillataskiran.com", note: "Purposeful freelance software design" },
  { name: "Gabriel Valdivia", url: "gabrielvaldivia.com", note: "Early-stage startup design partner" },
  { name: "Carl Hauser", url: "carlhauser.com", note: "Daily creative process journal" },
  { name: "U.S. Graphics", url: "usgraphics.com", note: "Engineering-driven graphics philosophy" },
  { name: "Spotted in Prod", url: "spottedinprod.com", note: "Curated standout iOS interactions" },
  { name: "History of Software", url: "historyofsoftware.org", note: "Preserving landmark software interfaces" },
  { name: "Steve Jobs Archive", url: "stevejobsarchive.com", note: "Legacy, fellowship, and inspiration" },
  { name: "Bhavik Singh", url: "softnet.works", note: "Intimate social software futures" },
  { name: "Making Software", url: "makingsoftware.com", note: "Illustrated technical reference book" },
  { name: "Area Technology", url: "area.tech", note: "Advanced visual technology studio" },
  { name: "Untitled", url: "untitled.stream", note: "Work-in-progress music platform" },
  { name: "Software Inc.", url: "software.inc", note: "Retro Mac OS emulator site" },
  { name: "Paul Macgregor", url: "works.pm", note: "Minimal portfolio, maximal craft" },
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
                        onLoad={(e) => {
                          const el = e.currentTarget;
                          if (el.naturalWidth < 24) {
                            el.style.display = 'none';
                            const circle = document.createElement('span');
                            Object.assign(circle.style, { width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--theme-border)', display: 'inline-block', flexShrink: '0' });
                            el.parentElement?.insertBefore(circle, el);
                          }
                        }}
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.style.display = 'none';
                          const circle = document.createElement('span');
                          Object.assign(circle.style, { width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--theme-border)', display: 'inline-block', flexShrink: '0' });
                          el.parentElement?.insertBefore(circle, el);
                        }}
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
