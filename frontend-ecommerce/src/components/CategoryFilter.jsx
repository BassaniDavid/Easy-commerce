export default function CategoryFilter({ categories, selected, onChange }) {
  return (
    <select
      id="category"
      aria-label="Category select"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="rounded p-3 mb-4 focus:outline-none  bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-700 dark:hover:bg-sky-600 "
    >
      <option value="">category</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
