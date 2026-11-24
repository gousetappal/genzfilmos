import { createServerClient, type CookieOptions } from "@supabase/ssr"
type CK = { name: string; value: string; options: CookieOptions }
import { NextResponse, type NextRequest } from "next/server"
// Only these paths work without signing in. Everything else redirects to /login.
const PUBLIC = ["/login", "/forgot", "/auth/callback"]
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req })
  const s = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => req.cookies.getAll(), setAll: (l: CK[]) => {
      l.forEach(({ name, value }) => req.cookies.set(name, value))
      res = NextResponse.next({ request: req })
      l.forEach(({ name, value, options }) => res.cookies.set(name, value, options)) } } })
  const { data: { user } } = await s.auth.getUser()
  const p = req.nextUrl.pathname
  if (!user) return PUBLIC.some(x => p === x || p.startsWith(x + "/")) ? res : NextResponse.redirect(new URL("/login", req.url))
  // client-portal users never see staff pages
  if (!p.startsWith("/portal") && !p.startsWith("/auth/") && p !== "/reset") {
    const { data: me } = await s.from("profiles").select("role").eq("id", user.id).single()
    if (me?.role === "client") return NextResponse.redirect(new URL("/portal", req.url))
  }
  return res
}
export const config = { matcher: ["/((?!_next|favicon.ico).*)"] }
