export default function CategoryFilter({ categories, selected, onChange }) {
  return (
    <div className="mb-4">
      <select
        id="category"
        aria-label="Category select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-1"
      >
        <option value="">category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
