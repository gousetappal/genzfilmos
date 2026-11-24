"use client"
import { createBrowserClient } from "@supabase/ssr"
import { useEffect, useState } from "react"
export default function Login() {
  const [email, setE] = useState(""), [pw, setP] = useState(""), [err, setErr] = useState(""), [busy, setB] = useState(false)
  useEffect(() => { const e = new URLSearchParams(location.search).get("err"); if (e) setErr(e) }, [])
  async function go(e: React.FormEvent) {
    e.preventDefault(); setB(true); setErr("")
    const s = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { error } = await s.auth.signInWithPassword({ email, password: pw })
    if (error) { setErr(error.message); setB(false) } else location.href = "/dashboard"
  }
  return <main className="min-h-screen grid place-items-center"><form onSubmit={go} className="bg-card border border-line rounded-2xl p-8 w-96 space-y-4">
    <h1 className="text-xl font-bold">GENZ FILMS OS</h1><p className="text-sm text-slate-400">Creative Storytelling. Strategic Content. Business Growth.</p>
    <input className="inp" type="email" placeholder="Email" value={email} onChange={e => setE(e.target.value)} required />
    <input className="inp" type="password" placeholder="Password" value={pw} onChange={e => setP(e.target.value)} required />
    {err && <p className="text-red-400 text-sm">{err}</p>}
    <button className="btn w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    <a href="/forgot" className="block text-sm text-slate-400 underline">Forgot password?</a></form></main>
}
