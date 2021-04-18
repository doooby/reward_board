import { Model } from './model';

interface Tile {
    x: number;
    y: number;
    key: string;
}

interface TileSizes {
    slot: number,
    stepMargin: number,
    stepWidth: number,
    stepBorder: number,
}

// type SpecialTile =
//     {
//         x: number;
//         y: number;
//     }
//     &
//     (
//         { home: true }
//     );

export const RESOLUTION = 400;
export const RIMS_LEVELS = 4;
export const RIM_STEPS = 3;
export const RIM_LAS_LEVEL_STEPS = 8;

const STEP_SIZE = 2.2;
const STEP_MARGIN = 0;
const STEP_BORDER = 0.5;
const STEP_WIDTH = STEP_SIZE + (2 * STEP_BORDER);
const STEP_SLOT_WIDTH = STEP_SIZE + (2 * STEP_BORDER) + (2 * STEP_MARGIN);

function cent (relSize: number): number {
    return Math.ceil((relSize / 100) * RESOLUTION);
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
    // ctx.imageSmoothingEnabled = false;
}

export function renderInto (
    ctx: CanvasRenderingContext2D,
    model: Model,
) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const tileSizes: TileSizes = {
        slot: cent(STEP_SLOT_WIDTH),
        stepMargin: cent(STEP_MARGIN),
        stepWidth: cent(STEP_WIDTH),
        stepBorder: cent(STEP_BORDER),
    };
    console.log(tileSizes);

    // render step tiles
    ctx.lineWidth = tileSizes.stepBorder;
    ctx.strokeStyle = 'black';
    for (let tile of mapTiles) {
        renderStep(ctx, tile, tileSizes);
    }
}

function renderStep (
    ctx: CanvasRenderingContext2D,
    tile: Tile,
    { slot, stepMargin, stepWidth }: TileSizes,
) {
    const x = (RESOLUTION / 2) - (slot / 2) + (tile.x * slot);
    const y = (RESOLUTION / 2) - (slot / 2) + (tile.y * slot);
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.strokeRect(stepMargin, stepMargin, stepWidth, stepWidth);
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

// sepcial tiels
