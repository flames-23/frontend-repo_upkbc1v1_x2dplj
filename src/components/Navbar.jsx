import { useState } from 'react'
import { Menu, X, Home, MessagesSquare, User, Shuffle, BookOpen } from 'lucide-react'

export default function Navbar({ current, onNavigate }) {
  const [open, setOpen] = useState(false)
  const items = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'matchmaking', label: 'Matchmaking', icon: Shuffle },
    { key: 'chat', label: 'Chat', icon: MessagesSquare },
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'resources', label: 'Resources', icon: BookOpen },
  ]

  return (
    <nav className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-semibold tracking-tight">NovaMatch</div>
        <div className="hidden md:flex gap-2">
          {items.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${current===key? 'bg-blue-600 text-white':'text-slate-700 hover:bg-slate-100'}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-2">
          {items.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { onNavigate(key); setOpen(false) }}
              className={`text-left px-3 py-2 rounded-md ${current===key? 'bg-blue-600 text-white':'hover:bg-slate-100'}`}
            >{label}</button>
          ))}
        </div>
      )}
    </nav>
  )
}
