import React from 'react'
import { usePOSStore } from '../store/posStore'
import { tablesAPI } from '../hooks/api'
import toast from 'react-hot-toast'

export function SalesPage() {
  const { tables, setTables, selectedTable, selectTable } = usePOSStore()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    loadTables()
  }, [])

  const loadTables = async () => {
    try {
      const response = await tablesAPI.getAll()
      setTables(response.data)
    } catch (error) {
      toast.error('Error al cargar mesas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-2xl font-semibold text-slate-600">Cargando mesas...</div>
      </div>
    )
  }

  const sections = [...new Set(tables.map((t) => t.section))]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Gestión de Mesas</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
          + Nueva Mesa
        </button>
      </div>

      {sections.map((section) => (
        <div key={section}>
          <h2 className="text-xl font-bold text-slate-800 mb-4">{section}</h2>
          <div className="grid grid-cols-auto-fit gap-4">
            {tables
              .filter((t) => t.section === section)
              .map((table) => (
                <button
                  key={table.id}
                  onClick={() => selectTable(table)}
                  className={`p-6 rounded-xl font-semibold transition cursor-pointer ${
                    selectedTable?.id === table.id
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : table.status === 'free'
                      ? 'bg-green-100 text-green-900 hover:bg-green-200'
                      : 'bg-red-100 text-red-900 hover:bg-red-200'
                  }`}
                >
                  <div className="text-2xl mb-2">🍽️</div>
                  <div className="text-lg">Mesa {table.table_number}</div>
                  <div className="text-sm opacity-75">
                    {table.status === 'free' ? 'Libre' : 'Ocupada'}
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}

      {selectedTable && (
        <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Mesa Seleccionada: {selectedTable.table_number}
          </h3>
          <div className="flex gap-3">
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition">
              Nueva Orden
            </button>
            <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition">
              Ver Orden
            </button>
            <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold transition">
              Cerrar Mesa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
