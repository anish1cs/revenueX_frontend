import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaFileInvoiceDollar, FaRupeeSign } from "react-icons/fa";
import CountUp from "react-countup";
import domain from "../constants";

const Dashboard = () => {
  const [pending, setPending] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [revenue, setRevenue] = useState("Not available");
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // ✅ Fetch customers
      const customersRes = await axios.get(
        `${domain}/customers/list`
      );
      setCustomers(customersRes.data.data.length);

      // ✅ Fetch bills
      const billsRes = await axios.get(`${domain}/bills/`);
      let pendingCount = 0;
      let totalRevenue = 0;

      billsRes.data.data.forEach((bill) => {
        if (bill.status === "pending") pendingCount++;
        if (bill.status === "paid") totalRevenue += bill.amount || 0;
      });

      setPending(pendingCount);
      setRevenue(totalRevenue);
    } catch (e) {
      console.error("Error fetching stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Customers",
      value: customers,
      color: "from-blue-500 to-blue-700",
      icon: <FaUsers className="w-10 h-10 text-white" />,
    },
    {
      title: "Pending Bills",
      value: pending,
      color: "from-red-500 to-red-700",
      icon: <FaFileInvoiceDollar className="w-10 h-10 text-white" />,
    },
    {
      title: "Revenue",
      value: revenue,
      prefix: "₹",
      color: "from-green-500 to-green-700",
      icon: <FaRupeeSign className="w-10 h-10 text-white" />,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
        📊 Dashboard Overview
      </h1>
      {loading ? (
        <p className="text-lg">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`relative bg-gradient-to-r ${card.color} p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-white">
                    {card.title}
                  </h2>
                  <p className="text-3xl font-bold text-white mt-2">
                    {card.prefix}
                    <CountUp end={card.value} duration={2} separator="," />
                  </p>
                </div>
                <div className=" bg-opacity-20 rounded-full p-3 ">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
