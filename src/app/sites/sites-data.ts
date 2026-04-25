export interface Site {
  name: string;
  url: string;
  note: string;
  waitMs?: number;
}

export const sites: Site[] = [
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

export function slugForUrl(url: string): string {
  return url.replace(/\./g, "-");
}
