"use client"

import { useState, useEffect, useCallback } from 'react'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error'
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] })

  const toast = useCallback(({
    title,
    description,
    variant = 'default',
    duration = 5000
  }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, title, description, variant, duration }
    
    setState((state) => ({
      toasts: [...state.toasts, newToast]
    }))

    setTimeout(() => {
      setState((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, duration)
  }, [])

  const dismiss = useCallback((id: string) => {
    setState((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss
  }
}
