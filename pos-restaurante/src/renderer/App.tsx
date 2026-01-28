import React from 'react'
import { Toaster } from 'react-hot-toast'
import { usePOSStore } from './store/posStore'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { LoginPage } from './pages/LoginPage'
import { SalesPage } from './pages/SalesPage'
import './styles/app.css'

export function App() {
  const { currentUser } = usePOSStore()
  const [currentPage, setCurrentPage] = React.useState('sales')

  if (!currentUser) {
    return <LoginPage />
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {currentPage === 'sales' && <SalesPage />}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
