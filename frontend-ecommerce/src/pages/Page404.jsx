import { useNavigate } from "react-router-dom";

export default function Page404() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[90vh] flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-900 dark:text-white p-5">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition animate-bounce"
      >
        Go Back Home
      </button>
    </main>
  );
}
