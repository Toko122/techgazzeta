import ProtectedRoute from "@/lib/ProtectedRoute";
import BuildingsPage from "./features/buildings/page";

export default function Home() {
  return (
    <ProtectedRoute>
      <BuildingsPage/>
    </ProtectedRoute>
  )
}
