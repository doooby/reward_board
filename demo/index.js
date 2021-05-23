window.D3O_RewardBoard(async ({Board, fetch, Template}) => {
    const apiBaseUrl = '';

    // pri nacteni stranky je potreba ziskat data odmen:
    const rewards = await fetch(apiBaseUrl + '/rewards', { method: 'GET' });
    if (rewards === null) throw new Error('rewards fetch failed');
    // const rewards = [
    //     { x: 3, y: -3, color: 'red', label: 'S', id: 1, text: 'something' },
    //     { x: 6, y: -6, color: 'red', label: '2', id: 2, text: 'something' },
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

        const reward = board.rewardOnPositionGet(position);
        const result = await fetch(apiBaseUrl + '/move', { data: {
                position: position.toCoords(),
                reward_id: reward?.id,
            },
        });
        if (result === null || !result.valid) {
            // tah neni validni nebo neco selhalo v komunikaci se serverem
            // zobrazit nejakou informaci uzivateli?
            return;
        }
        // nastavit novou pozici na desce
        board.setPosition(position);

        // protoze je tah validni, tak server souhlasil s odmenou, na kterou uzivatel stoupnul
        if (reward) {
            // aktualizovat odmeny - mohla nektera zmizet
            const rewards = await fetch(apiBaseUrl + '/rewards', { method: 'GET' });
            if (rewards === null) throw new Error('rewards fetch failed');
            board.setRewards(rewards);

            // co s tim? dalsi modal uzivateli?
            // takzer napr:
            // 1. stahnout si ze serveru obsah modalu pro danou odmenu
            // 2. vykreslit tento modal
        }

        // aktualizovat vypis poctu zvybajicich tahu?
        // aktualizuje tlacitka (disabled nemozne pohyby)
        if (result.moves > 0) buttons.update(board);

        // aktualizace pocitadla tahu
        document.querySelector('#rewards-moves-left').textContent = result.moves;

        // zobrazeni zmeny teleportu
        showTPBadge(result.teleport_active);
    }

    // udalost pri kliku na pozici
    // otevre modal a vypise v nem detail odmeny
    function onPositionClick (position) {
        const reward = board.rewardOnPositionGet(position);
        if (reward) {
            const modal = document.querySelector('#rewards-modal');
            const template = new Template(modal.querySelector('template'));
            template.set('text', reward.text);
            template.set('badge', reward.label, el => el.style.backgroundColor = reward.color);
            template.insertInto(modal.querySelector('.modal-body'));
            $(modal).modal({ show: true });

            // odebrat zvyraneni odmene
            let element = document.querySelector('#rewards-list > .active');
            if (element) element.classList.remove('active');
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
            element = document.querySelector(`#rewards-list > [data-reward-id="${reward.id}"]`);
            if (element) element.classList.add('active');
        }
    }

    function showTPBadge (state) {
        const badge = document.querySelector('#rewards-tp-badge');
        if (state) badge.classList.remove('invisible');
        else badge.classList.add('invisible');
    }

    // inicializace UI
    const buttons = Board.findButtons(direction => document.getElementById(`rewards-btn-${direction}`));
    const board = new Board({
        element: document.querySelector('#rewards-board'),
        defaultPosition: defaultPlayerData.position,
        avatarColor: '#23a85a',
        rewards,
        onStepRequested,
        onPositionClick,
        onMouseOverPosition,
    });
    buttons.onClick = direction => board.step(direction);
    if (defaultPlayerData.moves > 0) buttons.update(board);
    showTPBadge(defaultPlayerData.teleport_active);

    window.D3O_REWARDS_BOARD = board;
});
