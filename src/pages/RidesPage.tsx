import { useEffect, useState } from 'react'
import { getAvailableRides, type Ride } from '../api/rideApi'

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAvailableRides()
      .then(setRides)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Fahrten konnten nicht geladen werden.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="app-shell page">
      <section className="hero">
        <span className="eyebrow">Gemeinsam unterwegs</span>
        <h1>Deine nächste Fahrt beginnt hier.</h1>
        <p className="lead">Finde freie Plätze, teile deine Route und mach deinen Weg ein bisschen einfacher.</p>
      </section>
      <section aria-labelledby="available-rides">
        <h2 id="available-rides">Verfügbare Fahrten</h2>
        {loading ? <p className="empty-state">Fahrten werden geladen ...</p> : null}
        {error ? <p className="error-message" role="alert">Fehler: {error}</p> : null}
        {!loading && !error && rides.length === 0 ? <p className="empty-state">Aktuell sind keine Fahrten verfügbar.</p> : null}
        <div className="ride-grid">
          {rides.map((ride) => (
            <article className="card" key={ride.id}>
              <span className="eyebrow">{ride.status}</span>
              <div className="route">
                <strong>{ride.startLocation}</strong><span aria-hidden="true">→</span><strong>{ride.endLocation}</strong>
              </div>
              <div className="ride-meta">
                <p>{dateFormatter.format(new Date(ride.departureTime))}</p>
                <p>{ride.availableSeats} freie Plätze · Fahrer: {ride.driverUsername}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
