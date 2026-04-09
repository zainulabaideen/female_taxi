import { useState } from "react";
import { Users, X, FileText } from "lucide-react";
import DataTable from "../../DataTable";
import { useApplications } from "../../../api/careers/hooks/useApplications";
import { stripHtml } from "../../../utils/textUtils";
import { imagePrefix2 } from "../../../api/axios";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "contact", label: "Contact" },
  // { key: "position", label: "Position" },
  { key: "education", label: "Education" },
  { key: "gender", label: "Gender" },
  { key: "resume", label: "Resume / CV" },
  { key: "created_at", label: "Applied At" },
  { key: "actions", label: "Actions" },
];

const ApplicationModal = ({ application, onClose }) => {
  
  const cvUrl = application?.cv
    ? `${imagePrefix2}/${application.cv.replaceAll("\\", "/")}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Application Details
          </h2>
        </div>

        <div className="space-y-3 text-sm">

          {[
            ["Full Name", application.name],
            ["Email", application.email],
            ["Contact", application.contact],
            // ["Position", application.position],
            ["Gender", application.gender],
            ["Date of Birth", application.dob],
            ["CNIC", application.cnic],
            ["Education", application.education],
            ["Availability", application.availability || "Not specified"],
            ["Address", application.address],
          ]?.map(([label, value]) => (
            <div key={label} className="flex gap-3">
              <span className="font-semibold text-gray-500 w-32 flex-shrink-0">
                {label}
              </span>

              <span className="text-gray-800">
                {value || "-"}
              </span>
            </div>
          ))}

          <div>
            <p className="font-semibold text-gray-500 mb-1">
              Experience
            </p>

            <p className="text-gray-800 bg-gray-50 rounded-lg p-3 leading-relaxed">
              {application.experience || "-"}
            </p>
          </div>

          {application.message && (
            <div>
              <p className="font-semibold text-gray-500 mb-1">
                Message
              </p>

              <p className="text-gray-800 bg-gray-50 rounded-lg p-3">
                {application.message}
              </p>
            </div>
          )}

          {cvUrl && (
            <div>
              <p className="font-semibold text-gray-500 mb-1">
                Resume / CV
              </p>

              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                View Resume
              </a>
            </div>
          )}

        </div>

        <div className="mt-6 flex justify-end">
          <a
            href={`mailto:${application.email}?subject=Re: Your Application at Alpha Enterprises`}
            className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  );
};

const AdminJobApplications = () => {

  const [selected, setSelected] = useState(null);

  const { data: applications = [], isLoading, isError } = useApplications();

  const handleView = (item) => setSelected(item);

  const tableData = applications?.map((app) => {

    const cvUrl = app?.cv
      ? `${imagePrefix2}/${app.cv.replaceAll("\\", "/")}`
      : null;

    return {
      ...app,

      experience: stripHtml(app.experience, 60),

      resume: cvUrl ? (
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium"
        >
          View CV
        </a>
      ) : "-",
    };
  });

  return (
    <main className="py-8 max-w-6xl mx-auto px-4">

      <header className="flex items-center gap-3 mb-6">
        <Users size={32} className="text-[var(--accent)]" />

        <div>
          <h1 className="text-3xl font-bold text-[var(--typo)]">
            Job Applications
          </h1>

          <p className="text-sm text-gray-500 mt-0.5">
            All submitted job applications
          </p>
        </div>
      </header>

      <DataTable
        title="All Applications"
        columns={columns}
        data={tableData}
        loading={isLoading}
        error={isError ? "Failed to load applications." : null}
        onEdit={handleView}
      />

      {selected && (
        <ApplicationModal
          application={selected}
          onClose={() => setSelected(null)}
        />
      )}

    </main>
  );
};

export default AdminJobApplications;