import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}