import React from 'react'
import { usePOSStore } from '../store/posStore'
import { usersAPI } from '../hooks/api'
import toast from 'react-hot-toast'

export function LoginPage() {
  const { setCurrentUser } = usePOSStore()
  const [username, setUsername] = React.useState('')
  const [pin, setPin] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await usersAPI.verifyPin(username, pin)
      setCurrentUser(response.data)
      toast.success(`¡Bienvenido, ${response.data.name}!`)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Usuario o PIN inválido')
    } finally {
      setLoading(false)
      setPin('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white text-center">
            <h1 className="text-4xl font-bold mb-2">LA JICARADAS</h1>
            <p className="text-blue-100">Sistema POS para Restaurantes</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ingrese su PIN"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                disabled={loading}
                inputMode="numeric"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !username || !pin}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-4 text-center text-xs text-slate-500">
            <p>v1.0.0 | Offline First POS System</p>
          </div>
        </div>
      </div>
    </div>
  )
}
