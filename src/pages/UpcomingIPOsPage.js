// UpcomingIPOsPage: Lists IPOs with search, filter, and detail modal. Responsive and accessible.
// Uses IPOCard and IPODetailModal components.
import React, { useState, useEffect } from "react";
import ipoData from "../utils/ipoData";
import IPOCard from "../components/IPOCard";
import IPODetailModal from "../components/IPODetailModal";

// Build sector filter options from IPO data
const sectors = ["All", ...Array.from(new Set(ipoData.map(ipo => ipo.sector)))]

function UpcomingIPOsPage() {
  // State for search input, sector filter, date range, and selected IPO for modal
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [selectedIPO, setSelectedIPO] = useState(null);
  // New: Date range filter state
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Dark/Light mode state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Reset page to 1 when filters change
  useEffect(() => { setPage(1); }, [search, sector, dateRange]);

  // Filter IPOs by sector, search query, and date range
  const filteredIPOs = ipoData.filter(ipo => {
    const matchesSector = sector === "All" || ipo.sector === sector;
    const matchesSearch = ipo.companyName.toLowerCase().includes(search.toLowerCase());
    // Date filter: if set, IPO openDate must be >= from and closeDate <= to
    const matchesFrom = !dateRange.from || ipo.openDate >= dateRange.from;
    const matchesTo = !dateRange.to || ipo.closeDate <= dateRange.to;
    return matchesSector && matchesSearch && matchesFrom && matchesTo;
  });
  // Pagination logic
  const totalPages = Math.ceil(filteredIPOs.length / pageSize);
  const paginatedIPOs = filteredIPOs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      {/* Dark/Light Mode Toggle */}
      <div className="flex justify-end mb-2">
        <button
          className="p-2 rounded-full border bg-white dark:bg-gray-800 shadow text-gray-700 dark:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle dark/light mode"
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
          )}
        </button>
      </div>
      <section className="custom-section bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg p-6 md:p-10 max-w-7xl mx-auto mb-8">
        <header className="mb-9 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 dark:text-blue-200 mb-2 tracking-wide">Upcoming IPOs</h1>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-0">Discover and apply for the latest IPO opportunities.</p>
        </header>
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 justify-center items-center bg-white dark:bg-gray-700 rounded-xl p-4 mb-7 shadow border border-blue-100 dark:border-gray-600">
          <input
            type="text"
            placeholder="Search by company name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search IPOs by company name"
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-base min-w-[180px] flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <select
            value={sector}
            onChange={e => setSector(e.target.value)}
            aria-label="Filter IPOs by sector"
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-base min-w-[120px] flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {sectors.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateRange.from}
            onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
            aria-label="Filter IPOs from date"
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-base min-w-[120px] flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <input
            type="date"
            value={dateRange.to}
            onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
            aria-label="Filter IPOs to date"
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-base min-w-[120px] flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        {/* IPO Cards Grid: responsive columns */}
        {filteredIPOs.length === 0 ? (
          <div className="text-center text-gray-400 py-16">No IPOs match your criteria.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {paginatedIPOs.map(ipo => (
                <div className="transition-transform transform hover:-translate-y-2 hover:shadow-2xl bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col items-stretch border border-blue-100 dark:border-gray-700 ring-1 ring-blue-100 dark:ring-gray-700 hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500">
                  <IPOCard key={ipo.id} ipo={ipo} onClick={() => setSelectedIPO(ipo)} />
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="px-3 py-1 rounded border bg-white dark:bg-gray-700 shadow text-gray-700 dark:text-gray-200 disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'} shadow`}
                  onClick={() => setPage(i + 1)}
                  aria-label={`Go to page ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded border bg-white dark:bg-gray-700 shadow text-gray-700 dark:text-gray-200 disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>
          </>
        )}
        {/* IPO Detail Modal: shown when an IPO is selected */}
        {selectedIPO && (
          <IPODetailModal ipo={selectedIPO} onClose={() => setSelectedIPO(null)} />
        )}
      </section>
    </>
  );
}

export default UpcomingIPOsPage; 