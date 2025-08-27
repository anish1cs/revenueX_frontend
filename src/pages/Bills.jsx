import React, { useEffect, useState } from "react";
import { FaDownload, FaEnvelope, FaCheck, FaSpinner } from "react-icons/fa";
import axios from "axios";
import domain from "../constants";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Bills + enrich with customer & payment mode
  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${domain}/bills/`);
      const billsData = res.data.data;

      const enriched = await Promise.all(
        billsData.map(async (bill) => {
          let customer = null;
          let mode = "-";

          // fetch customer
          try {
            const custRes = await axios.get(
              `${domain}/customers/get/${bill.customerId}`
            );
            customer = custRes.data.data;
          } catch {
            console.warn("Customer fetch failed");
          }

          // fetch payment mode
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

  // ✅ Download invoice (from backend)
  const handleDownload = async (billId, customerName) => {
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
    }
  };

  // ✅ Mark Paid
  const handleMarkPaid = async (billId, mode) => {
    try {
      await axios.post(`${domain}/payments/create`, {
        billId,
        mode,
      });
      fetchBills();
    } catch (e) {
      console.error("Error marking paid", e);
    }
  };

  // ✅ Send request
  const handleSendRequest = async (bill) => {
    try {
      await axios.post(`/api/bills/${bill.billId}/send-request`);
      alert(`Payment request sent to ${bill.customer?.name}`);
    } catch (e) {
      console.error("Error sending request", e);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">📑 Bills</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <FaSpinner className="animate-spin text-blue-600 w-8 h-8" />
        </div>
      ) : bills.length === 0 ? (
        <p className="text-center text-gray-500">No bills available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Mode</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, idx) => (
                <tr
                  key={bill.billId}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-4 font-medium text-gray-800">
                    {bill.customer?.name || "-"}
                  </td>
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
                        className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow hover:bg-green-700 transition"
                      >
                        <FaDownload /> Download
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSendRequest(bill)}
                          className="flex items-center gap-2 bg-yellow-600 text-white px-3 py-2 rounded-lg shadow hover:bg-yellow-700 transition"
                        >
                          <FaEnvelope /> Send Request
                        </button>
                        <div className="flex gap-2">
                          {["Cash", "UPI", "Card"].map((mode) => (
                            <button
                              key={mode}
                              onClick={() => handleMarkPaid(bill.billId, mode)}
                              className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-lg shadow hover:bg-blue-700 text-sm transition"
                            >
                              <FaCheck /> {mode}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Bills;
