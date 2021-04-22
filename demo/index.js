(function () {
    const directions = ['up', 'right', 'down', 'left'];

    const buttons = {};
    for (let direction of directions) {
        buttons[direction] = document.getElementById(`btn-${direction}`);
    }

    function updateButtons (possibleSteps) {
        for (let direction of directions) {
            buttons[direction].disabled = !possibleSteps[direction];
        }
    }

    const REWARDS = new window.D3O_RewardBoard({
        element: document.querySelector('#board-container'),
        position: { x: 0, y: 0 },
        onStepRequested(position) {
            console.log('user requested move to', position);
            REWARDS.setPosition(position);
            updateButtons(REWARDS.possibleSteps());
        }
    });
    for (let direction of directions) {
        buttons[direction].onclick = () => REWARDS.step(direction);
    }
    updateButtons(REWARDS.possibleSteps());

    window.REWARDS;
}());