import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function Navbar() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link className="brand" to="/">BlaBla</Link>
        <nav aria-label="Hauptnavigation">
          <NavLink to="/">Fahrten</NavLink>
          {auth ? <NavLink to="/rides/new">Fahrt anbieten</NavLink> : null}
          {auth ? (
            <button className="link-button" onClick={handleLogout} type="button">Abmelden</button>
          ) : (
            <NavLink className="nav-cta" to="/login">Anmelden</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
