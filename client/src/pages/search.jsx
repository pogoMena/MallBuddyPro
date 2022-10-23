import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxInput,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

export default function Search1(props) {
  const loginStatus = props.loginStatus;
  const [currentPosition, setCurrentPosition] = useState("");
  const [locationPermissionGiven, setLocationPermissionGiven] = useState("");

  //either sets position to current position, or sets it to a random default and
  useEffect(() => {
    if (navigator.geolocation) {
      //Checks if browser supports location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            //Gets users coordinates
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationPermissionGiven(true); //sets if the user has given location permission
        },
        (error) => {
          //Handles if there was an error getting permission
          console.log(error.message);
          setLocationPermissionGiven(false); //sets if the user hasnt given location permission
        }
      );
    } else {
      //Else statement in case location isnt supported by browser
      console.log("Location not supported by browser");
      setLocationPermissionGiven(false);
    }
  }, []);

  //checks if map is loaded
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAzlS-0bq_gbvdSUpXCHcW_WlsXM2BEo9I",
    libraries: ["places"],
  });

  //If loading, shows loader. if not, displays map
  if (!isLoaded) return <div>Loading...</div>;
  if (currentPosition.longitude == null || !locationPermissionGiven) {
    // waits for location and checks if location permission was given
    return <div>Waiting for location</div>;
  }
  return <Map center={currentPosition} />;
}


//Gets the closest malls if location is given
//gets malls closest to previous mall if no location was given but user logged in and has used it before
//if neither of the others, shows whole world and lets user type in mall names i guess
const PlacesAutocomplete = ({ setSelected, defaultCenter }) => {
    console.log("Default center in autocomplete VVV");
    console.log(defaultCenter);
//gets the default bounds
const center = defaultCenter;
// Create a bounding box with sides ~10km away from the center point
const defaultBounds = {
  north: center.lat + 0.1,
  south: center.lat - 0.1,
  east: center.lng + 0.1,
  west: center.lng - 0.1,
};

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      bounds: defaultBounds,
      types: ["shopping_mall"],
    },
  });

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
    console.log(results);
    
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search for a mall"
      />
      <ComboboxPopover className="combobox-popover">
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

function Map(props) {
  const centerTaken = {
    lat: props.center.latitude,
    lng: props.center.longitude,
  };

  const [selected, setSelected] = useState("");

  return (
    <div>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} defaultCenter={centerTaken}/>
      </div>
      <GoogleMap
        zoom={12}
        center={centerTaken}
        mapContainerClassName="map-container">
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </div>
  );
}
//const PlacesAutocomplete = ({setSelected}) => {
//{selected && <Marker position={centerTaken} />}
//<PlacesAutocomplete setSelected={setSelected}/>
//<ComboboxList>{status === "OK" && data.map(({place_id, description}) => <ComboboxOption key={place_id} value={description}/>)}</ComboboxList>
//<GoogleMap zoom={10} center={centerTaken} mapContainerClassName="map-container"><Marker position={centerTaken} /></GoogleMap>;

/*

*/
