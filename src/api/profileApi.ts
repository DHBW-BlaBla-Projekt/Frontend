import { apiRequest } from './client'

const PROFILE_URL = import.meta.env.VITE_PROFILE_API_URL

export interface Car {
  id: number
  name?: string
  brand: string
  model: string
}

export function getMyCars(token: string) {
  return apiRequest<Car[]>(PROFILE_URL, '/api/profile/cars', {}, token)
}
