import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

//Custom pin in MOVR Lime color - avoids default-marker-icon bug that can appear betwen leaflet and Vite
const limeIcon = L.divIcon({
    className: '',
    html: `<div style="
    width: 18px; height: 18px; border-radius: 50%;
    background: #a3e635; border: 3px solid black;
    box-shadow: 0 0 0 2px #a3e635;
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

interface EventLocationMapProps {
    lat: number;
    lng: number;
    label: string;
}

export function EventLocationMap({ lat, lng, label}: EventLocationMapProps) {
    return (
        <MapContainer
          center={[ lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%'}}
          >
            <TileLayer
            // CARTO dark tiles — free, no key, matches your black theme
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
             />
                <Marker position={[lat, lng]} icon={limeIcon}>
                    <Popup>{label}</Popup>
                </Marker>
          </MapContainer>
    );
}