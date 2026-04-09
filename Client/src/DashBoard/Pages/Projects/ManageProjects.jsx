import { useNavigate } from "react-router-dom";
import { FolderOpen, Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import { useProjects, useDeleteProjectItem } from  "../../../api/projects/useProjects"
import { imagePrefix2 } from "../../../api/axios";  
import DataTable from "../../DataTable";

const normalizeImg = (path) => {
  if (!path) return null;
  return `${imagePrefix2}/${path.replace(/\\/g, "/").replace(/^uploads\//, "uploads/")}`;
};

const columns = [
  { key: "cover_image", label: "Cover",     type: "image" },
  { key: "main_title",  label: "Title" },
  { key: "slug",        label: "Slug" },
  { key: "created_at",  label: "Created At" },
  { key: "actions",     label: "Actions" },
];

const ManageProjects = () => {
  const navigate = useNavigate();
  const { data: projects = [], isLoading, isError } = useProjects();
  const { mutate: deleteProject } = useDeleteProjectItem();

  const handleDelete = (slug) => {
    if (!window.confirm("Delete this project and all its items?")) return;
    deleteProject(slug);
  };

  const handleEdit = (item) => {
    navigate(`/admindashboard/edit-project/${item.slug}`);
  };

  // Normalize cover_image paths for DataTable image rendering
  const tableData = projects?.map((p) => ({
    ...p,
    // DataTable image col reads item[col.key] so we keep key as cover_image
    // but we need it normalized — override here
    cover_image: p.cover_image
      ? p.cover_image.replace(/\\/g, "/")
      : null,
  }));

  return (
    <main className="py-8 max-w-6xl mx-auto px-4">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <FolderOpen size={32} className="text-[var(--accent)]" />
          <div>
            <h1 className="text-3xl font-bold text-[var(--typo)]">Manage Projects</h1>
            <p className="text-sm text-gray-400 mt-0.5">View, edit and delete client projects</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admindashboard/add-project")}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus size={16} /> Add New Project
        </button>
      </header>

      <DataTable
        title="All Projects"
        columns={columns}
        data={tableData}
        loading={isLoading}
        error={isError ? "Failed to load projects." : null}
        onEdit={handleEdit}
        onDelete={(id) => {
          // DataTable calls onDelete(item.id) but we need slug
          // So we find the project by id and use its slug
          const project = projects.find((p) => p.id === id);
          if (project) handleDelete(project.slug);
        }}
      />
    </main>
  );
};

export default ManageProjects;