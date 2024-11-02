export function cn(classes: unknown[]) {
  return classes.filter((cssClass) => typeof cssClass === "string").join(" ");
}
