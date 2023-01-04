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
import { Navigate, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

//export default function MallSearch(props) {
export default function MallSearch({
  loginStatusSent,
  userName,
  setSelection,
}) {
  //const loginStatus = loginStatusSent;
  //const currentUser = username;
  const [currentPosition, setCurrentPosition] = useState("");
  const [locationPermissionGiven, setLocationPermissionGiven] = useState("");

  //either sets position to current position, or sets it to a random default and
  useEffect(() => {
    console.log(loginStatusSent);
    console.log(userName);
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
  return <Map center={currentPosition} setMallSelection={setSelection} userName={userName} />;
}

//Gets the closest malls if location is given
//gets malls closest to previous mall if no location was given but user logged in and has used it before
//if neither of the others, shows whole world and lets user type in mall names i guess
const PlacesAutocomplete = ({
  //setSelected,
  userName,
  defaultCenter,
  setMallFinalSelection,
}) => {
  //gets the default bounds
  const center = defaultCenter;
  const navigate = useNavigate();
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
    var results = await getGeocode({ address });

    results[0].mall_name = address;

//
    //Work in progress


    
    let shortAddress =
      results[0].address_components[0].long_name +
      " " +
      results[0].address_components[1].short_name;

    const { lat, lng } = await getLatLng(results[0]);

    let parsedResults = {
      mall_name: address,
      lat: lat,
      lng: lng,
      short_address: shortAddress
    };

    console.log(parsedResults);
    setMallFinalSelection(parsedResults);
//

    //
    navigate("/itemSearch");
  };

  const goToFavoriteMall = () => {

    console.log(userName);
    console.log("\n\nGetFavoriteMallInfo");
    Axios.post("http://localhost:3001/api/getusersfavoritemall", {
      userName,
    }).then((response)=>{

        if (response.data[0]) {
        
        let parsedResults = {
          mall_name: response.data[0].mall_name,
          lat: response.data[0].mall_lat,
          lng: response.data[0].mall_lng,
          short_address: response.data[0].mall_address,
        };

        console.log(parsedResults);
        setMallFinalSelection(parsedResults);

        navigate("/itemSearch");
    }else{
        window.alert("No favorite mall saved.");
    }
    });
  }

  return (
    <div className="row">
      <div className="col-10">
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
      </div>
      <div className="col-2">
        {userName && (
          <Button
            style={{ fontSize: 10 }}
            variant="secondary"
            size="sm"
            onClick={() => {
              goToFavoriteMall();
            }}>
            Go to favorite
          </Button>
        )}
      </div>
    </div>
  );
};

function Map({ center, setMallSelection,userName }) {
  const centerTaken = {
    lat: center.latitude,
    lng: center.longitude,
  };
  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  //const [selected, setSelected] = useState("");

  return (
    <div>
      <div className="places-container row">
        <PlacesAutocomplete
          //setSelected={setSelected}
          defaultCenter={centerTaken}
          setMallFinalSelection={setMallSelection}
          userName={userName}
        />
        
      </div>
      <GoogleMap
        zoom={12}
        center={centerTaken}
        mapContainerClassName="map-container"
        options={options}></GoogleMap>
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
