'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Lead {
  id: number
  nombre: string
  telefono: string
  cedula: string
  created_at: string
}

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
    router.refresh()
  }

  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(data)
        setLoading(false)
      })
      .catch(() => {
        setError('No se pudieron cargar los registros')
        setLoading(false)
      })
  }, [])

  const filtered = leads.filter(l =>
    l.nombre.toLowerCase().includes(search.toLowerCase()) ||
    l.cedula.includes(search) ||
    l.telefono.includes(search)
  )

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('es-VE', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none">
                <path d="M20 24 C20 14 44 14 44 24 C44 30 40 38 36 44 C34 48 30 48 28 44 C24 38 20 30 20 24Z" fill="url(#tg)" />
                <defs>
                  <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#bae6fd" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Dental Care · Michelena</p>
              <h1 className="text-lg font-bold text-blue-900 leading-tight">Panel de Registros</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ver Landing
            </a>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total registros</p>
            <p className="text-3xl font-extrabold text-blue-700">{leads.length}</p>
          </div>
          <div className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Hoy</p>
            <p className="text-3xl font-extrabold text-cyan-600">
              {leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Esta semana</p>
            <p className="text-3xl font-extrabold text-blue-500">
              {leads.filter(l => {
                const d = new Date(l.created_at)
                const now = new Date()
                const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
                return d >= weekAgo
              }).length}
            </p>
          </div>
        </div>

        {/* Search + Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-bold text-blue-900 text-lg">Solicitudes de cita</h2>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7 7 0 103 10a7 7 0 0013.65 6.65z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre, cédula o teléfono..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-72 text-slate-700"
              />
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 mx-6 my-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-6 py-3 font-semibold">#</th>
                      <th className="text-left px-6 py-3 font-semibold">Nombre</th>
                      <th className="text-left px-6 py-3 font-semibold">Teléfono</th>
                      <th className="text-left px-6 py-3 font-semibold">Cédula</th>
                      <th className="text-left px-6 py-3 font-semibold">Fecha de registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-slate-400">
                          No se encontraron registros
                        </td>
                      </tr>
                    ) : (
                      filtered.map((lead, i) => (
                        <tr key={lead.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-6 py-4 text-slate-400 font-mono text-xs">{i + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                                {lead.nombre.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-slate-800">{lead.nombre}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{lead.telefono}</td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold">
                              {lead.cedula}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(lead.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <p className="text-center py-12 text-slate-400 text-sm">No se encontraron registros</p>
                ) : (
                  filtered.map(lead => (
                    <div key={lead.id} className="px-5 py-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {lead.nombre.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-slate-800">{lead.nombre}</p>
                      </div>
                      <div className="space-y-1 pl-12 text-sm text-slate-600">
                        <p>📞 {lead.telefono}</p>
                        <p>🪪 <span className="font-mono">{lead.cedula}</span></p>
                        <p className="text-xs text-slate-400">{formatDate(lead.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400 text-right">
                {filtered.length} registro{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
