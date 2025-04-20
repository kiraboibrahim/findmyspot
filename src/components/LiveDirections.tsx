import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap
} from '@vis.gl/react-google-maps';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { toast } from 'react-toastify';

function parseDestinationParam(param: string) {
  const parts = param.split(',');
  if (parts.length !== 2) return null;
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  return !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null;
}

function LiveDirections() {
  const [searchParams] = useSearchParams();
  const { isLoading, location: currentLocation } = useCurrentLocation();
  if (!isLoading && !currentLocation) {
    toast.error('Unable to get current location');
    return;
  }
  const destParam = searchParams.get('destination');
  const destination = parseDestinationParam(destParam || '');
  if (!destination) {
    toast.error('Invalid destination parameter');
    return;
  }
  const { lat, lng } = destination;
  return currentLocation ? (<div className="screen-full">
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={{ lat: currentLocation?.lat, lng: currentLocation.lng }}
        defaultZoom={12}
        gestureHandling={'greedy'}
        fullscreenControl={false}
        style={{ height: 500, width: '100%' }}
      >
        <Directions from={currentLocation} to={{ lat, lng }} />
      </Map>
    </APIProvider >
  </div >) : <></>
}

function Directions({ from, to }: { from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  // Initialize directions service and renderer once the map and routes library are available
  useEffect(() => {
    if (map && routesLibrary) {
      if (!directionsService) {
        setDirectionsService(new window.google.maps.DirectionsService());
      }
      if (!directionsRenderer) {
        const renderer = new window.google.maps.DirectionsRenderer();
        setDirectionsRenderer(renderer);
        renderer.setMap(map);
      }
    }
  }, [map, routesLibrary, directionsService, directionsRenderer]);

  // Update directions when currentLocation or destination changes (live tracking)
  useEffect(() => {
    if (directionsService && directionsRenderer && from && to) {
      directionsService
        .route({
          origin: from,
          destination: to,
          travelMode: window.google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
        })
        .then(response => {
          directionsRenderer.setDirections(response);
          setRoutes(response.routes);
          setRouteIndex(0);
        })
        .catch(error => {
          console.error('Error fetching directions:', error);
        });
    }
  }, [directionsService, directionsRenderer, from, to]);

  if (!leg) return null;

  return (
    <RouteSummary
      startAddress={leg.start_address.split(',')[0]}
      endAddress={leg.end_address.split(',')[0]}
      distance={leg.distance?.text} duration={leg.duration?.text} />
  );
}

export default LiveDirections;

function RouteSummary({ startAddress, endAddress, distance, duration }: { startAddress: string, endAddress: string, distance?: string, duration?: string }) {
  return (
    <div className="flex flex-col p-4 bg-white shadow-md rounded-md">
      <div className="flex items-center">
        <span>{duration}({distance})</span>
      </div>
      <div>
        <span>{startAddress} to {endAddress}</span>
      </div>
    </div>
  );
}