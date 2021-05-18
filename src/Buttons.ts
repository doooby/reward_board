import Board from "./Board";

const DIRECTIONS = ['up', 'right', 'down', 'left'];

interface Index {
    [direction: string]: HTMLButtonElement;
}

export type ButtonsFinder = (direction: string) => HTMLButtonElement;

export default class Buttons {
    buttons: Index = {};
    onClick?: (direction: string) => void;

    constructor (finder: ButtonsFinder) {
        for (const direction of DIRECTIONS) {
            const button = finder(direction);
            this.buttons[direction] = button;
            button.addEventListener('click', () => this.onClick?.(direction));
        }
        this.disableAll();
    }

    disableAll () {
        for (const direction of DIRECTIONS) {
            this.buttons[direction].disabled = true;
        }
    }

    update (board: Board) {
        const steps = board.possibleSteps() as any;
        for (const direction of DIRECTIONS) {
            this.buttons[direction].disabled = !steps[direction];
        }
    }
}
