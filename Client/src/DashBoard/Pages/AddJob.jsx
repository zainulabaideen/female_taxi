import api from "../../api/axios";
import { Plus, Briefcase } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useState } from "react";

const AddJob = () => {
  const [description, setDescription] = useState("");

  const addJob = async (formData) => {
    try {
      await api.post("/jobs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Job added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add job. Try again.");
    }
  };

  return (
    <div className="py-16 max-w-4xl mx-auto">

      {/* Page Heading */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Briefcase /> Add New Job
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Fill out the form below to create a new job posting.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-400 p-8">
        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
          <Plus /> Job Details
        </h2>

        <form
          action={addJob}
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            formData.set("description", description); // attach quill content
            addJob(formData);
          }}
        >
          {/* Job Title */}
          <div>
            <label className="block mb-2 font-medium">
              Job Title <span className="text-red-600">*</span>
            </label>
            <input
              name="title"
              type="text"
              required
              aria-label="Job Title"
              className="input"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 font-medium">
              Location <span className="text-red-600">*</span>
            </label>
            <input
              name="location"
              type="text"
              required
              aria-label="Location"
              className="input"
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block mb-2 font-medium">
              Job Type <span className="text-red-600">*</span>
            </label>
            <select
              name="type"
              required
              aria-label="Job Type"
              className="input"
            >
              <option value="">Select Type</option>
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block mb-2 font-medium">
              Salary <span className="text-red-600">*</span>
            </label>
            <input
              name="salary"
              type="text"
              required
              aria-label="Salary"
              className="input"
            />
          </div>

          {/* Description (ReactQuill) */}
          <div>
            <label className="block mb-2 font-medium">
              Job Description <span className="text-red-600">*</span>
            </label>
            <ReactQuill
              value={description}
              onChange={setDescription}
              className="bg-white border border-gray-300 rounded-lg"
              theme="snow"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-black text-white rounded-xl px-10 py-4 text-lg"
            >
              Add Job
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddJob;
