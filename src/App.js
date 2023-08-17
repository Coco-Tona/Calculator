import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./Component/style.css";
import DigitButton from "./Component/DigitButton";
import OperationButton from "./Component/OperationButton";

export const ACTIONS = {
  ADD_DIGITS: "add-digits",
  ADD_OPERATIONS: "add-operations",
  CLEAR: "clear",
  DELETE: "delete",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGITS:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      if (state.currentOperand === "0" && payload.digit === "0") return state;
      if (state.currentOperand === "0") {
        return {
          ...state,
          currentOperand: payload.digit,
        };
      }
      if (payload.digit == "." && state.currentOperand == null) {
        return {
          // ...state,
          currentOperand: ` 0${payload.digit}`,
        };
      }
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.ADD_OPERATIONS:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;

      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          currentOperand: null,
          operation: payload.operation,
        };
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      return {
        ...state,
        currentOperand: null,
        operation: payload.operation,
        previousOperand: evaluating(state),
      };
    case ACTIONS.EVALUATE:
      if (
        state.currentOperand == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      )
        return state;
      return {
        ...state,
        previousOperand: null,
        operation: null,
        currentOperand: evaluating(state),
        overwrite: true,
      };
    case ACTIONS.CLEAR:
      return {
        currentOperand: null,
        previousOperand: null,
      };
    case ACTIONS.DELETE:
      if (state.currentOperand == null) return state;

      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          // overwrite: false,
        };
      }

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    default:
      return null;
  }
}

function evaluating({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  // console.log(prev);
  // console.log(curr);
  if (isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;
  }
  return computation.toString();
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand === undefined || operand === null) return;
  // 22
  // Answer: ['22']
  const [integer, decimal] = operand.split(".");
  if (decimal === undefined || decimal === null)
    return INTEGER_FORMATTER.format(integer);
  else return INTEGER_FORMATTER.format(integer) + "." + decimal;
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] =
    React.useReducer(reducer, {});
  return (
    <div className="container">
      <div className="first-section">
        <div className="previous">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current">{formatOperand(currentOperand)}</div>
      </div>
      <div className="second-section">
        <div className="box">
          <button
            className="span-one"
            onClick={() => dispatch({ type: ACTIONS.CLEAR })}
          >
            AC
          </button>
          <button
            className="span-two"
            onClick={() => dispatch({ type: ACTIONS.DELETE })}
          >
            Del
          </button>
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <OperationButton operation="/" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <OperationButton operation="*" dispatch={dispatch} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="3" dispatch={dispatch} />
          <OperationButton operation="+" dispatch={dispatch} />
          <DigitButton digit="." dispatch={dispatch} />
          <DigitButton digit="0" dispatch={dispatch} />
          <button
            className="equal"
            onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
          >
            =
          </button>
          <OperationButton operation="-" dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}

export default App;
