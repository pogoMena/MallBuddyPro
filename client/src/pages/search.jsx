import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

export default function Search1(props) {
  const loginStatus = props.loginStatus;
  const [currentPosition, setCurrentPosition] = useState("");
  const [locationPermissionGiven, setLocationPermissionGiven] = useState("");

  //either sets position to current position, or sets it to a random default and 
  useEffect(() => {
    if (navigator.geolocation) {//Checks if browser supports location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({ //Gets users coordinates
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationPermissionGiven(true); //sets if the user has given location permission
        },
        (error) => {//Handles if there was an error getting permission
          console.log(error.message);
          setLocationPermissionGiven(false); //sets if the user hasnt given location permission
        }
      );
    } else {//Else statement in case location isnt supported by browser
      console.log("Location not supported by browser");
      setLocationPermissionGiven(false);
    }
  },[]);

  //checks if map is loaded
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAzlS-0bq_gbvdSUpXCHcW_WlsXM2BEo9I",
  });

  //If loading, shows loader. if not, displays map
  if (!isLoaded) return <div>Loading...</div>;
  if (currentPosition.longitude == null || !locationPermissionGiven){ // waits for location and checks if location permission was given
    return <div>Waiting for location</div>;
  }
  return <Map center={currentPosition} />;
}

//Gets the closest malls if location is given
//gets malls closest to previous mall if no location was given but user logged in and has used it before
//if neither of the others, shows whole world and lets user type in mall names i guess
function Places(){
return (
    <div></div>
//<ComboBox></ComboBox>
)
}


function Map(props) {
  const centerTaken = {
    lat: props.center.latitude,
    lng: props.center.longitude,
  };
  return (
    <GoogleMap
      zoom={10}
      center={centerTaken}
      mapContainerClassName="map-container">
      <Marker position={centerTaken} />
    </GoogleMap>
  );
}
