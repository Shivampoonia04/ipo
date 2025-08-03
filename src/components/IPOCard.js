// IPOCard: Displays IPO summary info and Apply Now button. Clickable for details. Accessible and responsive.
import React from "react";

function getIPOStatus(ipo) {
  const now = new Date();
  const open = new Date(ipo.openDate);
  const close = new Date(ipo.closeDate);
  // If listingDate exists, use it for 'Listed' status
  if (ipo.listingDate && new Date(ipo.listingDate) <= now) return 'Listed';
  if (now < open) return 'Upcoming';
  if (now >= open && now <= close) return 'Ongoing';
  if (now > close) return 'Closed';
  return '';
}

function IPOCard({ ipo, onClick }) {
  const status = getIPOStatus(ipo);
  const statusColors = {
    'Upcoming': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Ongoing': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Closed': 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
    'Listed': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-2xl transition cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 group relative" onClick={onClick}>
      {/* Status Tag */}
      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${statusColors[status] || 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}>{status}</span>
      {/* Company Name */}
      <h2 className="text-lg font-bold mb-1 text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition">{ipo.companyName}</h2>
      {/* Sector badge */}
      <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2 py-0.5 rounded mb-2">{ipo.sector}</span>
      {/* IPO Open/Close Dates */}
      <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
        <span>Open: <span className="font-medium text-gray-800 dark:text-gray-200">{ipo.openDate}</span></span>
        <span>Close: <span className="font-medium text-gray-800 dark:text-gray-200">{ipo.closeDate}</span></span>
      </div>
      {/* Price Band & Lot Size */}
      <div className="flex flex-wrap gap-2 text-sm mb-3">
        <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-0.5">Price Band: <span className="font-medium">{ipo.priceBand}</span></span>
        <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-0.5">Lot Size: <span className="font-medium">{ipo.lotSize}</span></span>
      </div>
      {/* Apply Now button: stops event propagation so card click doesn't trigger, placeholder alert for now */}
      <button
        className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 text-white px-5 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-900 dark:hover:to-blue-800 font-semibold w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
        onClick={e => { e.stopPropagation(); alert('Apply Now feature coming soon!'); }}
        aria-label={`Apply for IPO: ${ipo.companyName}`}
      >
        Apply Now
      </button>
    </div>
  );
}

export default IPOCard; 