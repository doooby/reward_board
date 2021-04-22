export type Config = {
    element: HTMLElement;
    position?: { x: number, y: number };
    onStepRequested?: (position: Position) => void;
}

export type Model = {
    viewSize: number;
    avatarPosition: null | Position;
}

export interface Tile {
    x: number;
    y: number;
    key: string;
}

export interface BoardSizes {
    view: number,
    slot: number,
    stepMargin: number,
    step: number,
    stepBorder: number,
    avatar: number,
}

export interface PossibleSteps {
    up: boolean,
    right: boolean,
    down: boolean,
    left: boolean,
}

export const RIMS_LEVELS = 4;
export const RIM_STEPS = 3;
export const RIM_LAS_LEVEL_STEPS = 8;

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
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

    distance (otherPosition: Position): number {
        return Math.abs( this.x - otherPosition.x ) +
            Math.abs( this.y - otherPosition.y );
    }

    isOnBoard (): boolean {
        const xIsZero = this.x === 0;
        const yIsZero = this.y === 0;
        // home
        if (xIsZero && yIsZero) return true;

        const x = Math.abs(this.x);
        const y = Math.abs(this.y);

        // cross
        if (xIsZero || yIsZero) {
            const step = xIsZero ? y : x;
            const limit = ( RIMS_LEVELS * RIM_STEPS ) - RIM_STEPS + RIM_LAS_LEVEL_STEPS;
            return step <= limit;
        }

        // on a rim
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
            case "up": return new Position(this.x, this.y - 1);
            case "right": return new Position(this.x + 1, this.y);
            case "down": return new Position(this.x, this.y + 1);
            case "left": return new Position(this.x - 1, this.y);
        }
    }

}

export const mapTiles: Tile[] = [];

function addTile (x: number, y: number ) {
    mapTiles.push({ x, y, key: `${x}:${y}` });
}

addTile(0, 0);

const mapHalfWide = ( RIMS_LEVELS * RIM_STEPS ) + RIM_LAS_LEVEL_STEPS - RIM_STEPS;
for (let i = -mapHalfWide; i <= mapHalfWide; i += 1) {
    if (i === 0) continue;
    addTile(i, 0);
    addTile(0, i);
}

for (let rim = 0; rim < RIMS_LEVELS; rim += 1) {
    const rimHalfWide = ( rim * RIM_STEPS ) + RIM_STEPS;
    for (let i = -rimHalfWide; i < rimHalfWide; i += 1) {
        if (i === 0) continue;
        addTile(i, -rimHalfWide); // north line
        addTile(rimHalfWide, i ); // east line
        addTile(i, rimHalfWide ); // south line
        addTile(-rimHalfWide, i ); // west line
    }
    addTile(rimHalfWide, -rimHalfWide ); // north/east corner
    addTile(rimHalfWide, rimHalfWide ); // south/east line
    addTile(-rimHalfWide, rimHalfWide ); // south/west line
    addTile(-rimHalfWide, -rimHalfWide ); // north/west line
}