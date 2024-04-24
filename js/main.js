let currentCalc = "";
let prevOperator = "";

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

  //Check if user tries to set duplicate operators
  if (!CheckDuplicateOperator(event.target.value, prevOperator)) {
    prevOperator = event.target.value;

    if (event.target.value === "=") {
      if (currentCalc.length > 1 && history.childNodes.length < 10) {
        const p = document.createElement("p");

        if (history.childNodes.length == 9) {
          p.innerText = "History full! Please clear!";
          p.classList.add("redText");
        } else {
          const calculation = currentCalc;
          currentCalc = math.evaluate(currentCalc);
          p.innerHTML += calculation + " = " + currentCalc;
        }

        p.classList.add("historyPara");
        history.append(p);
      }
    } else if (event.target.value === "CE") currentCalc = "";
    else currentCalc += event.target.value;

    inputField.textContent = currentCalc;
  }
}

//Function that checks for duplicate operators
function CheckDuplicateOperator(newVal, currentOperator) {
  if (isOperator(newVal)) {
    if (isOperator(newVal) && isOperator(currentOperator)) return true;
  }
  return false;
}

function isOperator(v) {
  if (
    v === "+" ||
    v === "-" ||
    v === "/" ||
    v === "*" ||
    v === "%" ||
    v === "." ||
    v === "="
  )
    return true;

  return false;
}
