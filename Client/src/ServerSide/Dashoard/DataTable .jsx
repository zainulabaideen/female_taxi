import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, ArrowUpDown } from "lucide-react";

const DataTable = ({ title, endpoint, columns, filterFn }) => {
  const baseURL = import.meta.env.VITE_NODE_URL;
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseURL}${endpoint}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  // Helpers
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const shortenText = (text, limit = 60) =>
    text && text.length > limit ? text.slice(0, limit) + "..." : text;

  // Search filter
  const filteredData = useMemo(() => {
    let result = filterFn ? data.filter(filterFn) : data;

    return result.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search, filterFn]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <section className={`p-6 bg-gray-50 ${filterFn ? "" : "min-h-screen"}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="  mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2
            className="text-3xl font-bold bg-gradient-to-r 
            from-[var(--primary-red)] to-[var(--secondary-blue)] 
            bg-clip-text text-transparent"
          >
            {title}
          </h2>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 mt-3 md:mt-0 focus:ring-2 focus:ring-[var(--secondary-blue)] outline-none transition"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-8 h-8 text-[var(--secondary-blue)]" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto"
          >
            <table className="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-[var(--secondary-blue)] text-white">
                <tr>
                  {columns?.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-4 py-3 text-left cursor-pointer select-none hover:bg-[var(--primary-red)]/90 transition"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <ArrowUpDown className="w-4 h-4 opacity-70" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData?.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-t hover:bg-gray-100 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                    >
                      {columns?.map((col) => {
                        let value = item[col.key];

                        if (col.key === "created_at") value = formatDateTime(value);
                        if (col.key === "notes") value = shortenText(value, 100);

                        if (col.key === "preferred_date") value = formatDate(value);
                        if (col.type === "date") value = formatDate(value);

                        return (
                          <td key={col.key} className="px-4 py-2 align-top">
                            {value || "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-5 text-gray-500">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default DataTable;
