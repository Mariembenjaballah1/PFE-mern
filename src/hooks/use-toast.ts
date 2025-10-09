
import * as React from "react"
import { State, Toast } from './toast/types'
import { toast, listeners, memoryState, dispatch } from './toast/toast-api'

// Define the enhanced toast function type with Sonner-compatible signatures
interface ToastFunction {
  (titleOrProps: string | Toast, options?: { description?: string; [key: string]: any }): { id: string; dismiss: () => void; update: (props: Partial<Toast>) => void }
  success: (titleOrProps: string | Omit<Toast, "variant">, options?: { description?: string; [key: string]: any }) => { id: string; dismiss: () => void; update: (props: Partial<Toast>) => void }
  error: (titleOrProps: string | Omit<Toast, "variant">, options?: { description?: string; [key: string]: any }) => { id: string; dismiss: () => void; update: (props: Partial<Toast>) => void }
  warning: (titleOrProps: string | Omit<Toast, "variant">, options?: { description?: string; [key: string]: any }) => { id: string; dismiss: () => void; update: (props: Partial<Toast>) => void }
  info: (titleOrProps: string | Omit<Toast, "variant">, options?: { description?: string; [key: string]: any }) => { id: string; dismiss: () => void; update: (props: Partial<Toast>) => void }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast: toast as ToastFunction,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
