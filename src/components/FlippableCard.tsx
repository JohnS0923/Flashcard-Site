import React, { useState } from "react";
import "./FlippableCard.css";
import { ReactNode } from "react";

interface Props {
  FrontText?: string;
  BackText?: string;
  children?: ReactNode;
}
function FlippableCard({ FrontText, BackText }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <>
      <div className="center">
        <div
          className={`the-card ${isFlipped ? "flipped" : ""}`}
          onClick={handleFlip}
        >
          <div className="the-card-inner">
            <div className="the-card-front">
              <p>{FrontText}</p>
            </div>
            <div className="the-card-back">
              <p>{BackText}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FlippableCard;
