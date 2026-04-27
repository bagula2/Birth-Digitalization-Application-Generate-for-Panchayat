import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-4 py-6">
      <h1 className="mb-3 text-xl font-bold text-primary">Birth Certificate Digitalization Application System</h1>
      <p className="mb-6 text-sm">Bagula 2 No Gram Panchayat</p>
      <div className="space-y-3">
        <Link href="/user" className="block rounded bg-primary px-4 py-3 text-center font-semibold text-white">User Portal</Link>
        <Link href="/staff" className="block rounded bg-secondary px-4 py-3 text-center font-semibold text-white">Staff Portal</Link>
        <Link href="/admin" className="block rounded bg-accent px-4 py-3 text-center font-semibold text-gray-900">Admin Portal</Link>
      </div>
      <p className="mt-8 rounded border border-primary/40 bg-white p-3 text-xs">
        This portal facilitates application generation only. Final approval rests with competent authority.
      </p>
    </main>
  );
}
