import React, { useEffect, useState } from "react";
import {
  FaDownload,
  FaEnvelope,
  FaCheck,
  FaSpinner,
  FaEdit,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import domain from "../constants";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [newAmount, setNewAmount] = useState("");

  // ✅ Search States
  const [searchName, setSearchName] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // ✅ Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage, setBillsPerPage] = useState(5);

  // ✅ Fetch Bills
  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${domain}/bills/`);
      const billsData = res.data.data;

      const enriched = await Promise.all(
        billsData.map(async (bill) => {
          let customer = null;
          let mode = "-";

          try {
            const custRes = await axios.get(
              `${domain}/customers/get/${bill.customerId}`
            );
            customer = custRes.data.data;
          } catch {
            console.warn("Customer fetch failed");
          }

          try {
            const payRes = await axios.get(
              `${domain}/payments/bills/${bill.billId}`
            );
            if (payRes.data.data) mode = payRes.data.data.mode;
          } catch {
            console.warn("Payment fetch failed");
          }

          return { ...bill, customer, mode };
        })
      );

      enriched.reverse();
      setBills(enriched);
    } catch (e) {
      console.error("Error fetching bills", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // ✅ Download invoice
  const handleDownload = async (billId, customerName) => {
    setProcessing({ billId, action: "download" });
    try {
      const res = await axios.get(`/api/bills/${billId}/invoice`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${customerName}-${billId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("Error downloading invoice", e);
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Mark Paid
  const handleMarkPaid = async (billId, mode) => {
    setProcessing({ billId, action: `mark-${mode}` });
    try {
      await axios.post(`${domain}/payments/create`, {
        billId,
        mode,
      });
      fetchBills();
    } catch (e) {
      console.error("Error marking paid", e);
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Send request
  const handleSendRequest = async (bill) => {
    setProcessing({ billId: bill.billId, action: "request" });
    try {
      await axios.post(`${domain}/payments/bills/${bill.billId}/send-request`);
      alert(`Payment request sent to ${bill.customer?.name}`);
    } catch (e) {
      console.error("Error sending request", e);
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Update Bill Amount
  const handleUpdateAmount = async (e) => {
    e.preventDefault();
    if (!selectedBill) return;
    setProcessing({ billId: selectedBill.billId, action: "update" });

    try {
      await axios.put(`${domain}/bills/${selectedBill.billId}`, {
        amount: newAmount,
      });

      setShowEditModal(false);
      setSelectedBill(null);
      setNewAmount("");
      fetchBills();
    } catch (e) {
      console.error("Error updating bill amount", e);
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Filter bills by search
  const filteredBills = bills.filter((bill) => {
    const matchesName = bill.customer?.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesMonth = searchMonth
      ? bill.month.toLowerCase().includes(searchMonth.toLowerCase())
      : true;
    const matchesStatus = searchStatus
      ? bill.status.toLowerCase() === searchStatus.toLowerCase()
      : true;

    return matchesName && matchesMonth && matchesStatus;
  });

  // ✅ Pagination logic
  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(filteredBills.length / billsPerPage);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">📑 Bills</h1>

      {/* ✅ Search Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center bg-white p-4 rounded-xl shadow">
        <div className="flex items-center border rounded-lg px-3 py-2 w-64">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by Customer Name"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setCurrentPage(1);
            }}
            className="outline-none w-full"
          />
        </div>
        <input
          type="text"
          placeholder="Search by Month (e.g., Jan, February)"
          value={searchMonth}
          onChange={(e) => {
            setSearchMonth(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-lg w-64"
        />
        <select
          value={searchStatus}
          onChange={(e) => {
            setSearchStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <FaSpinner className="animate-spin text-blue-600 w-8 h-8" />
        </div>
      ) : filteredBills.length === 0 ? (
        <p className="text-center text-gray-500">No matching bills found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
                <tr>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Month</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Mode</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentBills.map((bill, idx) => (
                  <tr
                    key={bill.billId}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {bill.customer?.name || "-"}
                    </td>
                    <td className="p-4 text-gray-700">{bill.month}</td>
                    <td className="p-4 text-gray-700">₹{bill.amount}</td>
                    <td className="p-4 text-gray-600">
                      {new Date(bill.generatedDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          bill.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {bill.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">{bill.mode || "-"}</td>
                    <td className="p-4 flex flex-wrap gap-2">
                      {bill.status === "paid" ? (
                        <button
                          onClick={() =>
                            handleDownload(
                              bill.billId,
                              bill.customer?.name || "User"
                            )
                          }
                          disabled={
                            processing?.billId === bill.billId &&
                            processing?.action === "download"
                          }
                          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-70"
                        >
                          {processing?.billId === bill.billId &&
                          processing?.action === "download" ? (
                            <>
                              <FaSpinner className="animate-spin" /> Processing...
                            </>
                          ) : (
                            <>
                              <FaDownload /> Download
                            </>
                          )}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleSendRequest(bill)}
                            disabled={
                              processing?.billId === bill.billId &&
                              processing?.action === "request"
                            }
                            className="flex items-center gap-2 bg-yellow-600 text-white px-3 py-2 rounded-lg shadow hover:bg-yellow-700 transition disabled:opacity-70"
                          >
                            {processing?.billId === bill.billId &&
                            processing?.action === "request" ? (
                              <>
                                <FaSpinner className="animate-spin" /> Sending...
                              </>
                            ) : (
                              <>
                                <FaEnvelope /> Send Request
                              </>
                            )}
                          </button>
                          <div className="flex gap-2">
                            {["Cash", "UPI", "Card"].map((mode) => (
                              <button
                                key={mode}
                                onClick={() => handleMarkPaid(bill.billId, mode)}
                                disabled={
                                  processing?.billId === bill.billId &&
                                  processing?.action === `mark-${mode}`
                                }
                                className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-lg shadow hover:bg-blue-700 text-sm transition disabled:opacity-70"
                              >
                                {processing?.billId === bill.billId &&
                                processing?.action === `mark-${mode}` ? (
                                  <>
                                    <FaSpinner className="animate-spin" /> ...
                                  </>
                                ) : (
                                  <>
                                    <FaCheck /> {mode}
                                  </>
                                )}
                              </button>
                            ))}
                          </div>
                          {/* ✅ Edit button */}
                          <button
                            onClick={() => {
                              setSelectedBill(bill);
                              setNewAmount(bill.amount);
                              setShowEditModal(true);
                            }}
                            className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg shadow hover:bg-purple-700 transition"
                          >
                            <FaEdit /> Edit
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Rows per page:</span>
              <select
                value={billsPerPage}
                onChange={(e) => {
                  setBillsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                {[5, 10, 20, 50].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-700 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* ✅ Edit Modal */}
      {showEditModal && selectedBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              ✏️ Update Bill Amount
            </h2>
            <form onSubmit={handleUpdateAmount} className="space-y-4">
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-purple-300"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    processing?.billId === selectedBill.billId &&
                    processing?.action === "update"
                  }
                  className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-70"
                >
                  {processing?.billId === selectedBill.billId &&
                  processing?.action === "update" ? (
                    <>
                      <FaSpinner className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
