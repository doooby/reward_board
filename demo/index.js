(function () {
    const printout = document.getElementById('printout');
    const directions = ['up', 'right', 'down', 'left'];
    let lastSelectedReward;

    const buttons = {};
    for (let direction of directions) {
        buttons[direction] = document.getElementById(`btn-${direction}`);
    }

    function updateButtons (possibleSteps) {
        for (let direction of directions) {
            buttons[direction].disabled = !possibleSteps[direction];
        }
    }

    function print (...stuff) {
        const item = document.createElement('li');
        item.textContent = JSON.stringify(stuff);
        item.className = 'list-group-item list-group-item-info';
        printout.prepend(item);
        printout.scrollTop = 0;
        console.log(...stuff);
    }

    const REWARDS = new window.D3O_RewardBoard({
        element: document.querySelector('#board-container'),
        position: { x: 0, y: 0 },
        rewards: [
            { x: 6, y: 6, style: { color: 'red' } },
        ],
        onStepRequested (position, reward) {
            print('user requested move to: ', position, reward);
            REWARDS.setPosition(position);
            updateButtons(REWARDS.possibleSteps());
        },
        // onMouseOverReward (reward) {
        //     if (lastSelectedReward !== reward) {
        //         lastSelectedReward = reward;
        //         print('hover on reward: ', {reward});
        //     }
        // },
        onPositionClick (position, reward) {
            print('click on: ', position, reward);
        }
    });
    for (let direction of directions) {
        buttons[direction].onclick = () => REWARDS.step(direction);
    }
    updateButtons(REWARDS.possibleSteps());

    window.REWARDS;
}());
