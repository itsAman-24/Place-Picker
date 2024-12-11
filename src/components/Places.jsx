import tickIcon from "../assets/tick-icon.png"; 

export default function Places({ title, places, fallbackText, onSelectPlace, addedPlaceIds = [] }) {
  return (
    <section className="places-category">
      <h2>{title}</h2>
      {places.length === 0 && <p className="fallback-text">{fallbackText}</p>}
      {places.length > 0 && (
        <ul className="places">
          {places.map((place) => (
            <li key={place.id} className="place-item">
              <button onClick={() => onSelectPlace(place.id)} className="place-button">
                <img src={place.image.src} alt={place.image.alt} className="place-image" />
                <h3>{place.title}</h3>
                {/* If the place is selected, show the tick icon */}
                {addedPlaceIds.includes(place.id) && (
                  <img src={tickIcon} alt="Selected" className="tick-icon" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
