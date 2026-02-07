import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📂</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Category Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The category you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
