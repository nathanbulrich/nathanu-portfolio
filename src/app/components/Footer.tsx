import DotRow from "./DotRow";

export default function Footer() {
  return (
    <footer
      className="bg-transparent rounded-lg p-8 md:p-12 mx-4 md:mx-12 lg:mx-16 mt-6 mb-8 transition-[border-color] duration-300"
      style={{ border: "1px solid var(--theme-border)" }}
    >
      <DotRow
        dotSize="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
        gap="gap-4 md:gap-6"
        className="justify-center"
      />
    </footer>
  );
}
