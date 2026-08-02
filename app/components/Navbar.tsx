import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <span className="text-xl font-bold">CampusLoop</span>

      <button className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black">
        Get Started
      </button>
    </nav>
  );
}
