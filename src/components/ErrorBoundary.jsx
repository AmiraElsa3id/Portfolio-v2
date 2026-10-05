import { Component } from 'react'

/**
 * Minimal error boundary for decorative subtrees (e.g. canvas/WebGL effects).
 *
 * A failure inside a decorative effect must never unmount the whole app, which
 * is what React does with uncaught errors in render/effects. Boundary state
 * only flips once, so steady-state rendering adds no overhead.
 */
class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info)
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}

export default ErrorBoundary
