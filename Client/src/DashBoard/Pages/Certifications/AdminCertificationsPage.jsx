import { useState } from "react";
import { ShieldCheck, Plus } from "lucide-react";
import DataTable from "../../DataTable";
import CertificationModal from "./CertificationModal";
import { useCertifications, useDeleteCertification } from "../../../api/hooks/useCertifications"
import { imagePrefix2 } from "../../../api/axios";

const columns = [
  { key: "id", label: "ID" },
  { key: "image", label: "Image", type: "image",  imagePrefixNumber: 1 },
  { key: "created_at", label: "Uploaded At" },
  { key: "actions", label: "Actions" },
];

const AdminCertificationsPage = () => {
  const [showModal, setShowModal] = useState(false);

  const { data: certifications = [], isLoading, isError } = useCertifications();
  const { mutate: deleteCertification } = useDeleteCertification();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) return;
    deleteCertification(id);
  };

  return (
    <main className="py-8 max-w-6xl mx-auto px-4">

      {/* Page Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={32} className="text-[var(--accent)]" />
          <div>
            <h1 className="text-3xl font-bold text-[var(--typo)]">Certifications</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage all uploaded certificates</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus size={16} />
          Add Certificate
        </button>
      </header>

      {/* Table */}
      <DataTable
        title="All Certificates"
        columns={columns}
        data={certifications}
        loading={isLoading}
        error={isError ? "Failed to load certifications." : null}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {showModal && <CertificationModal onClose={() => setShowModal(false)} />}
    </main>
  );
};

export default AdminCertificationsPage;