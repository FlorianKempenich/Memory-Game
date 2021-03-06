function MemoryGame(iconBoard, rater) {
  const validateIconBoard = () => {
    const ensureValidDimensions = () => {
      const throwError = () => {
        throw "Invalid dimensions. The board must be 4x4";
      };
      if (iconBoard.length !== 4) {
        throwError();
      }
      for (let i = 0; i < 4; i++) {
        if (iconBoard[i].length !== 4) {
          throwError();
        }
      }
    };
    const ensureContains8PairsOfIcons = () => {
      const allIcons = [];
      for (row of iconBoard) {
        for (icon of row) {
          allIcons.push(icon);
        }
      }

      const represents8Pairs = Array.from(new Set(allIcons)).length === 8;

      if (!represents8Pairs) {
        throw "Invalid board. The board must contain 8 pairs of icons";
      }
    };

    ensureValidDimensions();
    ensureContains8PairsOfIcons();
  };
  const initializeGameBoard = () => {
    const mapToGameCell = icon => ({ icon, revealed: false });
    const gameBoard = [];

    for (iconRow of iconBoard) {
      gameRow = iconRow.map(mapToGameCell);
      gameBoard.push(gameRow);
    }

    return gameBoard;
  };

  this.rater = rater;
  validateIconBoard();
  this.board = initializeGameBoard();
  this.finished = false;
  this.firstCardOfCurrent2CardsMove = null;
  this.movesCount = 0;
}

MemoryGame.prototype.playCard = function(x, y) {
  /**
   * Response Template:
   *
   * {
   *   card1: { x, y, icon },
   *   card2: { x, y, icon },
   *   success: true,
   *   isGameFinished: false,
   *   movesCounter: 13,
   *   rating: 2
   * };
   */

  const ensureGameNotFinished = () => {
    if (this.finished) {
      throw "Invalid Move: Can not play after game is finished";
    }
  };
  const validateCoordinates = () => {
    const isOutOfBoard = coordinate => coordinate < 0 || coordinate >= 4;
    if (isOutOfBoard(x) || isOutOfBoard(y)) {
      throw "Invalid coordinates: Coordinates are out of the board!";
    }
  };
  const getCard = () => {
    const cell = this.board[y][x];
    return { x: x, y: y, icon: cell.icon, revealed: cell.revealed };
  };
  const ensureCardNotAlreadyRevealed = () => {
    if (card.revealed) {
      throw "Invalid coordinates: Card already revealed";
    }
  };
  const playFirstMove = card => {
    this.firstCardOfCurrent2CardsMove = card;
    return {
      card1: this.firstCardOfCurrent2CardsMove,
      card2: null,
      success: null,
      isGameFinished: false,
      movesCount: this.movesCount,
      rating: this.rater.rateMovesCount(this.movesCount)
    };
  };
  const playSecondMove = card => {
    const ensureNotSameAsFirst = () => {
      const first = this.firstCardOfCurrent2CardsMove;
      if (x === first.x && y === first.y) {
        throw "Invalid Move: Can not play the same card twice";
      }
    };
    const setRevealed = card => {
      this.board[card.y][card.x].revealed = true;
    };
    const allCardsAreRevealed = () => {
      for (row of this.board) {
        for (cell of row) {
          if (!cell.revealed) {
            return false;
          }
        }
      }
      return true;
    };

    ensureNotSameAsFirst();
    const firstCard = this.firstCardOfCurrent2CardsMove;
    const secondCard = card;
    const sucess = secondCard.icon === this.firstCardOfCurrent2CardsMove.icon;

    if (sucess) {
      setRevealed(firstCard);
      setRevealed(secondCard);
      if (allCardsAreRevealed()) {
        this.finished = true;
      }
    }

    this.firstCardOfCurrent2CardsMove = null;
    this.movesCount++;
    return {
      card1: firstCard,
      card2: secondCard,
      success: sucess,
      isGameFinished: this.finished,
      movesCount: this.movesCount,
      rating: this.rater.rateMovesCount(this.movesCount)
    };
  };

  ensureGameNotFinished();
  validateCoordinates();
  const card = getCard(x, y);
  ensureCardNotAlreadyRevealed();
  const isFirstMove = this.firstCardOfCurrent2CardsMove === null;
  if (isFirstMove) {
    return playFirstMove(card);
  } else {
    return playSecondMove(card);
  }
};

module.exports = MemoryGame;
