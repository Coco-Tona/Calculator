import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./Component/style.css";
import DigitButton from "./Component/DigitButton";
import OperationButton from "./Component/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  ADD_OPERATION: "add-operation",
  CLEAR: "clear",
  EVALUATE: "evaluate",
  DELETE: "delete",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };

      if (state.currentOperand === "0" && payload.digit === "0") return state;

      if (state.currentOperand == null && payload.digit === ".") {
        return {
          ...state,
          currentOperand: `0${payload.digit}`,
        };
      } else if (payload.digit === "." && state.currentOperand.includes(".")) {
        return {
          ...state,
          // currentOperand: `0${payload.digit}`,
        };
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.ADD_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
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
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.CLEAR:
      return {
        currentOperand: null,
        previousOperand: null,
      };
    case ACTIONS.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        return state;
      }
      return {
        ...state,
        previousOperand: null,
        operation: null,
        overwrite: true,
        currentOperand: evaluate(state),
        // overwrite: true,
      };
    case ACTIONS.DELETE:
      if (state.currentOperand == null) return state;
      // if (state.previousOperand == null) {
      //   return {
      //     ...state,
      //   };
      // }

      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
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
        // previousOperand: state.currentOperand,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);

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
          <button onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
            =
          </button>
          <OperationButton operation="-" dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}

export default App;
