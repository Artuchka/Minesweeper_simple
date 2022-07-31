// SCRIPT.JS IS FOR WORKING WITH UI\DESIGN INTERFACE

import {
	createBoard,
	openMines,
	loseGame,
	isMarked,
	unmarkTile,
	markTile,
	revealTilesAround,
} from "./logic.js"

export const boardElement = document.querySelector("#board")
export const subtextElement = document.querySelector("#subtext")

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)

boardElement.innerHTML = ""
board.forEach((arr) => {
	arr.forEach((tile) => {
		const tileElement = tile.element
		tileElement.addEventListener("click", (e) => {
			console.log("clicked right")

			if (isMarked(tile)) return

			if (tile.isMine) {
				openMines()
				loseGame()
			}

			revealTilesAround(tile)
		})

		tileElement.addEventListener("contextmenu", (e) => {
			e.preventDefault()

			if (isMarked(tile)) {
				unmarkTile(tile)
			} else {
				markTile(tile)
			}
		})

		boardElement.appendChild(tileElement)
	})
})
