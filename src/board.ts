import { RIM_LAS_LEVEL_STEPS, RIM_STEPS, RIMS_LEVELS } from './position';

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


export const mapTiles: Tile[] = [
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
    for (let i = -rimHalfWide - 1; i < rimHalfWide; i += 1) {
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


