const posts = [
  {
    date: "Feb 2026",
    title: "Tools make the best networks",
    body: "Every great social network started as a tool. Instagram was a camera. Venmo was a way to split a bill. When you give someone a reason to come back every day on their own, you earn the right to connect them with others.",
  },
  {
    date: "Jan 2026",
    title: "Learning to ship alone",
    body: "I spent the last few months building Joon on nights and weekends. Designing for yourself is freeing — no stakeholder reviews, no spec debates. But it's also harder than I expected. You have to be your own critic.",
  },
  {
    date: "Dec 2025",
    title: "Solitaire and the beauty of simple software",
    body: "I built a Solitaire app because I wanted one that felt good. No ads, no streaks, no social features. Just cards. Sometimes the best product decision is choosing what not to build.",
  },
];

export default function Blog() {
  return (
    <main className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-8 md:pt-[88px] pb-24">
        <div className="max-w-[640px] space-y-16">
          {posts.map((post, i) => (
            <article key={i}>
              <span className="text-[13px] opacity-40">{post.date}</span>
              <h2 className="font-medium mt-1 mb-3">{post.title}</h2>
              <p className="leading-relaxed opacity-70">{post.body}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
