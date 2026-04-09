import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowUpDown } from "lucide-react";
import placeHolderImage from '/placeholder-img.jpg'
import { imagePrefix, imagePrefix2 } from "../api/axios";

const DataTable = ({
  title,
  columns,
  data = [],
  loading = false,
  error = null,
  onEdit,
  onDelete,
  filterFn,
}) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const shortenText = (text, limit = 60) =>
    text && text.length > limit ? text.slice(0, limit) + "..." : text;

  const filteredData = useMemo(() => {
    let result = filterFn ? data.filter(filterFn) : data;

    return result.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search, filterFn]);

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
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <section className="text-[var(--typo)] my-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl border border-[var(--border-color)] p-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--typo)]">
            {title}
          </h2>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input mt-4 md:mt-0 max-w-xs"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin w-8 h-8 text-[var(--logo-blue-color)]" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-[var(--border-color)] rounded-lg overflow-hidden">
              <thead
                style={{
                  backgroundColor: "var(--accent)",
                  color: "white",
                }}
              >
                <tr>
                  {columns?.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-4 py-4 text-left cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
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
                      key={item.id || index}
                      className={`border-t border-[var(--border-color)] transition hover:bg-[var(--bg-light)]`}
                    >
                      {columns?.map((col) => {

                        if (col.key === "actions") {
                          return (
                            <td key={col.key} className="px-4 py-3">
                              <div className="flex gap-4">
                                {onEdit && (
                                  <button
                                    onClick={() => onEdit(item)}
                                    className="text-[var(--accent)] font-medium hover:underline"
                                  >
                                    Edit
                                  </button>
                                )}
                                {onDelete && (
                                  <button
                                    onClick={() => onDelete(item.id)}
                                    className="text-red-600 font-medium hover:underline"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        }

                        if (col.type === "image") {
                          let imgSrc;
                          try {
                            if (col.imageArray) {
                              const imagesArray = Array.isArray(item[col.key]) ? item[col.key] : [];
                              if (imagesArray.length > 0) imgSrc = `${col.imagePrefixNumber == 2 ? imagePrefix2 : imagePrefix}${imagesArray[0]}`;
                            } else {
                              // single image
                              const imagePath = item?.[col.key]?.replaceAll("\\", "/") || "";

                              imgSrc = `${imagePrefix}/${imagePath.replace("uploads/", "")}`;
                            }
                          } catch (err) {
                            console.error("Error parsing image:", err);
                          }

                          return (
                            <td key={col.key} className="px-4 py-3 align-top">
                              {imgSrc ? (
                                <img
                                  src={imgSrc}
                                  alt={item.name || "image"}
                                  className="w-20 h-16 object-cover rounded"
                                />
                              ) : (
                                <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                                  No Image
                                </div>
                              )}
                            </td>
                          );
                        }

                        // default rendering for text/date/actions
                        let value = item[col.key];
                        if (col.key === "created_at") value = formatDateTime(value);
                        if (col.type === "text" && col.maxLength) value = shortenText(value, col.maxLength);

                        return (
                          <td key={col.key} className="px-4 py-3 align-top">
                            {value || "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-8 text-[var(--typo-secondary)]"
                    >
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default DataTable;