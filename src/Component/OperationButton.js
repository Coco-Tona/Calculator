import React from "react";
import { ACTIONS } from "../App";

export default function OperationButton({ operation, dispatch }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.ADD_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}
