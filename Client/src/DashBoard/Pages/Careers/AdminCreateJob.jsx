import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAddJob } from "../../../api/careers/hooks/useJobs";

const AdminCreateJob = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");

  const { mutate: addJob, isPending } = useAddJob({
    onSuccessCallback: () => navigate("/admindashboard/manage-jobs"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("description", description);
    // convert FormData to plain object for JSON body
    const body = Object.fromEntries(formData.entries());
    addJob(body);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Briefcase /> Post a New Job
        </h1>
        <p className="text-gray-600">Fill in the details to publish a new job opening.</p>
      </div>

      <div className="bg-white shadow-lg rounded-2xl border border-gray-300 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">Job Title <span className="text-red-600">*</span></label>
            <input name="title" type="text" required className="input" placeholder="e.g. Network Security Engineer" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Job Type</label>
              <select name="type" className="input">
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Location</label>
              <input name="location" type="text" className="input" placeholder="e.g. Islamabad, Pakistan" />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Salary / Package</label>
            <input name="price" type="number" className="input" placeholder="e.g. 80000" />
          </div>

          <div>
            <label className="block mb-2 font-medium">Job Description</label>
            <ReactQuill value={description} onChange={setDescription} />
          </div>

          <div className="text-center pt-4">
            <button
              type="submit" disabled={isPending}
              className="bg-black text-white rounded-xl px-10 py-4 text-lg hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateJob;