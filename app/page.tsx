'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface FormData {
  nombre: string
  email: string
  telefono: string
  cedula: string
  edad: string
}
interface FormState {
  loading: boolean
  success: boolean
  error: string | null
}

const emptyForm: FormData = { nombre: '', email: '', telefono: '', cedula: '', edad: '' }

export default function LandingPage() {
  const [form, setForm] = useState<FormData>(emptyForm)
  const [state, setState] = useState<FormState>({ loading: false, success: false, error: null })
  const [limite, setLimite] = useState<number | null>(null)
  const [total, setTotal] = useState<number>(0)

  const esMenor = parseInt(form.edad) < 18 && form.edad !== ''
  const cupoAgotado = limite !== null && total >= limite && limite > 0

  useEffect(() => {
    fetch('/api/limit')
      .then(r => r.json())
      .then(d => { setLimite(d.limite); setTotal(d.total) })
      .catch(() => { })
  }, [])

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
      setForm(emptyForm)
      setTotal(prev => prev + 1)
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

      {/* Logo */}
      <section className="flex justify-center pb-10">
        <Image
          src="/logo.jpg"
          alt="Dental Care Michelena"
          width={160}
          height={160}
          className="rounded-full shadow-lg"
          priority
        />
      </section>

      {/* Form */}
      <section className="max-w-lg mx-auto px-4 pb-16">

        {/* ── Banner cupos agotados (informativo, no bloquea) ── */}
        {cupoAgotado && (
          <div className="mb-5 bg-amber-50 border border-amber-300 rounded-2xl px-5 py-4 flex gap-3 items-start">
            <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div>
              <p className="text-amber-800 font-semibold text-sm">Cupos de la jornada actual completos</p>
              <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">
                Gracias por tu interés — estudiaremos tu caso para incluirte en una <strong>segunda jornada</strong>. Puedes registrarte de todas formas.
              </p>
            </div>
          </div>
        )}

        {/* ── Formulario ── */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-6 text-white text-center">
            <h3 className="text-2xl font-bold mb-1">Solicitar Cita</h3>
            <p className="text-blue-100 text-sm">Completa tus datos y te llamamos</p>
            {limite !== null && limite > 0 && (
              <p className="text-blue-200 text-xs mt-1">
                {limite - total} de {limite} cupos disponibles
              </p>
            )}
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

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                Nombre completo <span className="text-cyan-500">*</span>
              </label>
              <input
                type="text" name="nombre" value={form.nombre} onChange={handleChange}
                required placeholder="Ej. Juan Pérez"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                Correo electrónico <span className="text-slate-400 font-normal text-xs">(opcional)</span>
              </label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="Ej. juan@correo.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                Teléfono <span className="text-cyan-500">*</span>
              </label>
              <input
                type="tel" name="telefono" value={form.telefono} onChange={handleChange}
                required placeholder="Ej. 0414-7501234"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Edad */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                Edad <span className="text-cyan-500">*</span>
              </label>
              <input
                type="number" name="edad" value={form.edad} onChange={handleChange}
                required min="1" max="120" placeholder="Ej. 35"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Cédula */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                Cédula de identidad{' '}
                {esMenor
                  ? <span className="text-slate-400 font-normal text-xs">(opcional para menores de edad)</span>
                  : <span className="text-cyan-500">*</span>
                }
              </label>
              <input
                type="text" name="cedula" value={form.cedula} onChange={handleChange}
                required={!esMenor} placeholder="Ej. V-12345678"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-sm"
              />
            </div>

            <button
              type="submit" disabled={state.loading}
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
              ) : 'Solicitar mi cita'}
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
      <footer className="bg-blue-900 text-blue-200 text-center py-5 text-xs space-y-2 px-4">
        <p>© {new Date().getFullYear()} Dental Care — Michelena. Todos los derechos reservados.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 text-blue-300">
          <span className="flex items-center gap-1">
            Hecho con{' '}
            <svg className="w-3.5 h-3.5 text-rose-400 fill-rose-400" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {' '}por{' '}
            <a
              href="https://alejandroroa.medium.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold hover:underline underline-offset-2 transition-all"
            >
              Alejandro Roa
            </a>
          </span>
          <span className="hidden sm:inline mx-1">·</span>
          <span>Desarrollador de Software</span>
        </div>
      </footer>
    </main>
  )
}
