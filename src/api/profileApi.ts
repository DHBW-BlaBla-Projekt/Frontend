import { apiRequest } from './client'

const PROFILE_URL = import.meta.env.VITE_PROFILE_API_URL

export interface Car {
  id: number
  name?: string
  brand: string
  model: string
}

export interface CreateCarRequest {
  name?: string
  brand: string
  model: string
  licensePlate?: string
  averageConsumptionLPer100km: number
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID'
}

export function getMyCars(token: string) {
  return apiRequest<Car[]>(PROFILE_URL, '/api/profile/cars', {}, token)
}

export function createCar(request: CreateCarRequest, token: string) {
  return apiRequest<Car>(PROFILE_URL, '/api/profile/cars', {
    method: 'POST',
    body: JSON.stringify(request),
  }, token)
}
