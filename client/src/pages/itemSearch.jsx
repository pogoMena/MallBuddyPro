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

export default function ItemSearch({ loginStatus, userName, selection }) {
  const [center, setCenter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { lat, lng } = await getLatLng(selection[0]);

      function getCenter(selection) {
        console.log("IM going crazy");
        return { lat, lng };
      }

      setCenter(getCenter(selection));
      return "Hello World";
    };
    fetchData().catch(console.error);
  }, [selection]);

  //checks if map is loaded
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAzlS-0bq_gbvdSUpXCHcW_WlsXM2BEo9I",
  });

  if (!isLoaded) return <div>Loading...</div>;

  console.log("after the center == null");
  console.log("Surrounded\n");
  console.log(center);
  console.log("\nSurrounded");

  return <Map center={center} />;
}

function Map({ center }) {
  return (
    <GoogleMap zoom={15} center={center} mapContainerClassName="map-container">
      {<Marker position={center} />}
    </GoogleMap>
  );
}

/*


    const getCenter = async (selection) => {
       const{lat,lng} = await getLatLng(selection[0]);
      setCenter({ lat, lng });
    }
    setCenter(await getCenter);
    console.log("In the get center");
*/
