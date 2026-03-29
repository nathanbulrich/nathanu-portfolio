"use client";

/* eslint-disable @next/next/no-img-element */

const sites = [
  { name: "Making Software", url: "makingsoftware.com", note: "Technical illustrations on software" },
  { name: "Daniel Destefanis", url: "danield.design", note: "Thoughtful shaders and motion" },
  { name: "Yitong Zhang", url: "zhayitong.com", note: "Opinionated writing on product design" },
  { name: "Marco Cornacchia", url: "marco.fyi", note: "Playful sounds and bento" },
  { name: "Rasmus Andersson", url: "rsms.me", note: "Legendary type and computing" },
  { name: "David McGillivray", url: "dmcg.co", note: "Blending brand and product" },
  { name: "Philip Davis", url: "philipcdavis.com", note: "Wonderful iOS prototyping" },
  { name: "Gabriel Valdivia", url: "gabrielvaldivia.com", note: "Early-stage startup design partner" },
  { name: "Carl Hauser", url: "carlhauser.com", note: "Sketching cleverly presented" },
  { name: "U.S. Graphics", url: "usgraphics.com", note: "Engineering-driven graphics philosophy" },
  { name: "Spotted in Prod", url: "spottedinprod.com", note: "The definitive mobile inspo" },
  { name: "History of Software", url: "historyofsoftware.org", note: "A deep dive into the medium" },
  { name: "Steve Jobs Archive", url: "stevejobsarchive.com", note: "Fascinating stories from Apple" },
  { name: "Area Technology", url: "area.tech", note: "Not-boring brand and design" },
  { name: "Untitled", url: "untitled.stream", note: "Delicious audiophile details" },
  { name: "Software Inc.", url: "software.inc", note: "Retro Mac OS emulator site" },
  { name: "Paul Macgregor", url: "works.pm", note: "Insane visual design craft" },
];

export default function Sites() {
  return (
    <main className="min-h-screen">
      <div className="sites-layout pt-8 md:pt-[88px] lg:pt-[92px] pb-24 pl-0 md:pl-12 lg:pl-12 pr-0 md:pr-[44px]">
        <p className="max-w-[640px] leading-relaxed mb-12 px-6 md:px-0">
          A collection of really wonderful websites that inspire. Click around and enjoy what the talented craftspeople of the World Wide Web have to offer.
        </p>
        <div className="card-border md:rounded-lg w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--theme-border)]">
                <th className="py-5 pl-6 md:pl-8 pr-8 text-left font-normal text-[var(--theme-text)]">Name</th>
                <th className="py-5 pr-8 text-left font-normal text-[var(--theme-text)] hidden md:table-cell">Site</th>
                <th className="py-5 pr-6 md:pr-8 text-left font-normal text-[var(--theme-text)] hidden md:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(({ name, url, note }) => (
                <tr
                  key={url}
                  className="border-b border-[var(--theme-border)] last:border-b-0 cursor-pointer hover:bg-[color-mix(in_srgb,var(--theme-text)_5%,transparent)] transition-colors"
                  onClick={() => window.open(`https://${url}`, '_blank', 'noopener,noreferrer')}
                >
                  <td className="py-5 pl-6 md:pl-8 pr-8">
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
                  <td className="py-5 pr-8 opacity-40 hidden md:table-cell">
                    {url}
                  </td>
                  <td className="py-5 pr-6 md:pr-8 opacity-40 hidden md:table-cell">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
