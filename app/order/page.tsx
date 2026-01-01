import { Suspense } from "react"
import { OrderContent } from "./order-content"

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
        </div>
      }
    >
      <OrderContent />
    </Suspense>
  )
}
