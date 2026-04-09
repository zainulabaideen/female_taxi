import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, Upload } from "lucide-react";
import { useCreateProject } from "../../../api/projects/useProjects";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const AddProject = () => {
  const navigate = useNavigate();
  const [preview,     setPreview]     = useState(null);
  const [description, setDescription] = useState("");

  const { mutate: createProject, isPending } = useCreateProject({
    onSuccessCallback: (data) => {
      navigate(`/admindashboard/edit-project/${data.slug}`);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();
    formData.append("main_title",   form.main_title.value);
    formData.append("cover_image",  form.cover_image.files[0]);
    formData.append("description",  description); // backend can use later
    createProject(formData);
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
          <FolderPlus /> Add New Project
        </h1>
        <p className="text-gray-500 text-sm">
          Create the project title, cover image, and an overview description.
          You can add detail items on the next step.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              name="main_title" required className="input" 
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Cover Image <span className="text-red-400">*</span>
            </label>
            <label
              htmlFor="cover_image"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition bg-gray-50 overflow-hidden"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={28} />
                  <span className="text-sm">Click to upload cover image</span>
                  <span className="text-xs">JPG, PNG, WEBP</span>
                </div>
              )}
            </label>
            <input
              id="cover_image" name="cover_image" type="file"
              accept="image/*" required className="hidden"
              onChange={handleImageChange}
            />
          </div>

           

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admindashboard/manage-projects")}
              className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isPending}
              className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating..." : "Create & Add Items →"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProject;