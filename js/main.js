const data = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];

function shuffleCards(cardsList) {
  return [...cardsList].sort(function() {
    return 0.5 - Math.random();
  });
}

function showCard(id) {
  $("#" + id).css("visibility", "visible")
} 

function putCardsOnScreen() {
  const shuffledCards = shuffleCards(data);
  shuffledCards.forEach((element, index) => {
    $("#game-board").append(
      `<div id="ele-${index}" class="board"> 
        <div id="ele-${index}-inner"  >${element}</div>
      </div>`
    );
    $("#ele-" + index + "-inner").css("visibility", "hidden");


    $("#ele-" + index).click(function() {
      $("#ele-" + index + "-inner").css("visibility", "visible");
    })
  });
}

putCardsOnScreen();
