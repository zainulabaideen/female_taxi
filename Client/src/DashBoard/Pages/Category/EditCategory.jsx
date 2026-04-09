import { useState, useEffect } from "react";
import { Layers, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSingleCategory, useUpdateCategory } from "../../../api/hooks/useCategories";
import { useParentCategories } from "../../../api/hooks/useParentCategories";
import { imagePrefix } from "../../../api/axios";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: category, isLoading: isFetching } = useSingleCategory(id);
  const { data: parentCategories = [], isLoading: loadingParents } = useParentCategories();
  const { mutate: updateCategory, isPending } = useUpdateCategory({
    onSuccessCallback: () => navigate("/admindashboard/manage-categories"),
  });

  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");

  // Pre-fill when data arrives
  useEffect(() => {
    if (category) {
      setName(category?.name || "");
      setDescription(category?.description || "");
      setParentId(category?.parent_id ? String(category.parent_id) : "");
      if (category?.image) {
        const normalized = category.image.replace(/\\/g, "/").replace(/^uploads\//, "uploads/");
        setExistingImage(`${imagePrefix}/${normalized}`);
      }
    }
  }, [category]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Ensure parent_id is explicitly set (FormData from controlled select won't auto-append)
    formData.set("parent_id", parentId);
    updateCategory({ id, formData });
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 size={36} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <main className="py-8 max-w-4xl mx-auto px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2 text-[var(--typo)]">
          <Layers /> Edit Category
        </h1>
        <p className="text-gray-600">Update the details of this sub-category.</p>
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
                <Loader2 size={16} className="animate-spin" /> Loading...
              </div>
            ) : (
              <select
                id="parent_id"
                name="parent_id"
                required
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="input w-full"
              >
                <option value="" disabled>Select a parent category</option>
                {parentCategories?.map((parent) => (
                  <option key={parent?.id} value={String(parent?.id)}>
                    {parent?.title}
                  </option>
                ))}
              </select>
            )}
            {category?.parent_category_title && (
              <p className="text-xs text-gray-400 mt-1">
                Currently: <span className="font-medium text-gray-600">{category.parent_category_title}</span>
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-[var(--typo)]">
              Category Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
            />
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block mb-2 font-medium text-[var(--typo)]">
              Category Image
            </label>

            {/* Show existing image if no new preview */}
            {!preview && existingImage && (
              <figure className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Current image:</p>
                <img
                  src={existingImage}
                  alt="Current category"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                />
              </figure>
            )}

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
                <p className="text-xs text-gray-400 mb-1">New image preview:</p>
                <img
                  src={preview}
                  alt="New category preview"
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

export default EditCategory;