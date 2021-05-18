window.D3O_RewardBoard(async ({Board, fetch}) => {
    const apiBaseUrl = 'http://localhost:3000/api';

    // pri nacteni stranky je potreba ziskat data odmen:
    // const rewards = await fetch(apiBaseUrl + '/rewards', {method: 'GET'});
    // if (rewards === null) throw new Error('rewards fetch failed');
    const rewards = [
        { x: 3, y: -3, style: { color: 'red' }, reward_id: 1 },
        { x: 6, y: -6, style: { color: 'red' }, reward_id: 2 },
    ];

    // take nacist aktualni pozici uzivatele:
    // x+ = vychod, x- = zapad, y+ = sever, y- = jih
    // const playerData = await fetch(apiBaseUrl + '/player', {method: 'GET'});
    // if (playerData === null) throw new Error('playerData fetch failed');
    const playerData = {
        moves: 10,
        position: { x: 0, y: 0 },
    };

    // udalost po stistku tlacitka pohybu
    async function onStepRequested (position) {
        // aby se ignorovalo dalsi kliknuti nez se to vyhodnoti
        buttons.disableAll();

        // const result = await fetch(apiBaseUrl + '/move', position);
        const result = { valid: true, moves: 9};
        if (result === null || !result.valid) {
            // tah neni validni nebo neco selhalo v komunikaci se serverem
            // zobrazit nejakou informaci uzivateli?
            return;
        }
        // nastavit novou pozici na desce
        board.setPosition(position);
        // aktualizovat vypis poctu zvybajicich tahu?
        // aktualizuje tlacitka (disabled nemozne pohyby)
        if (result.moves > 0) buttons.update(board);
    }

    // udalost pri kliku na pozici
    function onPositionClick (position) {
        const reward = board.rewardOnPositionGet(position);
        if (reward) {
            // zobrazit modal s detailem odmeny
        }
    }

    // udalost pri pohybu mezi pozicema
    function onMouseOverPosition (position) {
        const reward = position && board.rewardOnPositionGet(position);
        // zvyraznit odmenu v tabulce?
    }

    // inicializace UI
    const buttons = Board.findButtons(direction => document.getElementById(`rewards-btn-${direction}`));
    const board = new Board({
        element: document.querySelector('#board-container'),
        defaultPosition: playerData.position,
        rewards,
        onStepRequested,
        onPositionClick,
        onMouseOverPosition,
    });
    buttons.onClick = direction => board.step(direction);
    if (playerData.moves > 0) buttons.update(board);

    window.D3O_REWARDS_BOARD = board;
});
