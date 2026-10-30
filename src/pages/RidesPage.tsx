import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createBooking, getMyBookings } from '../api/bookingApi'
import { getAvailableRides, type Ride } from '../api/rideApi'
import { useAuth } from '../context/useAuth'

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function RidesPage() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [rides, setRides] = useState<Ride[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [bookingRideId, setBookingRideId] = useState<number | null>(null)
  const [bookedRideIds, setBookedRideIds] = useState<Set<number>>(new Set())
  const [now] = useState(() => Date.now())
  const [filter, setFilter] = useState('')

  async function loadRides() {
    try {
      const nextRides = await getAvailableRides()
      setRides(nextRides)
      setError('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Fahrten konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadRides()
  }, [])

  useEffect(() => {
    if (!auth) {
      setBookedRideIds(new Set())
      return
    }

    void getMyBookings(auth.accessToken)
      .then((bookings) => setBookedRideIds(new Set(
        bookings
          .filter((booking) => booking.status === 'CONFIRMED')
          .map((booking) => booking.rideId),
      )))
      .catch(() => {
        setBookedRideIds(new Set())
      })
  }, [auth])

  async function handleBookRide(ride: Ride) {
    if (!auth) {
      navigate('/login')
      return
    }

    if (ride.driverUsername.localeCompare(auth.username, undefined, { sensitivity: 'accent' }) === 0) {
      setError('Du kannst deine eigene Fahrt nicht buchen.')
      return
    }

    if (ride.availableSeats <= 0) {
      setError('Für diese Mitfahrt sind keine Plätze mehr verfügbar.')
      return
    }

    setBookingRideId(ride.id)
    setError('')

    try {
      await createBooking(ride.id, auth.accessToken)
      setBookedRideIds((current) => new Set(current).add(ride.id))
      await loadRides()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Die Buchung konnte nicht erstellt werden.')
    } finally {
      setBookingRideId(null)
    }
  }

  const activeRides = rides.filter((ride) => new Date(ride.departureTime).getTime() > now)
  const normalizedFilter = filter.trim().toLocaleLowerCase('de-DE')
  const filteredRides = activeRides.filter((ride) => {
    if (!normalizedFilter) return true
    return `${ride.startLocation} ${ride.endLocation}`.toLocaleLowerCase('de-DE').includes(normalizedFilter)
  })

  return (
    <main className="app-shell page">
      <section className="hero">
        <span className="eyebrow">Gemeinsam unterwegs</span>
        <h1>Deine nächste Fahrt beginnt hier.</h1>
        <p className="lead">Finde freie Plätze, teile deine Route und mach deinen Weg ein bisschen einfacher.</p>
      </section>
      <section aria-labelledby="available-rides">
        <h2 id="available-rides">Verfügbare Fahrten</h2>
        <label htmlFor="ride-filter">
          Fahrten filtern
          <input
            id="ride-filter"
            type="search"
            value={filter}
            placeholder="Start oder Ziel"
            onChange={(event) => setFilter(event.target.value)}
          />
        </label>
        {loading ? <p className="empty-state">Fahrten werden geladen ...</p> : null}
        {error ? <p className="error-message" role="alert">Fehler: {error}</p> : null}
        {!loading && !error && filteredRides.length === 0 ? <p className="empty-state">Keine passenden Fahrten gefunden.</p> : null}
        <div className="ride-grid">
          {filteredRides.map((ride) => (
            <article className="card" key={ride.id}>
              <span className="eyebrow">{ride.status}</span>
              <div className="route">
                <strong>{ride.startLocation}</strong><span aria-hidden="true">→</span><strong>{ride.endLocation}</strong>
              </div>
              <div className="ride-meta">
                <p>{dateFormatter.format(new Date(ride.departureTime))}</p>
                <p>{ride.availableSeats} freie Plätze · Fahrer: {ride.driverUsername}</p>
              </div>

              <div className="ride-actions">
                {auth ? (
                  ride.driverUsername.localeCompare(auth.username, undefined, { sensitivity: 'accent' }) === 0 ? (
                    <span className="ride-badge">Deine Fahrt</span>
                  ) : bookedRideIds.has(ride.id) ? (
                    <span className="ride-badge">Bereits gebucht</span>
                  ) : (
                    <button type="button" disabled={bookingRideId === ride.id} onClick={() => void handleBookRide(ride)}>
                      {bookingRideId === ride.id ? 'Buchung...' : 'Fahrt buchen'}
                    </button>
                  )
                ) : (
                  <Link className="button button-secondary" to="/login">Zum Buchen anmelden</Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
