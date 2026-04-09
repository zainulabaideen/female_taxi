import { useNavigate } from "react-router-dom";
import { Briefcase, Plus } from "lucide-react";
import DataTable from "../../DataTable";
import { useJobs, useDeleteJob } from "../../../api/careers/hooks/useJobs";
import { stripHtml } from "../../../utils/textUtils";

const columns = [
  { key: "id",          label: "ID" },
  { key: "title",       label: "Title" },
  { key: "type",        label: "Type" },
  { key: "location",    label: "Location" },
  { key: "price",       label: "Salary (Rs)" },
  { key: "description", label: "Description", type: "text", maxLength: 80 },
  { key: "created_at",  label: "Posted At" },
  { key: "actions",     label: "Actions" },
];

const AdminManageJobs = () => {
  const navigate = useNavigate();
  const { data: jobs = [], isLoading, isError } = useJobs();
  const { mutate: deleteJob } = useDeleteJob();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    deleteJob(id);
  };

  const handleEdit = (item) => {
    navigate(`/admindashboard/edit-job/${item.id}`);
  };

  // strip HTML from description for table display
  const tableData = jobs?.map((job) => ({
    ...job,
    description: stripHtml(job.description),
  }));

  return (
    <main className="py-8 max-w-6xl mx-auto px-4">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Briefcase size={32} className="text-[var(--accent)]" />
          <div>
            <h1 className="text-3xl font-bold text-[var(--typo)]">Manage Jobs</h1>
            <p className="text-sm text-gray-500 mt-0.5">View, edit and delete job postings</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admindashboard/create-job")}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus size={16} /> Post New Job
        </button>
      </header>

      <DataTable
        title="All Jobs"
        columns={columns}
        data={tableData}
        loading={isLoading}
        error={isError ? "Failed to load jobs." : null}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  );
};

export default AdminManageJobs;