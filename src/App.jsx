import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { StartupQuickForm, InvestorQuickForm } from './components/QuickForms'
import GoogleSignIn from './components/GoogleSignIn'

function App() {
  const [tab, setTab] = useState('home')
  const [startups, setStartups] = useState([])
  const [investors, setInvestors] = useState([])
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('authProfile') || 'null') } catch { return null }
  })
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadLists = async () => {
    try {
      const [sRes, iRes] = await Promise.all([
        fetch(`${base}/api/startups`).then(r=>r.json()),
        fetch(`${base}/api/investors`).then(r=>r.json()),
      ])
      setStartups(sRes)
      setInvestors(iRes)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { loadLists() }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      <Navbar current={tab} onNavigate={setTab} />
      {tab === 'home' && (
        <>
          <Hero />
          <section id="get-started" className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">Create a Startup Profile</h3>
                {!profile && <GoogleSignIn onSuccess={setProfile} />}
                {profile && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <img src={profile.picture} alt="avatar" className="w-6 h-6 rounded-full" />
                    <span>{profile.name || profile.email}</span>
                  </div>
                )}
              </div>
              <p className="text-slate-600 mb-4">Share your problem, solution, traction, and funding needs.</p>
              <StartupQuickForm onCreated={loadLists} />
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-2">Create an Investor Profile</h3>
              <p className="text-slate-600 mb-4">Add your thesis, preferred stages, and ticket size.</p>
              <InvestorQuickForm onCreated={loadLists} />
            </div>
          </section>
          <section className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="font-semibold mb-3">Latest Startups</h4>
              <ul className="divide-y">
                {startups.map(s => (
                  <li key={s._id} className="py-3">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-slate-600">{s.tagline}</div>
                  </li>
                ))}
                {startups.length === 0 && <li className="py-3 text-slate-500">No startups yet.</li>}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="font-semibold mb-3">Latest Investors</h4>
              <ul className="divide-y">
                {investors.map(i => (
                  <li key={i._id} className="py-3">
                    <div className="font-medium">{i.name}</div>
                    <div className="text-sm text-slate-600">Stages: {(i.preferred_stage||[]).join(', ')}</div>
                  </li>
                ))}
                {investors.length === 0 && <li className="py-3 text-slate-500">No investors yet.</li>}
              </ul>
            </div>
          </section>
        </>
      )}

      {tab === 'matchmaking' && <Matchmaking />}
      {tab === 'chat' && <ChatPreview />}
      {tab === 'profile' && <ProfileInfo profile={profile} onSignOut={() => { localStorage.removeItem('authProfile'); setProfile(null) }} />}
      {tab === 'resources' && <Resources />}
    </div>
  )
}

function Matchmaking() {
  const [filters, setFilters] = useState({ industry: '', stage: '', geography: '', ticket_min: '', ticket_max: '' })
  const [results, setResults] = useState([])
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const search = async () => {
    const body = {
      industry: filters.industry ? filters.industry.split(',').map(s=>s.trim()) : null,
      stage: filters.stage || null,
      geography: filters.geography || null,
      ticket_min: filters.ticket_min ? Number(filters.ticket_min) : null,
      ticket_max: filters.ticket_max ? Number(filters.ticket_max) : null,
    }
    const res = await fetch(`${base}/api/matchmaking`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    setResults(data)
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-4">Find Matches</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid md:grid-cols-5 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Industry (comma separated)" value={filters.industry} onChange={e=>setFilters({...filters, industry:e.target.value})} />
          <select className="border rounded px-3 py-2" value={filters.stage} onChange={e=>setFilters({...filters, stage:e.target.value})}>
            <option value="">Any stage</option>
            {['idea','MVP','pre-seed','seed','series-a','series-b'].map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
          <input className="border rounded px-3 py-2" placeholder="Geography" value={filters.geography} onChange={e=>setFilters({...filters, geography:e.target.value})} />
          <input className="border rounded px-3 py-2" type="number" placeholder="Ticket min" value={filters.ticket_min} onChange={e=>setFilters({...filters, ticket_min:e.target.value})} />
          <input className="border rounded px-3 py-2" type="number" placeholder="Ticket max" value={filters.ticket_max} onChange={e=>setFilters({...filters, ticket_max:e.target.value})} />
        </div>
        <button onClick={search} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Search</button>
        <div className="mt-6">
          <ul className="divide-y">
            {results.map((m, idx) => (
              <li key={idx} className="py-3">
                <div className="font-medium">Match score: {m.score}</div>
                <div className="text-sm text-slate-600">Startup {m.a_id} ↔ Investor {m.b_id}</div>
              </li>
            ))}
            {results.length===0 && <li className="py-3 text-slate-500">No results yet. Adjust filters and search.</li>}
          </ul>
        </div>
      </div>
    </section>
  )
}

function ChatPreview() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-4">Chat (Preview)</h2>
      <p className="text-slate-600">Create profiles first, then implement conversations with IDs in a later iteration.</p>
    </section>
  )
}

function ProfileInfo({ profile, onSignOut }) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {!profile ? (
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-600 mb-4">Sign in to personalize your experience.</p>
          <GoogleSignIn onSuccess={() => window.location.reload()} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={profile.picture} alt="avatar" className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-semibold">{profile.name}</div>
              <div className="text-slate-600 text-sm">{profile.email}</div>
            </div>
          </div>
          <button className="px-3 py-2 rounded-md bg-slate-900 text-white" onClick={onSignOut}>Sign out</button>
        </div>
      )}
    </section>
  )
}

function Resources() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-4">Resources</h2>
      <ul className="list-disc pl-6 text-slate-700 space-y-2">
        <li>How to craft a compelling pitch</li>
        <li>Understanding fundraising stages</li>
        <li>Diligence checklist for investors</li>
      </ul>
    </section>
  )
}

export default App
