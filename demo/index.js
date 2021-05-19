window.D3O_RewardBoard(async ({Board, fetch, Template}) => {
    const apiBaseUrl = '';

    // pri nacteni stranky je potreba ziskat data odmen:
    const rewards = await fetch(apiBaseUrl + '/rewards', { method: 'GET' });
    if (rewards === null) throw new Error('rewards fetch failed');
    // const rewards = [
    //     { x: 3, y: -3, style: { color: 'red' }, reward_id: 1 },
    //     { x: 6, y: -6, style: { color: 'red' }, reward_id: 2 },
    // ];

    // take nacist aktualni pozici uzivatele:
    // x+ = vychod, x- = zapad, y+ = sever, y- = jih
    const defaultPlayerData = await fetch(apiBaseUrl + '/player', { method: 'GET' });
    if (defaultPlayerData === null) throw new Error('defaultPlayerData fetch failed');
    // const defaultPlayerData = {
    //     moves: 10,
    //     position: { x: 0, y: 0 },
    // };

    // udalost po stistku tlacitka pohybu
    // odesle zatost o pohyb na server
    // a posune hrace, pokud to bylo uspesne
    // jinak tlacitka zustanou zablokovana
    async function onStepRequested (position) {
        // aby se ignorovalo dalsi kliknuti nez se to vyhodnoti
        buttons.disableAll();

        const result = await fetch(apiBaseUrl + '/move', { data: position });
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
        // aktualizace pocitadla tahu
        document.querySelector('#rewards-moves-left').textContent = result.moves;
    }

    // udalost pri kliku na pozici
    // otevre modal a vypise v nem detail odmeny
    function onPositionClick (position) {
        const reward = board.rewardOnPositionGet(position);
        if (reward) {
            const modal = document.querySelector('#rewards-modal');
            const template = new Template(modal.querySelector('template'));
            template.set('text', reward.text);
            template.insertInto(modal.querySelector('.modal-body'));
            $(modal).modal({ show: true });
        }
    }

    // udalost pri pohybu mezi pozicema
    // zvyrazneni odmeny v tabulce pridanim `.active` pro danou `.list-group-item`
    function onMouseOverPosition (position) {
        // odebere predchozi zvyraznenou odmenu
        let element = document.querySelector('#rewards-list > .active');
        if (element) element.classList.remove('active');

        const reward = position && board.rewardOnPositionGet(position);
        if (reward) {
            // pokud je mys nad pozici s odmenou, zvyrazni ji v tabulce
            element = document.querySelector(`#rewards-list > [data-reward-id="${reward.reward_id}"]`);
            if (element) element.classList.add('active');
        }
    }

    // inicializace UI
    const buttons = Board.findButtons(direction => document.getElementById(`rewards-btn-${direction}`));
    const board = new Board({
        element: document.querySelector('#rewards-board'),
        defaultPosition: defaultPlayerData.position,
        rewards,
        onStepRequested,
        onPositionClick,
        onMouseOverPosition,
    });
    buttons.onClick = direction => board.step(direction);
    if (defaultPlayerData.moves > 0) buttons.update(board);

    window.D3O_REWARDS_BOARD = board;
});
