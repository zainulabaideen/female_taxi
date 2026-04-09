import { useState } from "react";
import { Mail, Clock, CheckCircle, XCircle } from "lucide-react";
import DataTable from "../DataTable";
import {
  useContactForms,
  useDeleteContactForm,
  useUpdateContactForm,
} from "../../api/hooks/useContactForm";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  replied: "bg-green-100  text-green-700  border-green-200",
  closed:  "bg-gray-100   text-gray-600   border-gray-200",
};

const StatusIcon = ({ status }) => {
  if (status === "replied") return <CheckCircle className="w-4 h-4" />;
  if (status === "closed")  return <XCircle     className="w-4 h-4" />;
  return                           <Clock       className="w-4 h-4" />;
};

const getStatusBadge = (item) => {
  const s = item?.status || "pending";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[s]}`}>
      <StatusIcon status={s} />
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
};

const AdminContactFormsPage = () => {
  const { data, isLoading, error } = useContactForms();
  const deleteMutation  = useDeleteContactForm();
  const updateMutation  = useUpdateContactForm();

  const [editingItem, setEditingItem] = useState(null);
  const [status, setStatus]           = useState("pending");
  const [note, setNote]               = useState("");

  // backend returns { success: true, data: [...] }
  const contacts = data?.data || [];

  const columns = [
    { key: "name",       label: "Name" },
    { key: "email",      label: "Email" },
    { key: "subject",    label: "Subject" },
    { key: "message",    label: "Message", type: "text", maxLength: 60 },
    { key: "status",     label: "Status",  render: getStatusBadge },
    { key: "created_at", label: "Created At" },
    { key: "actions",    label: "Actions" },
  ];

  const handleDelete = (id) => {
    if (!window.confirm("Delete this contact message?")) return;
    deleteMutation.mutate(id);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setStatus(item?.status || "pending");
    setNote(item?.note || "");
  };

  const handleUpdate = () => {
    updateMutation.mutate(
      { id: editingItem?.id, data: { status, note } },
      { onSuccess: () => setEditingItem(null) }
    );
  };

  return (
    <div>
      <DataTable
        title="Contact Form Messages"
        columns={columns}
        data={contacts}
        loading={isLoading}
        error={error?.message}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

            <h3 className="text-xl font-semibold mb-1">Update Contact Message</h3>
            <p className="text-sm text-gray-500 mb-5">
              From: <strong>{editingItem.name}</strong> — {editingItem.email}
            </p>

            {/* Message preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5 text-sm text-gray-700">
              <p className="font-medium text-gray-500 text-xs mb-1 uppercase tracking-wide">Message</p>
              {editingItem.message}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Admin Note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  placeholder="Write internal note..."
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactFormsPage;