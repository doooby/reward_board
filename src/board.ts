import { Model } from './model';

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

const STEP_SIZE = 1.8;
const STEP_MARGIN = 0;
const STEP_BORDER = 0.4;
const AVATAR_SIZE = 2.2;

function cent (realSize: number, realView: number): number {
    return Math.ceil((realSize / 100) * realView);
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
    renderAvatar(ctx, mapTiles[0], sizes);
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
    return [ x, y];
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
