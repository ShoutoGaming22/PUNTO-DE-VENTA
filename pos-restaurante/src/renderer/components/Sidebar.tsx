import React from 'react'
import { LogOut, Settings, Users, BarChart3 } from 'lucide-react'
import { usePOSStore } from '../store/posStore'

export function Sidebar() {
  const { currentUser, setCurrentUser } = usePOSStore()
  const [isOpen, setIsOpen] = React.useState(true)

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const menuItems = [
    { label: 'Mesas', icon: '🍽️', href: '#sales' },
    { label: 'Inventario', icon: '📦', href: '#inventory' },
    { label: 'Reportes', icon: '📊', href: '#reports' },
    { label: 'Usuarios', icon: '👥', href: '#users' },
    { label: 'Configuración', icon: '⚙️', href: '#settings' },
  ]

  return (
    <aside
      className={`bg-slate-900 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } h-screen flex flex-col shadow-lg`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {isOpen && <h1 className="text-2xl font-bold">LA JICARADAS</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-700">
        {isOpen && currentUser && (
          <div className="mb-3 text-sm">
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-slate-400 text-xs">{currentUser.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          <LogOut size={20} />
          {isOpen && <span>Salir</span>}
        </button>
      </div>
    </aside>
  )
}
