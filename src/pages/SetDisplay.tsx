import { useEffect, useState, ChangeEvent } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Flashcard from "../components/Flashcard2";
import { getGlobalVariable } from "../variable/globalVar";
import FlippableCard from "../components/FlippableCard";
import Popup from "../popup/Popup.tsx";

function DisplaySet() {
  interface Cards {
    cardId: number;
    setId: number;
    userId: number;
    cardFront: string;
    cardBack: string;
    starred: boolean;
  }

  const navigate = useNavigate();

  const { setId } = useParams();
  const [setName, setSetName] = useState("");
  const [cardsList, setCardsList] = useState<Cards[]>([]);
  const [editMode, setEditMode] = useState(false);

  //check for authentication
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const userId = getGlobalVariable();

        if (userId === "0" || userId == null) {
          // User is not authenticated, navigate to the login page
          navigate("/login");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    checkAuthentication();
  }, [navigate]);

  // hold variable for view like 1 = view favorite
  const [selectedValue, setSelectedValue] = useState("0");

  //on change set value
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };

  //slide variable
  const [slideLocation, setSlideLocation] = useState(0);
  const [slideList, setSlideList] = useState<Cards[]>([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [isStarredSwitchToggled, setStarredSwitchToggled] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleStarredSwitchToggle = () => {
    setStarredSwitchToggled(!isStarredSwitchToggled);
    setSlideLocation(0);
  };

  const [isShuffleSwitchToggled, setShuffleSwitchToggled] = useState(false);

  const handleShuffleSwitchToggle = () => {
    setShuffleSwitchToggled(!isShuffleSwitchToggled);
    setSlideLocation(0);
  };

  useEffect(() => {
    let updatedSlideList = cardsList;

    if (isStarredSwitchToggled) {
      updatedSlideList = updatedSlideList.filter((card) => card.starred);
    }

    if (isShuffleSwitchToggled) {
      // Clone the current slideList to avoid mutating the state directly
      updatedSlideList = [...updatedSlideList];

      // Apply the Fisher-Yates shuffle algorithm
      for (let i = updatedSlideList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [updatedSlideList[i], updatedSlideList[j]] = [
          updatedSlideList[j],
          updatedSlideList[i],
        ];
      }
    }

    setSlideList(updatedSlideList);
    // console.log(updatedSlideList);
  }, [isShuffleSwitchToggled, isStarredSwitchToggled]);

  //get card data
  const getData = () => {
    axios
      .get("https://localhost:7119/Flashcard/GetCardInSet?setId=" + setId)
      .then((res) => {
        // console.log(res.data);
        setSetName(res.data.setName);
        setCardsList(res.data.cardsList);
        setSlideList(cardsList);
        // setSlideList(
        //   isStarredSwitchToggled
        //     ? cardsList.filter((card: Cards) => card.starred)
        //     : cardsList
        // );
        console.log(cardsList);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  // Handle the case where setId is undefined
  if (!setId) {
    return <div>Error: Set ID not provided</div>;
  } else {
    useEffect(() => {
      getData();
    }, []);
  }
  const addCard = async () => {
    try {
      // Add a new card
      const response = await axios.post(
        "https://localhost:7119/Flashcard/AddCard",
        {
          setId: setId,
          userId: getGlobalVariable(),
          cardFront: "",
          cardBack: "",
          starred: false,
        }
      );

      console.log(response.data);

      getData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteSet = (setId: number) => {
    axios
      .post("https://localhost:7119/Flashcard/DeleteSet?setId=" + setId)
      .then(() => {
        // console.log(res.data);
        navigate("../");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const onChange = () => {
    getData();
  };
  return (
    <div>
      <div className="header">
        <div className="go-back">
          <NavLink to="../">
            <i className="fa-solid fa-chevron-left center-icon"></i>
            <p>Go Back</p>
          </NavLink>
        </div>
        <h1 className="centered-h1">{setName}</h1>
        <div className="buttons" onClick={() => setEditMode(!editMode)}>
          <p>Edit Set</p>
        </div>
      </div>
      {editMode ? (
        <div
          className="buttons center"
          onClick={() => deleteSet(Number(setId))}
        >
          <p>Delete Set</p>
        </div>
      ) : null}
      {/* card */}
      {slideList != null && slideList.length > 0 ? (
        <div className="centered-container">
          <div className="slides">
            {/* set up control */}
            {slideLocation != 0 ? (
              <i
                className="fa-solid fa-arrow-left"
                onClick={() => {
                  setSlideLocation(slideLocation - 1);

                  setIsFlipped(true);
                  setIsFlipped(false);
                  console.log(isFlipped);
                }}
              ></i>
            ) : (
              <i className="fa-solid fa-arrow-left disable"></i>
            )}
            {slideLocation == slideList.length ? (
              <div
                className="center"
                style={{
                  width: "400px",
                  height: "300px",
                  cursor: "pointer",
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center", // Vertical centering
                }}
              >
                <div className="buttons" onClick={() => setSlideLocation(0)}>
                  Reset
                </div>
              </div>
            ) : (
              <div>
                <FlippableCard
                  frontText={slideList[slideLocation].cardFront}
                  backText={slideList[slideLocation].cardBack}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
              </div>
            )}

            {/* setup control */}
            {slideLocation != slideList.length ? (
              <i
                className="fa-solid fa-arrow-right"
                onClick={() => {
                  setSlideLocation(slideLocation + 1);
                  setIsFlipped(true);

                  setIsFlipped(false);
                }}
              ></i>
            ) : (
              <i className="fa-solid fa-arrow-right disable"></i>
            )}
          </div>
          <div>
            {slideLocation == slideList.length ? null : (
              <p>
                {slideLocation + 1}/{slideList.length}
              </p>
            )}
            <i
              className="fa-solid fa-gear"
              onClick={() => setButtonPopup(true)}
            ></i>
          </div>
        </div>
      ) : null}
      <Popup
        trigger={buttonPopup}
        title="Slide Control"
        setTrigger={() => setButtonPopup(false)}
      >
        <div>
          <div className="form-check form-switch">
            <label className="form-check-label" htmlFor="starredSwitch">
              Show Only Starred Items
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="starredSwitch"
              checked={isStarredSwitchToggled}
              onChange={handleStarredSwitchToggle}
            />
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="uniqueSwitch"
              checked={isShuffleSwitchToggled}
              onChange={handleShuffleSwitchToggle}
            />
            <label className="form-check-label" htmlFor="uniqueSwitch">
              Shuffle List
            </label>
          </div>
        </div>
      </Popup>

      {/* {editMode ? (
        cardsList != null ? (
          cardsList.map((card, index, array) => (
            <Flashcard
              key={card.cardId}
              id={card.cardId}
              front={card.cardFront}
              back={card.cardBack}
              starred={card.starred}
              edit={index === array.length - 1 && hasNewCard}
              editView={true}
            />
          ))
        ) : (
          <p>No card avaliable</p>
        )
      ) : cardsList != null ? (
        cardsList.map((card, index, array) => (
          <Flashcard
            key={card.cardId}
            id={card.cardId}
            front={card.cardFront}
            back={card.cardBack}
            starred={card.starred}
            edit={index === array.length - 1 && hasNewCard}
          />
        ))
      ) : (
        <p>No card avaliable</p>
      )} */}
      {/* select type of view */}
      <div className="container-right">
        <select
          className="form-select view-select"
          aria-label="Default select example"
          onChange={handleSelectChange}
          style={{ width: "auto" }}
        >
          <option selected>
            <p>View All</p>
            <i className="fa-solid fa-chevron-down"></i>
          </option>
          <option value="1">View Favorite</option>
        </select>
      </div>
      {cardsList != null ? (
        // change view to favorite if 1
        selectedValue === "1" ? (
          cardsList
            .filter((card) => card.starred) // Filter only non-starred cards
            .map((card) => (
              <Flashcard
                key={card.cardId}
                id={card.cardId}
                front={card.cardFront}
                back={card.cardBack}
                starred={card.starred}
                edit={editMode}
                onChange={onChange}
              />
            ))
        ) : (
          //otherwise show all
          cardsList.map((card) => (
            <Flashcard
              key={card.cardId}
              id={card.cardId}
              front={card.cardFront}
              back={card.cardBack}
              starred={card.starred}
              edit={editMode}
              onChange={onChange}
            />
          ))
        )
      ) : (
        <p>No card available</p>
      )}
      {editMode ? (
        <div className="center-btn-container">
          <button onClick={addCard}>+Add Card</button>
        </div>
      ) : null}
    </div>
  );
}

export default DisplaySet;
