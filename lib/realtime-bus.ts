type Listener = (event: any) => void

const listeners = new Set<Listener>()

export function emit(event: any) {
  for (const l of Array.from(listeners)) {
    try {
      l(event)
    } catch {}
  }
}

export function on(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
