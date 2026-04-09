import { useState } from "react";
import { FolderOpen, Loader2 } from "lucide-react";
import { useAddParentCategory } from "../../../api/hooks/useParentCategories";
import { useNavigate } from "react-router-dom";

const AddParentCategory = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const { mutate: addParentCategory, isPending } = useAddParentCategory({
    onSuccessCallback: () => navigate("/admindashboard/manage-parent-categories"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    addParentCategory({ title: trimmed });
  };

  return (
    <main className="py-8 max-w-2xl mx-auto px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-2 text-[var(--typo)]">
          <FolderOpen size={36} /> Add Parent Category
        </h1>
        <p className="text-gray-500">
          Parent categories group multiple sub-categories under one label.
        </p>
      </header>

      <section className="bg-white shadow-lg rounded-2xl border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 font-medium text-[var(--typo)]">
              Parent Category Title <span className="text-red-600">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Security Cameras"
              className="input w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              A slug will be auto-generated from the title on the server.
            </p>
          </div>

          <footer className="text-center pt-2">
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="bg-black text-white rounded-xl px-10 py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 transition hover:bg-gray-800"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Adding...
                </>
              ) : (
                "Add Parent Category"
              )}
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default AddParentCategory;