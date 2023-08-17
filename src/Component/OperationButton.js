import React from "react";
import { ACTIONS } from "../App";

export default function OperationButton({ operation, dispatch }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.ADD_OPERATIONS, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}
