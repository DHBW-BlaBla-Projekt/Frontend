import { apiRequest } from './client'

const RIDE_URL = import.meta.env.VITE_RIDE_API_URL

export interface Ride {
  id: number
  driverUsername: string
  startLocation: string
  endLocation: string
  departureTime: string
  availableSeats: number
  status: string
}

export function getAvailableRides() {
  return apiRequest<Ride[]>(RIDE_URL, '/api/rides/public/available')
}

export function createRide(
  request: {
    startLocation: string
    endLocation: string
    departureTime: string
    availableSeats: number
  },
  token: string,
) {
  return apiRequest<Ride>(RIDE_URL, '/api/rides', {
    method: 'POST',
    body: JSON.stringify(request),
  }, token)
}
