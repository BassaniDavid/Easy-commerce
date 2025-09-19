export default function CategoryFilter({ categories, selected, onChange }) {
  return (
    <select
      id="category"
      aria-label="Category select"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="rounded p-1 mb-4  bg-lime-500 text-white hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-500"
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
