import { useState } from "react";
import { FolderOpen, Pencil, Trash2, X, Loader2, FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useParentCategories,
  useDeleteParentCategory,
} from "../../../api/hooks/useParentCategories";

const ManageParentCategories = () => {
  const navigate = useNavigate();
  const { data: parents = [], isLoading, isError } = useParentCategories();
  const { mutate: deleteParent, isPending: isDeleting } = useDeleteParentCategory();
  const [confirmId, setConfirmId] = useState(null);

  const handleDeleteConfirm = () => {
    if (!confirmId) return;
    deleteParent(confirmId, { onSettled: () => setConfirmId(null) });
  };

  return (
    <main className="py-8 max-w-4xl mx-auto px-4">
      <header className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <FolderOpen size={32} className="text-[var(--accent)]" />
          <div>
            <h1 className="text-3xl font-bold text-[var(--typo)]">Parent Categories</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {parents.length} parent {parents.length === 1 ? "category" : "categories"}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admindashboard/add-parent-category")}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition text-sm font-medium"
        >
          <FolderPlus size={16} /> Add New
        </button>
      </header>

      <section className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : isError ? (
          <p className="p-8 text-center text-red-500">Failed to load parent categories.</p>
        ) : parents.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FolderOpen size={40} className="mx-auto mb-3 text-gray-300" />
            <p>No parent categories yet.</p>
            <button
              onClick={() => navigate("/admindashboard/add-parent-category")}
              className="mt-3 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Create the first one
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--accent)] text-white">
                <tr>
                  {["ID", "Title", "Slug", "Created At", "Actions"]?.map((h) => (
                    <th key={h} className="px-5 py-4 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {parents?.map((parent, idx) => (
                  <tr
                    key={parent?.id}
                    className={`transition hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                  >
                    <td className="px-5 py-3 text-gray-500">{parent?.id}</td>
                    <td className="px-5 py-3 font-medium text-[var(--typo)]">{parent?.title}</td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{parent?.slug}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {parent?.created_at ? new Date(parent.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/admindashboard/edit-parent-category/${parent?.id}`)}
                          className="flex items-center gap-1 text-[var(--accent)] font-medium hover:underline text-xs"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => setConfirmId(parent?.id)}
                          className="flex items-center gap-1 text-red-600 font-medium hover:underline text-xs"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 relative">
            <button
              onClick={() => setConfirmId(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
            <div className="text-center">
              <div className="p-3 bg-red-50 rounded-full w-fit mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Parent Category?</h2>
              <p className="text-sm text-gray-500 mb-6">
                This will also delete all sub-categories linked to it. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setConfirmId(null)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ManageParentCategories;