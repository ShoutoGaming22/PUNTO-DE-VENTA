import React from 'react'
import { usePOSStore } from '../store/posStore'
import { useOnlineStatus } from '../hooks'

export function Header() {
  const { currentUser } = usePOSStore()
  const isOnline = useOnlineStatus()
  const [time, setTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">LA JICARADAS POS</h2>
          <p className="text-sm text-slate-500">Sistema de Punto de Venta</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Status indicators */}
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-slate-600">
              {isOnline ? 'En línea' : 'Sin conexión'}
            </span>
          </div>

          {/* Time */}
          <div className="text-right">
            <p className="text-sm font-mono text-slate-900">
              {time.toLocaleTimeString('es-ES')}
            </p>
            <p className="text-xs text-slate-500">
              {time.toLocaleDateString('es-ES')}
            </p>
          </div>

          {/* User */}
          {currentUser && (
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500 uppercase">
                {currentUser.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
