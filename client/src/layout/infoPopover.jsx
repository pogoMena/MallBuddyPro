import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
// Popover component
export default function Popover() {
  const [isOpen, setIsOpen] = useState("");

  useEffect(() => {
    setIsOpen(false);
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Button
        onClick={() => {
          toggleOpen();
        }}>
        🛈
      </Button>
      {isOpen && (
        <div className="popover position-absolute">
          <div className="popover-header">What is this?</div>
          <div className="popover-body">
            <p>
              MallBuddy pro is an application to help you with all of your
              shopping needs!
            </p>
            <p>
              <strong>First page: </strong>Enter the shopping center you are
              going to be shopping at.
            </p>
            <p>
              <strong>Second Page: </strong>You will have the option to enter a
              specific item you are searching for (I.E. "Hats"). The application
              will then show all stores within the shopping center that match
              your search criteria. You have the option to leave a review and
              take a survey for any store within the mall. You can also sort the
              stores based off of the different ratings calculated by surveys
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
