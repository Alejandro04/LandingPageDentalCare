'use client'

import { useState } from 'react'

interface FormData {
  nombre: string
  telefono: string
  cedula: string
}

interface FormState {
  loading: boolean
  success: boolean
  error: string | null
}

export default function LandingPage() {
  const [form, setForm] = useState<FormData>({ nombre: '', telefono: '', cedula: '' })
  const [state, setState] = useState<FormState>({ loading: false, success: false, error: null })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState({ loading: true, success: false, error: null })

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al enviar el formulario')
      }

      setState({ loading: false, success: true, error: null })
      setForm({ nombre: '', telefono: '', cedula: '' })
    } catch (err) {
      setState({ loading: false, success: false, error: (err as Error).message })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-blue-600">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-800 leading-tight">Dental Care</h1>
            <p className="text-sm text-blue-500 font-medium tracking-wide">Michelena</p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 leading-tight">
          Tu salud dental,<br />
          <span className="text-cyan-500">nuestra prioridad</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-xl mx-auto mb-4">
          Regístrate y uno de nuestros especialistas te contactará para agendar tu cita.
        </p>
      </section>

      {/* Services strip */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🦷', label: 'Ortodoncia' },
            { icon: '✨', label: 'Estética Dental' },
            { icon: '🔬', label: 'Endodoncia' },
            { icon: '🏥', label: 'Implantes' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-blue-100">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-sm font-semibold text-blue-800">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-lg mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-6 text-white text-center">
            <h3 className="text-2xl font-bold mb-1">Solicitar Cita</h3>
            <p className="text-blue-100 text-sm">Completa tus datos y te llamamos</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {state.success && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tu solicitud fue enviada. Te contactaremos pronto.
              </div>
            )}

            {state.error && (
              <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm font-medium">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                Nombre completo <span className="text-cyan-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Ej. Juan Pérez"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                Teléfono <span className="text-cyan-500">*</span>
              </label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                required
                placeholder="Ej. 0414-7501234"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                Cédula de identidad <span className="text-cyan-500">*</span>
              </label>
              <input
                type="text"
                name="cedula"
                value={form.cedula}
                onChange={handleChange}
                required
                placeholder="Ej. V-12345678"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm tracking-wide"
            >
              {state.loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Solicitar mi cita'
              )}
            </button>

            <p className="text-center text-xs text-slate-400 mt-2">
              Tus datos son confidenciales y solo se usarán para contactarte.
            </p>
          </form>
        </div>

        {/* Contact info */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-blue-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400">Llámanos</p>
              <p className="text-xs font-bold text-blue-800">+58 424-7434085</p>
            </div>
          </div>
          <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-blue-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400">Horario</p>
              <p className="text-xs font-bold text-blue-800">Previa Cita</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-200 text-center py-5 text-xs">
        © {new Date().getFullYear()} Dental Care — Michelena. Todos los derechos reservados.
      </footer>
    </main>
  )
}
