import { useCategories, useDeleteCategory } from "../../../api/hooks/useCategories";
import { useNavigate } from "react-router-dom";
import DataTable from "../../DataTable";

const ManageCategories = () => {
  const { data: categories = [], isLoading, error } = useCategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (confirmed) deleteCategory(id);
  };

  const columns = [
    { key: "id",                    label: "ID" },
    { key: "name",                  label: "Name" },
    { key: "parent_category_title", label: "Parent Category" },
    { key: "description",           label: "Description", type: "text", maxLength: 80 },
    { key: "image",                 label: "Image", type: "image", imageArray: false },
    { key: "created_at",            label: "Created At" },
    { key: "actions",               label: "Actions" },
  ];

  // Provide a fallback label for categories with no parent
  const tableData = categories?.map((cat) => ({
    ...cat,
    parent_category_title: cat?.parent_category_title || "—",
  }));

  return (
    <main className="py-8 max-w-6xl mx-auto px-4">
      <DataTable
        title="Manage Categories"
        columns={columns}
        data={tableData}
        loading={isLoading}
        error={error?.message}
        onEdit={(item) => navigate(`/admindashboard/edit-category/${item?.id}`)}
        onDelete={(id) => handleDelete(id)}
      />
    </main>
  );
};

export default ManageCategories;