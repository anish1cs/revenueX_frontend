import React, { useEffect, useState } from "react";
import { FaPlus, FaSpinner } from "react-icons/fa";
import axios from "axios";
import domain from "../constants";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false); // loader for add btn
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ✅ Fetch Customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${domain}/customers/list`);
      let resData = [...res.data.data];
      resData.sort((a, b) => a.name.localeCompare(b.name));
      setCustomers(resData);
    } catch (error) {
      console.error("Error fetching customers", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add Customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (adding) return; // ⛔ Prevent double submit
    setAdding(true);
    try {
      const res = await axios.post(
        `${domain}/customers/create`,
        newCustomer
      );
      setCustomers([...customers, res.data.data]);
      setShowModal(false);
      setNewCustomer({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      console.error("Error adding customer", error);
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">👥 Customers</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2.5 rounded-xl shadow hover:scale-105 transition-transform"
        >
          <FaPlus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* Customers Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <FaSpinner className="animate-spin text-blue-600 w-8 h-8" />
        </div>
      ) : customers.length === 0 ? (
        <p className="text-center text-gray-500">No customers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Address</th>
                 <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, idx) => (
                <tr
                  key={c.customerId}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-4 font-medium text-gray-800">{c.name}</td>
                  <td className="p-4 text-gray-600">{c.email}</td>
                  <td className="p-4 text-gray-600">{c.phone}</td>
                  <td className="p-4 text-gray-600">{c.address}</td>
                   <td className="p-4 text-gray-600">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl w-[420px] shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              ➕ Add Customer
            </h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                  disabled={adding}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {adding ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Add"
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

export default Customers;
