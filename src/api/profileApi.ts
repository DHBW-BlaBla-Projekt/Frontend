import { apiRequest } from './client'

const PROFILE_URL = import.meta.env.VITE_PROFILE_API_URL

export interface VehicleMenuItem {
  value: string
  text: string
}

export interface VehicleOption {
  vehicleId: number
  label: string
}

export interface VehicleDetails {
  vehicleId: number
  year: number | null
  make: string
  model: string
  cityMpg: number | null
  highwayMpg: number | null
  combinedMpg: number | null
  consumptionLPer100Km: number | null
  fuelType: string
}

export interface ProfileCar {
  id: number
  name: string | null
  brand: string
  model: string
  licensePlate: string | null
  averageConsumptionLPer100km: number
  fuelType: string
}

export interface CreateCarRequest {
  brand: string
  model: string
  averageConsumptionLPer100km: number
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID'
  name?: string
  licensePlate?: string
}

export function getVehicleYears() {
  return apiRequest<VehicleMenuItem[]>(PROFILE_URL, '/api/vehicle-data/years')
}

export function getVehicleMakes(year: string) {
  const query = new URLSearchParams({ year })
  return apiRequest<VehicleMenuItem[]>(PROFILE_URL, `/api/vehicle-data/makes?${query}`)
}

export function getVehicleModels(year: string, make: string) {
  const query = new URLSearchParams({ year, make })
  return apiRequest<VehicleMenuItem[]>(PROFILE_URL, `/api/vehicle-data/models?${query}`)
}

export function getVehicleOptions(year: string, make: string, model: string) {
  const query = new URLSearchParams({ year, make, model })
  return apiRequest<VehicleOption[]>(PROFILE_URL, `/api/vehicle-data/options?${query}`)
}

export function getVehicleDetails(vehicleId: number) {
  return apiRequest<VehicleDetails>(PROFILE_URL, `/api/vehicle-data/${vehicleId}`)
}

export function getProfileCars(token: string) {
  return apiRequest<ProfileCar[]>(PROFILE_URL, '/api/profile/cars', {}, token)
}

export function createProfileCar(request: CreateCarRequest, token: string) {
  return apiRequest<ProfileCar>(PROFILE_URL, '/api/profile/cars', {
    method: 'POST',
    body: JSON.stringify(request),
  }, token)
}
