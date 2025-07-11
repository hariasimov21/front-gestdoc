'use client'

import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Skeleton } from '@/components/ui/skeleton';
import { PropertyColumn } from './columns';

interface PropertiesMapProps {
    properties: PropertyColumn[];
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

// A default center, in case there are no properties.
const defaultCenter = {
  lat: -33.448890,
  lng: -70.669265
};


export const PropertiesMap: React.FC<PropertiesMapProps> = ({ properties }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [selectedProperty, setSelectedProperty] = useState<PropertyColumn | null>(null);

  const onMarkerClick = (property: PropertyColumn) => {
    setSelectedProperty(property);
  };

  const onInfoWindowClose = () => {
    setSelectedProperty(null);
  };

  const mapCenter = useMemo(() => {
    if (properties.length > 0) {
      const lat = parseFloat(properties[0].latitud);
      const lng = parseFloat(properties[0].longitud);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    return defaultCenter;
  }, [properties]);


  if (loadError) {
    return <div>Error al cargar el mapa. Asegúrate de que la clave de API de Google Maps sea correcta.</div>;
  }

  if (!isLoaded) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={properties.length > 0 ? 12 : 8}
    >
      {properties.map((property) => {
        const lat = parseFloat(property.latitud);
        const lng = parseFloat(property.longitud);

        if (isNaN(lat) || isNaN(lng)) return null;

        return (
             <Marker
                key={property.id_propiedad}
                position={{ lat, lng }}
                onClick={() => onMarkerClick(property)}
             />
        )
      })}
    
      {selectedProperty && (
        <InfoWindow
          position={{ lat: parseFloat(selectedProperty.latitud), lng: parseFloat(selectedProperty.longitud) }}
          onCloseClick={onInfoWindowClose}
        >
          <div>
            <h3 className="font-bold">{selectedProperty.direccion}</h3>
            <p>{selectedProperty.descripcion}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};
