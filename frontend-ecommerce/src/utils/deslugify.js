export default function deslugify(slug) {
  return slug.replace(/-/g, " ");
}
