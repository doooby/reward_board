const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.resolve(__dirname, '../views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(express.json())

app.get('/', (req, res) => {
    res.render('home_page.html');
});

app.get('/rewards', (req, res) => {
    res.json(REWARDS);
});

app.get('/player', (req, res) => {
    res.json(PLAYER);
});

app.post('/move', (req, res) => {
    const newPosition = req.body;
    if (
        PLAYER.moves > 0 &&
        distance(PLAYER.position, newPosition) === 1 &&
        isOnBoard(newPosition)
    ) {
        PLAYER.position = newPosition;
        PLAYER.moves -= 1;
        res.json({
            valid: true,
            moves: PLAYER.moves,
        });
    } else {
        res.json({ valid: false });
    }
});

app.get('/assets/*', (req, res) => {
    const file = path.resolve(__dirname, '../../tmp/build', req.params[0]);
    if (fs.existsSync(file)) {
        res.sendFile(file);
    } else {
        res.status(404).end();
    }
});

app.listen(port, () => {
   console.log(`started on http://localhost:${port}`);
});

const PLAYER = {
    moves: 10,
    position: { x: 0, y: 0 },
};

const REWARDS = [
    { x: 3, y: -3, style: { color: 'red' }, reward_id: 1 },
    { x: 6, y: -6, style: { color: 'red' }, reward_id: 2 },
];

const RIMS_LEVELS = 4;
const RIM_STEPS = 3;
const RIM_LAS_LEVEL_STEPS = 8;

function distance (pos1, pos2) {
    return Math.abs( pos1.x - pos2.x ) + Math.abs( pos1.y - pos2.y );
}

function isOnBoard (pos) {
    const xIsZero = pos.x === 0;
    const yIsZero = pos.y === 0;
    if (xIsZero && yIsZero) return true;

    const x = Math.abs(pos.x);
    const y = Math.abs(pos.y);

    if (xIsZero || yIsZero) {
        const step = xIsZero ? y : x;
        const limit = ( RIMS_LEVELS * RIM_STEPS ) - RIM_STEPS + RIM_LAS_LEVEL_STEPS;
        return step <= limit;
    }

    if (x % RIM_STEPS === 0 || y % RIM_STEPS === 0) {
        const [ a, b ] = [ x, y ].sort((n1, n2) => n1 - n2);
        const bIsOnRim = b % RIM_STEPS === 0;
        const rim = bIsOnRim ? (b / RIM_STEPS) : (a / RIM_STEPS);
        if (rim > RIMS_LEVELS) return false;
        const sidestep = bIsOnRim ? a : b;
        return sidestep <= (rim * RIM_STEPS);
    }

    return false;
}
