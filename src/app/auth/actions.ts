'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
  const origin = (await headers()).get('origin')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const city = formData.get('city') as string
  const role = formData.get('role') as string
  
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          city,
          role,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Signup error (supabase):', error)
      return { error: error.message || 'Signup failed' }
    }

    return { success: 'Check your email to continue sign in process' }
  } catch (err: any) {
    console.error('Unexpected signup error:', err?.message ?? err)
    return { error: 'An unexpected error occurred while creating your account. Check server logs.' }
  }
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

export async function resetPassword(prevState: any, formData: FormData) {
  const origin = (await headers()).get('origin')
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/profile/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Password reset link sent to your email' }
}
