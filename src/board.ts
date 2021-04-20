import { Model } from './model';

export interface PossibleSteps {
    up: boolean,
    right: boolean,
    down: boolean,
    left: boolean,
}

interface Tile {
    x: number;
    y: number;
    key: string;
}

interface RelativeSizes {
    view: number,
    slot: number,
    stepMargin: number,
    step: number,
    stepBorder: number,
    avatar: number,
}

export const RIMS_LEVELS = 4;
export const RIM_STEPS = 3;
export const RIM_LAS_LEVEL_STEPS = 8;

const STEP_SIZE = 2.1;
const STEP_MARGIN = 0;
const STEP_BORDER = STEP_SIZE / 10;
const AVATAR_SIZE = STEP_SIZE;

function cent (realSize: number, realView: number): number {
    return Math.ceil((realSize / 100) * realView);
    // return (realSize / 100) * realView;
}

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

const mapTiles: Tile[] = [];

// export const specialTiles: SpecialTile[] = [
//     { x: 0, y: 0, home: true },
//     // { x: 0, y: 0, type: 'some-event-1' },
// ];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// setup & rendering

export function setupCanvasContext (
    ctx: CanvasRenderingContext2D,
) {
    ctx.imageSmoothingEnabled = false;
}

export function renderInto (
    ctx: CanvasRenderingContext2D,
    model: Model,
) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, model.viewSize, model.viewSize);

    const sizes: RelativeSizes = {
        view: model.viewSize,
        slot: cent(STEP_SIZE + (2 * STEP_BORDER) + (2 * STEP_MARGIN), model.viewSize),
        stepMargin: cent(STEP_MARGIN, model.viewSize),
        step: cent(STEP_SIZE + (2 * STEP_BORDER), model.viewSize),
        stepBorder: cent(STEP_BORDER, model.viewSize),
        avatar: cent(AVATAR_SIZE, model.viewSize),
    };

    // render step tiles
    ctx.lineWidth = sizes.stepBorder;
    ctx.strokeStyle = 'black';
    for (let tile of mapTiles) {
        renderStep(ctx, tile, sizes);
    }

    // render avatar
    if (model.avatarPosition) renderAvatar(ctx, model.avatarPosition, sizes);
}

function renderStep (
    ctx: CanvasRenderingContext2D,
    tile: Tile,
    sizes: RelativeSizes,
) {
    const { slot, stepMargin, step } = sizes;
    const [ x, y ] = realPosition(tile, sizes);
    ctx.setTransform(1, 0, 0, 1, x - (slot / 2), y - (slot / 2));
    ctx.strokeRect(stepMargin, stepMargin, step, step);
}

function renderAvatar (
    ctx: CanvasRenderingContext2D,
    position: { x: number, y: number },
    sizes: RelativeSizes,
) {
    const { avatar } = sizes;
    const [ x, y ] = realPosition(position, sizes);
    ctx.fillStyle = 'orange';
    ctx.setTransform(1, 0, 0, 1, x - (avatar / 2), y - (avatar / 2));
    ctx.fillRect(0, 0, avatar, avatar);
}

function realPosition (
    position: { x: number, y: number },
    { view, slot }: RelativeSizes,
): [ number, number ] {
    const x = (view / 2) + (position.x * slot);
    const y = (view / 2) + (position.y * slot);
    return [ x, y ];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// fill tiles

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

// special tiles
