import React, { useEffect, useState, useMemo, useRef } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Range from "react-range";

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
  const [questions, setQuestions] = useState("");
  const [mall_id, setMallID] = useState("");
  const [mallSpecific, setMallSpecific] = useState("");

  //Gets the center of the mall
  useEffect(() => {
    const fetchData = async () => {
      setCenter({
        lat: parseFloat(selection.lat),
        lng: parseFloat(selection.lng),
      });

      //Gets the street number and street name from the selection
      setShortAddress(selection.short_address);

      let tempMall = {
        mall_name: selection.mall_name,
        mall_lat: selection.lat,
        mall_lng: selection.lng,
        mall_address: selection.short_address,
      };
      insertMall(tempMall);
    };
    //
    //Add mall to malls if it isnt already there
    //

    fetchData().catch(console.error);

    getQuestions();
    setMallSpecific(false);
  }, [selection]);

  //Gets all questions for sortBy dropdown

  const insertMall = (mall) => {
    Axios.post("http://localhost:3001/api/insertmall", { mall }).then(
      (responsarino) => {
        Axios.post("http://localhost:3001/api/getmallid", {
          mall_name: mall.mall_name,
        }).then((response) => {
          setMallID(response.data[0].mall_id);
        });
      }
    );
  };

  const getQuestions = () => {
    Axios.get("http://localhost:3001/api/getquestions", {}).then((response) => {
      setQuestions(response.data);
    });
  };

  //checks if map is loaded
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAzlS-0bq_gbvdSUpXCHcW_WlsXM2BEo9I",
    libraries: ["places"],
  });

  //if (!isLoaded) return <div>Loading...</div>;
  return (
    <Map
      center={center}
      shortAddress={shortAddress}
      userName={userName}
      questions={questions}
      mall_id={mall_id}
      setMallSpecific={setMallSpecific}
      mallSpecific={mallSpecific}
    />
  );
}

