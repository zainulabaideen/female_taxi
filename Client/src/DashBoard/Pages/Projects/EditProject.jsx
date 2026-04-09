import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Upload, Plus, X, ImageOff } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useProjectBySlug,
  useAddItemToProject,
  useDeleteProjectItem,
  useDeleteProject,
} from "../../../api/projects/useProjects";
import { imagePrefix2 } from "../../../api/axios";

const normalizeImg = (path) => {
  if (!path) return null;
  return `${imagePrefix2}/${path.replace(/\\/g, "/").replace(/^uploads\//, "uploads/")}`;
};

const EditProject = () => {
  const { proSlug } = useParams();
  const navigate    = useNavigate();

  const { data, isLoading, isError } = useProjectBySlug(proSlug);
  const { mutate: addItem,      isPending: addingItem  } = useAddItemToProject();
  const { mutate: deleteItem,   isPending: deletingItem } = useDeleteProjectItem(proSlug);
  const { mutate: deleteProject }                         = useDeleteProject();

  const [showItemForm,    setShowItemForm]    = useState(false);
  const [itemPreview,     setItemPreview]     = useState(null);
  const [itemDescription, setItemDescription] = useState("");

  // ── Loading / error states ───────────────────────────────────────────────
  if (isLoading) return (
    <div className="text-center py-20 text-gray-400">Loading project...</div>
  );
  if (isError || !data) return (
    <div className="text-center py-20 text-red-400">Project not found.</div>
  );

  const { title_info, items } = data;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAddItem = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();
    formData.append("sub_title",   form.sub_title.value);
    formData.append("description", itemDescription);
    formData.append("image",       form.image.files[0]);

    addItem(
      { slug: proSlug, formData },
      {
        onSuccess: () => {
          setShowItemForm(false);
          setItemPreview(null);
          setItemDescription("");
          form.reset();
        },
      }
    );
  };

  const handleDeleteItem = (itemId) => {
    if (!window.confirm("Delete this item?")) return;
    deleteItem(itemId);
  };

  const handleDeleteProject = () => {
    if (!window.confirm(`Delete entire project "${title_info.main_title}"? This cannot be undone.`)) return;
    deleteProject(proSlug, {
      onSuccess: () => navigate("/admindashboard/manage-projects"),
    });
  };

  const handleToggleItemForm = () => {
    setShowItemForm((v) => !v);
    setItemPreview(null);
    setItemDescription("");
  };

  return (
    <div className="py-8 max-w-5xl mx-auto">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Pencil size={26} /> Edit Project
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Slug:{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              {proSlug}
            </code>
          </p>
        </div>
        <button
          onClick={handleDeleteProject}
          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl transition text-sm font-medium"
        >
          <Trash2 size={15} /> Delete Entire Project
        </button>
      </div>

      {/* ── Project Overview Card ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Project Overview</h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {title_info.cover_image ? (
            <img
              src={normalizeImg(title_info.cover_image)}
              alt={title_info.main_title}
              className="w-full sm:w-52 h-36 object-cover rounded-xl border border-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-full sm:w-52 h-36 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ImageOff size={24} className="text-gray-300" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title_info.main_title}</h3>
            <p className="text-sm text-gray-400 mt-1">
              {items.length} item{items.length !== 1 ? "s" : ""} added
            </p>
          </div>
        </div>
      </div>

      {/* ── Items Section ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-700">
            Project Items ({items.length})
          </h2>
          <button
            onClick={handleToggleItemForm}
            className="flex items-center gap-1.5 text-sm px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
          >
            {showItemForm ? <X size={14} /> : <Plus size={14} />}
            {showItemForm ? "Cancel" : "Add Item"}
          </button>
        </div>

        {/* Existing items grid */}
        {items.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">
            No items yet. Add your first item using the button above.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items?.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl overflow-hidden flex flex-col"
              >
                <img
                  src={normalizeImg(item.image)}
                  alt={item.sub_title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {item.sub_title}
                    </h4>
                    {item.description && (
                      <div
                        className="text-xs text-gray-400 mt-1 line-clamp-3 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={deletingItem}
                    className="mt-3 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-500 transition self-start disabled:opacity-50"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Add Item Form ─────────────────────────────────────────────── */}
        {showItemForm && (
          <form
            onSubmit={handleAddItem}
            className="mt-6 pt-6 border-t border-gray-200 space-y-5"
          >
            <h3 className="font-semibold text-gray-700">New Item</h3>

            {/* Sub title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Sub Title <span className="text-red-400">*</span>
              </label>
              <input
                name="sub_title" required className="input"
                placeholder="e.g. Main Entrance Camera"
              />
            </div>

            {/* Description — Quill */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <ReactQuill
                  value={itemDescription}
                  onChange={setItemDescription}
                  placeholder="Describe this item..."
                  className="bg-white"
                />
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Image <span className="text-red-400">*</span>
              </label>
              <label
                htmlFor="item_image"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition bg-gray-50 overflow-hidden"
              >
                {itemPreview ? (
                  <img
                    src={itemPreview} alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Upload size={22} />
                    <span className="text-xs">Click to upload image</span>
                    <span className="text-xs text-gray-300">JPG, PNG, WEBP</span>
                  </div>
                )}
              </label>
              <input
                id="item_image" name="image" type="file"
                accept="image/*" required className="hidden"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) setItemPreview(URL.createObjectURL(f));
                }}
              />
            </div>

            {/* Form action buttons */}
            <div className="flex gap-3">
              <button
                type="submit" disabled={addingItem}
                className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {addingItem ? "Adding..." : "Add Item"}
              </button>
              <button
                type="button"
                onClick={handleToggleItemForm}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
              >
                <X size={14} className="text-red-400" /> Cancel
              </button>
            </div>

          </form>
        )}
      </div>

      {/* Back link */}
      <button
        onClick={() => navigate("/admindashboard/manage-projects")}
        className="text-sm text-gray-400 hover:text-gray-600 transition"
      >
        ← Back to Manage Projects
      </button>

    </div>
  );
};

export default EditProject;