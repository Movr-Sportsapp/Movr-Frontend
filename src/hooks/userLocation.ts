import { useState, useCallback } from 'react';

export default function UserLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading ] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => { 
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  const setLocationManually = useCallback((lat: number, lng: number) => {
    setLocation({ lat, lng});
    setError(null);
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
  }, []);

  return { location, error, loading, requestLocation, clearLocation, setLocationManually };
};