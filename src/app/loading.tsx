import { MorphingSquare } from "@/components/ui/morphing-square"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <MorphingSquare message="Loading..." />
    </div>
  )
}
