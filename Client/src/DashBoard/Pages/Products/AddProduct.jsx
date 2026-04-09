import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddProduct } from "../../../api/hooks/useProducts";
import { useCategories } from "../../../api/hooks/useCategories";
// import { useParentCategories } from "../../../api/hooks/useParentCategories"; // uncomment when needed
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Layers, Flame, ShoppingCart } from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  // const { data: parentCategories = [] } = useParentCategories(); // uncomment when needed

  const { mutate, isPending } = useAddProduct({
    onSuccessCallback: () => navigate("/admindashboard/manage-products"),
  });

  const [overview,      setOverview]      = useState("");
  const [keyFeatures,   setKeyFeatures]   = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [hot,           setHot]           = useState(false);
  const [addToCart,     setAddToCart]     = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setPreviewImages(files?.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("overview",    overview);
    formData.set("key_features", keyFeatures);
    formData.set("hot",         String(hot));
    formData.set("add_to_cart", String(addToCart));
    mutate(formData);
  };

  return (
    <main className="py-8 max-w-4xl mx-auto px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2 text-[var(--typo)]">
          <Layers /> Add Product to Catalog
        </h1>
        <p className="text-gray-600">
          Provide product details, pricing, and features to make it available for customers.
        </p>
      </header>

      <section className="bg-white shadow-lg rounded-2xl border border-gray-200 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-[var(--typo)]">
              Product Name <span className="text-red-600">*</span>
            </label>
            <input id="name" name="name" type="text" required className="input w-full" />
          </div>

          {/* Parent Category — COMMENTED: uncomment when needed */}
          {/* 
          <div>
            <label htmlFor="parent_category" className="block mb-2 font-medium text-[var(--typo)]">
              Parent Category
            </label>
            <select id="parent_category" name="parent_category" className="input w-full" defaultValue="">
              <option value="">Select Parent Category</option>
              {parentCategories?.map((pc) => (
                <option key={pc?.id} value={pc?.id}>{pc?.title}</option>
              ))}
            </select>
          </div>
          */}

          {/* Category + Price */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category_id" className="block mb-2 font-medium text-[var(--typo)]">
                Category <span className="text-red-600">*</span>
              </label>
              <select id="category_id" name="category_id" required className="input w-full" defaultValue="">
                <option value="" disabled>Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat?.id} value={cat?.id}>
                    {cat?.name}
                    {cat?.parent_category_title ? ` (${cat.parent_category_title})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block mb-2 font-medium text-[var(--typo)]">
                Price <span className="text-red-600">*</span>
              </label>
              <input id="price" name="price" type="number" required min="0" step="0.01" className="input w-full" />
            </div>
          </div>

          {/* Hot + Add to Cart toggles */}
          <fieldset className="grid grid-cols-2 gap-4">
            <legend className="sr-only">Product flags</legend>

            <label
              htmlFor="hot"
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                hot ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                id="hot"
                type="checkbox"
                className="sr-only"
                checked={hot}
                onChange={(e) => setHot(e.target.checked)}
              />
              <Flame size={20} className={hot ? "text-orange-500" : "text-gray-400"} />
              <div>
                <p className="font-medium text-sm text-[var(--typo)]">Mark as Hot</p>
                <p className="text-xs text-gray-400">Shows a hot badge on the product</p>
              </div>
            </label>

            <label
              htmlFor="add_to_cart"
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                addToCart ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                id="add_to_cart"
                type="checkbox"
                className="sr-only"
                checked={addToCart}
                onChange={(e) => setAddToCart(e.target.checked)}
              />
              <ShoppingCart size={20} className={addToCart ? "text-blue-500" : "text-gray-400"} />
              <div>
                <p className="font-medium text-sm text-[var(--typo)]">Enable Add to Cart</p>
                <p className="text-xs text-gray-400">Shows cart button on product card</p>
              </div>
            </label>
          </fieldset>

          {/* Overview */}
          <div>
            <label className="block mb-2 font-medium text-[var(--typo)]">Overview</label>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <ReactQuill value={overview} onChange={setOverview} />
            </div>
          </div>

          {/* Key Features */}
          <div>
            <label className="block mb-2 font-medium text-[var(--typo)]">Key Features</label>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <ReactQuill value={keyFeatures} onChange={setKeyFeatures} />
            </div>
          </div>

          {/* Images */}
          <div>
            <label htmlFor="images" className="block mb-2 font-medium text-[var(--typo)]">
              Product Images
            </label>
            <input
              id="images"
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="input w-full"
            />
            {previewImages.length > 0 && (
              <figure className="flex gap-3 mt-4 flex-wrap">
                {previewImages?.map((img, index) => (
                  <img
                    key={`preview-${index}`}
                    src={img}
                    className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                    alt={`preview ${index + 1}`}
                  />
                ))}
              </figure>
            )}
          </div>

          <footer className="text-center pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white rounded-xl px-10 py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed transition hover:bg-gray-800"
            >
              {isPending ? "Adding..." : "Add Product"}
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default AddProduct;