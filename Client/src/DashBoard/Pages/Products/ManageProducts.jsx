import { useNavigate } from "react-router-dom";
import DataTable from "../../DataTable";
import { useProducts, useDeleteProduct } from "../../../api/hooks/useProducts";
import { truncateHtml } from "../../../utils/textUtils";

const columns = [
  { key: "name",          label: "Name" },
  { key: "category_name", label: "Category" },
  { key: "price",         label: "Price ($)" },
  { key: "images",        label: "Image",       type: "image", imageArray: true, imagePrefixNumber: 2 },
  { key: "overview",      label: "Overview",    type: "text",  maxLength: 80 },
  { key: "key_features",  label: "Key Features",type: "text",  maxLength: 80 },
  { key: "created_at",    label: "Created At" },
  { key: "actions",       label: "Actions" },
];

const ManageProducts = () => {
  const navigate = useNavigate();

  // data is now the products array directly — fetchAllProducts returns data.products
  const { data: products = [], isLoading, error } = useProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    deleteProduct(id);
  };

  const handleEdit = (item) => {
    navigate(`/admindashboard/edit-product/${item.id}`);
  };

  const tableData = products?.map((product) => ({
    id:            product.id,
    name:          product.name,
    category_name: product.category?.name || product.category_name || "-",
    price:         product.price,
    overview:      truncateHtml(product.overview),
    key_features:  truncateHtml(product.key_features),
    created_at:    product.created_at,
    images:        Array.isArray(product.images) ? product.images : [],
  }));

  return (
    <div className="py-8">
      <DataTable
        title="Manage Products"
        columns={columns}
        data={tableData}
        loading={isLoading}
        error={error?.message}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageProducts;