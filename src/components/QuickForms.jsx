import { useState } from 'react'

export function StartupQuickForm({ onCreated }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', tagline: '', industry: '', stage: 'pre-seed', funding_needs_min: '', funding_needs_max: '' })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const payload = {
        ...form,
        industry: form.industry ? form.industry.split(',').map(s=>s.trim()) : [],
        funding_needs_min: form.funding_needs_min ? Number(form.funding_needs_min) : null,
        funding_needs_max: form.funding_needs_max ? Number(form.funding_needs_max) : null,
      }
      const res = await fetch(`${base}/api/startups`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      onCreated?.(data.id)
      setForm({ name: '', tagline: '', industry: '', stage: 'pre-seed', funding_needs_min: '', funding_needs_max: '' })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input className="border rounded px-3 py-2" placeholder="Startup name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
      <input className="border rounded px-3 py-2" placeholder="Tagline" value={form.tagline} onChange={e=>setForm({...form, tagline:e.target.value})} />
      <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Industries (comma separated)" value={form.industry} onChange={e=>setForm({...form, industry:e.target.value})} />
      <select className="border rounded px-3 py-2" value={form.stage} onChange={e=>setForm({...form, stage:e.target.value})}>
        {['idea','MVP','pre-seed','seed','series-a','series-b'].map(s=> <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input className="border rounded px-3 py-2" type="number" placeholder="Ticket min" value={form.funding_needs_min} onChange={e=>setForm({...form, funding_needs_min:e.target.value})} />
        <input className="border rounded px-3 py-2" type="number" placeholder="Ticket max" value={form.funding_needs_max} onChange={e=>setForm({...form, funding_needs_max:e.target.value})} />
      </div>
      <button disabled={loading} className="md:col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{loading? 'Saving...':'Create Startup'}</button>
    </form>
  )
}

export function InvestorQuickForm({ onCreated }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', domains: '', preferred_stage: 'seed', ticket_min: '', ticket_max: '' })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const payload = {
        ...form,
        domains: form.domains ? form.domains.split(',').map(s=>s.trim()) : [],
        preferred_stage: form.preferred_stage ? [form.preferred_stage] : [],
        ticket_min: form.ticket_min ? Number(form.ticket_min) : null,
        ticket_max: form.ticket_max ? Number(form.ticket_max) : null,
      }
      const res = await fetch(`${base}/api/investors`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      onCreated?.(data.id)
      setForm({ name: '', email: '', domains: '', preferred_stage: 'seed', ticket_min: '', ticket_max: '' })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input className="border rounded px-3 py-2" placeholder="Investor/Fund name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
      <input className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Domains (comma separated)" value={form.domains} onChange={e=>setForm({...form, domains:e.target.value})} />
      <select className="border rounded px-3 py-2" value={form.preferred_stage} onChange={e=>setForm({...form, preferred_stage:e.target.value})}>
        {['idea','MVP','pre-seed','seed','series-a','series-b'].map(s=> <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input className="border rounded px-3 py-2" type="number" placeholder="Ticket min" value={form.ticket_min} onChange={e=>setForm({...form, ticket_min:e.target.value})} />
        <input className="border rounded px-3 py-2" type="number" placeholder="Ticket max" value={form.ticket_max} onChange={e=>setForm({...form, ticket_max:e.target.value})} />
      </div>
      <button disabled={loading} className="md:col-span-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50">{loading? 'Saving...':'Create Investor'}</button>
    </form>
  )
}
