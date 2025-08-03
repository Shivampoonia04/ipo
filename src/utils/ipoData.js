// ipoData.js: Static dummy IPO data for use as a mock API in development.
const ipoData = [
  {
    id: 1,
    companyName: "Tech Innovators Ltd.",
    sector: "Technology",
    openDate: "2024-07-01",
    closeDate: "2024-07-05",
    priceBand: "₹500 - ₹550",
    lotSize: 20,
    rhpLink: "https://example.com/rhp1.pdf",
    description: "A leading tech company specializing in AI solutions.",
    listingDate: "2024-07-10", // Future listing
  },
  {
    id: 2,
    companyName: "Green Energy Corp.",
    sector: "Energy",
    openDate: "2024-07-10",
    closeDate: "2024-07-15",
    priceBand: "₹300 - ₹320",
    lotSize: 35,
    rhpLink: "https://example.com/rhp2.pdf",
    description: "Renewable energy provider with a focus on solar.",
    listingDate: "2024-07-20", // Future listing
  },
  {
    id: 3,
    companyName: "Old Finance Ltd.",
    sector: "Finance",
    openDate: "2024-05-01",
    closeDate: "2024-05-05",
    priceBand: "₹200 - ₹220",
    lotSize: 15,
    rhpLink: "https://example.com/rhp3.pdf",
    description: "Established finance company, now listed.",
    listingDate: "2024-05-15", // Past listing
  },
  // Add more IPOs as needed
];

export default ipoData; 