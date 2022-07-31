// LOGIC.JS IS FOR BACKEND OF THE GAME
// Here we have boardMap[row][col] and different Status marks

import { boardElement, subtextElement } from "./script.js"

const board = []
const minesPos = []
const TILE_STATUSES = {
	HIDDEN: "hidden",
	NUMBER: "number",
	MARKED: "marked",
	MINE: "mine",
}

export function createBoard(BOARD_SIZE, NUMBER_OF_MINES) {
	clearArrays()
	setBoardSizeInCSS(BOARD_SIZE)

	createEmptyBoard(BOARD_SIZE)

	populateMines(BOARD_SIZE, NUMBER_OF_MINES)
	countMines()

	console.log(minesPos)
	console.log(board)

	return board
}

function createEmptyBoard(BOARD_SIZE) {
	for (let row = 0; row < BOARD_SIZE; row++) {
		const arr = []

		for (let col = 0; col < BOARD_SIZE; col++) {
			const element = document.createElement("div")
			element.classList.add("tile")
			element.dataset.status = TILE_STATUSES.HIDDEN

			const tile = {
				element,
				row,
				col,
				isMine: false,
				minesAround: 0,
				set status(value) {
					element.dataset.status = value
				},
				get status() {
					return element.dataset.status
				},
				set text(value) {
					element.innerText = value
				},
			}

			// tile.status = TILE_STATUSES.HIDDEN

			arr.push(tile)
		}

		board.push(arr)
	}
}

function populateMines(BOARD_SIZE, NUMBER_OF_MINES) {
	while (minesPos.length < NUMBER_OF_MINES) {
		const row = randomNumber(BOARD_SIZE)
		const col = randomNumber(BOARD_SIZE)

		const newPos = { row, col }

		const hasAlready = minesPos.some((pos) => matchPos(pos, newPos))
		if (!hasAlready) {
			minesPos.push(newPos)
		}
	}

	minesPos.forEach((pos) => {
		board[pos.row][pos.col].isMine = true
	})
}

function countMines() {
	minesPos.forEach((pos) => {
		const row = pos.row
		const col = pos.col
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				if (dx == 0 && dy == 0) continue
				if (board[row + dy]?.[col + dx]) {
					board[row + dy][col + dx].minesAround++
				}
			}
		}
	})
}

export function loseGame() {
	subtextElement.innerText = "you have lost!"
}

export function openMines() {
	minesPos.forEach((pos) => {
		const tile = board[pos.row][pos.col]
		tile.status = TILE_STATUSES.MINE
	})
}

export function revealTilesAround(tile) {
	if (tile.isMine || isOpened(tile) || isMarked(tile)) return

	openTile(tile)

	if (tile.minesAround > 0) return

	const adjacentTiles = getAdjacentTiles(tile)

	adjacentTiles.forEach(revealTilesAround)
}

function getAdjacentTiles(tile) {
	const adjacentTiles = []

	const row = tile.row
	const col = tile.col

	for (let dx = -1; dx <= 1; dx++) {
		for (let dy = -1; dy <= 1; dy++) {
			if (dx == 0 && dy == 0) continue
			if (board[row + dy]?.[col + dx]) {
				adjacentTiles.push(board[row + dy][col + dx])
			}
		}
	}

	return adjacentTiles
}

function matchPos(a, b) {
	return a.row == b.row && a.col == b.col
}

function clearArrays() {
	while (board.length > 0) {
		board.shift()
	}
	while (minesPos.length > 0) {
		minesPos.shift()
	}
}

function randomNumber(top) {
	return Math.floor(Math.random() * top)
}

function setBoardSizeInCSS(BOARD_SIZE) {
	boardElement.style.setProperty("--boardSize", BOARD_SIZE)
}

export function isMarked(tile) {
	return tile.status == TILE_STATUSES.MARKED
}

export function markTile(tile) {
	tile.status = TILE_STATUSES.MARKED
}

export function unmarkTile(tile) {
	tile.status = TILE_STATUSES.HIDDEN
}

function isOpened(tile) {
	return tile.status == TILE_STATUSES.NUMBER
}

function openTile(tile) {
	tile.status = TILE_STATUSES.NUMBER
	if (tile.minesAround > 0) {
		tile.text = tile.minesAround
	}
}
