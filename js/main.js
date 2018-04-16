// Data to render on cards when card flips.
const data = [
  `<img class="img-fluid card-img" src="./img/fury.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/fury.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/america.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/america.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/falcon.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/falcon.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/hulk.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/hulk.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/vision.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/vision.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/black-panther.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/black-panther.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/thanos.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/thanos.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/spider.jpeg" />`,
  `<img class="img-fluid card-img" src="./img/spider.jpeg" />`
];
let opened = []; // Opened cards indexes.
let temp2Opened = []; // temporary 2 opened cards indexes.
let numberOfSteps = 0; // No of clicks on the cards.
let timer;
let currentTime = "0 : 00"; // Formatted running time to show on screen.
let elapsed = 0; // Elapsed time in ms.

const svgStar = `<svg height="25" width="23" class="star rating" data-rating="5">
<polygon points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style="fill-rule:nonzero;"/>
</svg>`;

/**
 * @description Shuffles cards randomly
 * @param {Array} cardsList
 * @returns {Array} Shuffled array
 */
const shuffleCards = cardsList => {
  return [...cardsList].sort(() => {
    return 0.5 - Math.random();
  });
};

/**
 * @description Calculate star ratings according to time and number of moves.
 * @param {number} time
 * @param {number} moves
 * @returns {string} Star rating
 */
const calculateStarRatings = (time, moves) => {
  const timeInSeconds = time / 1000;
  if (timeInSeconds < 30 && moves < 30) {
    return svgStar + svgStar + svgStar;
  } else if (timeInSeconds < 45 && moves < 40) {
    return svgStar + svgStar;
  } else {
    return svgStar;
  }
};

/**
 * @description Register click events on particular cards.
 * @param {number} index
 * @param {Array} cards
 */
const registerClickEvent = (index, cards) => {
  const mainCard = $("#ele-" + index);
  // Register click events on the cards.
  mainCard.click(() => {
    // Change star rating on every flip of the card.
    mainCard.addClass("board-flip");
    $("#star-ratings").html(calculateStarRatings(elapsed, numberOfSteps));

    // Using seTimeouts for animation purposes.
    setTimeout(() => {
      $("#ele-" + index + "-inner").css("visibility", "visible");
    }, 100);

    // Increase number of steps whenever user clicks a card.
    numberOfSteps++;
    $("#no-of-steps").text(numberOfSteps);

    // append index of card values.
    temp2Opened.push(index);
    opened.push(index);
    mainCard.unbind("click");

    if (temp2Opened.length === 2) {
      // If 2 successive cards clicked are same push there index in opened array.
      if (cards[temp2Opened[0]] === cards[temp2Opened[1]]) {
        opened = _.uniq([...opened, ...temp2Opened]);
      } else {
        // Animation stuff
        const temp2OpenedCopy = [...temp2Opened];
        setTimeout(() => {
          $("#ele-" + temp2OpenedCopy[0]).removeClass("board-flip");
          $("#ele-" + temp2OpenedCopy[1]).removeClass("board-flip");
        }, 400);

        // bind click event back.
        mainCard.bind({
          click: registerClickEvent(temp2Opened[0], cards)
        });
        mainCard.bind({
          click: registerClickEvent(temp2Opened[1], cards)
        });

        // Remove them from opened array.
        _.remove(opened, o => o === temp2Opened[0] || o === temp2Opened[1]);
      }
      temp2Opened = [];
    }

    // Only keep open those cards which matched successfully else make them hidden.
    cards.forEach((element, index) => {
      if (!opened.includes(index)) {
        setTimeout(() => {
          $("#ele-" + index + "-inner").css("visibility", "hidden");
        }, 500);
        _.remove(opened, o => o === index);
      }
    });

    // If all the cards are opened show congratulation pop up.
    if (opened.length === data.length) {
      showCongratulationPopUp();
    }
  });
};

/**
 * @description Reset board to initial state.
 */
const resetBoard = () => {
  const shuffledCards = shuffleCards(data);
  shuffledCards.forEach((element, index) => {
    // Append cards to the game board.
    $("#game-board").append(
      `<div id="ele-${index}" class="board">
          <div id="ele-${index}-inner">${element}</div>
      </div>`
    );
    // Set visibility hidden for the card values.
    $("#ele-" + index + "-inner").css("visibility", "hidden");

    // Click events on cards.
    registerClickEvent(index, shuffledCards);
  });
};

/**
 * @description Game timer for tracking time.
 */
const gameTimer = () => {
  let startTime = new Date().getTime();

  timer = setInterval(() => {
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

/**
 * @description Removes game board from screen.
 */
const removeGameBoardFromScreen = () => {
  $("#game-board").empty();
};

/**
 * @description Resets number of steps to 0 and render on screen.
 */
const resetNumberOfSteps = () => {
  numberOfSteps = 0;
  $("#no-of-steps").text(numberOfSteps);
};

/**
 * @description Resets timer to start again form 0 and render on the screen.
 */
const resetTimer = () => {
  clearInterval(timer);
  $("#clock").text("0 : 00");
};

/**
 * @description Reset game to the initial state.
 */
const resetGame = () => {
  removeGameBoardFromScreen();
  resetBoard();
  resetNumberOfSteps();
  resetTimer();
  gameTimer();
  opened = [];
  temp2Opened = [];
  $("#star-ratings").html(svgStar + svgStar + svgStar);
};

// Shows a modal with congratulations when a user wins the game.
const showCongratulationPopUp = () => {
  $("#game-modal").modal("show");
  $(".modal-body")
    .html(`<div>
      Congratulations! You have won the game!!!<br> 
      You have taken: ${currentTime}.<br>
      Rating: ${calculateStarRatings(elapsed, numberOfSteps)}<br>
      Do you want to play again?
    </div>`);
  clearInterval(timer);
};

// Show start game modal on the first load.
$("#game-modal").modal("show");
$(".restart-game").click(() => {
  resetGame();
  $("#game-modal").modal("hide");
});
