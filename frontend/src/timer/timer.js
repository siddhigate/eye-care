const pause_Btn = document.querySelector(".pause");
const reset_Btn = document.querySelector(".reset");

const el = document.querySelector(".clock");
const bell = document.querySelector("audio");

const mindiv = document.querySelector(".mins");
const secdiv = document.querySelector(".secs");

const startBtn = document.querySelector(".start");
localStorage.setItem("btn", "focus");

let initial, totalsecs, perc, paused, mins, seconds;

let isbreak;

startBtn.addEventListener("click", () => {
  mins = 1;
  isbreak=false;
  
  pause_Btn.style.display = "initial";
  reset_Btn.style.display = "initial";
  
  startTimer(mins);
});

function decremenT() {
  mindiv.textContent = Math.floor(seconds / 60);
  secdiv.textContent = seconds % 60 > 9 ? seconds % 60 : `0${seconds % 60}`;
  if (circle.classList.contains("danger")) {
    circle.classList.remove("danger");
  }

  if (seconds > 0) {
    perc = Math.ceil(((totalsecs - seconds) / totalsecs) * 100);
    setProgress(perc);
    seconds--;
    initial = window.setTimeout("decremenT()", 1000);
    if (seconds < 10) {
      circle.classList.add("danger");
    }
  } else {
    mins = 0;
    seconds = 0;
    bell.play();

    if(isbreak){
      startTimer(20);
      isbreak = false;
    }
    else{
      startTimer(5);
      isbreak = true;


    }


    // let btn = localStorage.getItem("btn");

    if (btn === "focus") {
      startBtn.textContent = "start break";
      startBtn.classList.add("break");
      // localStorage.setItem("btn", "break");
    } else {
      startBtn.classList.remove("break");
      startBtn.textContent = "start focus";
      // localStorage.setItem("btn", "focus");
    }
    startBtn.style.transform = "scale(1)";
  }
}

function startTimer(mins){
  seconds = mins * 60;
  totalsecs = mins * 60;
  setTimeout(decremenT(), 60);
  startBtn.style.transform = "scale(0)";
  paused = false;
}