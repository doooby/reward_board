export interface BoardState {

}

interface Tile {
    x: number;
    y: number;
    key: string;
}

type SpecialTile =
    {
        x: number;
        y: number;
    }
    &
    (
        { home: true }
    );

export const RESOLUTION = 1000;
export const RIMS_LEVELS = 4;
export const RIM_STEPS = 3;
export const RIM_LAS_LEVEL_STEPS = 8;

const STEP_SIZE = 2;
const STEP_MARGIN = 0.2;
const STEP_BORDER = 0.2;
const STEP_WIDTH = STEP_SIZE + (2 * STEP_BORDER);
const STEP_SLOT_WIDTH = STEP_SIZE + (2 * STEP_BORDER) + (2 * STEP_MARGIN);

function cent (relSize: number): number {
    return (relSize / 100) * RESOLUTION;
}

const mapTiles: Tile[] = [
    { x: 0 , y: 0, key: '0:0' },
];

function addTile (x: number, y: number ) {
    mapTiles.push({ x, y, key: `${x}:${y}` });
}

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


export const specialTiles: SpecialTile[] = [
    { x: 0, y: 0, home: true },
    // { x: 0, y: 0, type: 'some-event-1' },
];

export function renderInto (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    board: BoardState,
) {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // render step tiles
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    for (let tile of mapTiles) {
        paintStep(ctx, tile);
    }
}

function paintStep (ctx: CanvasRenderingContext2D, tile: Tile) {
    const centSlot = cent(STEP_SLOT_WIDTH);
    const x = (RESOLUTION / 2) - (centSlot / 2) + (tile.x * centSlot);
    const y = (RESOLUTION / 2) - (centSlot / 2) + (tile.y * centSlot);
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.strokeRect(cent(STEP_MARGIN), cent(STEP_MARGIN), cent(STEP_WIDTH), cent(STEP_WIDTH));
}
