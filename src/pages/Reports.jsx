import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import domain from "../constants";

const Reports = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [customerGrowthData, setCustomerGrowthData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    activeCustomers: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);

      // ✅ Fetch customers
      const customersRes = await axios.get(`${domain}/customers/list`);
      const customers = customersRes.data.data || [];
      const totalCustomers = customers.length;

      // Group customers by month (if createdAt exists)
      const custByMonth = {};
      customers.forEach((c) => {
        const created = c.createdAt ? new Date(c.createdAt) : null;
        if (created) {
          const month = created.toLocaleString("default", { month: "short" });
          custByMonth[month] = (custByMonth[month] || 0) + 1;
        }
      });

      const customerGrowthArr = Object.keys(custByMonth).map((m) => ({
        month: m,
        customers: custByMonth[m],
      }));

      setCustomerGrowthData(customerGrowthArr);

      // ✅ Fetch bills
      const billsRes = await axios.get(`${domain}/bills/`);
      const bills = billsRes.data.data || [];

      let totalRevenue = 0;
      let totalExpenses = 0; // update if you have expenses

      // Group bills by month
      const revByMonth = {};
      bills.forEach((bill) => {
        const date = bill.generatedDate ? new Date(bill.generatedDate) : null;
        if (!date) return;

        const month = date.toLocaleString("default", { month: "short" });

        if (bill.status === "paid") {
          totalRevenue += bill.amount;
          revByMonth[month] = (revByMonth[month] || 0) + bill.amount;
        }
      });

      const revenueArr = Object.keys(revByMonth).map((m) => ({
        month: m,
        revenue: revByMonth[m],
        expenses: 0, // if no expenses data
      }));

      setRevenueData(revenueArr);

      // ✅ Stats
      setStats({
        totalRevenue,
        totalExpenses,
        activeCustomers: totalCustomers,
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Reports</h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-blue-600 w-10 h-10" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
              <p className="text-2xl font-bold text-green-600">
                ₹ {stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-gray-700">Total Expenses</h2>
              <p className="text-2xl font-bold text-red-600">
                ₹ {stats.totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-gray-700">Active Customers</h2>
              <p className="text-2xl font-bold text-blue-600">
                {stats.activeCustomers}
              </p>
            </div>
          </div>

          {/* Revenue vs Expenses */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Revenue vs Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Growth */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Customer Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="customers" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
