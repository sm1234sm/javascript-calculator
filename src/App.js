import React, { useState, useEffect } from 'react';
import './App.css';

const initialState = {
  numbers: [],
  operators: [],
  lastDisplay: "",
  viewDisplay: "",
  lastInput: "",
  signedNumber: false
}

const Display = (props) => {
  return (
    <div id="display">
      {props.display}
    </div>
  )
}

const ResetPad = (props) => {
  return (
    <div id="reset">
      <button onClick={() => props.resetLastInput()}>C</button>
      <button onClick={() => props.resetCalculatorHandler()} className='clear'>AC</button>
    </div>
  )
}

const NumberPad = (props) => {
  return (
    <button onClick={() => props.numPadHandler(props.number)}>{props.number}</button>
  )
}

function App() {
  const [state, setState] = useState(initialState);

  const [display, setDisplay] = useState('0');

  useEffect(() => {
  }, [display])

  const resetCalculator = () => {
    setState({
      numbers: [],
      operators: [],
      lastDisplay: "0",
      viewDisplay: "",
      lastInput: "",
      signedNumber: false
    })
    setDisplay(prevState => "0")
    // $("#view").text("0")
  }

  const resetLastInput = ({ display = "", input = "" }) => {
    setState(prevState => ({
      ...prevState,
      lastDisplay: display,
      lastInput: input,
    }))

    if (state.numbers.length <= state.operators.length) {
      setState(prevState => ({
        ...prevState,
        operators: prevState.operators.pop(),
        viewDisplay: prevState.viewDisplay.slice(0, -1)
      }))

    }
  }

  const calculate = () => {
    let temp = state.numbers[0];
    const tempNumbers = [];
    const tempOperators = [];
    let continueCalculate = true;
    setState(prevState => ({
      ...prevState,
      numbers: prevState.numbers.map((number) => parseFloat(number))
    }))
    //console.log("Numbers", numbers);
    for (let i = 0; i < (state.operators.length); i++) {
      switch (state.operators[i]) {
        case "*":
          continueCalculate = true;
          temp *= state.numbers[i + 1];
          // console.log("Case 1", temp);
          break;
        case "/":
          continueCalculate = true;
          temp /= state.numbers[i + 1];
          // console.log("Case 2", temp);
          break;
        default:
          // console.log("Case Default", temp);
          if (continueCalculate) {
            continueCalculate = false;
            tempNumbers.push(parseFloat(temp));
            tempOperators.push(state.operators[i]);
            temp = state.numbers[i + 1];
          } else {
            temp = state.numbers[i + 1];
            tempNumbers.push(state.numbers[i]);
            tempOperators.push(state.operators[i]);
          }
      }
    }
    tempNumbers.push(temp);
    let result = tempNumbers.reduce((previousNumber, currentNumber, index) => {
      if (tempOperators[index - 1] === "+") {
        console.log(previousNumber, currentNumber, index);
        return previousNumber + currentNumber;
      } else if (tempOperators[index - 1] === "-") {
        console.log(previousNumber, currentNumber, index);
        return previousNumber - currentNumber;
      }
    })
    //console.log(tempNumbers, tempOperators, result);
    setState(prevState => ({
      ...prevState,
      numbers: [],
      operators: [],
      lastDisplay: result.toString(),
      viewDisplay: ""
    }))

    setDisplay(prevState => state.lastDisplay);
    //$("#view").text(lastDisplay);
  }

  // const resetCalculatorHandler = () => {
  //   switch (/*$(this).text()*/) {
  //     case "C":
  //       resetLastInput({});
  //       //$("#view").text(viewDisplay === "" ? 0 : viewDisplay);
  //       setDisplay(prevState => (state.viewDisplay === "" ? 0 : state.viewDisplay));
  //       break;
  //     case "AC":
  //       resetCalculator();
  //       break;
  //   }
  // }

  const numPadHandler = (number) => {
    setState(prevState => ({
      ...prevState,
      lastInput: number
    }))

    setDisplay(prevState=>
      state.viewDisplay + state.lastDisplay + number
    )

    console.log("State: ", state)

    if (state.lastDisplay + state.lastInput === "00") {
      return;
    }

    console.log("Last display", state.lastDisplay);

    if ((state.lastInput === ".") && (state.lastDisplay.indexOf(".") >= 0)) {
      console.log("Double dots");
      return;
    }

    if (state.lastDisplay === "0" && (!!parseFloat(state.lastInput) > 0 || state.lastInput !== ".")) {
      setState(prevState => ({
        ...prevState,
        lastDisplay: ""
      }))

    }

    if ((state.lastDisplay === "" || isNaN(state.lastDisplay)) && state.lastInput === ".") {
      setState(prevState => ({
        ...prevState,
        lastInput: "0."
      }))

    }

    if ((state.lastInput === "." && state.lastDisplay.slice(-1) === ".") || (state.lastInput === "." && state.lastDisplay === "") || (state.lastInput === "." && isNaN(state.lastDisplay))) {
      return;
    }

    if (isNaN(state.lastDisplay) && state.lastDisplay !== "" && state.numbers.length && !state.signedNumber) {
      setState(prevState => ({
        ...prevState,
        operators: [...prevState.operators, prevState.lastDisplay],
        viewDisplay: prevState.viewDisplay + prevState.lastDisplay,
        lastDisplay: prevState.lastInput
      }))

      //console.log("First ", $(this).text());
    } else {
      if (state.lastDisplay !== "" && isNaN(state.lastDisplay) && state.viewDisplay !== "") {
        //console.log("Test 1");
        setState(prevState => ({
          ...prevState,
          operators: [...prevState.operators, prevState.lastDisplay],
          viewDisplay: prevState.viewDisplay + prevState.lastDisplay,
          lastDisplay: "-" + prevState.lastInput,
          signedNumber: false
        }))
      } else {
        //console.log("Test 2");
        setState(prevState => ({
          ...prevState,
          lastDisplay: prevState.lastDisplay + prevState.lastInput
        }))
      }
    }
    setDisplay(prevState => state.viewDisplay + state.lastDisplay);
    //$("#view").text(viewDisplay + lastDisplay);

    console.log("Numbers", state.numbers);
    console.log("Operators", state.operators);
  }

  const operatorPadHandler = (operator) => {
    setState(prevState => ({
      ...prevState,
      lastInput: operator
    }))

    setDisplay(prevState=>(
      state.viewDisplay + state.lastDisplay + operator
    ))

    console.log('State: ' + state)

    if ((state.lastDisplay === "" || state.lastDisplay === "-") && state.lastInput !== "-" && state.viewDisplay === "") {
      console.log(`(state.lastDisplay === "" || state.lastDisplay === "-") && state.lastInput !== "-" && state.viewDisplay === ""`)
      return;
    }

    if (!state.numbers.length && !state.operators.length && parseFloat(state.lastDisplay + state.lastInput) === 0) {
      console.log(`!state.numbers.length && !state.operators.length && parseFloat(state.lastDisplay + state.lastInput) === 0`)
      resetCalculator();
      return;
    }

    if (parseFloat(state.lastDisplay + state.lastInput) === 0) {
      console.log(`parseFloat(state.lastDisplay + state.lastInput) === 0`)
      resetLastInput({ display: state.lastInput, input: state.lastInput });
      if (state.lastDisplay === "=") {
        setState(prevState => ({
          ...prevState,
          lastInput: "",
          lastDisplay: ""
        }))
      }
      setDisplay(prevState => (state.viewDisplay + state.lastDisplay));
      //$("#view").text(viewDisplay + lastDisplay);
      return;
    }

    if (state.lastDisplay.slice(-1) === ".") {
      console.log(`state.lastDisplay.slice(-1) === "."`)
      //console.log("Last Display", state.lastDisplay.slice(-1), state.lastDisplay);
      setState(prevState => ({
        ...prevState,
        lastDisplay: "0"
      }))
      setDisplay(prevState => (state.viewDisplay + state.lastDisplay));
      //$("#view").text(viewDisplay + lastDisplay);
    }

    if (state.lastInput === "=") {
      console.log(`state.lastInput === "="`)
      if (!isNaN(state.lastDisplay)) {
        setState(prevState => ({
          ...prevState,
          numbers: [...prevState.numbers, prevState.lastDisplay]
        }))
      }
      calculate();
      return;
    }


    if (!isNaN(state.lastDisplay) && state.lastDisplay !== "") {
      console.log(`!isNaN(state.lastDisplay) && state.lastDisplay !== ""`)
      setState(prevState => ({
        ...prevState,
        numbers: [...prevState.numbers, prevState.lastDisplay],
        viewDisplay: prevState.viewDisplay + parseFloat(prevState.lastDisplay).toString(),
        lastDisplay: prevState.lastInput,
        signedNumber: false
      }))

      setDisplay(prevState => (state.viewDisplay + state.lastDisplay));
      //$("#view").text(viewDisplay + lastDisplay);

      //console.log("First ", lastInput);
    } else {
      if (state.lastInput === "-" && isNaN(state.lastDisplay)) {
        console.log(`state.lastInput === "-" && isNaN(state.lastDisplay)`)
        setState(prevState => ({
          ...prevState,
          signedNumber: true
        }))

        if (!state.numbers.length) {
          console.log(`!state.numbers.length`)
          setDisplay(prevState => (state.viewDisplay + state.lastDisplay));
          //$("#view").text(viewDisplay + lastDisplay);
        } else {
          console.log(`else`)
          setDisplay(prevState => (state.viewDisplay + state.lastDisplay + state.lastInput));
          //$("#view").text(viewDisplay + lastDisplay + lastInput);
        }

      } else {
        console.log(`else`)
        setState(prevState => ({
          ...prevState,
          signedNumber: false,
          lastDisplay: prevState.lastInput
        }))
        setDisplay(prevState => (state.viewDisplay + state.lastDisplay));
        //$("#view").text(viewDisplay + lastDisplay);
      }
      //console.log("Second ", $(this).text());
    }
    console.log("Numbers", state.numbers);
    console.log("Operators", state.operators);
  };

  const numbers = [
    { className: "seven", input: "7" },
    { className: "eight", input: "8" }, { className: "nine", input: "9" }, { className: "four", input: "4" }, { className: "five", input: "5" }, { className: "six", input: "6" }, { className: "one", input: "1" }, { className: "two", input: "2" }, { className: "three", input: "3" }, { className: "zero", input: "0" }, { className: "decimal", input: "." }
  ];

  const operators = [
    { className: "add", input: "+" }, { className: "subtract", input: "-" }, { className: "multiply", input: "*" }, { className: "divide", input: "/" }, { className: "equal", input: "=" }
  ];

  const numberPads = numbers.map((number, index) =>
    <button onClick={() => numPadHandler(number.input)} className={number.className} key={index}>{number.input}</button>
  );

  const operatorPads = operators.map((operator, index) =>
    <button onClick={()=> operatorPadHandler(operator.input)} className={operator.className} key={index}>{operator.input}</button>
  );

  return (
    <div className="App">
      <Display display={display} />
      <div id="keypad">
        <ResetPad resetCalculatorHandler={resetCalculator} />
        <div id="numbers">
          {numberPads}
        </div>
        <div id="operations">
          {operatorPads}
        </div>
      </div>
    </div>
  );
}

export default App;
