import React, { useEffect, useState } from "react";
import { FaPlus, FaSpinner, FaEdit } from "react-icons/fa";
import axios from "axios";
import domain from "../constants";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active", // ✅ default
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

  // ✅ Add or Update Customer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      if (editingCustomer) {
        // 🔄 Update
        const res = await axios.put(
          `${domain}/customers/update/${editingCustomer._id}`,
          formData
        );
        setCustomers((prev) =>
          prev.map((c) =>
            c._id === editingCustomer._id ? res.data.data : c
          )
        );
      } else {
        // ➕ Add
        const res = await axios.post(`${domain}/customers/create`, formData);
        setCustomers([...customers, res.data.data]);
      }

      setShowModal(false);
      setFormData({ name: "", email: "", phone: "", address: "", status: "active" });
      setEditingCustomer(null);
    } catch (error) {
      console.error("Error saving customer", error);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Open edit modal with customer data
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status || "active",
    });
    setShowModal(true);
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
          onClick={() => {
            setEditingCustomer(null);
            setFormData({ name: "", email: "", phone: "", address: "", status: "active" });
            setShowModal(true);
          }}
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
                <th className="p-4 text-left">Actions</th>
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
                  <td
                    className={`p-4 font-semibold ${
                      c.status === "active" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {c.status}
                  </td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition"
                    >
                      <FaEdit /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl w-[420px] shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {editingCustomer ? "✏️ Edit Customer" : "➕ Add Customer"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
              />

              {/* ✅ Status Dropdown */}
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : editingCustomer ? (
                    "Update"
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
