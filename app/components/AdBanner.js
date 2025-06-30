export default function AdBanner({ position }) {
  const getAdSize = () => {
    switch (position) {
      case "top":
        return "h-24 w-full"
      case "side":
        return "h-64 w-full"
      case "bottom":
        return "h-32 w-full"
      default:
        return "h-24 w-full"
    }
  }

  return (
    <div
      className={`bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center ${getAdSize()}`}
    >
      <div className="text-gray-500 text-center">
        <div className="text-sm font-medium">Advertisement</div>
        <div className="text-xs">{position} banner</div>
      </div>
    </div>
  )
}
