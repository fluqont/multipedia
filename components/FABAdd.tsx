import Add from "@/icons/Add";

export default function FABAdd() {
  return (
    <a
      href="/add"
      className="fixed bottom-24 right-10 p-8 rounded-2xl z-20 interactive-bg-surface-variant text-primary shadow-md shadow-black/50"
    >
      <Add />
    </a>
  );
}
