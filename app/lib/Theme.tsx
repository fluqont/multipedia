import Dark from "../icons/Dark";

export default function Theme() {
  return (
    <div className="relative">
      <input
        type="checkbox"
        name="theme"
        id="theme"
        className="absolute w-full h-full"
      />
      <Dark />
    </div>
  );
}
