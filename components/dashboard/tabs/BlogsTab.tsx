// components/dashboard/tabs/placeholder
export default function BlogsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Blogs</h2>
          <p className="text-gray-600">Manage blogs</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-gray-500">This page is under construction</p>
      </div>
    </div>
  );
}