import { useState } from "react";
import { Handshake, Plus } from "lucide-react";
import DataTable from "../../DataTable";
import PartnersModal from "./PartnersModal";
import { usePartners, useDeletePartner } from "../../../api/hooks/usePartners";

const columns = [
  { key: "id",         label: "ID" },
  { key: "image",      label: "Image",      type: "image", imagePrefixNumber: 2 },
  { key: "created_at", label: "Uploaded At" },
  { key: "actions",    label: "Actions" },
];

const AdminPartnerPage = () => {
  const [showModal, setShowModal] = useState(false);

  const { data: partners = [], isLoading, isError } = usePartners();
  const { mutate: deletePartner } = useDeletePartner();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) return;
    deletePartner(id);
  };

  return (
    <main className="py-8 max-w-6xl mx-auto px-4">

      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Handshake size={32} className="text-[var(--accent)]" />
          <div>
            <h1 className="text-3xl font-bold text-[var(--typo)]">Partners</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage all partner logos</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus size={16} />
          Add Partner
        </button>
      </header>

      <DataTable
        title="All Partners"
        columns={columns}
        data={partners}
        loading={isLoading}
        error={isError ? "Failed to load partners." : null}
        onDelete={handleDelete}
      />

      {showModal && <PartnersModal onClose={() => setShowModal(false)} />}
    </main>
  );
};

export default AdminPartnerPage;