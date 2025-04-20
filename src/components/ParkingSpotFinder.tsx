import React, { useState } from 'react'
import { Link } from 'react-router'
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps'
import AutocompleteSuggestion from './AutoCompleteSuggestions'
import {
  IoCompassOutline,
  IoHeartOutline,
  IoLocationOutline,
  IoCallOutline,
  IoTimeOutline,
  IoShareSocialOutline
} from 'react-icons/io5';

interface LatLng {
  lat: number
  lng: number
}

interface ParkingSpot {
  id: number;
  name: string;
  hourlyRate: number;
  rating: number; // out of 5
  imageUrl: string;
  openHours: string;
  location: LatLng;
  filledUp: boolean;
  phone: string;
  street: string;
}

const parkingSpots: ParkingSpot[] = [
  {
    id: 1,
    name: 'Nakawa Oasis',
    hourlyRate: 2.50,
    rating: 4,
    imageUrl: 'https://picsum.photos/id/101/400/300',
    openHours: '6:00 AM - 10:00 PM',
    phone: '256-123-4567',
    street: 'Nakawa Road, Kampala',
    location: { lat: 0.3476, lng: 32.5825 },
    filledUp: false,
  },
  {
    id: 2,
    name: 'Kololo Retreat',
    hourlyRate: 3.00,
    rating: 5,
    imageUrl: 'https://picsum.photos/id/102/400/300',
    openHours: '7:00 AM - 11:00 PM',
    phone: '256-234-5678',
    street: 'Kololo Crescent, Kampala',
    location: { lat: 0.3600, lng: 32.5800 },
    filledUp: false,
  },
  {
    id: 3,
    name: 'Kampala Pinnacle',
    hourlyRate: 2.75,
    rating: 4,
    imageUrl: 'https://picsum.photos/id/103/400/300',
    openHours: '6:30 AM - 10:30 PM',
    phone: '256-345-6789',
    street: 'Central Kampala, Kampala',
    location: { lat: 0.3300, lng: 32.5950 },
    filledUp: false,
  },
  {
    id: 4,
    name: 'Bugolobi Bay',
    hourlyRate: 2.25,
    rating: 3,
    imageUrl: 'https://picsum.photos/id/104/400/300',
    openHours: '7:00 AM - 9:00 PM',
    phone: '256-456-7890',
    street: 'Bugolobi Road, Kampala',
    location: { lat: 0.3400, lng: 32.5700 },
    filledUp: true,
  },
  {
    id: 5,
    name: 'Ggaba Grove',
    hourlyRate: 3.50,
    rating: 5,
    imageUrl: 'https://picsum.photos/id/105/400/300',
    openHours: '6:00 AM - 12:00 AM',
    phone: '256-567-8901',
    street: 'Ggaba Road, Kampala',
    location: { lat: 0.3550, lng: 32.6100 },
    filledUp: false,
  },
  {
    id: 6,
    name: 'Kawala Corner',
    hourlyRate: 2.00,
    rating: 3,
    imageUrl: 'https://picsum.photos/id/106/400/300',
    openHours: '7:00 AM - 8:00 PM',
    phone: '256-678-9012',
    street: 'Kawala Street, Kampala',
    location: { lat: 0.3650, lng: 32.5650 },
    filledUp: false,
  },
  {
    id: 7,
    name: 'Makerere Mile',
    hourlyRate: 3.25,
    rating: 4,
    imageUrl: 'https://picsum.photos/id/107/400/300',
    openHours: '8:00 AM - 10:00 PM',
    phone: '256-789-0123',
    street: 'Makerere Road, Kampala',
    location: { lat: 0.3200, lng: 32.5800 },
    filledUp: true,
  },
  {
    id: 8,
    name: 'Kampala Crest',
    hourlyRate: 2.80,
    rating: 4,
    imageUrl: 'https://picsum.photos/id/108/400/300',
    openHours: '6:00 AM - 11:00 PM',
    phone: '256-890-1234',
    street: 'Kampala Crest, Kampala',
    location: { lat: 0.3500, lng: 32.6000 },
    filledUp: false,
  },
  {
    id: 9,
    name: 'Bwaise Boulevard',
    hourlyRate: 2.30,
    rating: 3,
    imageUrl: 'https://picsum.photos/id/109/400/300',
    openHours: '7:00 AM - 9:00 PM',
    phone: '256-901-2345',
    street: 'Bwaise Lane, Kampala',
    location: { lat: 0.3600, lng: 32.5900 },
    filledUp: false,
  },
  {
    id: 10,
    name: 'Victoria Vista',
    hourlyRate: 3.10,
    rating: 5,
    imageUrl: 'https://picsum.photos/id/110/400/300',
    openHours: '6:00 AM - 10:00 PM',
    phone: '256-012-3456',
    street: 'Victoria Road, Kampala',
    location: { lat: 0.3350, lng: 32.5750 },
    filledUp: false,
  },
];

const defaultCenter: LatLng = parkingSpots[4].location

