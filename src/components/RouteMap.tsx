import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface RouteMapProps {
  geometry: string
  start: [number, number]
  end: [number, number]
}

export function RouteMap({ geometry, start, end }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let parsedGeometry: GeoJSON.Geometry
    try {
      parsedGeometry = JSON.parse(geometry) as GeoJSON.Geometry
    } catch {
      return
    }

    const map = L.map(containerRef.current)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    const route = L.geoJSON(parsedGeometry as GeoJSON.GeoJsonObject, {
      style: { color: '#ea580c', weight: 5 },
    }).addTo(map)
    L.circleMarker(start, { color: '#166534', fillColor: '#22c55e', fillOpacity: 1, radius: 7 }).addTo(map)
    L.circleMarker(end, { color: '#991b1b', fillColor: '#ef4444', fillOpacity: 1, radius: 7 }).addTo(map)
    map.fitBounds(route.getBounds(), { padding: [20, 20] })

    return () => {
      map.remove()
    }
  }, [geometry, start, end])

  return <div className="route-map" ref={containerRef} aria-label="Karte der Fahrstrecke" />
}
