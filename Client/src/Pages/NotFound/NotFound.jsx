import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 text-center px-4">
      <h1 className="text-7xl font-bold text-blue-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">Page Not Found</h2>
      <p className="mt-2 text-gray-600">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
