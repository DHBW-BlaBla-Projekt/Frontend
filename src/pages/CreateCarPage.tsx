import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCar } from '../api/profileApi'
import { useAuth } from '../context/useAuth'

export function CreateCarPage() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    brand: '',
    model: '',
    licensePlate: '',
    averageConsumptionLPer100km: '',
    fuelType: 'PETROL' as const,
  })

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth) return

    setError('')
    setSubmitting(true)
    try {
      await createCar({
        ...form,
        averageConsumptionLPer100km: Number(form.averageConsumptionLPer100km),
        name: form.name || undefined,
        licensePlate: form.licensePlate || undefined,
      }, auth.accessToken)
      navigate('/cars/new')
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Fahrzeug konnte nicht erstellt werden.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="app-shell page">
      <section className="form-card">
        <span className="eyebrow">Mein Fahrzeug</span>
        <h1>Fahrzeug erstellen</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Bezeichnung (optional)
            <input value={form.name} onChange={(event) => update('name', event.target.value)} />
          </label>

          <label>
            Marke
            <input required value={form.brand} onChange={(event) => update('brand', event.target.value)} />
          </label>

          <label>
            Modell
            <input required value={form.model} onChange={(event) => update('model', event.target.value)} />
          </label>

          <label>
            Kennzeichen (optional)
            <input value={form.licensePlate} onChange={(event) => update('licensePlate', event.target.value)} />
          </label>

          <label>
            Verbrauch (l/100 km)
            <input
              required
              min="0"
              step="0.1"
              type="number"
              value={form.averageConsumptionLPer100km}
              onChange={(event) => update('averageConsumptionLPer100km', event.target.value)}
            />
          </label>

          <label>
            Treibstoffart
            <select value={form.fuelType} onChange={(event) => update('fuelType', event.target.value)}>
              <option value="PETROL">Benzin</option>
              <option value="DIESEL">Diesel</option>
              <option value="ELECTRIC">Elektro</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </label>

          {error ? <p className="error-message" role="alert">{error}</p> : null}
          <button disabled={submitting} type="submit">
            {submitting ? 'Wird erstellt ...' : 'Fahrzeug erstellen'}
          </button>
        </form>
      </section>
    </main>
  )
}
