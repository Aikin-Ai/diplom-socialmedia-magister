import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession()

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // // if user is not signed in and the current path is not /login redirect the user to /login
  // if (!user && req.nextUrl.pathname !== '/login') {
  //   return NextResponse.redirect(new URL('/login', req.url))
  // }

  return res
}

// export const config = {
//   matcher: ['/', '/login', '/account', '/auth/callback', '/auth/sign-up', '/auth/sign-in', '/auth/sign-out'],
// }