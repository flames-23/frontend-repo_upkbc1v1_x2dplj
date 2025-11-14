import { useEffect, useRef } from 'react'

// Google Identity Services button wrapper
// Requires: VITE_GOOGLE_CLIENT_ID, VITE_BACKEND_URL
export default function GoogleSignIn({ onSuccess }) {
  const btnRef = useRef(null)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!clientId) return

    const scriptId = 'google-identity-services'
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script')
      s.src = 'https://accounts.google.com/gsi/client'
      s.async = true
      s.defer = true
      s.id = scriptId
      s.onload = init
      document.body.appendChild(s)
    } else {
      init()
    }

    function init() {
      if (!window.google || !btnRef.current) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const id_token = response.credential
            const res = await fetch(`${backend}/api/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id_token })
            })
            const data = await res.json()
            if (data.ok) {
              localStorage.setItem('authProfile', JSON.stringify(data.profile))
              onSuccess?.(data.profile)
            } else {
              console.error('Auth failed', data)
              alert('Google authentication failed')
            }
          } catch (e) {
            console.error(e)
            alert('Google authentication error')
          }
        },
        ux_mode: 'popup'
      })
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'medium',
        shape: 'pill',
        type: 'standard',
        text: 'signin_with'
      })
    }
  }, [clientId, backend])

  if (!clientId) {
    return (
      <button
        className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm"
        onClick={() => alert('Missing VITE_GOOGLE_CLIENT_ID env. Set it and reload.')}
      >
        Configure Google Sign-In
      </button>
    )
  }

  return <div ref={btnRef} />
}
