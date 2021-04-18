const $global$ = (globalThis as any);

const board = new $global$.D3O_RewardBoard({
    element: document.querySelector('#board-container'),
    stylesURL: '/assets/app.css',
});

$global$.board = board;
