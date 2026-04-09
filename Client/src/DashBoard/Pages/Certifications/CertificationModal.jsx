import { useRef, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import { useAddCertification } from "../../../api/hooks/useCertifications";

const CertificationModal = ({ onClose }) => {
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const { mutate: addCertification, isPending } = useAddCertification({
    onSuccessCallback: onClose,
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addCertification(formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <h2 id="modal-title" className="text-2xl font-bold mb-6 text-[var(--typo)]">
          Upload Certificate
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="cert-image" className="block mb-2 font-medium text-sm">
              Certificate Image <span className="text-red-600">*</span>
            </label>

            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent)] transition"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-40 object-contain rounded" />
              ) : (
                <>
                  <UploadCloud size={36} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                </>
              )}
            </div>

            <input
              id="cert-image"
              ref={fileRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="hidden"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationModal;