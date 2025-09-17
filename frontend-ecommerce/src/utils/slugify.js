export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spazi → trattini
    .replace(/[^\w\-]+/g, "") // rimuove caratteri non alfanumerici
    .replace(/\-\-+/g, "-"); // riduce doppi trattini
}
