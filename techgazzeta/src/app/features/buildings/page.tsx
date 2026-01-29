import React from 'react'
import BuildingsDashboard from './components/Building'
import ProtectedRoute from '@/lib/ProtectedRoute'

const BuildingsPage = () => {
  return (
    <ProtectedRoute>
        <BuildingsDashboard />
    </ProtectedRoute>
  )
}

export default BuildingsPage