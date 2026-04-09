import { useParams, useNavigate } from "react-router-dom";
import { useSingleProduct, useUpdateProduct } from "../../../api/hooks/useProducts";
import { useCategories } from "../../../api/hooks/useCategories";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useState, useEffect } from "react";
import { Flame, ShoppingCart, Loader2 } from "lucide-react";
import { imagePrefix2 } from "../../../api/axios";

const EditProduct = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const { data: product, isLoading, isError } = useSingleProduct(id);
  const { data: categories = [] }             = useCategories();
  const { mutate, isPending }                 = useUpdateProduct({
    onSuccessCallback: () => navigate("/admindashboard/manage-products"),
  });

  const [overview,    setOverview]    = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [hot,         setHot]         = useState(false);
  const [addToCart,   setAddToCart]   = useState(false);
  const [newPreviews, setNewPreviews] = useState([]);

  useEffect(() => {
    if (product) {
      setOverview(product?.overview    || "");
      setKeyFeatures(product?.key_features || "");
      setHot(Boolean(product?.hot));
      setAddToCart(Boolean(product?.add_to_cart));
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 size={36} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (isError || !product) {
    return <p className="text-center py-20 text-red-500">Product not found.</p>;
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewPreviews(files?.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("overview",    overview);
    formData.set("key_features", keyFeatures);
    formData.set("hot",         String(hot));
    formData.set("add_to_cart", String(addToCart));
    mutate({ id, formData });
  };

  const existingImages = Array.isArray(product?.images) ? product.images : [];

  return (
    <main className="py-10 max-w-5xl mx-auto px-4">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 text-[var(--typo)]">Edit Product</h1>
        <p className="text-gray-500">Update product details and save your changes.</p>
      </header>

      <section className="bg-white shadow-sm rounded-2xl border border-gray-200 p-10">
        <form className="space-y-8" onSubmit={handleSubmit}>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-[var(--typo)]">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={product?.name}
              required
              className="input w-full"
            />
          </div>

          {/* Category + Price */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category_id" className="block mb-2 font-medium text-[var(--typo)]">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                defaultValue={product?.category_id}
                className="input w-full"
              >
                {categories?.map((cat) => (
                  <option key={cat?.id} value={cat?.id}>
                    {cat?.name}
                    {cat?.parent_category_title ? ` (${cat.parent_category_title})` : ""}
                  </option>
                ))}
              </select>
              {product?.parent_category_title && (
                <p className="text-xs text-gray-400 mt-1">
                  Parent: <span className="text-gray-600 font-medium">{product.parent_category_title}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block mb-2 font-medium text-[var(--typo)]">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.price}
                className="input w-full"
              />
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
            <label className="block mb-3 font-medium text-[var(--typo)]">Product Overview</label>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <ReactQuill value={overview} onChange={setOverview} />
            </div>
          </div>

          {/* Key Features */}
          <div>
            <label className="block mb-3 font-medium text-[var(--typo)]">Key Features / Specifications</label>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <ReactQuill value={keyFeatures} onChange={setKeyFeatures} />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block mb-2 font-medium text-[var(--typo)]">Product Images</label>

            {existingImages.length > 0 && newPreviews.length === 0 && (
              <figure className="mb-3">
                <p className="text-xs text-gray-400 mb-2">Current images (will be replaced if you upload new ones):</p>
                <div className="flex gap-3 flex-wrap">
                  {existingImages?.map((img, i) => {
                    const normalized = img.replace(/\\/g, "/").replace(/^uploads\//, "uploads/");
                    return (
                      <img
                        key={`existing-${i}`}
                        src={`${imagePrefix2}${normalized}`}
                        alt={`product ${i + 1}`}
                        className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                      />
                    );
                  })}
                </div>
              </figure>
            )}

            <input
              id="images"
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="input w-full"
            />

            {newPreviews.length > 0 && (
              <figure className="flex gap-3 mt-4 flex-wrap">
                <p className="text-xs text-gray-400 w-full mb-1">New images preview:</p>
                {newPreviews?.map((img, i) => (
                  <img
                    key={`new-${i}`}
                    src={img}
                    alt={`new preview ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                  />
                ))}
              </figure>
            )}
          </div>

          <footer className="flex justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admindashboard/manage-products")}
              className="px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white rounded-xl px-10 py-3 disabled:opacity-60 inline-flex items-center gap-2 hover:bg-gray-800 transition"
            >
              {isPending ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Changes"}
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default EditProduct;