const GetStores = ({
  setMarkers,
  setStoreList,
  setStoreInfo,
  defaultCenter,
  defaultBounds,
  setMallSpecific,
  shortAddress,
  questions,
  mallSpecific,
  mall_id,
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
      radius: "25",
    },
  });

  //Adds stores to database if they havent been added yet
  const submitStores = (stores) => {
    console.log("in insert stores");
    Axios.post("http://localhost:3001/api/insertstores", {
      stores,
    });
  };

  const getSpecificOrNonSpecificHandler = (stores) => {
    if (mallSpecific) {
      getStoreAveragesMallSpecific(stores);
    } else {
      getStoreAverages(stores);
    }
  };

  const getStoreAverages = (stores) => {
    console.log("in storeAverages");
    Axios.post("http://localhost:3001/api/getavganswer", {
      stores,
    }).then((thisresponse) => {
      console.log("just got the response");

      setStoreInfo(JSON.parse(JSON.stringify(thisresponse.data.store_info)));
      console.log(JSON.stringify(thisresponse.data.store_info));

      let modifiedStores = stores;
      let baseAverages = thisresponse.data.store_info;

      //Sets an array of all questions with "0" as the base answer
      var initialAnswers = [];

      for (let inc = 0; inc < questions.length; inc++) {
        let emptyAnswerForInitialCreation = {
          question_id: questions[inc].question_id,
          radio_answer: 0,
          boolean_answer: 0,
        };
        initialAnswers.push(emptyAnswerForInitialCreation);
      }

      //Takes the base store from google and adds the averages to it
      modifiedStores.forEach(function (store, index) {
        for (var i = 0; i < baseAverages.length; i++) {
          //If this is the right store, adds info to it
          if (baseAverages[i].store_name === store.name) {
            //Goes through each answer for each store and sets it to the correct value
            //The ultimate goal of this it make sure all stores have an equal number of answers (zero if null)
            let tempAnswers = JSON.parse(JSON.stringify(initialAnswers)); //Sets all answers to 0 initially
            baseAverages[i].answers.forEach((average, indexB) => {
              if (average.question_id !== null) {
                for (var j = 0; j < questions.length; j++) {
                  if (tempAnswers[j].question_id === average.question_id) {
                    tempAnswers[j].radio_answer = average.radio_answer;
                    tempAnswers[j].boolean_answer = average.boolean_answer;
                    break;
                  }
                }
              }
            });

            baseAverages[i].answers = tempAnswers;

            let tempStore = Object.assign({}, store, {
              averagesInfo: baseAverages[i],
            });
            console.log("temp storeVV");
            console.log(tempStore.name);
            console.log(tempStore.averagesInfo.answers);

            modifiedStores[index] = tempStore;

            break;
          }
        }
      });
      //When done, sets the markers to the modiefied stores
      console.log("its at modified");
      console.log(modifiedStores);
      setMarkers(modifiedStores);
    });
  };

  const getStoreAveragesMallSpecific = (stores) => {
    console.log("in storeAveragesSpecific");
    Axios.post("http://localhost:3001/api/getavganswermallspecific", {
      stores,
      mall_id,
    }).then((thisresponse) => {
      console.log("just got the response");

      setStoreInfo(JSON.parse(JSON.stringify(thisresponse.data.store_info)));
      console.log(JSON.stringify(thisresponse.data.store_info));

      let modifiedStores = stores;
      let baseAverages = thisresponse.data.store_info;

      //Sets an array of all questions with "0" as the base answer
      var initialAnswers = [];

      for (let inc = 0; inc < questions.length; inc++) {
        let emptyAnswerForInitialCreation = {
          question_id: questions[inc].question_id,
          radio_answer: 0,
          boolean_answer: 0,
        };
        initialAnswers.push(emptyAnswerForInitialCreation);
      }

      //Takes the base store from google and adds the averages to it
      modifiedStores.forEach(function (store, index) {
        for (var i = 0; i < baseAverages.length; i++) {
          //If this is the right store, adds info to it
          if (baseAverages[i].store_name === store.name) {
            //Goes through each answer for each store and sets it to the correct value
            //The ultimate goal of this it make sure all stores have an equal number of answers (zero if null)
            let tempAnswers = JSON.parse(JSON.stringify(initialAnswers)); //Sets all answers to 0 initially
            baseAverages[i].answers.forEach((average, indexB) => {
              if (average.question_id !== null) {
                for (var j = 0; j < questions.length; j++) {
                  if (tempAnswers[j].question_id === average.question_id) {
                    tempAnswers[j].radio_answer = average.radio_answer;
                    tempAnswers[j].boolean_answer = average.boolean_answer;
                    break;
                  }
                }
              }
            });

            baseAverages[i].answers = tempAnswers;

            let tempStore = Object.assign({}, store, {
              averagesInfo: baseAverages[i],
            });
            console.log("temp storeVV");
            console.log(tempStore.name);
            console.log(tempStore.averagesInfo.answers);

            modifiedStores[index] = tempStore;

            break;
          }
        }
      });
      //When done, sets the markers to the modiefied stores
      console.log("its at modified");
      console.log(modifiedStores);
      setMarkers(modifiedStores);
    });
  };

  const handleSelect = async (event) => {
    event.preventDefault();

    console.log("Defaults");
    console.log(defaultCenter);
    console.log(defaultBounds);

    let placesService = new window.google.maps.places.PlacesService(
      document.getElementById("idk")
    );
    const request = {
      query: JSON.stringify(value),
      bounds: defaultBounds,
      fields: ["photos", "formatted_address", "name", "rating", "geometry"],
    };

    let markers = [];

    function inBoundingBox(obj) {
      let isLatInRange =
        obj.lat >= defaultBounds.south && obj.lat <= defaultBounds.north;
      let isLongInRange =
        obj.lng <= defaultBounds.east && obj.lng >= defaultBounds.west;

      return isLongInRange && isLatInRange;
    }

    placesService.textSearch(request, function (results, status) {
      for (var i = 0; i < results.length; i++) {
        let tempLatLng = getLatLng(results[i]);
        if (inBoundingBox(tempLatLng)) {
          markers.push(results[i]);
        }
      }
      console.log(markers);
      console.log(status);
      submitStores(markers);
      getSpecificOrNonSpecificHandler(markers);
      //getStoreAverages(markers);
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

function Map({
  center,
  shortAddress,
  userName,
  questions,
  mall_id,
  setMallSpecific,
  mallSpecific,
}) {
  const mapRef = useRef();
  const [markers, setMarkers] = useState("");
  const [store, setStore] = useState("");
  const [reviewModalShow, setReviewModalShow] = useState(false);
  const [reviews, setReviews] = useState("");
  const [storedetails, setStoreDetails] = useState("");
  const [storeInfo, setStoreInfo] = useState("");
  const [sortID, setSortID] = useState("");
  const [map, setMap] = useState(null);
  const [defaultBounds, setDefaultBounds] = useState("");

  const onLoad = useCallback((map) => setMap(map), []);

  const storeSort = (question_id) => {
    var answerType;

    if (questions[question_id - 1].answer_type === 1) {
      answerType = "radio";
    } else if (questions[question_id - 1].answer_type === 2) {
      answerType = "boolean";
    }
    let preSorted = markers;

    if (answerType === "boolean") {
      preSorted.sort((a, b) => {
        return (
          b.averagesInfo.answers[question_id - 1].boolean_answer -
          a.averagesInfo.answers[question_id - 1].boolean_answer
        );
      });
    } else if (answerType === "radio") {
      preSorted.sort((a, b) => {
        return (
          b.averagesInfo.answers[question_id - 1].radio_answer -
          a.averagesInfo.answers[question_id - 1].radio_answer
        );
      });
    }

    handleSortMarkers(preSorted);

    setSortID(question_id);
  };

  const handleSortMarkers = (newMarkers) => {
    setMarkers(newMarkers);
  };

  const getReviews = (store) => {
    Axios.post("http://localhost:3001/api/getreviews", { store }).then(
      (response) => {
        let storeName = store;
        setReviews(response.data);
        setReviewModalShow(true);

        var tempDetails = {};

        for (var i = 0; i < markers.length; i++) {
          if (markers[i].name === storeName) {
            tempDetails = {
              rating: markers[i].averagesInfo.rating,
              answers: markers[i].averagesInfo.answers,
            };
            break;
          }
        }
        setStoreDetails(tempDetails);
      }
    );
  };

  const mallSpecificHandler = () => {
    console.log("in the handler");

    if (mallSpecific) {
      setMallSpecific(false);
    } else {
      setMallSpecific(true);
    }
    console.log(mallSpecific);
  };

  /*
Handles getting specific reviews
  */
  const getReviewsMallSpecific = (store) => {
    Axios.post("http://localhost:3001/api/getreviewsmallspecific", {
      store,
      mall_id,
    }).then((response) => {
      let storeName = store;
      setReviews(response.data);
      setReviewModalShow(true);

      var tempDetails = {};

      for (var i = 0; i < markers.length; i++) {
        if (markers[i].name === storeName) {
          tempDetails = {
            rating: markers[i].averagesInfo.rating,
            answers: markers[i].averagesInfo.answers,
          };
          break;
        }
      }
      setStoreDetails(tempDetails);
    });
  };

  /*
  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  };
  */

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

  const bothZero = (a, b) => {
    if (a === 0 && b === 0) {
      return true;
    } else {
      return false;
    }
  };

  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      styles: styles,
    }),
    []
  );
  const getBounds = () => {
    if (map) {
      let ne = map.getBounds().getNorthEast();
      let sw = map.getBounds().getSouthWest();
      setDefaultBounds({
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng(),
      });
    }
  };

  return (
    <div>
      <div className="places-container">
        <GetStores
          defaultCenter={center}
          defaultBounds={defaultBounds}
          setMarkers={setMarkers}
          setStoreInfo={setStoreInfo}
          shortAddress={shortAddress}
          questions={questions}
          mall_id={mall_id}
        />
      </div>

      <GoogleMap
        zoom={16}
        id="map"
        center={center}
        mapContainerClassName="map-container"
        options={options}
        onLoad={onLoad}
        onIdle={getBounds}
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
        <div className="row">
          <div className="col">
            <DropdownButton id="dropdown-basic-button" title="Dropdown button">
              {questions &&
                questions.map((question) => (
                  <Dropdown.Item
                    onClick={() => {
                      storeSort(question.question_id);
                    }}>
                    {question.question}
                  </Dropdown.Item>
                ))}
            </DropdownButton>
          </div>
          <div className="col">{sortID && questions[sortID - 1].question}</div>
          <div className="col">
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customSwitch1"
                onClick={() => {
                  mallSpecificHandler();
                }}
              />
              <label className="custom-control-label" htmlFor="customSwitch1">
                Mall specific?
              </label>
            </div>
          </div>
        </div>
        {markers &&
          markers.map((store) => (
            <div
              key={store.name}
              className="row mx-0 my-5 border-top border-bottom">
              <div className="col picture">
                <img
                  src={
                    store.photos &&
                    store.photos[0].getUrl({
                      maxWidth: 75,
                      maxHeight: 75,
                    })
                  }
                  alt={store.name}
                />
              </div>
              <div className="col storeName">{store.name}</div>
              {sortID && (
                <div className="col storeName">
                  {bothZero(
                    store.averagesInfo.answers[sortID - 1].radio_answer,
                    store.averagesInfo.answers[sortID - 1].boolean_answer
                  ) && "N/A"}

                  {!bothZero(
                    store.averagesInfo.answers[sortID - 1].radio_answer,
                    store.averagesInfo.answers[sortID - 1].boolean_answer
                  ) &&
                    store.averagesInfo.answers[sortID - 1].radio_answer &&
                    store.averagesInfo.answers[sortID - 1].radio_answer}

                  {!bothZero(
                    store.averagesInfo.answers[sortID - 1].radio_answer,
                    store.averagesInfo.answers[sortID - 1].boolean_answer
                  ) &&
                    store.averagesInfo.answers[sortID - 1].boolean_answer &&
                    store.averagesInfo.answers[sortID - 1].boolean_answer}
                </div>
              )}
              <div className="col review">
                <Button
                  variant="primary"
                  onClick={() => {
                    if (mallSpecific) {
                      console.log("specific");
                      getReviewsMallSpecific(store.name);
                    } else {
                      console.log("non specific");
                      getReviews(store.name);
                    }

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
        username={userName}
        storedetails={storedetails}
        questions={questions}
        mall_id={mall_id}
      />
      <div id="idk"></div>
    </div>
  );
}

function ModalsHandler(props) {
  const storeName = props.store;
  const reviews = props.reviews;
  const username = props.username;
  const storedetails = props.storedetails;
  const questions = props.questions;
  const mall_id = props.mall_id;
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [modal, setModal] = useState("");
  const [modalObject, setModalObject] = useState("");
  //const [questions, setQuestions] = useState("");
  //const [answerArray, setAnswerArray] = useState("");
  const [errors, setErrors] = useState("");
  var answerArray = [];

  //Gets all questions for createReview page

  //Resets all answers to 0
  const setBlankAnswers = () => {
    let tempArray = [];
    for (var i = 0; i < questions.length; i++) {
      tempArray.push({
        question_id: questions[i].question_id,
        answer: 0,
        answer_type: questions[i].answer_type,
      });
    }

    answerArray = tempArray;
    //setAnswerArray(tempArray);
  };

  //Submits review when button is pressed on "makeReview" modal
  const submitReview = () => {
    //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers
    Axios.post("http://localhost:3001/api/submitreview", {
      rating: rating,
      review: review,
      store: storeName,
      userName: username,
      mall_id: mall_id,
    })
      .then((response) => {
        let id = response.data.insertId;
        submitanswers(id);
      })
      .then(() => {
        setModal("reviews");
        props.onHide();
      });
    setReview("");
    setRating(3);
  };

  const submitanswers = (id) => {
    console.log(answerArray);

    if (answerArray.length !== 0) {
      Axios.post("http://localhost:3001/api/submitanswers", {
        review_id: id,
        answers: answerArray,
      });
    } else {
      window.alert("Answers array is empty");
    }
  };

  const closeMakeReview = () => {
    props.onHide();
    setModal("reviews");
  };

  //Handles the selection of all items
  const answerSelectHandler = (question_id, answer) => {
    if (answerArray.length === 0) {
      setBlankAnswers();
    }

    console.log(answerArray);

    if (answerArray.length !== 0) {
      const newState = answerArray.map((tempAnswer) => {
        if (tempAnswer.question_id === question_id) {
          return { ...tempAnswer, answer: answer };
        }
        return tempAnswer;
      });

      answerArray = newState;
      console.log(answerArray);
    }
  };

  const bothZero = (a, b) => {
    if (a === 0 && b === 0) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setModal("reviews");
    //getQuestions();
    setRating(5);
    setReview("");
  }, []);

  //The Modal to be used when creating a new review
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
              <label>Rating</label>
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
              <label>What do you think?</label>
              <textarea
                className="form-control"
                id="review"
                rows="3"
                onChange={(e) => {
                  setReview(e.target.value);
                }}></textarea>
            </div>
            {questions &&
              questions.map((question, index) => {
                if (question.answer_type === 1 && question.display) {
                  return (
                    <div
                      className="form-group row radio"
                      key={question.id}
                      onChange={(e) => {
                        answerSelectHandler(
                          question.question_id,
                          e.target.value
                        );
                      }}>
                      <div className="col">
                        <label>{question.question}</label>
                      </div>
                      <div className="col">
                        <input
                          type="radio"
                          value="1"
                          name={question.question_id}
                        />
                        <input
                          type="radio"
                          value="2"
                          name={question.question_id}
                        />
                        <input
                          type="radio"
                          value="3"
                          name={question.question_id}
                        />
                        <input
                          type="radio"
                          value="4"
                          name={question.question_id}
                        />
                        <input
                          type="radio"
                          value="5"
                          name={question.question_id}
                        />
                      </div>
                    </div>
                  );
                } else if (question.answer_type === 2 && question.display) {
                  return (
                    <div
                      className="form-group row radio"
                      key={question.question_id}
                      onChange={(e) => {
                        answerSelectHandler(
                          question.question_id,
                          e.target.value
                        );
                      }}>
                      <div className="col">
                        <label>{question.question}</label>
                      </div>
                      <div className="col">
                        <input
                          type="radio"
                          value="0"
                          name={question.question_id}
                        />
                        <input
                          type="radio"
                          value="1"
                          name={question.question_id}
                        />
                      </div>
                    </div>
                  );
                } else {
                  return <div></div>;
                }
              })}
          </div>
        </Modal.Body>
        <Modal.Footer className="row">
          <div className="w-50 p-0 m-0">
            <button
              className="btn btn-secondary"
              onClick={() => {
                closeMakeReview();
              }}>
              Close
            </button>
          </div>
          <div className="w-50 p-0 m-0">
            <button
              className="btn btn-primary"
              onClick={() => {
                submitReview();
              }}>
              Submit
            </button>
          </div>
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
          <div className="container">
            <div className="row">
              <Modal.Title
                id="contained-modal-title-vcenter"
                className="mx-auto">
                {props.store}
              </Modal.Title>
            </div>
            {storedetails.rating && (
              <div className="row">
                <div className="col">Overall: </div>
                <div className="col">{storedetails.rating}</div>
              </div>
            )}

            {storedetails &&
              storedetails.answers.map((detail) => (
                <div className="row border-top" key={detail.question_id - 1}>
                  <div className="col">
                    {questions[detail.question_id - 1].question}
                  </div>
                  <div className="col">
                    {bothZero(detail.radio_answer, detail.boolean_answer) && (
                      <div className="col">N/A</div>
                    )}

                    {!bothZero(detail.radio_answer, detail.boolean_answer) &&
                      detail.radio_answer && (
                        <div className="col">{detail.radio_answer}</div>
                      )}

                    {!bothZero(detail.radio_answer, detail.boolean_answer) &&
                      detail.boolean_answer && (
                        <div className="col">{detail.boolean_answer}</div>
                      )}
                  </div>
                </div>
              ))}
          </div>
        </Modal.Header>
        <Modal.Body>
          {username && (
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
              <div
                className="row py-2 my-2 border-top border-bottom"
                key={review.id}>
                <div className="col">{review.username}</div>
                <div className="col">{review.review}</div>
                <div className="col">{review.rating}</div>
                <div className="col">
                  <button className="btn btn-secondary" onClick={props.onHide}>
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
}
