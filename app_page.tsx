import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Birth Certificate Digitalization
          </h1>
          <p className="text-xl text-gray-600">⏱ Takes 3–5 minutes</p>
          <p className="text-lg text-gray-600">Apply Once, Submit Once</p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Easy Application
            </h3>
            <p className="text-gray-600">
              Fill a simple form with your details and upload documents.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Secure & Safe
            </h3>
            <p className="text-gray-600">
              Your data is encrypted and protected by government standards.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Fast Processing
            </h3>
            <p className="text-gray-600">
              Track your application status in real-time.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/application"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition text-center"
          >
            Start New Application
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-bold hover:bg-blue-50 transition text-center"
          >
            Login to Check Status
          </Link>
        </div>

        {/* Requirements */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📄 Required Documents
          </h2>
          <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
            <li>✓ Birth Certificate</li>
            <li>✓ Father's Aadhaar Card</li>
            <li>✓ Mother's Aadhaar Card</li>
            <li>✓ Ration Card</li>
            <li>✓ Child's Proof (Aadhaar/EPIC)</li>
            <li>✓ Supporting Documents (if available)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}