const ParkingSpots: React.FC = () => {

  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<LatLng | null>(null)
  const [hoveredSpot, setHoveredSpot] = useState<ParkingSpot | null>(null)

  const handleSelect = (place: google.maps.places.Place) => {
    const { location } = place;
    if (!location) return;
    const latLng = {
      lat: location.lat(),
      lng: location.lng(),
    }
    setSelectedPlace(latLng)

    let closest: ParkingSpot | null = null
    let minDistance = Infinity
    parkingSpots.forEach(spot => {
      console.log("Spot: ", spot);
      if (!spot.filledUp) {
        const dx = latLng.lat - spot.location.lat
        const dy = latLng.lng - spot.location.lng
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < minDistance) {
          minDistance = distance
          closest = spot
        }
      }
    })
    setSelectedSpot(closest);
  }

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="max-w-full mx-auto">
        <div className="mb-4 fixed w-1/2 top-10 left-1/2 transform -translate-x-1/2 z-10">
          <AutocompleteSuggestion onPlaceSelect={(place) => handleSelect(place)} />


          {selectedPlace && !selectedSpot && (
            <div className="mt-4 p-4 bg-red-100 rounded text-sm">
              <p>No available parking spots found near this location.</p>
            </div>
          )}
        </div>

        <Map defaultCenter={defaultCenter} defaultZoom={13} style={{ height: '100vh', width: '100vw' }}>
          {parkingSpots.map(spot => (
            <Marker
              key={spot.id}
              position={spot.location}
              onClick={() => {
                if (spot.id == hoveredSpot?.id) return;
                setHoveredSpot(spot)
              }
              }
            />
          ))}

          {hoveredSpot && (
            <InfoWindow position={hoveredSpot.location}>
              <div>
                <h3 className="font-bold">{hoveredSpot.name}</h3>
                <p>
                  {hoveredSpot.location.lat.toFixed(6)},{' '}
                  {hoveredSpot.location.lng.toFixed(6)}
                </p>
                <p>Status: {hoveredSpot.filledUp ? 'Filled Up' : 'Available'}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
      {selectedPlace && selectedSpot && (
        <ParkingSpotDetail
          spot={selectedSpot}
          onClose={() => {
            setSelectedSpot(null)
            setSelectedPlace(null)
          }}
        />
      )}
    </APIProvider>
  )
}

export default ParkingSpots;

interface ParkingSpotDetailProps {
  spot: ParkingSpot;
  onClose: () => void;
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-500 inline-block"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.956a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.956c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.956a1 1 0 00-.364-1.118L2.07 9.383c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.956z" />
        </svg>
      );
    } else {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-300 inline-block"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.956a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.956c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.956a1 1 0 00-.364-1.118L2.07 9.383c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.956z" />
        </svg>
      );
    }
  }
  return stars;
};

const ParkingSpotDetail: React.FC<ParkingSpotDetailProps> = ({ spot, onClose }) => {
  return (
    <div className="fixed top-0 right-0  z-50">
      {/* Modal container */}
      <div className="relative flex flex-col bg-white shadow-lg max-w-md min-w-sm w-full h-[100vh] z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div>
          <img
            src={spot.imageUrl}
            alt={spot.name}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{spot.name}</h2>
            <p className="text-gray-700">${spot.hourlyRate.toFixed(2)} / hour</p>
          </div>
          <div className="mb-4">
            <div>{renderStars(spot.rating)}</div>
          </div>
          <div className="mb-4 flex justify-around border-t border-gray-200 pt-4">
            <button className="flex flex-col items-center text-green-500 hover:text-green-600 focus:outline-none cursor-pointer">
              <IoCompassOutline size="32" />
              <span className="text-xs"><Link to={`/directions?destination=${spot.location.lat},${spot.location.lng}`}>Get Directions</Link></span>
            </button>
            <button className="flex flex-col items-center text-green-500 hover:text-green-600 focus:outline-none cursor-pointer">
              <IoHeartOutline size="32" />
              <span className="text-xs">Favorites</span>
            </button>
            <button className="flex flex-col items-center text-green-500 hover:text-green-600 focus:outline-none cursor-pointer">
              <IoShareSocialOutline size="32" />
              <span className="text-xs">Send to Phone</span>
            </button>
          </div>

          <div className="mb-4 border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 flex items-center mb-3">
              <IoTimeOutline size="24" />
              <span className="ms-2">{spot.openHours}</span>
            </p>
            <p className="text-xs text-gray-500 flex items-center mb-3">
              <IoCallOutline size="24" />
              <span className="ms-2">{spot.phone}</span>
            </p>
            <p className="text-xs text-gray-500 flex items-center">
              <IoLocationOutline size="24" />
              <span className="ms-2">{spot.street}</span>
            </p>
          </div>
        </div>
        {/* Call-to-action button */}
        <div className="my-auto p-4">
          <button className="w-full py-2 bg-green-500 text-white rounded-full hover:bg-greeb-600 transition focus:outline-none">
            Book Now
          </button>
        </div>

      </div>
    </div>
  );
};

