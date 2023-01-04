import React, { useEffect, useState } from "react";
import Axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Admin(props) {
  const admin = props.admin;

  if (props.loginStatus === true) {
    if (admin) {
      return <Display />;
    }
  } else {
    return "You shouldnt be able to see this";
  }
}

function Display() {
  return (
    <div className="">
      <AdminDisplayHandler />
    </div>
  );
}

function AdminDisplayHandler() {
  const [userList, setUsers] = useState([]);
  const [display, setDisplay] = useState("");
  const [ActiveDisplay, setActiveDisplay] = useState("");
  const [malls, setMalls] = useState("");
  const [stores, setStores] = useState("");
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [reviews, setReviews] = useState("");
  const [ascending, setAscending] = useState("");
  const [subComments, setSubComments] = useState("");
  const [showAddQuestion, setShowAddQuestion] = useState("");
  const [modal, setModal] = useState("");
  const [show, setShow] = useState(false);
  const [updateID, setUpdateID] = useState("");

  //For updating questions
  const [globalQuestionID, setGlobalQuestionID] = useState("");
  const [globalQuestion, setGlobalQuestion] = useState("");
  const [globalAnswerType, setGlobalAnswerType] = useState("");
  const [globalDisplayQuestion, setGlobalDisplayQuestion] = useState("");

  //For updating Malls
  const [globalMallID, setGlobalMallID] = useState("");
  const [globalMallName, setGlobalMallName] = useState("");
  const [globalMallAddress, setGlobalMallAddress] = useState("");
  const [globalMallLat, setGlobalMallLat] = useState("");
  const [globalMallLng, setGlobalMallLng] = useState("");

  //for updating stores
  const [globalStoreID, setGlobalStoreID] = useState("");
  const [globalStoreName, setGlobalStoreName] = useState("");

  //For updating reviews
  const [globalReviewID, setGlobalReviewID] = useState("");
  const [globalRating, setGlobalRating] = useState("");
  const [globalReview, setGlobalReview] = useState("");
  const [globalUserID, setGlobalUserID] = useState("");

  //For updating Answer
  const [globalAnswerID, setGlobalAnswerID] = useState("");
  const [globalRadioAnswer, setGlobalRadioAnswer] = useState("");
  const [globalBooleanAnswer, setGlobalBooleanAnswer] = useState("");

  //For updating subreviews
  const [globalSubReviewID, setGlobalSubReviewID] = useState("");
  const [globalSubReview, setGlobalSubReview] = useState("");

  //For updating users
  const [globalAdmin, setGlobalAdmin] = useState("");
  const [globalUserName, setGlobalUserName] = useState("");
  const [globalPassword, setGlobalPassword] = useState("");
  const [globalEmail, setGlobalEmail] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getUsers();
    setActiveDisplay();
    setAscending(true);
  }, []);

  const DisplayNav = () => {
    return (
      <div className="col-2 container  p-0 m-auto mt-2">
        <div className="row mt-5">
          <button
            className="m-auto"
            onClick={() => {
              getUsers();
              setDisplay("users");
            }}>
            Users
          </button>
        </div>
        <div className="row mt-1">
          <button
            className="m-auto"
            onClick={() => {
              getMalls();
              setDisplay("malls");
            }}>
            Malls
          </button>
        </div>
        <div className="row mt-1">
          <button
            className="m-auto"
            onClick={() => {
              getStores();
              setDisplay("stores");
            }}>
            Stores
          </button>
        </div>
        <div className="row mt-1">
          <button
            className="m-auto"
            onClick={() => {
              getReviews();
              setDisplay("reviews");
            }}>
            Reviews
          </button>
        </div>
        <div className="row mt-1">
          <button
            className="m-auto"
            onClick={() => {
              getQuestions();
              setDisplay("questions");
            }}>
            Questions
          </button>
        </div>
        <div className="row mt-1">
          <button
            className="m-auto"
            onClick={() => {
              getAnswers();
              setDisplay("answers");
            }}>
            Answers
          </button>
        </div>
        <div className="row mt-1">
          <button
            className="m-auto"
            onClick={() => {
              getSubReviews();
              setDisplay("subcomments");
            }}>
            SubComments
          </button>
        </div>
      </div>
    );
  };

  const UsersDisplay = () => {
    const deleteUser = (id) => {
      Axios.post("http://localhost:3001/api/deleteuser", {
        user_id: id,
      }).then(()=>{
        getUsers()
    });
    };

    const userSort = (sortBy) => {
      let temp = userList;
      if (sortBy === "user_id") {
        if (ascending) {
          temp.sort((a, b) => {
            return a[sortBy] - b[sortBy];
          });
        } else {
          temp.sort((a, b) => {
            return b[sortBy] - a[sortBy];
          });
        }
      } else {
        if (ascending) {
          temp.sort((a, b) => {
            return ("" + a[sortBy]).localeCompare(b[sortBy]);
          });
        } else {
          temp.sort((a, b) => {
            return ("" + b[sortBy]).localeCompare(a[sortBy]);
          });
        }
      }

      setUsers(temp);
      setAscending(!ascending);
    };


    return (
      <div className="col-10 p-5 m-auto">
        <div className="row mx-auto">
          <button
            onClick={() => {
              setModal("addUser");
              handleShow();
            }}>
            Add User
          </button>
        </div>
        <div className="container border">
          <div className="row">
            <div
              id="interactable"
              className="col h6 "
              onClick={() => {
                userSort("user_id");
              }}>
              Id
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                userSort("username");
              }}>
              Username
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                userSort("password");
              }}>
              Password
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                userSort("email");
              }}>
              Email
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                userSort("mall_id");
              }}>
              Favorite Mall
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                userSort("admin");
              }}>
              Admin
            </div>
            <div className="col h6">Update</div>
            <div className="col h6">Delete</div>
          </div>

          <div>
            {userList &&
              userList.map((val) => {
                return (
                  <div className="row" key={val.user_id}>
                    <div className="col text-truncate">{val.user_id}</div>
                    <div className="col text-truncate">{val.username}</div>
                    <div className="col text-truncate">{val.password}</div>
                    <div className="col text-truncate">{val.email}</div>
                    <div className="col text-truncate">{val.mall_id}</div>
                    <div className="col text-truncate">{val.admin}</div>
                    <div
                      id="interactable"
                      className="col text-truncate"
                      onClick={() => {
                        setGlobalUserID(val.user_id);
                        setGlobalMallID(val.mall_id);
                        setGlobalAdmin(val.admin);
                        setGlobalUserName(val.username);
                        setGlobalPassword(val.password);
                        setGlobalEmail(val.email);
                        setModal("updateUser");
                        handleShow();
                      }}>
                      update
                    </div>
                    <div
                      id="interactable"
                      className="col text-truncate"
                      onClick={() => {
                        deleteUser(val.user_id);
                        
                      }}>
                      delete
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };
  const QuestionsDisplay = () => {
    const deleteQuestion = (id) => {
      Axios.post("http://localhost:3001/api/deletequestion", {
        question_id: id,
      }).then(() => {
        getQuestions();
      });
    };
    const questionsSort = (sortBy) => {
      let temp = questions;

      if (
        sortBy === "question_id" ||
        sortBy === "answer_type" ||
        sortBy === "display"
      ) {
        if (ascending) {
          temp.sort((a, b) => {
            return a[sortBy] - b[sortBy];
          });
        } else {
          temp.sort((a, b) => {
            return b[sortBy] - a[sortBy];
          });
        }
      } else {
        if (ascending) {
          temp.sort((a, b) => {
            return ("" + a[sortBy]).localeCompare(b[sortBy]);
          });
        } else {
          temp.sort((a, b) => {
            return ("" + b[sortBy]).localeCompare(a[sortBy]);
          });
        }
      }

      setQuestions(temp);
      setAscending(!ascending);
    };
    //Submits review when button is pressed on "makeReview" modal

    return (
      <div className="col-10 p-5 m-auto">
        <div className="container border">
          <div className="row mx-auto">
            <button
              onClick={() => {
                setModal("addQuestion");
                handleShow();
              }}>
              Make new question
            </button>
          </div>
          <div className="row">
            <div
              id="interactable"
              className="col-2 h6"
              onClick={() => {
                questionsSort("question_id");
              }}>
              Question ID
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                questionsSort("question");
              }}>
              Question
            </div>
            <div
              id="interactable"
              className="col-1 h6"
              onClick={() => {
                questionsSort("answer_type");
              }}>
              Answer Type
            </div>
            <div
              id="interactable"
              className="col-1 h6"
              onClick={() => {
                questionsSort("display");
              }}>
              Display
            </div>
            <div className="col-1 h6">Update</div>
            <div className="col-1 h6">Delete</div>
          </div>

          <div>
            {questions &&
              questions.map((question) => {
                return (
                  <div className="row" key={question.question_id}>
                    <div className="col-2">{question.question_id}</div>
                    <div className="col text-truncate">{question.question}</div>
                    <div className="col-1 text-truncate">
                      {question.answer_type}
                    </div>
                    <div className="col-1 text-truncate">
                      {question.display === 1 && "True"}
                      {question.display === 0 && "False"}
                    </div>
                    <div
                      id="interactable"
                      className="col-1"
                      onClick={() => {
                        setModal("updateQuestion");
                        setGlobalQuestionID(question.question_id);
                        setGlobalQuestion(question.question);
                        setGlobalAnswerType(question.answer_type);
                        setGlobalDisplayQuestion(question.display);
                        handleShow();
                      }}>
                      update
                    </div>
                    <div
                      id="interactable"
                      className="col-1"
                      onClick={() => {
                        deleteQuestion(question.question_id);
                        getQuestions();
                      }}>
                      delete
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };
  const MallsDisplay = () => {
    const deleteMall = (id) => {
      Axios.post("http://localhost:3001/api/deletemall", {
        mall_id: id,
      }).then(()=>{
        getMalls();
      });

    };

    const mallsSort = (sortBy) => {
      let temp = malls;

      if (
        sortBy === "mall_id" ||
        sortBy === "mall_lat" ||
        sortBy === "mall_lng"
      ) {
        if (ascending) {
          temp.sort((a, b) => {
            return a[sortBy] - b[sortBy];
          });
        } else {
          temp.sort((a, b) => {
            return b[sortBy] - a[sortBy];
          });
        }
      } else {
        if (ascending) {
          temp.sort((a, b) => {
            return ("" + a[sortBy]).localeCompare(b[sortBy]);
          });
        } else {
          temp.sort((a, b) => {
            return ("" + b[sortBy]).localeCompare(a[sortBy]);
          });
        }
      }

      setMalls(temp);
      setAscending(!ascending);
    };

    return (
      <div className="col-10 p-5 m-auto">
        <div className="row mx-auto">
          <button
            onClick={() => {
              setModal("addMall");
              handleShow();
            }}>
            Add Mall
          </button>
        </div>
        <div className="container border">
          <div className="row">
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                mallsSort("mall_id");
              }}>
              Mall ID
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                mallsSort("mall_name");
              }}>
              Mall Name
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                mallsSort("mall_address");
              }}>
              Address
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                mallsSort("mall_lat");
              }}>
              Lat
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                mallsSort("mall_lng");
              }}>
              Lng
            </div>
            <div className="col h6">Update</div>
            <div className="col h6">Delete</div>
          </div>

          <div>
            {malls &&
              malls.map((mall) => {
                return (
                  <div className="row" key={mall.mall_id}>
                    <div className="col">{mall.mall_id}</div>
                    <div className="col text-truncate">{mall.mall_name}</div>
                    <div className="col text-truncate">{mall.mall_address}</div>
                    <div className="col text-truncate">{mall.mall_lat}</div>
                    <div className="col text-truncate">{mall.mall_lng}</div>
                    <div
                      id="interactable"
                      className="col"
                      onClick={() => {
                        setModal("updateMall");
                        setGlobalMallID(mall.mall_id);
                        setGlobalMallName(mall.mall_name);
                        setGlobalMallAddress(mall.mall_address);
                        setGlobalMallLat(mall.mall_lat);
                        setGlobalMallLng(mall.mall_lng);
                        handleShow();
                      }}>
                      update
                    </div>
                    <div
                      id="interactable"
                      className="col"
                      onClick={() => {
                        deleteMall(mall.mall_id);
                        getMalls();
                      }}>
                      delete
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  //
  const StoresDisplay = () => {
    const deleteStore = (id) => {
      Axios.post("http://localhost:3001/api/deletestore", {
        store_id: id,
      }).then(() => {
        getStores();
      });
    };
    const storesSort = (sortBy) => {
      let temp = stores;

      if (sortBy === "store_id") {
        if (ascending) {
          temp.sort((a, b) => {
            return a[sortBy] - b[sortBy];
          });
        } else {
          temp.sort((a, b) => {
            return b[sortBy] - a[sortBy];
          });
        }
      } else {
        if (ascending) {
          temp.sort((a, b) => {
            return ("" + a[sortBy]).localeCompare(b[sortBy]);
          });
        } else {
          temp.sort((a, b) => {
            return ("" + b[sortBy]).localeCompare(a[sortBy]);
          });
        }
      }

      setStores(temp);
      setAscending(!ascending);
    };

    return (
      <div className="col-10 p-5 m-auto">
        <div className="row mx-auto">
          <button
            onClick={() => {
              setModal("addStore");
              handleShow();
            }}>
            Add Store
          </button>
        </div>
        <div className="container border">
          <div className="row">
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                storesSort("store_id");
              }}>
              Store ID
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                storesSort("store_name");
              }}>
              Store Name
            </div>
            <div className="col h6">Update</div>
            <div className="col h6">Delete</div>
          </div>

          <div>
            {stores &&
              stores.map((store) => {
                return (
                  <div className="row" key={store.store_id}>
                    <div className="col">{store.store_id}</div>
                    <div className="col text-truncate">{store.store_name}</div>
                    <div
                      id="interactable"
                      className="col"
                      onClick={() => {
                        setModal("updateStore");
                        setGlobalStoreID(store.store_id);
                        setGlobalStoreName(store.store_name);
                        handleShow();
                      }}>
                      update
                    </div>
                    <div
                      id="interactable"
                      className="col"
                      onClick={() => {
                        deleteStore(store.store_id);
                        getStores();
                      }}>
                      delete
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };
  const ReviewsDisplay = () => {
    const deleteReview = (id) => {
      Axios.post("http://localhost:3001/api/deletereview", {
        review_id: id,
      }).then(() => {
        getReviews();
      });
    };

    const reviewsSort = (sortBy) => {
      let temp = reviews;

      if (sortBy === "review") {
        if (ascending) {
          temp.sort((a, b) => {
            return ("" + a[sortBy]).localeCompare(b[sortBy]);
          });
        } else {
          temp.sort((a, b) => {
            return ("" + b[sortBy]).localeCompare(a[sortBy]);
          });
        }
      } else {
        if (ascending) {
          temp.sort((a, b) => {
            return a[sortBy] - b[sortBy];
          });
        } else {
          temp.sort((a, b) => {
            return b[sortBy] - a[sortBy];
          });
        }
      }

      setReviews(temp);
      setAscending(!ascending);
    };

    return (
      <div className="col-10 p-5 m-auto">
        <div className="row mx-auto">
          <button
            onClick={() => {
              setModal("addReview");
              handleShow();
            }}>
            Add Review
          </button>
        </div>
        <div className="container border">
          <div className="row">
            <div
              id="interactable"
              className="col-1 h6"
              onClick={() => {
                reviewsSort("review_id");
              }}>
              Review ID
            </div>
            <div
              id="interactable"
              className="col-5 h6"
              onClick={() => {
                reviewsSort("review");
              }}>
              Review
            </div>
            <div
              id="interactable"
              className="col-1 h6"
              onClick={() => {
                reviewsSort("rating");
              }}>
              Rating
            </div>

            <div
              id="interactable"
              className="col-1 h6"
              onClick={() => {
                reviewsSort("user_id");
              }}>
              User_ID
            </div>
            <div
              id="interactable"
              className="col-1 h6"
              onClick={() => {
                reviewsSort("store_id");
              }}>
              Store_ID
            </div>
            <div
              id="interactable"
              className="col-1 h6"
              onClick={() => {
                reviewsSort("mall_id");
              }}>
              Mall_ID
            </div>
            <div className="col-1 h6">Update</div>
            <div className="col-1 h6">Delete</div>
          </div>

          <div>
            {reviews &&
              reviews.map((review) => {
                return (
                  <div className="row" key={review.review_id}>
                    <div className="col-1">{review.review_id}</div>
                    <div className="col-5">{review.review}</div>
                    <div className="col-1">{review.rating}</div>
                    <div className="col-1">{review.user_id}</div>
                    <div className="col-1">{review.store_id}</div>
                    <div className="col-1">{review.mall_id}</div>
                    <div
                      id="interactable"
                      className="col-1"
                      onClick={() => {
                        setModal("updateReview");
                        setGlobalReviewID(review.review_id);
                        setGlobalRating(review.rating);
                        setGlobalReview(review.review);
                        setGlobalUserID(review.user_id);
                        setGlobalStoreID(review.store_id);
                        setGlobalMallID(review.mall_id);

                        handleShow();
                      }}>
                      update
                    </div>
                    <div
                      id="interactable"
                      className="col-1"
                      onClick={() => {
                        deleteReview(review.review_id);
                        getReviews();
                      }}>
                      delete
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };
  const AnswersDisplay = () => {
    const deleteAnswer = (id) => {
      Axios.post("http://localhost:3001/api/deleteanswer", {
        answer_id: id,
      }).then(() => {
        getAnswers();
      });
    };
    const answersSort = (sortBy) => {
      let temp = answers;

      if (ascending) {
        temp.sort((a, b) => {
          return a[sortBy] - b[sortBy];
        });
      } else {
        temp.sort((a, b) => {
          return b[sortBy] - a[sortBy];
        });
      }

      setAnswers(temp);
      setAscending(!ascending);
    };

    return (
      <div className="col-10 p-5 m-auto">
        <div className="row mx-auto">
          <button
            onClick={() => {
              setModal("addAnswer");
              handleShow();
            }}>
            Add Answer
          </button>
        </div>
        <div className="container border">
          <div className="row">
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                answersSort("answer_id");
              }}>
              Answer ID
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                answersSort("question_id");
              }}>
              Question ID
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                answersSort("review_id");
              }}>
              Review ID
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                answersSort("radio_answer");
              }}>
              Radio Answer
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                answersSort("boolean_answer");
              }}>
              Boolean Answer
            </div>
            <div className="col h6">Update</div>
            <div className="col h6">Delete</div>
          </div>

          <div>
            {answers &&
              answers.map((answer) => {
                return (
                  <div className="row" key={answer.answer_id}>
                    <div className="col">{answer.answer_id}</div>
                    <div className="col">{answer.question_id}</div>
                    <div className="col">{answer.review_id}</div>
                    <div className="col">
                      {answer.radio_answer && answer.radio_answer}
                      {!answer.radio_answer && "N/A"}
                    </div>
                    <div className="col">
                      {answer.boolean_answer && answer.boolean_answer}
                      {answer.boolean_answer === null && "N/A"}
                    </div>
                    <div
                      id="interactable"
                      className="col"
                      onClick={() => {
                        setModal("updateAnswer");
                        setGlobalAnswerID(answer.answer_id);
                        setGlobalRadioAnswer(answer.radio_answer);
                        setGlobalBooleanAnswer(answer.boolean_answer);
                        handleShow();
                      }}>
                      update
                    </div>
                    <div
                      id="interactable"
                      className="col"
                      onClick={() => {
                        deleteAnswer(answer.answer_id);
                        getAnswers();
                      }}>
                      delete
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };
  const SubCommentsDisplay = () => {
    const deleteSubReview = (id) => {
      Axios.post("http://localhost:3001/api/deletesubcomment", {
        subreview_id: id,
      }).then(() => {
        getSubReviews();
      });
    };

    const subReviewsSort = (sortBy) => {
      let temp = subComments;

      if (sortBy === "subreview") {
        if (ascending) {
          temp.sort((a, b) => {
            return ("" + a[sortBy]).localeCompare(b[sortBy]);
          });
        } else {
          temp.sort((a, b) => {
            return ("" + b[sortBy]).localeCompare(a[sortBy]);
          });
        }
      } else {
        if (ascending) {
          temp.sort((a, b) => {
            return a[sortBy] - b[sortBy];
          });
        } else {
          temp.sort((a, b) => {
            return b[sortBy] - a[sortBy];
          });
        }
      }

      setSubComments(temp);
      setAscending(!ascending);
    };

    return (
      <div className="col-10 p-5 m-auto">
        <div className="row mx-auto">
          <button
            onClick={() => {
              setModal("addSubComment");
              handleShow();
            }}>
            Add SubComment
          </button>
        </div>
        <div className="container border">
          <div className="row">
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                subReviewsSort("subreview_id");
              }}>
              SubReview ID
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                subReviewsSort("subreview");
              }}>
              SubComment
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                subReviewsSort("review_id");
              }}>
              Review_id
            </div>
            <div
              id="interactable"
              className="col h6"
              onClick={() => {
                subReviewsSort("user_id");
              }}>
              User_ID
            </div>

            <div className="col h6">Update</div>
            <div className="col h6">Delete</div>
          </div>

          <div>
            {subComments &&
              subComments.map((comment) => {
                return (
                  <div className="row" key={comment.subreview_id}>
                    <div className="col">{comment.subreview_id}</div>
                    <div className="col">{comment.subreview}</div>
                    <div className="col">{comment.review_id}</div>
                    <div className="col">{comment.user_id}</div>
                    <div
                      id="interactable"
                      className="col"
                      onClick={() => {
                        setModal("updateSubComment");
                        setGlobalSubReviewID(comment.subreview_id);
                        setGlobalSubReview(comment.subreview);
                        setGlobalReviewID(comment.review_id);
                        setGlobalUserID(comment.user_id);

                        handleShow();
                      }}>
                      update
                    </div>
                    <div
                      id="interactable"
                      className="col"
                      onClick={() => {
                        deleteSubReview(comment.subreview_id);
                        getReviews();
                      }}>
                      delete
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };


  const getSubReviews = () => {
    Axios.get("http://localhost:3001/api/getsubreviews", {}).then(
      (response) => {
        console.log(response.data);
        setSubComments(response.data);
      }
    );
  };

  const getUsers = () => {
    Axios.get("http://localhost:3001/api/getusers", {}).then((response) => {
      setUsers(response.data);
    });
  };

  const getMalls = () => {
    Axios.get("http://localhost:3001/api/getmalls", {}).then((response) => {
      setMalls(response.data);
    });
  };
  const getStores = () => {
    Axios.get("http://localhost:3001/api/getstores", {}).then((response) => {
      setStores(response.data);
    });
  };
  const getQuestions = () => {
    Axios.get("http://localhost:3001/api/getquestions", {}).then((response) => {
      setQuestions(response.data);
    });
  };
  const getAnswers = () => {
    Axios.get("http://localhost:3001/api/getanswers", {}).then((response) => {
      setAnswers(response.data);
    });
  };
  const getReviews = () => {
    Axios.get("http://localhost:3001/api/getallreviews", {}).then(
      (response) => {
        setReviews(response.data);
      }
    );
  };
  function ModalsHandler() {
    //for updateQuestions
    var questionID;
    var question;
    var answerType;
    var displayQuestion;

    //for update malls
    var mallName;
    var mallAddress;
    var mallLat;
    var mallLng;

    // for update stores
    var storeName;

    //for update reviews
    var rating;
    var review;
    var user_id;
    var store_id;
    var mall_id;

    //For update answer
    var radio_answer;
    var boolean_answer;

    //For updating SubComments
    var subReview;

    //For adding subcomment
    var review_id;

    //for updating user
    var admin;
    var thisusername;
    var password;
    var email;
    const addUser = (adminprop) => {
      //Submits a new user to the users table
      Axios.post("http://localhost:3001/api/adduser", {
        username: thisusername,
        password: password,
        email: email,
        admin: adminprop,
      }).then(() => {
        getUsers();
      });
    };
    const updateUser = (adminprop) => {
      //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers
      Axios.post("http://localhost:3001/api/updateuser", {
        user_id: globalUserID,
        username: thisusername,
        password: password,
        email: email,
        admin: adminprop,
      }).then(() => {
        getUsers();
      });
    };

    const addQuestion = () => {
      //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers
      Axios.post("http://localhost:3001/api/addquestion", {
        question: question,
        answer_type: answerType,
        display: displayQuestion,
      }).then(() => {
        getQuestions();
      });

      question = "";
      answerType = "1";
      displayQuestion = "1";
    };

    const updateQuestion = () => {
      //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers
      Axios.post("http://localhost:3001/api/updatequestion", {
        question_id: globalQuestionID,
        question: question,
        answer_type: answerType,
        display: displayQuestion,
      }).then(() => {
        getQuestions();
      });
      question = "";
      answerType = "1";
      displayQuestion = "1";
    };
    //Adds a mall to the Malls table
    const addMall = () => {
      Axios.post("http://localhost:3001/api/addmall", {
        mall_name: mallName,
        mall_address: mallAddress,
        mall_lat: mallLat,
        mall_lng: mallLng,
      }).then(() => {
        getMalls();
      });
    };

    const updateMall = () => {
      //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers
      Axios.post("http://localhost:3001/api/updatemall", {
        mall_id: globalMallID,
        mallName: mallName,
        mallAddress: mallAddress,
        mallLat: mallLat,
        mallLng: mallLng,
      }).then(() => {
        getMalls();
      });
    };

    const addStore = () => {
      //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers
      Axios.post("http://localhost:3001/api/insertstore", {
        store_name: storeName,
      }).then(() => {
        getStores();
      });
    };
    const updateStore = () => {
      //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers
      Axios.post("http://localhost:3001/api/updatestore", {
        store_id: globalStoreID,
        store_name: storeName,
      }).then(() => {
        getStores();
      });
    };
    const addReview = () => {
      console.log(rating);
      console.log(review);
      console.log(user_id);
      console.log(store_id);
      console.log(mall_id);
      //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers
      Axios.post("http://localhost:3001/api/addreview", {
        rating: rating,
        review: review,
        user_id: user_id,
        store_id: store_id,
        mall_id: mall_id,
      }).then(() => {
        getReviews();
      });
    };
    const updateReview = () => {
      //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers
      Axios.post("http://localhost:3001/api/updatereview", {
        review_id: globalReviewID,
        rating: rating,
        review: review,
        user_id: user_id,
        store_id: store_id,
        mall_id: mall_id,
      }).then(() => {
        getReviews();
      });
    };

    const addAnswer = (boolean_answer) => {
      console.log(radio_answer);
      console.log(boolean_answer);
      console.log(questionID);
      console.log(review_id);
      //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers

      Axios.post("http://localhost:3001/api/addanswer", {
        radio_answer: radio_answer,
        boolean_answer: boolean_answer,
        question_id: questionID,
        review_id: review_id,
      }).then(() => {
        getAnswers();
      });
    };
    const updateAnswer = () => {
      //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers
      Axios.post("http://localhost:3001/api/updateanswer", {
        answer_id: globalAnswerID,
        radio_answer: radio_answer,
        boolean_answer: boolean_answer,
      }).then(() => {
        getAnswers();
      });
    };

    const addSubComment = () => {
      //Submits a SubComment to the SubComment table

      Axios.post("http://localhost:3001/api/addsubreview", {
        subcomment: subReview,
        review_id: review_id,
        user_id: user_id,
      }).then(() => {
        getSubReviews();
      });
    };
    const updateSubComment = () => {
      //Submits a review to the reviews table, then uses the ID of the new review as teh review_id of the answers
      Axios.post("http://localhost:3001/api/updatesubreview", {
        subreview_id: globalSubReviewID,
        subreview: subReview,
      }).then(() => {
        getSubReviews();
      });
    };

    const UpdateUserModal = () => {
      const [updateAdmin, setUpdateAdmin] = useState("");

      const handleAdminChange = (yesOrNoAdmin) => {
        admin = yesOrNoAdmin;
        console.log(admin);
        setUpdateAdmin(admin);
      };

      admin = globalAdmin;
      thisusername = globalUserName.slice();
      email = globalEmail.slice();
      password = globalPassword.slice();
      mall_id = globalMallID;

      useEffect(() => {
        setUpdateAdmin(globalAdmin);
      }, []);

      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Update User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form">
                <div className="form-group">
                  <label>Username</label>
                  <textarea
                    className="form-control"
                    id="question"
                    rows="3"
                    defaultValue={thisusername}
                    onChange={(e) => {
                      thisusername = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group">
                  <label>Password (Will be hashed)</label>
                  <textarea
                    className="form-control"
                    id="question"
                    rows="3"
                    defaultValue={password}
                    onChange={(e) => {
                      password = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <textarea
                    className="form-control"
                    id="question"
                    rows="3"
                    defaultValue={email}
                    onChange={(e) => {
                      email = e.target.value;
                    }}></textarea>
                </div>

                <div className="form-group">
                  <label className="h6">Admin</label>
                  <div className="form-group row radio">
                    <div className="row border-bottom">
                      <div className="col">
                        <label>False</label>
                        <input
                          type="radio"
                          value="0"
                          name="is_admin"
                          onChange={() => {
                            handleAdminChange(0);
                          }}
                          checked={updateAdmin === 0}
                        />
                      </div>
                      <div className="col">
                        <label>True</label>
                        <input
                          type="radio"
                          value="1"
                          name="is_admin"
                          onChange={() => {
                            handleAdminChange(1);
                          }}
                          checked={updateAdmin === 1}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Favorite mall_id</label>
                    <div className="form-group row my-2">
                      <label className="col">(FK) Mall_ID: </label>
                      <input
                        readOnly
                        className="col"
                        type="number"
                        value={globalMallID}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  updateUser(updateAdmin);
                  handleClose();
                }}>
                Update User
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    const AddUserModal = () => {
      const [updateAdmin, setUpdateAdmin] = useState("");

      const handleAdminChange = (yesOrNoAdmin) => {
        admin = yesOrNoAdmin;
        setUpdateAdmin(admin);
      };

      useEffect(() => {
        setUpdateAdmin(globalAdmin);
      }, []);

      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form">
                <div className="form-group">
                  <label>Username</label>
                  <textarea
                    className="form-control"
                    id="question"
                    rows="3"
                    onChange={(e) => {
                      thisusername = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group">
                  <label>Password (Will be hashed)</label>
                  <textarea
                    className="form-control"
                    id="question"
                    rows="3"
                    defaultValue={password}
                    onChange={(e) => {
                      password = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <textarea
                    className="form-control"
                    id="question"
                    rows="3"
                    defaultValue={email}
                    onChange={(e) => {
                      email = e.target.value;
                    }}></textarea>
                </div>

                <div className="form-group">
                  <label className="h6">Admin</label>
                  <div className="form-group row radio">
                    <div className="row border-bottom">
                      <div className="col">
                        <label>False</label>
                        <input
                          type="radio"
                          value="0"
                          name="is_admin"
                          onChange={() => {
                            handleAdminChange(0);
                          }}
                          checked={admin === 0}
                        />
                      </div>
                      <div className="col">
                        <label>True</label>
                        <input
                          type="radio"
                          value="1"
                          name="is_admin"
                          onChange={() => {
                            handleAdminChange(1);
                          }}
                          checked={admin === 1}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Favorite mall_id</label>
                    <div className="form-group row my-2">
                      <label className="col">(FK) Mall_ID: </label>
                      <input
                        readOnly
                        className="col"
                        type="number"
                        value={globalMallID}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addUser(admin);
                  handleClose();
                }}>
                Add user
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };

    //The Modal to be used when creating a new question
    const AddQuestionModal = () => {
      return (
        <>
          <Modal
            show={show}
            onHide={() => {
              handleClose();
            }}>
            <Modal.Header closeButton>
              <Modal.Title>Add a question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form">
                <div className="form-group">
                  <label>Question</label>
                  <textarea
                    className="form-control"
                    id="question"
                    rows="3"
                    onChange={(e) => {
                      question = e.target.value;
                      //setQuestion(e.target.value);
                    }}></textarea>
                </div>
                <div className="form-group">
                  <label className="h6">Answer Type</label>
                  <div
                    className="form-group row radio"
                    onChange={(e) => {
                      answerType = e.target.value;
                      //setAnswerType(e.target.value);
                    }}>
                    <div className="row border-bottom">
                      <div className="col">
                        <label>Boolean</label>
                        <input type="radio" value="2" name="answer_type" />
                      </div>
                      <div className="col">
                        <label>Radio</label>
                        <input type="radio" value="1" name="answer_type" />
                      </div>
                    </div>
                  </div>
                  <div
                    className="form-group row radio"
                    onChange={(e) => {
                      displayQuestion = e.target.value;
                    }}>
                    <label className="h6 mt-5">Display?</label>
                    <div className="row ">
                      <div className="col">
                        <label>Dont display</label>
                        <input type="radio" value="0" name="display" />
                      </div>
                      <div className="col">
                        <label>Display</label>
                        <input type="radio" value="1" name="display" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  handleClose();
                }}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addQuestion();
                  handleClose();
                }}>
                Add question
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };

    const UpdateQuestionModal = () => {
      const [updateQuestionType, setUpdateQuestionType] = useState("");
      const [updateQuestionDisplay, setUpdateQuestionDisplay] = useState("");

      const handleAnswerTypeChange = (type) => {
        answerType = type;
        setUpdateQuestionType(answerType);
      };

      const handleDisplayChange = (shallYouDisplay) => {
        console.log(shallYouDisplay);
        displayQuestion = shallYouDisplay;
        setUpdateQuestionDisplay(displayQuestion);
      };

      question = globalQuestion.slice();
      answerType = globalAnswerType;
      displayQuestion = globalDisplayQuestion;

      useEffect(() => {
        setUpdateQuestionType(answerType);
        setUpdateQuestionDisplay(displayQuestion);
      }, []);

      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Update question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form">
                <div className="form-group">
                  <label>Question</label>
                  <textarea
                    className="form-control"
                    id="question"
                    rows="3"
                    defaultValue={question}
                    onChange={(e) => {
                      question = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group">
                  <label className="h6">Answer Type</label>
                  <div className="form-group row radio">
                    <div className="row border-bottom">
                      <div className="col">
                        <label>Boolean</label>
                        <input
                          type="radio"
                          value="2"
                          name="answer_type"
                          onChange={() => {
                            handleAnswerTypeChange(2);
                          }}
                          checked={updateQuestionType === 2}
                        />
                      </div>
                      <div className="col">
                        <label>Radio</label>
                        <input
                          type="radio"
                          value="1"
                          name="answer_type"
                          onChange={() => {
                            handleAnswerTypeChange(1);
                          }}
                          checked={updateQuestionType === 1}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="form-group row radio"
                    onChange={(e) => {
                      displayQuestion = e.target.value;
                      //setDisplayQuestion(e.target.value);
                    }}>
                    <label className="h6 mt-5">Display?</label>
                    <div className="row ">
                      <div className="col">
                        <label>Dont display</label>
                        <input
                          type="radio"
                          value="0"
                          name="display"
                          onChange={() => {
                            handleDisplayChange(0);
                          }}
                          checked={updateQuestionDisplay === 0}
                        />
                      </div>
                      <div className="col">
                        <label>Display</label>
                        <input
                          type="radio"
                          value="1"
                          name="display"
                          onChange={() => {
                            handleDisplayChange(1);
                          }}
                          checked={updateQuestionDisplay === 1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  updateQuestion();
                  handleClose();
                }}>
                Update question
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    const AddMallModal = () => {
      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Add Mall</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form p-5">
                <div className="form-group my-2">
                  <label>MallName</label>
                  <textarea
                    className="form-control"
                    id="mall name"
                    rows="3"
                    onChange={(e) => {
                      mallName = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group my-2">
                  <label>Mall Address</label>
                  <textarea
                    className="form-control"
                    id="mall name"
                    rows="3"
                    onChange={(e) => {
                      mallAddress = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group row my-2">
                  <label className="col">Mall Lat: </label>
                  <input
                    className="col"
                    type="number"
                    step="any"
                    id="mall lng"
                    onChange={(e) => {
                      mallLat = e.target.value;
                    }}
                  />
                </div>

                <div className="form-group row my-2">
                  <label className="col">Mall Lng: </label>
                  <input
                    className="col"
                    type="number"
                    step="any"
                    id="mall lng"
                    onChange={(e) => {
                      mallLng = e.target.value;
                    }}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addMall();
                  handleClose();
                }}>
                Add mall
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    const UpdateMallModal = () => {
      mallName = globalMallName.slice();
      mallAddress = globalMallAddress.slice();
      mallLat = globalMallLat;
      mallLng = globalMallLng;

      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Update Mall</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form p-5">
                <div className="form-group my-2">
                  <label>MallName</label>
                  <textarea
                    className="form-control"
                    id="mall name"
                    rows="3"
                    defaultValue={mallName}
                    onChange={(e) => {
                      mallName = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group my-2">
                  <label>Mall Address</label>
                  <textarea
                    className="form-control"
                    id="mall name"
                    rows="3"
                    defaultValue={mallAddress}
                    onChange={(e) => {
                      mallAddress = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group row my-2">
                  <label className="col">Mall Lat: </label>
                  <input
                    className="col"
                    type="number"
                    step="any"
                    id="mall lng"
                    defaultValue={mallLat}
                    onChange={(e) => {
                      mallLat = e.target.value;
                    }}
                  />
                </div>

                <div className="form-group row my-2">
                  <label className="col">Mall Lng: </label>
                  <input
                    className="col"
                    type="number"
                    step="any"
                    id="mall lng"
                    defaultValue={mallLng}
                    onChange={(e) => {
                      mallLng = e.target.value;
                    }}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  updateMall();
                  handleClose();
                }}>
                Update mall
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    const AddStoreModal = () => {
      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Add Store</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form p-5">
                <div className="form-group my-2">
                  <label>Store Name</label>
                  <textarea
                    className="form-control"
                    id="mall name"
                    rows="3"
                    onChange={(e) => {
                      storeName = e.target.value;
                    }}></textarea>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addStore();
                  handleClose();
                }}>
                Add Store
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    const UpdateStoreModal = () => {
      storeName = globalStoreName.slice();

      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Update Store</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form p-5">
                <div className="form-group my-2">
                  <label>Store Name</label>
                  <textarea
                    className="form-control"
                    id="mall name"
                    rows="3"
                    defaultValue={storeName}
                    onChange={(e) => {
                      storeName = e.target.value;
                    }}></textarea>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  updateStore();
                  handleClose();
                }}>
                Update Store
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };

    const AddReviewModal = () => {
      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Add Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form p-5">
                <div className="form-group my-2">
                  <label>Review</label>
                  <textarea
                    className="form-control"
                    id="mall name"
                    rows="3"
                    onChange={(e) => {
                      review = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group row my-2">
                  <label className="col">Rating: </label>
                  <input
                    className="col"
                    type="number"
                    step="1"
                    id="Rating"
                    min="1"
                    max="5"
                    onChange={(e) => {
                      rating = e.target.value;
                    }}
                  />
                </div>
                <div className="form-group row my-2">
                  <label className="col">(FK) User ID: </label>
                  <input
                    className="col"
                    type="number"
                    step="1"
                    id="UserID"
                    min="0"
                    onChange={(e) => {
                      user_id = e.target.value;
                    }}
                  />
                </div>
                <div className="form-group row my-2">
                  <label className="col">(FK) Store ID: </label>
                  <input
                    className="col"
                    type="number"
                    step="1"
                    min="0"
                    id="StoreID"
                    onChange={(e) => {
                      store_id = e.target.value;
                    }}
                  />
                </div>
                <div className="form-group row my-2">
                  <label className="col">(FK) Mall ID: </label>
                  <input
                    className="col"
                    type="number"
                    step="1"
                    min="0"
                    id="MallID"
                    onChange={(e) => {
                      mall_id = e.target.value;
                    }}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addReview();
                  handleClose();
                }}>
                Add Review
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    const UpdateReviewModal = () => {
      rating = globalRating;
      review = globalReview.slice();
      user_id = globalUserID;
      store_id = globalStoreID;
      mall_id = globalMallID;

      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Update Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form p-5">
                <div className="form-group my-2">
                  <label>Review</label>
                  <textarea
                    className="form-control"
                    id="mall name"
                    rows="3"
                    defaultValue={review}
                    onChange={(e) => {
                      review = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group row my-2">
                  <label className="col">Rating: </label>
                  <input
                    className="col"
                    type="number"
                    step="1"
                    id="Rating"
                    min="1"
                    max="5"
                    defaultValue={rating}
                    onChange={(e) => {
                      rating = e.target.value;
                    }}
                  />
                </div>
                <div className="form-group row my-2">
                  <label className="col">User ID: </label>
                  <input
                    className="col"
                    type="number"
                    step="1"
                    id="UserID"
                    min="0"
                    defaultValue={user_id}
                    onChange={(e) => {
                      user_id = e.target.value;
                    }}
                  />
                </div>
                <div className="form-group row my-2">
                  <label className="col">Store ID: </label>
                  <input
                    className="col"
                    type="number"
                    step="1"
                    min="0"
                    id="StoreID"
                    defaultValue={store_id}
                    onChange={(e) => {
                      store_id = e.target.value;
                    }}
                  />
                </div>
                <div className="form-group row my-2">
                  <label className="col">Mall ID: </label>
                  <input
                    className="col"
                    type="number"
                    step="1"
                    min="0"
                    id="MallID"
                    defaultValue={mall_id}
                    onChange={(e) => {
                      mall_id = e.target.value;
                    }}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  updateReview();
                  handleClose();
                }}>
                Update review
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    const AddAnswerModal = () => {
      const [updateThisAnswer, setUpdateThisAnswer] = useState("");

      const handleBooleanAnswerChange = (answer) => {
        answerType = answer;
        setUpdateThisAnswer(answerType);
      };

      useEffect(() => {
        if (boolean_answer !== null) {
          setUpdateThisAnswer(0);
        } else {
          setUpdateThisAnswer(1);
        }
      }, []);

      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Add Answer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form">
                <div className="form-group row">
                  <label className="col h6">Radio answer (1/5): </label>
                  <input
                    className="col"
                    type="number"
                    step="1"
                    min={1}
                    max={5}
                    id="radio_answer"
                    onChange={(e) => {
                      radio_answer = e.target.value;
                      handleBooleanAnswerChange(-1);
                    }}
                  />
                </div>

                <div className="form-group row">
                  <label className="col h6">Boolean Answer</label>
                  <div className="form-group row radio col">
                    <div className="row border-bottom">
                      <div className="col">
                        <label>False:</label>
                        <input
                          type="radio"
                          value="0"
                          name="boolean_answer"
                          onChange={() => {
                            handleBooleanAnswerChange(0);
                            radio_answer = 0;
                          }}
                          checked={updateThisAnswer === 0}
                        />
                      </div>
                      <div className="col">
                        <label>True: </label>
                        <input
                          type="radio"
                          value="1"
                          name="boolean_answer"
                          onChange={() => {
                            handleBooleanAnswerChange(1);
                            radio_answer = 0;
                          }}
                          checked={updateThisAnswer === 1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group row my-2">
                  <label className="col">(FK) Review_ID: </label>
                  <input
                    className="col"
                    type="number"
                    min="1"
                    onChange={(e) => {
                      review_id = e.target.value;
                    }}
                  />
                </div>
                <div className="form-group row my-2">
                  <label className="col">(FK) Question_ID: </label>
                  <input
                    className="col"
                    type="number"
                    min="1"
                    onChange={(e) => {
                      questionID = e.target.value;
                    }}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addAnswer(updateThisAnswer);
                  handleClose();
                }}>
                Update question
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    const UpdateAnswerModal = () => {
      const [updateThisAnswer, setUpdateThisAnswer] = useState("");

      const handleBooleanAnswerChange = (answer) => {
        answerType = answer;
        setUpdateThisAnswer(answerType);
      };

      radio_answer = globalRadioAnswer;
      boolean_answer = globalBooleanAnswer;

      useEffect(() => {
        if (boolean_answer !== null) {
          setUpdateThisAnswer(0);
        } else {
          setUpdateThisAnswer(1);
        }
      }, []);

      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Update Answer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form">
                {radio_answer && (
                  <div className="form-group row">
                    <label className="col">Radio answer (1/5): </label>
                    <input
                      className="col"
                      type="number"
                      step="1"
                      min={1}
                      max={5}
                      id="radio_answer"
                      defaultValue={radio_answer}
                      onChange={(e) => {
                        radio_answer = e.target.value;
                      }}
                    />
                  </div>
                )}
                {boolean_answer !== null && (
                  <div className="form-group">
                    <label className="h6">Boolean Answer</label>
                    <div className="form-group row radio">
                      <div className="row border-bottom">
                        <div className="col">
                          <label>False:</label>
                          <input
                            type="radio"
                            value="0"
                            name="boolean_answer"
                            onChange={() => {
                              handleBooleanAnswerChange(0);
                            }}
                            checked={updateThisAnswer === 0}
                          />
                        </div>
                        <div className="col">
                          <label>True: </label>
                          <input
                            type="radio"
                            value="1"
                            name="boolean_answer"
                            onChange={() => {
                              handleBooleanAnswerChange(1);
                            }}
                            checked={updateThisAnswer === 1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  updateAnswer();
                  handleClose();
                }}>
                Update question
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };

    const AddSubCommentModal = () => {
      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Add SubComment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form p-5">
                <div className="form-group my-2">
                  <label>SubComment</label>
                  <textarea
                    className="form-control"
                    id="mall name"
                    rows="3"
                    onChange={(e) => {
                      subReview = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group row my-2">
                  <label className="col">(FK) Review_ID: </label>
                  <input
                    className="col"
                    type="number"
                    onChange={(e) => {
                      review_id = e.target.value;
                    }}
                  />
                </div>
                <div className="form-group row my-2">
                  <label className="col">(FK) User_ID: </label>
                  <input
                    className="col"
                    type="number"
                    onChange={(e) => {
                      user_id = e.target.value;
                    }}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addSubComment();
                  handleClose();
                }}>
                Add SubComment
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    const UpdateSubCommentModal = () => {
      subReview = globalSubReview.slice();
      user_id = globalUserID;
      store_id = globalStoreID;
      mall_id = globalMallID;

      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Update SubComment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form p-5">
                <div className="form-group my-2">
                  <label>SubComment</label>
                  <textarea
                    className="form-control"
                    id="mall name"
                    rows="3"
                    defaultValue={subReview}
                    onChange={(e) => {
                      subReview = e.target.value;
                    }}></textarea>
                </div>
                <div className="form-group row my-2">
                  <label className="col">(PK) SubReview_ID: </label>
                  <input
                    readOnly
                    className="col"
                    type="number"
                    value={globalSubReviewID}
                  />
                </div>
                <div className="form-group row my-2">
                  <label className="col">(FK) Review_ID: </label>
                  <input
                    readOnly
                    className="col"
                    type="number"
                    value={globalReviewID}
                  />
                </div>
                <div className="form-group row my-2">
                  <label className="col">(FK) User_ID: </label>
                  <input
                    readOnly
                    className="col"
                    type="number"
                    value={globalUserID}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  updateSubComment();
                  handleClose();
                }}>
                Update SubComment
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };

    switch (modal) {
      case "addQuestion":
        return (
          <>
            <AddQuestionModal />
          </>
        );
      case "updateQuestion":
        return (
          <>
            <UpdateQuestionModal />
          </>
        );
      case "addMall":
        return (
          <>
            <AddMallModal />
          </>
        );
      case "updateMall":
        return (
          <>
            <UpdateMallModal />
          </>
        );
      case "addStore":
        return (
          <>
            <AddStoreModal />
          </>
        );
      case "updateStore":
        return (
          <>
            <UpdateStoreModal />
          </>
        );
      case "addReview":
        return (
          <>
            <AddReviewModal />
          </>
        );
      case "updateReview":
        return (
          <>
            <UpdateReviewModal />
          </>
        );
      case "addAnswer":
        return (
          <>
            <AddAnswerModal />
          </>
        );
      case "updateAnswer":
        return (
          <>
            <UpdateAnswerModal />
          </>
        );
      case "addSubComment":
        return (
          <>
            <AddSubCommentModal />
          </>
        );
      case "updateSubComment":
        return (
          <>
            <UpdateSubCommentModal />
          </>
        );
      case "addUser":
        return (
          <>
            <AddUserModal />
          </>
        );
      case "updateUser":
        return (
          <>
            <UpdateUserModal />
          </>
        );

      default:
        return (
          <>
            <AddQuestionModal />
          </>
        );
    }
  }

  const DisplaySwitch = () => {
    switch (display) {
      case "users":
        return (
          <div className="row flex m-5">
            <DisplayNav />
            <UsersDisplay />
          </div>
        );
      case "questions":
        return (
          <div className="row flex m-5">
            <DisplayNav />
            <QuestionsDisplay />
          </div>
        );
      case "malls":
        return (
          <div className="row flex m-5">
            <DisplayNav />
            <MallsDisplay />
          </div>
        );
      case "stores":
        return (
          <div className="row flex m-5">
            <DisplayNav />
            <StoresDisplay />
          </div>
        );
      case "answers":
        return (
          <div className="row flex m-5">
            <DisplayNav />
            <AnswersDisplay />
          </div>
        );
      case "reviews":
        return (
          <div className="row flex m-5">
            <DisplayNav />
            <ReviewsDisplay />
          </div>
        );
      case "subcomments":
        return (
          <div className="row flex m-5">
            <DisplayNav />
            <SubCommentsDisplay />
          </div>
        );
      default:
        return (
          <div className="row flex m-5">
            <DisplayNav />
            <UsersDisplay />
          </div>
        );
    }
  };
  return (
    <div className="">
      <DisplaySwitch />
      <ModalsHandler
        handleClose={handleClose}
        handleShow={handleShow}
        show={show}
        setShow={setShow}
      />
    </div>
  );
}
