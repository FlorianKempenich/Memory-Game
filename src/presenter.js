const { MemoryGame, BoardBuilder, Rater } = require("./game");

function Presenter(view, icons, ratingThreshold) {
  this.view = view;
  this.icons = icons;
  const boardBuilder = new BoardBuilder();
  const board = boardBuilder.buildFromIcons(icons);
  this.rater = new Rater(ratingThreshold.twoStars, ratingThreshold.oneStar)
  this.game = new MemoryGame(board, this.rater);

  const displayFirstCard = firstCard => {
    this.view.revealCard(firstCard);
  };

  const displaySecondCardAndResult = (
    firstCard,
    secondCard,
    wasSuccessful,
    movesCount,
    rating
  ) => {
    this.view.updateMovesCount(movesCount);
    this.view.updateRating(rating);
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
      movesCount: movesCount,
      rating: rating
    } = this.game.playCard(x, y);

    const isFirstCardPicked = secondCard === null;
    if (isFirstCardPicked) {
      displayFirstCard(firstCard);
    } else {
      displaySecondCardAndResult(
        firstCard,
        secondCard,
        wasSuccessful,
        movesCount,
        rating
      );
    }

    if (gameIsFinished) {
      this.view.showResults();
    }
  };

  this.onReset = () => {
    const resetGame = () => {
      const newBoard = boardBuilder.buildFromIcons(this.icons);
      this.game = new MemoryGame(newBoard, this.rater);
    };

    console.log("Resetting the game");
    this.view.resetAllCards();
    this.view.updateMovesCount(0);
    resetGame();
  };
}

module.exports = { Presenter };
