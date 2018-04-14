const data = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
let opened = []
let temp2Opened = []

function shuffleCards(cardsList) {
  return [...cardsList].sort(function() {
    return 0.5 - Math.random();
  });
}

function showCard(id) {
  $("#" + id).css("visibility", "visible")
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
      $("#ele-" + index + "-inner").css("visibility", "visible");
      temp2Opened.push(index)
      opened.push(index)
      console.log("Pupu")
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
    })
  });
}

resetBoard();
