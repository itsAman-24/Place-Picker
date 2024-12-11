import { useRef, useState, useEffect, useCallback } from "react";
import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

// After every reload we are fetching all the locally stored data inside the localStorage
const storedPlacesIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedPlacesIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [placeAdded, setPlaceAdded] = useState(false);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState(storedPlacesIds);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.longitude,
        position.coords.latitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    if (selectedPlaceIds.includes(id)) {
      return; // Do nothing if the place is already selected
    }

    setPlaceAdded((prev) => !prev);

    setPickedPlaces((prevPickedPlaces) => {
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    setSelectedPlaceIds((prevSelectedPlaceIds) => [id, ...prevSelectedPlaceIds]);

    // Storing the selected places into localStorage
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify([id, ...selectedPlaceIds])
    );
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setSelectedPlaceIds((prevSelectedPlaceIds) =>
      prevSelectedPlaceIds.filter((id) => id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    const storedPlacesIds =
      JSON.parse(localStorage.getItem("selectedPlaces")) || [];

    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(
        storedPlacesIds.filter((id) => id != selectedPlace.current)
      )
    );
  }

  const handleRemovePlaceCallback = useCallback(() => {
    handleRemovePlace();
  }, [handleRemovePlace]);

  return (
    <>
      <Modal open={modalIsOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlaceCallback}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Selecting the places according to the distance..."
          onSelectPlace={handleSelectPlace}
          addedPlaceIds={selectedPlaceIds} // Passing selected places ids to check
        />
      </main>
    </>
  );
}

export default App;
