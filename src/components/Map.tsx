'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon missing in Leaflet with Webpack/Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png'
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface MapProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    id: string
    position: [number, number]
    title: string
    description?: string
  }>
  className?: string
  onLocationSelect?: (lat: number, lng: number) => void
}

function LocationMarker({ onSelect }: { onSelect?: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
      if (onSelect) onSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return position === null ? null : (
    <Marker position={position} icon={defaultIcon}>
      <Popup>Selected Location</Popup>
    </Marker>
  )
}

export default function Map({ 
  center = [30.3753, 69.3451], // Default center of Pakistan
  zoom = 5, 
  markers = [],
  className = "h-[400px] w-full rounded-xl overflow-hidden z-0",
  onLocationSelect
}: MapProps) {

  return (
    <div className={className}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={marker.position}
            icon={defaultIcon}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-sm mb-1">{marker.title}</h3>
                {marker.description && <p className="text-xs text-slate-600 m-0">{marker.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
        {onLocationSelect && <LocationMarker onSelect={onLocationSelect} />}
      </MapContainer>
    </div>
  )
}
