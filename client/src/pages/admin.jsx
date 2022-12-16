import React, { useEffect, useState } from "react";
import Axios from "axios";

export default function Admin(props) {
  const admin = props.admin;

  const deleteUser = (id) => {
    Axios.post("http://localhost:3001/api/delete", {
      id: id,
    });
  };

  const updateUser = (id) => {
    Axios.post("http://localhost:3001/api/update", {
      id: id,
    });
  };

  if (props.loginStatus === true) {
    if (admin) {
      return <Display />;
    }
  } else {
    return "You shouldnt be able to see this";
  }
}

function Display() {
  return <AdminDisplayHandler />;
}

function AdminDisplayHandler() {
  const [userList, setUsers] = useState([]);
  const [display, setDisplay] = useState("");
  const [ActiveDisplay, setActiveDisplay] = useState("");
  const [malls, setMalls] = useState("");
  const [stores, setStores] = useState("");
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/api/getusers", {}).then((response) => {
      setUsers(response.data);
    });
    setActiveDisplay(DisplaySwitch());
  }, []);


  
  const DisplayNav = () => {
    return (
      <div className="col-2 container  p-0 m-auto mt-2">
        <div className="row mt-5">
          <button
            className="m-auto"
            onClick={() => {
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
      </div>
    );
  };

  const UsersDisplay = (props) => {
    return (
      <div className="col-10 p-5 m-auto">
        <div className="container border">
          <div className="row">
            <div className="col h4">Id</div>
            <div className="col h4">Username</div>
            <div className="col h4">Password</div>
            <div className="col h4">Update</div>
            <div className="col h4">Delete</div>
          </div>

          <div>
            {userList && userList.map((val) => {
              return (
                <div className="row">
                  <div className="col text-truncate">{val.id}</div>
                  <div className="col text-truncate">{val.username}</div>
                  <div className="col text-truncate">{val.password}</div>
                  <div className="col text-truncate" key={val.id}>
                    update
                  </div>
                  <div className="col text-truncate" key={val.id}>
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
    return (
      <div className="col-10 p-5 m-auto">
        <div className="container border">
          <div className="row mx-auto">
            <button>Make new question</button>
          </div>
          <div className="row">
            <div className="col h4">Question ID</div>
            <div className="col h4">Question</div>
            <div className="col h4">Answer Type</div>
            <div className="col h4">Display</div>
            <div className="col h4">Update</div>
            <div className="col h4">Delete</div>
          </div>

          <div>
            {questions && questions.map((question) => {
              return (
                <div className="row" key={question.question_id}>
                  <div className="col">{question.question_id}</div>
                  <div className="col text-truncate">{question.question}</div>
                  <div className="col text-truncate">
                    {question.answer_type}
                  </div>
                  <div className="col text-truncate">
                    {question.display === 1 && "True"}
                    {question.display === 0 && "False"}
                  </div>
                  <div className="col">update</div>
                  <div className="col">delete</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  const MallsDisplay = () => {
    return (
      <div className="col-10 p-5 m-auto">
        <div className="container border">
          <div className="row">
            <div className="col h4">Mall ID</div>
            <div className="col h4">Mall Name</div>
            <div className="col h4">Address</div>
            <div className="col h4">Lat</div>
            <div className="col h4">Lng</div>
            <div className="col h4">Update</div>
            <div className="col h4">Delete</div>
          </div>

          <div>
            {malls && malls.map((mall) => {
              return (
                <div className="row" key={mall.mall_id}>
                  <div className="col">{mall.mall_id}</div>
                  <div className="col text-truncate">{mall.mall_name}</div>
                  <div className="col text-truncate">{mall.mall_address}</div>
                  <div className="col text-truncate">{mall.mall_lat}</div>
                  <div className="col text-truncate">{mall.mall_lng}</div>
                  <div className="col">update</div>
                  <div className="col">delete</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  const StoresDisplay = () => {
    return (
      <div className="col-10 p-5 m-auto">
        <div className="container border">
          <div className="row">
            <div className="col h4">Store ID</div>
            <div className="col h4">Store Name</div>
            <div className="col h4">Rating</div>
            <div className="col h4">Update</div>
            <div className="col h4">Delete</div>
          </div>

          <div>
            {stores && stores.map((store) => {
              return (
                <div className="row" key={store.store_id}>
                  <div className="col">{store.store_id}</div>
                  <div className="col text-truncate">{store.store_name}</div>
                  <div className="col">{store.rating}</div>
                  <div className="col">update</div>
                  <div className="col">delete</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const AnswersDisplay = () => {
    return (
      <div className="col-10 p-5 m-auto">
        <div className="container border">
          <div className="row">
            <div className="col h4">Answer ID</div>
            <div className="col h4">Question ID</div>
            <div className="col h4">Review ID</div>
            <div className="col h4">Radio Answer</div>
            <div className="col h4">Boolean Answer</div>
            <div className="col h4">Update</div>
            <div className="col h4">Delete</div>
          </div>

          <div>
            {answers && answers.map((answer) => {
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
                  <div className="col">update</div>
                  <div className="col">delete</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
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
      default:
        return (
          <div className="row flex m-5">
            <DisplayNav />
            <UsersDisplay />
          </div>
        );
    }
  };

  return <DisplaySwitch />;
}
