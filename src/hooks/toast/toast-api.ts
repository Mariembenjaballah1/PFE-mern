
import * as React from "react"
import { State, ToasterToast, Toast, Action } from './types'

let count = 0

const memoryState: State = {
  toasts: [],
}

const listeners: Array<(state: State) => void> = []

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

function dispatch(action: Action) {
  switch (action.type) {
    case "ADD_TOAST":
      memoryState.toasts = [action.toast, ...memoryState.toasts]
      break

    case "UPDATE_TOAST":
      memoryState.toasts = memoryState.toasts.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      )
      break

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        memoryState.toasts = memoryState.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        )
      } else {
        memoryState.toasts.forEach((toast) => {
          toast.open = false
        })
      }

      break
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        memoryState.toasts = []
      } else {
        memoryState.toasts = memoryState.toasts.filter((t) => t.id !== action.toastId)
      }
      break
  }

  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Helper function to normalize toast parameters (supports both string and object inputs)
function normalizeToastProps(
  titleOrProps: string | Toast, 
  options?: { description?: string; [key: string]: any }
): Toast {
  if (typeof titleOrProps === 'string') {
    return {
      title: titleOrProps,
      description: options?.description,
      ...options
    }
  }
  return titleOrProps
}

function toast(titleOrProps: string | Toast, options?: { description?: string; [key: string]: any }) {
  const props = normalizeToastProps(titleOrProps, options)
  const id = genId()

  const update = (props: Partial<ToasterToast>) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    } as ToasterToast,
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

// Add variant methods to the toast function with Sonner-compatible signatures
toast.success = (titleOrProps: string | Omit<Toast, "variant">, options?: { description?: string; [key: string]: any }) => {
  const props = normalizeToastProps(titleOrProps as any, options)
  return toast({ ...props, variant: "success" })
}

toast.error = (titleOrProps: string | Omit<Toast, "variant">, options?: { description?: string; [key: string]: any }) => {
  const props = normalizeToastProps(titleOrProps as any, options)
  return toast({ ...props, variant: "destructive" })
}

toast.warning = (titleOrProps: string | Omit<Toast, "variant">, options?: { description?: string; [key: string]: any }) => {
  const props = normalizeToastProps(titleOrProps as any, options)
  return toast({ ...props, variant: "warning" })
}

toast.info = (titleOrProps: string | Omit<Toast, "variant">, options?: { description?: string; [key: string]: any }) => {
  const props = normalizeToastProps(titleOrProps as any, options)
  return toast({ ...props, variant: "info" })
}

export { listeners, memoryState, dispatch, toast }
