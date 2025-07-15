export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 border-4 border-gold-400 rounded-full animate-spin" />
          <div className="absolute inset-2 border-2 border-purple-400 rounded-full animate-spin animate-reverse" />
          <div className="absolute inset-4 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-purple-900 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-gold-400 animate-pulse">正在准备仪式...</p>
      </div>
    </div>
  )
}
