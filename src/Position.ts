import {RIM_LAS_LEVEL_STEPS, RIM_STEPS, RIMS_LEVELS} from './constants';

export interface PossibleSteps {
    up: boolean,
    right: boolean,
    down: boolean,
    left: boolean,
}

export default class Position {
    x: number;
    y: number;

    constructor(x: any, y: any) {
        if (typeof x !== 'number' || isNaN(x) || typeof y !== 'number' || isNaN(y)) {
            throw new Error('en.Position.invalid');
        }

        this.x = x;
        this.y = y;
        Object.freeze(this);
    }

    static parse (value?: { x: number, y: number }): null | Position {
        if (!value) return null;
        try {
            return new Position(value.x, value.y);
        }
        catch (err) {
            console.error('D3O_RewardBoard invalid position:', value);
            console.error(err);
            return null;
        }
    }

    toCoords (): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }

    distance (otherPosition: Position): number {
        return Math.abs( this.x - otherPosition.x ) +
            Math.abs( this.y - otherPosition.y );
    }

    isOnBoard (): boolean {
        const xIsZero = this.x === 0;
        const yIsZero = this.y === 0;
        // is home
        if (xIsZero && yIsZero) return true;

        const x = Math.abs(this.x);
        const y = Math.abs(this.y);

        // is on the cross
        if (xIsZero || yIsZero) {
            const step = xIsZero ? y : x;
            const limit = ( RIMS_LEVELS * RIM_STEPS ) - RIM_STEPS + RIM_LAS_LEVEL_STEPS;
            return step <= limit;
        }

        // is on a rim
        if (x % RIM_STEPS === 0 || y % RIM_STEPS === 0) {
            const [ a, b ] = [ x, y ].sort((n1, n2) => n1 - n2); // aka [ min, max ]
            const bIsOnRim = b % RIM_STEPS === 0;
            const rim = bIsOnRim ? b / RIM_STEPS : a / RIM_STEPS;
            if (rim > RIMS_LEVELS) return false;
            const sidestep = bIsOnRim ? a : b;
            return sidestep <= rim * RIM_STEPS;
        }

        return false;
    }

    possibleSteps (): PossibleSteps {
        return {
            up: this.step('up')!.isOnBoard(),
            right: this.step('right')!.isOnBoard(),
            down: this.step('down')!.isOnBoard(),
            left: this.step('left')!.isOnBoard(),
        }
    }

    step (direction: keyof PossibleSteps): undefined | Position {
        switch (direction) {
            case 'up': return new Position(this.x, this.y - 1);
            case 'right': return new Position(this.x + 1, this.y);
            case 'down': return new Position(this.x, this.y + 1);
            case 'left': return new Position(this.x - 1, this.y);
        }
    }

}
