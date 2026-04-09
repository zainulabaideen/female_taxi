import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useSingleJob, useUpdateJob } from "../../../api/careers/hooks/useJobs";

const AdminEditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading, isError } = useSingleJob(id);
  const { mutate: updateJob, isPending } = useUpdateJob({
    onSuccessCallback: () => navigate("/admindashboard/manage-jobs"),
  });

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (job) setDescription(job.description || "");
  }, [job]);

  if (isLoading) return <div className="text-center py-20 text-gray-500">Loading job...</div>;
  if (isError || !job) return <div className="text-center py-20 text-red-500">Job not found.</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("description", description);
    const body = Object.fromEntries(formData.entries());
    updateJob({ id, formData: body });
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Briefcase /> Edit Job
        </h1>
        <p className="text-gray-600">Update the job posting details.</p>
      </div>

      <div className="bg-white shadow-lg rounded-2xl border border-gray-300 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">Job Title <span className="text-red-600">*</span></label>
            <input name="title" type="text" required defaultValue={job.title} className="input" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Job Type</label>
              <select name="type" defaultValue={job.type || ""} className="input">
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Location</label>
              <input name="location" type="text" defaultValue={job.location || ""} className="input" />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Salary / Package</label>
            <input name="price" type="number" defaultValue={job.price || ""} className="input" />
          </div>

          <div>
            <label className="block mb-2 font-medium">Job Description</label>
            <ReactQuill value={description} onChange={setDescription} />
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admindashboard/manage-jobs")}
              className="px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isPending}
              className="bg-black text-white rounded-xl px-10 py-3 hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditJob;