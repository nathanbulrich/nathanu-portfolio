import DotRow from "./DotRow";

export default function Footer() {
  return (
    <footer
      className="bg-transparent rounded-lg p-8 md:p-12 mx-4 md:mx-12 lg:mx-12 mt-6 mb-8 transition-[border-color] duration-300"
      style={{ border: "1px solid var(--theme-border)" }}
    >
      <DotRow
        gap="gap-4 md:gap-6"
        className="justify-center"
      />
    </footer>
  );
}
