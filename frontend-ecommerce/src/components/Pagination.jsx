export default function Pagination({
  totalProducts,
  productsPerPage,
  currentPage,
  onPageChange,
  maxButtons = 5,
}) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Calcola l'intervallo di bottoni visibili
  const getPageNumbers = () => {
    const pages = [];
    let startPage = currentPage - Math.floor(maxButtons / 2);
    let endPage = currentPage + Math.floor(maxButtons / 2);

    // if necessari per centrare il bottone della pagina corrente solo se ci sono sufficienti pagine prima e dopo
    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(maxButtons, totalPages);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(totalPages - maxButtons + 1, 1);
    }

    // array di numeri che verrà usato per i bottoni della paginazione
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Nessuna paginazione se c'è una sola pagina
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:scale-105 transition hover:bg-lime-500/70"
        aria-label="Previous"
      >
        &#10094;
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded hover:scale-105 transition hover:bg-lime-500/70 ${
            page === currentPage
              ? "bg-lime-500 text-white dark:bg-lime-600"
              : ""
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:scale-105 transition hover:bg-lime-500/70"
        aria-label="Next"
      >
        &#10095;
      </button>
    </div>
  );
}
