import React, { lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useLocation } from '../Hooks'
const ClientScreen = lazy(() => import('../screens/ClientScreen'))
const InventoryScreen = lazy(() => import('../screens/InventoryScreen'))
const EntryScreen = lazy(() => import('../screens/InventoryScreen/Entry'))
const HistoryScreen = lazy(() => import('../screens/HistoryScreen'))
const ExitScreen = lazy(() => import('../screens/InventoryScreen/Exit'))
const ProductScreen = lazy(() => import('../screens/ProductScreen'))
const SupplierScreen = lazy(() => import('../screens/SupplierScreen'))
const SettingScreen = lazy(() => import('../screens/SettingScreen'))

export const AppRouter = () => {
  const { path } = useLocation()
  return (
    <Router>
      <Routes location={path}>
        <Route path="/" element={<InventoryScreen />} />
        <Route path="/inventory/entry" element={<EntryScreen />} />
        <Route path="/inventory/history/entry" element={<HistoryScreen />} />
        <Route path="/inventory/history/exit" element={<HistoryScreen />} />
        <Route path="/inventory/exit" element={<ExitScreen />} />
        <Route path="/client" element={<ClientScreen />} />
        <Route path="/client/create" element={<ClientScreen />} />
        <Route path="/product" element={<ProductScreen />} />
        <Route path="/product/create" element={<ProductScreen />} />
        <Route path="/supplier" element={<SupplierScreen />} />
        <Route path="/supplier/create" element={<SupplierScreen />} />
        <Route path="/setting" element={<SettingScreen />} />
      </Routes>
    </Router>
  )
}
