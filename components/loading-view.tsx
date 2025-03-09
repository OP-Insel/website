import { Card } from "@/components/ui/card"

export default function LoadingView() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md p-8 bg-black/40 backdrop-blur-xl border-gray-800">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          </div>
          <p className="text-xl font-semibold text-primary/80 animate-pulse">Loading...</p>
        </div>
      </Card>
    </div>
  )
}

