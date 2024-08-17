import React from 'react';
import {
  GoogleMap,
  MarkerF,
  Polyline,
  useJsApiLoader,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -1.9577,
  lng: 30.1127, // Kigali's coordinates
};

const GoogleMapsEmbed = React.memo(({ coordinates = [] }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'f147f16e33a7b0e0',
    googleMapsApiKey: 'AIzaSyDJOXNvQcvI8m7BdR5bc4xmDvxE_wly5Sg',
  });

  const onLoad = React.useCallback(
    (map) => {
      if (coordinates.length === 1) {
        map.setCenter(coordinates[0]);
        map.setZoom(14);
      } else if (coordinates.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        coordinates.forEach((point) => bounds.extend(point));
        map.fitBounds(bounds);
      } else {
        map.setCenter(defaultCenter);
        map.setZoom(12);
      }
    },
    [coordinates]
  );

  const singleIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  const startIcon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
  const middleIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  const endIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      options={{ streetViewControl: false }}
    >
      {coordinates.length === 1 ? (
        <MarkerF position={coordinates[0]} icon={singleIcon} />
      ) : coordinates.length > 1 ? (
        <>
          <MarkerF position={coordinates[0]} icon={startIcon} />
          {coordinates.slice(1, -1).map((point, index) => (
            <MarkerF key={index} position={point} icon={middleIcon} />
          ))}
          <MarkerF
            position={coordinates[coordinates.length - 1]}
            icon={endIcon}
          />
          <Polyline
            path={coordinates}
            options={{
              strokeColor: '#0000FF',
              strokeOpacity: 1.0,
              strokeWeight: 2,
            }}
          />
        </>
      ) : null}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
});

export default GoogleMapsEmbed;
