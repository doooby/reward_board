const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
require('../../tmp/build/demo_server_helpers.js');

app.set('views', path.resolve(__dirname, '../views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(express.json())

app.get('/', (req, res) => {
    res.render('home_page.html', {
        rewards: REWARDS,
        moves_left: PLAYER.moves,
        teleport_active: PLAYER.teleport_mode,
    });
});

app.get('/rewards', (req, res) => {
    res.json(REWARDS);
});

app.get('/player', (req, res) => {
    res.json(PLAYER);
});

app.post('/move', (req, res) => {
    const newPosition = new Position(req.body.position.x, req.body.position.y);
    const validMove = PLAYER.moves > 0 &&
        PLAYER.position.distance(newPosition) === 1 &&
        newPosition.isOnBoard();
    const reward = findReward(req.body.reward_id, newPosition);
    const validReward = req.body.reward_id ? !!reward : true;
    if (validMove && validReward) {
        PLAYER.position = newPosition;
        if (!PLAYER.teleport_mode) PLAYER.moves -= 1;

        // vyhodnoti naslapnutou odmenu
        if (reward) {
            PLAYER.teleport_mode = !!reward.teleport;
            if (reward.teleport) {
                const index = REWARDS.indexOf(reward);
                REWARDS.splice(index, 1);
            }
        }

        res.json({
            valid: true,
            moves: PLAYER.moves,
            teleport_active: PLAYER.teleport_mode,
        });
    } else {
        res.json({ valid: false });
    }
});

app.post('/reset', (req, res) => {
    PLAYER.moves = 100;
    PLAYER.position = new Position(0, 0);
    res.json(true);
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
    moves: 100,
    position: new Position(0, 0),
    teleport_mode: false,
};

const REWARDS = [
    { x: 3, y: -3, color: 'red', label: '1', id: 1, text: 'Nové profilové obrázky' },
    { x: 6, y: -6, color: 'red', label: 'F', id: 2, text: 'Možnost vlastní profilové fotky' },
    { x: 0, y: 1, color: 'blue', label: 'TP', id: 3, text: 'Teleportační mód', teleport: true },
];

function findReward (reward_id, position) {
    if (!reward_id) return null;
    const reward = REWARDS.find(item => item.id === reward_id);
    if (reward && reward.x === position.x && reward.y === position.y) return reward;
    return null;
}
