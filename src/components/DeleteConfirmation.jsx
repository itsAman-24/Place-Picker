import { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar";

const timer = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onCancel();
    }, 3000);

    //This cleanup function will run right before the next execution OR can say second execution of sideEffect function and also right before this component will be going to remove from the DOM tree OR can say dismounted.
    return () => {
      clearTimeout(timer);
    }

  }, [onConfirm]);
  

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={timer}/>
    </div>
  );
}
