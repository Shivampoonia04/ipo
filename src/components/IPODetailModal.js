// IPODetailModal: Shows detailed IPO info in a modal. Accessible, with close button and keyboard focus trap recommended.
import React from "react";

function getIPOStatus(ipo) {
  const now = new Date();
  const open = new Date(ipo.openDate);
  const close = new Date(ipo.closeDate);
  if (ipo.listingDate && new Date(ipo.listingDate) <= now) return 'Listed';
  if (now < open) return 'Upcoming';
  if (now >= open && now <= close) return 'Ongoing';
  if (now > close) return 'Closed';
  return '';
}

function IPODetailModal({ ipo, onClose }) {
  const status = getIPOStatus(ipo);
  const statusColors = {
    'Upcoming': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Ongoing': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Closed': 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
    'Listed': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  };
  return (
    // Modal overlay: covers entire screen, centers modal, uses high z-index
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {/* Modal content: white box, rounded, shadow, responsive width */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-7 w-full max-w-md relative border border-blue-100 dark:border-blue-900">
        {/* Close button: top-right, accessible with aria-label */}
        <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 text-2xl" onClick={onClose} aria-label="Close">&times;</button>
        {/* IPO Company Name */}
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{ipo.companyName}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${statusColors[status] || 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}>{status}</span>
        </div>
        {/* Sector badge */}
        <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2 py-0.5 rounded mb-3">{ipo.sector}</span>
        {/* IPO Open/Close Dates */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
          <span>Open: <span className="font-medium text-gray-800 dark:text-gray-200">{ipo.openDate}</span></span>
          <span>Close: <span className="font-medium text-gray-800 dark:text-gray-200">{ipo.closeDate}</span></span>
        </div>
        {/* Price Band & Lot Size */}
        <div className="flex flex-wrap gap-2 text-sm mb-2">
          <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-0.5">Price Band: <span className="font-medium">{ipo.priceBand}</span></span>
          <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-0.5">Lot Size: <span className="font-medium">{ipo.lotSize}</span></span>
        </div>
        {/* RHP Link: opens in new tab, accessible */}
        <div className="mb-2">RHP: <a href={ipo.rhpLink} className="text-blue-600 dark:text-blue-300 underline" target="_blank" rel="noopener noreferrer">View</a></div>
        {/* Description */}
        <div className="mb-4 text-gray-700 dark:text-gray-200 text-sm">{ipo.description}</div>
        {/* Apply Now button: visually prominent */}
        <button className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 text-white px-5 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-900 dark:hover:to-blue-800 font-semibold w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700" onClick={() => alert('Apply Now feature coming soon!')} aria-label={`Apply for IPO: ${ipo.companyName}`}>Apply Now</button>
      </div>
    </div>
  );
}

export default IPODetailModal; 