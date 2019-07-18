const { MemoryGame, BoardBuilder } = require("./game");

function Presenter(view, icons) {
  this.view = view;
  this.icons = icons;
  const boardBuilder = new BoardBuilder();
  const board = boardBuilder.buildFromIcons(icons);
  console.log(
    "board :\n",
    JSON.stringify(board)
      .split("],")
      .join("],\n  ")
      .replace(/"/g, " ")
  );
  this.game = new MemoryGame(board);

  const displayFirstCard = firstCard => {
    this.view.revealCard(firstCard);
  };

  const displaySecondCardAndResult = (firstCard, secondCard, wasSuccessful, movesCount) => {
    this.view.updateMovesCount(movesCount);
    this.view.revealCard(secondCard);
    if (wasSuccessful) {
      this.view.flashSuccess(firstCard, secondCard);
    } else {
      this.view.flashFailureAndHide(firstCard, secondCard);
    }
  };

  this.onCardClick = (x, y) => {
    const {
      card1: firstCard,
      card2: secondCard,
      success: wasSuccessful,
      isGameFinished: gameIsFinished,
      movesCount: movesCount
    } = this.game.playCard(x, y);

    const isFirstCardPicked = secondCard === null;
    if (isFirstCardPicked) {
      displayFirstCard(firstCard);
    } else {
      displaySecondCardAndResult(firstCard, secondCard, wasSuccessful, movesCount);
    }

    if (gameIsFinished) {
      this.view.showResults();
    }
  };

  this.onReset = () => {
    const resetGame = () => {
      const newBoard = boardBuilder.buildFromIcons(this.icons);
      this.game = new MemoryGame(newBoard);
    };

    console.log("Resetting the game");
    this.view.resetAllCards();
    this.view.updateMovesCount(0);
    resetGame();
  };
}

module.exports = { Presenter };