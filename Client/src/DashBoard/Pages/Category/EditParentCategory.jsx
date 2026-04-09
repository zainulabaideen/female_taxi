import { useState, useEffect } from "react";
import { FolderOpen, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useSingleParentCategory,
  useUpdateParentCategory,
} from "../../../api/hooks/useParentCategories";

const EditParentCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const { data: parentCategory, isLoading: isFetching } = useSingleParentCategory(id);

  const { mutate: updateParent, isPending } = useUpdateParentCategory({
    onSuccessCallback: () => navigate("/admindashboard/manage-parent-categories"),
  });

  // Pre-fill form once data arrives
  useEffect(() => {
    if (parentCategory?.title) {
      setTitle(parentCategory.title);
    }
  }, [parentCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    updateParent({ id, formData: { title: trimmed } });
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 size={36} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <main className="py-8 max-w-2xl mx-auto px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-2 text-[var(--typo)]">
          <FolderOpen size={36} /> Edit Parent Category
        </h1>
        <p className="text-gray-500">Update the title of this parent category.</p>
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
              className="input w-full"
            />
          </div>

          <footer className="text-center pt-2">
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="bg-black text-white rounded-xl px-10 py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 transition hover:bg-gray-800"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default EditParentCategory;