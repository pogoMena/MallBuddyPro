import React, { useEffect, useState, useMemo, useRef } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Range  from "react-range";
import {
  GoogleMap,
  LoadScript,
  useLoadScript,
  Marker,
  PlacesService,
} from "@react-google-maps/api";
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
import "@reach/combobox/styles.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useCallback } from "react";


export default function ItemSearch({ loginStatus, userName, selection }) {
  const [center, setCenter] = useState("");
  const [shortAddress, setShortAddress] = useState("");
  

  //Gets the center of the mall
  useEffect(() => {
    const fetchData = async () => {
      const { lat, lng } = await getLatLng(selection[0]);
      function getCenter(selection) {
        return { lat, lng };
      }
      setCenter(getCenter({ selection }));

      //Gets the street number and street name from the selection
      setShortAddress(
        selection[0].address_components[0].long_name +
          " " +
          selection[0].address_components[1].short_name
      );
    };
    fetchData().catch(console.error);
  }, [selection]);

  //checks if map is loaded
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAzlS-0bq_gbvdSUpXCHcW_WlsXM2BEo9I",
    libraries: ["places"],
  });

  //if (!isLoaded) return <div>Loading...</div>;
  return <Map center={center} shortAddress={shortAddress} userName={userName}/>;
}

const GetStores = ({
  setMarkers,
  setStoreList,
  defaultCenter,
  defaultBounds,
  shortAddress,
}) => {
  const {
    ready,
    searchMarkers,
    setSearchMarkers,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      bounds: defaultBounds,
      radius: "100",
    },
  });

  //Adds stores to database if they havent been added yet
  const submitStores = (stores) => {
    Axios.post("http://localhost:3001/api/insertstores", {
      stores,
    });
  };

  const handleSelect = async (event) => {
    event.preventDefault();

    let placesService = new window.google.maps.places.PlacesService(
      //document.getElementById("map")
      document.getElementById("idk")
    );
    const request = {
      query: JSON.stringify(value),
      bounds: defaultBounds,
      radius: 50,
      fields: [
        "photos",
        "formatted_address",
        "name",
        "rating",
        "opening_hours",
        "geometry",
      ],
    };
    let markers = [];

    placesService.textSearch(request, function (results, status) {
      for (var i = 0; i < results.length; i++) {
        if (results[i].formatted_address.indexOf(shortAddress) !== -1) {
          markers.push(results[i]);
        }
      }

      //I need to add the stores to the database if they havent been added yet
      submitStores(markers);
      setMarkers(markers);
    });
  };

  return (
    <form onSubmit={handleSelect}>
      <label>
        <input
          type="text"
          onChange={(e) => setValue(e.target.value)}
          placeholder="Item name"
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
};

function Map({ center, shortAddress, userName}) {
  const mapRef = useRef();
  const [markers, setMarkers] = useState("");
  const [store, setStore] = useState("");
  const [reviewModalShow, setReviewModalShow] = useState(false);
  const [reviews, setReviews] = useState("");

  const getReviews = (store) => {
    console.log(store);
    Axios.post("http://localhost:3001/api/getreviews", { store }).then(
      (response) => {
        setReviews(response.data);
        setReviewModalShow(true);
        console.log(response.data);
      }
    );
  };

  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  };

  const styles = [
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#CCFFFF" }],
    },
    {
      featureType: "landscape",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      styles: styles,
    }),
    []
  );

  return (
    <div>
      <div className="places-container">
        <GetStores
          defaultCenter={center}
          defaultBounds={defaultBounds}
          setMarkers={setMarkers}
          shortAddress={shortAddress}
        />
      </div>
      <GoogleMap
        zoom={16}
        id="map"
        center={center}
        mapContainerClassName="map-container"
        options={options}
        styles={styles}>
        {!markers && <Marker position={center} />}
        {markers &&
          markers.map((marker) => (
            <Marker
              key={marker.name}
              position={getLatLng(marker)}
              title={marker.name}
            />
          ))}
      </GoogleMap>
      <div id="storeList" className="container">
        {markers &&
          markers.map((store) => (
            <div
              key={store.name}
              id={store.name}
              className="row mx-0 my-5 border-top border-bottom">
              <div className="col picture">
                <img
                  src={store.photos[0].getUrl({ maxWidth: 75, maxHeight: 75 })}
                  alt={store.name}
                />
              </div>
              <div className="col storeName">{store.name}</div>
              <div className="col review">
                <Button
                  variant="primary"
                  onClick={() => {
                    getReviews(store.name);
                    setStore(store.name);
                  }}>
                  Reviews
                </Button>
              </div>
            </div>
          ))}
      </div>
      <ModalsHandler
        show={reviewModalShow}
        onHide={() => setReviewModalShow(false)}
        store={store}
        reviews={reviews}
        userName={userName}
      />
      <div id="idk"></div>
    </div>
  );
}

function ModalsHandler(props) {
  const storeName = props.store;
  const reviews = props.reviews;
  const userName = props.userName;
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [modal, setModal] = useState("");
  const [modalObject, setModalObject] = useState("");


  const submitReview = () => {
    console.log(storeName);
    Axios.post("http://localhost:3001/api/submitreview", {
      rating: rating,
      review: review,
      store: storeName,
      userName: userName,
    }).then(() => {
      setModal("reviews");
      props.onHide();
    });};

useEffect(() => {
    setModal("reviews")
  }, []);

  const makeReviewModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="ms-auto">
            {props.store}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form">
            <div className="form-group">
              <input
                type="range"
                min={1}
                max={5}
                defaultValue={5}
                name="Rating"
                onChange={(e) => {
                  setRating(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label for="review">What do you think?</label>
              <textarea
                className="form-control"
                id="review"
                rows="3"
                onChange={(e) => {
                  setReview(e.target.value);
                }}></textarea>
            </div>
            <button
              onClick={() => {
                submitReview();
              }}>
              Submit
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const reviewsModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="ms-auto">
            {props.store}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userName && (
            <div className="row">
              <Button
                variant="primary"
                onClick={() => {
                  setModal("createReview");
                }}>
                Leave Review
              </Button>
            </div>
          )}
          {reviews &&
            reviews.map((review) => (
              <div className="row py-2 my-2 border-top border-bottom">
                <div className="col">{review.username}</div>
                <div className="col">{review.review}</div>
                <div className="col">{review.rating}</div>
                  <div className="col">
                    <button className="button primary" onClick={props.onHide}>
                      comments
                    </button>
                  </div>
              </div>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };


  switch (modal) {
    case "reviews":
      return reviewsModal(props);
    case "createReview":
        return makeReviewModal(props);
    default:
      return reviewsModal(props);
  }
/*
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="ms-auto">
          {props.store}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <button
            variant="primary"
            onClick={() => {console.log("hi its teh reviews button")}}>
            Leave Review
          </button>
        </div>
        {reviews &&
          reviews.map((review) => (
            <div className="row">
              <div className="col">{review.username}</div>
              <div className="col">{review.review}</div>
              <div className="col">{review.rating}</div>
            </div>
          ))}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
*/
}
