import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getProfileCars, type ProfileCar } from '../api/profileApi'
import { useAuth } from '../context/useAuth'

export function ProfilePage() {
  const { auth } = useAuth()
  const location = useLocation()
  const [cars, setCars] = useState<ProfileCar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const notice = typeof location.state === 'object'
    && location.state !== null
    && 'notice' in location.state
    && typeof location.state.notice === 'string'
    ? location.state.notice
    : ''

  useEffect(() => {
    if (!auth) return
    let active = true
    getProfileCars(auth.accessToken)
      .then((result) => {
        if (active) setCars(result)
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Deine Fahrzeuge konnten nicht geladen werden.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [auth, reloadKey])

  function retryLoadingCars() {
    setError('')
    setLoading(true)
    setReloadKey((current) => current + 1)
  }

  return (
    <main className="app-shell page">
      <section aria-labelledby="profile-cars">
        {notice ? <p className="success-message" role="status">{notice}</p> : null}
        <div className="profile-heading">
          <div>
            <span className="eyebrow">Dein Profil</span>
            <h1 id="profile-cars">Meine Fahrzeuge</h1>
          </div>
          <Link className="button" to="/profile/cars/new">Fahrzeug hinzufügen</Link>
        </div>

        {loading ? <p className="empty-state">Fahrzeuge werden geladen ...</p> : null}
        {error ? (
          <div>
            <p className="error-message" role="alert">Fehler: {error}</p>
            <button type="button" className="secondary-button" onClick={retryLoadingCars}>Erneut versuchen</button>
          </div>
        ) : null}
        {!loading && !error && cars.length === 0 ? (
          <p className="empty-state">Du hast noch kein Fahrzeug hinzugefügt.</p>
        ) : null}

        <div className="ride-grid">
          {cars.map((car) => (
            <article className="card vehicle-card" key={car.id}>
              <span className="eyebrow">{car.fuelType}</span>
              <h2>{car.name || `${car.brand} ${car.model}`}</h2>
              <div className="ride-meta">
                <p><strong>Marke:</strong> {car.brand}</p>
                <p><strong>Modell:</strong> {car.model}</p>
                <p><strong>Verbrauch:</strong> {car.averageConsumptionLPer100km} l/100 km</p>
                {car.licensePlate ? <p><strong>Kennzeichen:</strong> {car.licensePlate}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
