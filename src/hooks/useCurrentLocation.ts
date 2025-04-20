import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface GeolocationResponse {
  location: { lat: number; lng: number };
  accuracy: number;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const useCurrentLocation = (pollInterval: number = 3000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Optionally include any parameters. Here, we're using IP-based geolocation
        body: JSON.stringify({ considerIp: "true" })
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data: GeolocationResponse = await response.json();
      setLocation({
        lat: data.location.lat,
        lng: data.location.lng,
        accuracy: data.accuracy
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();

    const intervalId = setInterval(fetchCurrentLocation, pollInterval);
    return () => clearInterval(intervalId);
  }, [pollInterval]);

  return { isLoading, location, error };
};