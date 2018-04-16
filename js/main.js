const data = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
let opened = []
let temp2Opened = []
let numberOfSteps = 0

function shuffleCards(cardsList) {
  return [...cardsList]/* .sort(function() {
    return 0.5 - Math.random();
  }); */
}

function showCard(id) {
  $("#" + id).css("visibility", "visible")
}

const calculateStarRatings = (time, moves) => {
  const timeInSeconds = time/1000
  if (timeInSeconds < 30 && moves < 30 ) {
    return "3 Stars" 
  } else if (timeInSeconds < 45 && moves < 40) {
    return "2 Stars"
  } else {
    return "1 Star"
  }
}

function resetBoard() {
  const shuffledCards = shuffleCards(data);
  shuffledCards.forEach((element, index) => {
    $("#game-board").append(
      `<div id="ele-${index}" class="board"> 
        <div id="ele-${index}-inner"  >${element}</div>
      </div>`
    );

    
    $("#ele-" + index + "-inner").css("visibility", "hidden");
    
    
    $("#ele-" + index).click(function() {
      $("#star-ratings").html(calculateStarRatings(elapsed, numberOfSteps))

      $("#ele-" + index + "-inner").css("visibility", "visible");

      numberOfSteps++
      $("#no-of-steps").text(numberOfSteps);

      temp2Opened.push(index)
      opened.push(index)

      if (temp2Opened.length === 2) {
        if (shuffledCards[temp2Opened[0]] === shuffledCards[temp2Opened[1]]) {
          opened = _.uniq([...opened, ...temp2Opened])
        } else {
          _.remove(opened, o => o === temp2Opened[0] || o === temp2Opened[1] )    
        }
        temp2Opened = []
      }
      shuffledCards.forEach((element, index) => {
        if(!opened.includes(index)) {
          setTimeout(() => { 
            $("#ele-" + index + "-inner").css("visibility", "hidden");
           }, 500);
          _.remove(opened, o => o === index)
        }
      })

      console.log(opened.length, data.length)
      if (opened.length === data.length) {
        showCongratulationPopUp();
      }
    })
  });
}

let timer
let currentTime
let elapsed = 0

const gameTimer = () => {
  let startTime = new Date().getTime();

  timer = setInterval(function() {
    let now = new Date().getTime();

    elapsed = now - startTime;
    let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    currentTime = minutes + " : " + seconds;

    $("#clock").text(currentTime);
  }, 1000);
};

const removeGameBoardFromScreen = () => {
  $("#game-board").empty();
}

const resetNumberOfSteps = () => {
  numberOfSteps = 0
  $("#no-of-steps").text(numberOfSteps);
}

const resetTimer = () => {
  clearInterval(timer)
  $("#clock").text("0 : 00");
}

const resetGame = () => {
  removeGameBoardFromScreen();
  resetBoard();
  resetNumberOfSteps();
  resetTimer();
  gameTimer();
  opened = []
  temp2Opened = []
  $("#star-ratings").html(calculateStarRatings(elapsed, numberOfSteps))
  
}

$(".restart-game").click(() => {
  resetGame()
  $('#exampleModal').modal('hide');  
})



const showCongratulationPopUp = () => {
  $('#exampleModal').modal('show');
  $(".modal-body").html(`<div>Congratulations! You have taken ${currentTime} time.
  Do you want to play again?</div>`)
  clearInterval(timer)
}

$('#exampleModal').modal('show');
