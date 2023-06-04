import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Pantanos from '../assets/Pantanos';
import 'leaflet/dist/leaflet.css';

const Mapa = ({handlerOpen, block}) => {

  return (
      <MapContainer  style={{ width: "100%", height: "100%"}} center={[36.72184282369917,  -4.418403224132213]} zoom={8} scrollWheelZoom={true} maxZoom={10} minZoom={6}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="/Mapa/{z}/{x}/{y}.png"
          errorTileUrl='/Mapa/MissingTile.png'
          eventHandlers={{error: ()=>{}}}
          
        />
        {Pantanos.map((pantano) => 
          <Marker key={pantano.Nombre} position={[pantano.Latitud, pantano.Longitud]} 
            eventHandlers={{click: () =>{if(!block){handlerOpen({name: pantano.Nombre})}},
            mouseover: (event) => event.target.openPopup(),
            mouseout: (event) =>event.target.closePopup()}}>
          <Popup>
            {pantano.Nombre}
          </Popup>
        </Marker>
        )}
      </MapContainer>
  )
}

export default Mapa;
