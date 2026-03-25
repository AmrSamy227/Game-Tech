"use client";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  paginate: (num: number) => void;
}

export default function Pagination({ totalPages, currentPage, paginate }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center gap-2 flex-wrap justify-center max-w-full overflow-x-auto px-2 sm:px-0">
        {/* First Page */}
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
            currentPage === 1
              ? "bg-[#222] text-gray-500 cursor-not-allowed"
              : "bg-[#333] text-gray-300 hover:bg-[#444]"
          }`}
        >
          «
        </button>

        {/* Previous Page */}
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
            currentPage === 1
              ? "bg-[#222] text-gray-500 cursor-not-allowed"
              : "bg-[#333] text-gray-300 hover:bg-[#444]"
          }`}
        >
          ‹
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => paginate(num)}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
              currentPage === num
                ? "bg-red-600 text-white"
                : "bg-[#333] text-gray-300 hover:bg-[#444]"
            }`}
          >
            {num}
          </button>
        ))}

        {/* Next Page */}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
            currentPage === totalPages
              ? "bg-[#222] text-gray-500 cursor-not-allowed"
              : "bg-[#333] text-gray-300 hover:bg-[#444]"
          }`}
        >
          ›
        </button>

        {/* Last Page */}
        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
            currentPage === totalPages
              ? "bg-[#222] text-gray-500 cursor-not-allowed"
              : "bg-[#333] text-gray-300 hover:bg-[#444]"
          }`}
        >
          »
        </button>
      </div>
    </div>
  );
}
