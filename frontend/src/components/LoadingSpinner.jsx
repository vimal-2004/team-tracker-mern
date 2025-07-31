const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex flex-col items-center space-y-6">
        <div className="loading-spinner h-16 w-16"></div>
        <p className="text-gray-600 text-xl font-semibold">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner 