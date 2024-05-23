//Settings
const maxHistory = 10;

//Temporary vars
let currentCalc = "";
let pointUsed = false;
let braceLeft = 0;
let braceRight = 0;

const allowedFirstChars = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "-",
  "(",
]; //This array contains characters that are valid to use when entering first input value in the calculator

const btns = document.getElementsByClassName("inputBtn");
const clearBtn = document.getElementById("clearBtn");

//Adding event listeners on every button
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", addInput);
}

clearBtn.addEventListener("click", removeHistory);

//Removes previously calculated calculation texts
function removeHistory() {
  const historyContent = document.getElementById("history");
  const texts = document.getElementById("texts");
  texts.remove();

  const newTexts = document.createElement("div");
  newTexts.setAttribute("id", "texts");
  historyContent.insertBefore(newTexts, historyContent.childNodes[2]);
}

//Add input to calculator field
function addInput(event) {
  const inputField = document.getElementById("input-field");
  const history = document.getElementById("texts");
  const charValue = event.target.value;
  const latestValue = currentCalc[currentCalc.length - 1];

  //Reset early if reset is pressed
  if (charValue === "CE") {
    currentCalc = "";
    inputField.textContent = currentCalc;
    return;
  }
  //If first character is not a valid first character, return early
  if (currentCalc === "" && !allowedFirstChars.includes(charValue)) return;

  //Check if braces count match each other on both sides, else return
  if (
    (charValue === "(" && braceLeft > braceRight) ||
    (charValue === ")" && braceRight >= braceLeft)
  )
    return;
  //Count braces
  if (charValue === "(") braceLeft += 1;
  if (charValue === ")") braceRight += 1;

  //Replace operator if previous value is operator too
  if (
    isOperator(latestValue) &&
    isOperator(charValue) &&
    currentCalc.length > 1
  )
    currentCalc = currentCalc.slice(0, -1);

  //Check validity of operators or decimal points
  if (
    (latestValue === "-" && isOperator(charValue)) ||
    (latestValue === "." && charValue === ".") ||
    (latestValue === "." && isOperator(charValue)) ||
    (isOperator(latestValue) && charValue === ".") ||
    (charValue === "." && pointUsed === true)
  )
    return;

  //Check if user can use decimal point again
  if (pointUsed === true && isOperator(charValue)) pointUsed = false;

  //Set true if user uses decimal point
  if (charValue === "." && pointUsed === false) pointUsed = true;

  //Try to evaluate the expression
  if (charValue === "=") {
    if (currentCalc.length > 1 && history.childNodes.length < maxHistory + 1) {
      const p = document.createElement("p");

      //Check if history is full
      if (history.childNodes.length === maxHistory) {
        p.innerText = "History full! Please clear!";
        p.classList.add("redText");

        //Evaluate the expression sent by the User. Can return error if given an invalid expression.
      } else {
        const calculation = currentCalc;

        try {
          const tempCalc = math.evaluate(currentCalc);

          if (isNaN(tempCalc) || !isFinite(tempCalc)) {
            throw new Error("Invalid result");
          }

          currentCalc = tempCalc;
        } catch (error) {
          console.error("Invalid expression error:", error.message);

          p.textContent = "Invalid Expression!";
          inputField.textContent = "Invalid Expression!";

          currentCalc = "";
          return "Error";
        }

        //Reset braces count
        braceLeft = 0;
        braceRight = 0;

        p.innerHTML += calculation + " = " + currentCalc;
        currentCalc = "";
        pointUsed = false;
      }

      p.classList.add("historyPara");
      history.append(p);
    }
  } else currentCalc += charValue;

  //Update inputField textContent to match current result
  inputField.textContent = currentCalc;
}

//Function that checks for duplicate operators
function CheckDuplicateOperator(newVal, currentOperator) {
  if (isOperator(newVal) && isOperator(currentOperator)) return true;

  return false;
}

function isOperator(v) {
  if (v === "+" || v === "-" || v === "/" || v === "*" || v === "%")
    return true;

  return false;
}
