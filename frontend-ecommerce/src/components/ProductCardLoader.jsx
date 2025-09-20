export default function ProductCardLoader() {
  return (
    <div className="flex flex-col rounded-lg p-4 border h-full bg-neutral-100/50 border-neutral-300 md:shadow-md shadow-neutral-400 dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-neutral-900 animate-pulse">
      {/* Immagine placeholder */}
      <div className="w-full aspect-square md:mb-3 rounded-lg bg-neutral-300 dark:bg-neutral-700" />

      <div className="flex-1 flex flex-col gap-2 mt-2">
        {/* Titolo */}
        <div className="h-5 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4" />
        {/* Descrizione */}
        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-full" />
        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-5/6" />
        {/* Prezzo */}
        <div className="h-5 bg-neutral-300 dark:bg-neutral-700 rounded w-1/4 mt-2" />
      </div>

      {/* Footer con bottoni */}
      <div className="mt-3 flex items-center justify-between">
        <div className="h-8 bg-neutral-300 dark:bg-neutral-700 rounded w-24" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-neutral-300 dark:bg-neutral-700 rounded" />
          <div className="h-8 w-10 bg-neutral-300 dark:bg-neutral-700 rounded" />
          <div className="h-8 w-8 bg-neutral-300 dark:bg-neutral-700 rounded" />
        </div>
      </div>
    </div>
  );
}
