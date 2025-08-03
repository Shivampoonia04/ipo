// AdminDashboardPage: Table of IPOs with Add/Edit/Delete. Uses modal form for add/edit. Accessible, responsive, and uses local state.
import React, { useState } from "react";
import ipoData from "../utils/ipoData";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function AdminDashboardPage() {
  // State for IPOs, modal form visibility, edit mode, form fields, and messages
  const [ipos, setIPOs] = useState(ipoData);
  const [showForm, setShowForm] = useState(false);
  const [editIPO, setEditIPO] = useState(null);
  const [form, setForm] = useState({
    companyName: "",
    sector: "",
    openDate: "",
    closeDate: "",
    priceBand: "",
    lotSize: "",
    rhpLink: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  // Delete IPO by id with confirmation
  const handleDelete = id => {
    if (window.confirm("Are you sure you want to delete this IPO?")) {
      setIPOs(ipos.filter(ipo => ipo.id !== id));
      setMessage("IPO deleted successfully.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // Edit IPO: open form with IPO data
  const handleEdit = ipo => {
    setEditIPO(ipo);
    setForm(ipo);
    setShowForm(true);
  };

  // Add IPO: open form with empty fields
  const handleAdd = () => {
    setEditIPO(null);
    setForm({
      companyName: "",
      sector: "",
      openDate: "",
      closeDate: "",
      priceBand: "",
      lotSize: "",
      rhpLink: "",
      description: "",
    });
    setShowForm(true);
  };

  // Handle form field changes
  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form: validate, add or update IPO
  const handleFormSubmit = e => {
    e.preventDefault();
    if (!form.companyName || !form.openDate || !form.closeDate || !form.priceBand || !form.lotSize) {
      setMessage("Please fill all required fields.");
      return;
    }
    if (editIPO) {
      setIPOs(ipos.map(ipo => ipo.id === editIPO.id ? { ...form, id: editIPO.id } : ipo));
      setMessage("IPO updated successfully.");
    } else {
      setIPOs([...ipos, { ...form, id: Date.now() }]);
      setMessage("IPO added successfully.");
    }
    setShowForm(false);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="main-section custom-section p-4 md:p-8 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg max-w-6xl mx-auto mt-8">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-200 mb-6">Admin Dashboard</h1>
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-900 dark:hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={handleAdd}><FaPlus /> Add IPO</button>
      </div>
      {message && <div className="mb-6 text-center text-green-700 bg-green-50 border border-green-200 rounded py-3 shadow">{message}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-2xl shadow bg-white dark:bg-gray-800">
          <thead className="bg-blue-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Company</th>
              <th className="px-4 py-2 text-left font-semibold">Sector</th>
              <th className="px-4 py-2 text-left font-semibold">Open</th>
              <th className="px-4 py-2 text-left font-semibold">Close</th>
              <th className="px-4 py-2 text-left font-semibold">Price Band</th>
              <th className="px-4 py-2 text-left font-semibold">Lot Size</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ipos.map(ipo => (
              <tr key={ipo.id} className="border-t dark:border-gray-700">
                <td className="px-4 py-2">{ipo.companyName}</td>
                <td className="px-4 py-2">{ipo.sector}</td>
                <td className="px-4 py-2">{ipo.openDate}</td>
                <td className="px-4 py-2">{ipo.closeDate}</td>
                <td className="px-4 py-2">{ipo.priceBand}</td>
                <td className="px-4 py-2">{ipo.lotSize}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={() => handleEdit(ipo)} aria-label={`Edit IPO: ${ipo.companyName}`}><FaEdit /> Edit</button>
                    <button className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-400" onClick={() => handleDelete(ipo.id)} aria-label={`Delete IPO: ${ipo.companyName}`}><FaTrash /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Form for Add/Edit IPO */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-blue-100 dark:border-gray-700" onSubmit={handleFormSubmit}>
            <button className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowForm(false)} type="button" aria-label="Close">&times;</button>
            <h2 className="text-blue-900 dark:text-blue-200 font-bold text-xl mb-6">{editIPO ? "Edit IPO" : "Add IPO"}</h2>
            <div className="mb-4">
              <label htmlFor="companyName" className="block mb-1 font-medium">Company Name*</label>
              <input id="companyName" name="companyName" value={form.companyName} onChange={handleFormChange} required aria-required="true" className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label htmlFor="sector" className="block mb-1 font-medium">Sector</label>
              <input id="sector" name="sector" value={form.sector} onChange={handleFormChange} className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label htmlFor="openDate" className="block mb-1 font-medium">Open Date*</label>
              <input id="openDate" name="openDate" type="date" value={form.openDate} onChange={handleFormChange} required aria-required="true" className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label htmlFor="closeDate" className="block mb-1 font-medium">Close Date*</label>
              <input id="closeDate" name="closeDate" type="date" value={form.closeDate} onChange={handleFormChange} required aria-required="true" className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label htmlFor="priceBand" className="block mb-1 font-medium">Price Band*</label>
              <input id="priceBand" name="priceBand" value={form.priceBand} onChange={handleFormChange} required aria-required="true" className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label htmlFor="lotSize" className="block mb-1 font-medium">Lot Size*</label>
              <input id="lotSize" name="lotSize" type="number" value={form.lotSize} onChange={handleFormChange} required aria-required="true" className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label htmlFor="rhpLink" className="block mb-1 font-medium">RHP Link</label>
              <input id="rhpLink" name="rhpLink" value={form.rhpLink} onChange={handleFormChange} className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block mb-1 font-medium">Description</label>
              <textarea id="description" name="description" value={form.description} onChange={handleFormChange} className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>
            <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 text-white font-semibold py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-900 dark:hover:to-blue-800 transition-all">{editIPO ? "Update" : "Add"} IPO</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage; 