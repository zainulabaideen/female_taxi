import { useState } from "react";
import { Layers, Loader2 } from "lucide-react";
import { useAddCategory } from "../../../api/hooks/useCategories";
import { useParentCategories } from "../../../api/hooks/useParentCategories";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const { data: parentCategories = [], isLoading: loadingParents } = useParentCategories();

  const { mutate: addCategory, isPending } = useAddCategory({
    onSuccessCallback: () => navigate("/admindashboard/manage-categories"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // parent_id is included automatically via the <select name="parent_id"> field
    addCategory(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <main className="py-8 max-w-4xl mx-auto px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2 text-[var(--typo)]">
          <Layers /> Add New Category
        </h1>
        <p className="text-gray-600">Create a new product sub-category under a parent.</p>
      </header>

      <section className="bg-white shadow-lg rounded-2xl border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Parent Category */}
          <div>
            <label htmlFor="parent_id" className="block mb-2 font-medium text-[var(--typo)]">
              Parent Category <span className="text-red-600">*</span>
            </label>
            {loadingParents ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                <Loader2 size={16} className="animate-spin" /> Loading parent categories...
              </div>
            ) : (
              <select
                id="parent_id"
                name="parent_id"
                required
                className="input w-full"
                defaultValue=""
              >
                <option value="" disabled>Select a parent category</option>
                {parentCategories?.map((parent) => (
                  <option key={parent?.id} value={parent?.id}>
                    {parent?.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Category Name */}
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-[var(--typo)]">
              Category Name <span className="text-red-600">*</span>
            </label>
            <input id="name" name="name" type="text" required className="input w-full" />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 font-medium flex justify-between items-center"
            >
              <span className="text-[var(--typo)]">Description</span>
              <span className="text-xs text-red-700">Max: 300 characters</span>
            </label>
            <textarea
              id="description"
              name="description"
              className="input w-full"
              maxLength={300}
              rows={3}
            />
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block mb-2 font-medium text-[var(--typo)]">
              Category Image
            </label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="input w-full"
            />
            {preview && (
              <figure className="mt-4">
                <img
                  src={preview}
                  alt="Category preview"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                />
              </figure>
            )}
          </div>

          <footer className="text-center pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white rounded-xl px-10 py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 transition hover:bg-gray-800"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Adding...
                </>
              ) : (
                "Add Category"
              )}
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default AddCategory;