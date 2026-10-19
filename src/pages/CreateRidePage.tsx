import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRide } from '../api/rideApi'
import { useAuth } from '../context/useAuth'

export function CreateRidePage() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ startLocation: '', endLocation: '', departureTime: '', availableSeats: '1' })

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) return
    setError('')
    setSubmitting(true)
    try {
      await createRide({ ...form, availableSeats: Number(form.availableSeats) }, auth.accessToken)
      navigate('/')
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Fahrt konnte nicht erstellt werden.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="app-shell page">
      <section className="form-card">
        <span className="eyebrow">Neue Route</span>
        <h1>Fahrt anbieten</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label>Start<input required value={form.startLocation} onChange={(event) => update('startLocation', event.target.value)} /></label>
          <label>Ziel<input required value={form.endLocation} onChange={(event) => update('endLocation', event.target.value)} /></label>
          <label>Abfahrt<input required type="datetime-local" value={form.departureTime} onChange={(event) => update('departureTime', event.target.value)} /></label>
          <label>Freie Plätze<input required min="1" type="number" value={form.availableSeats} onChange={(event) => update('availableSeats', event.target.value)} /></label>
          {error ? <p className="error-message" role="alert">{error}</p> : null}
          <button disabled={submitting} type="submit">{submitting ? 'Wird veröffentlicht ...' : 'Fahrt veröffentlichen'}</button>
        </form>
      </section>
    </main>
  )
}
