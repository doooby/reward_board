import {Config, Model, Position, PossibleSteps, RewardItem} from './model';
import View from './View';

(globalThis as any).D3O_RewardBoard = class {
    config: Config;
    model: Model = {
        viewSize: 0,
        avatarPosition: null,
        rewards: [],
    };
    view: View;

    constructor (config: Config) {
        this.config = config;

        this.view = new View(this.onMouseMove);
        this.view.attach(config.element.attachShadow({ mode: 'closed' }));
        this.updateModel({
            ...this.model,
            avatarPosition: Position.parse(config.position),
            rewards: Object.freeze(config.rewards.slice(0)),
        });

        const observer = new ResizeObserver(
            (entries: ResizeObserverEntry[]) => {
                try {
                    const width = entries[0].contentRect.width;
                    this.updateModel({
                        ...this.model,
                        viewSize: width,
                    });
                }
                finally {}
            }
        );
        observer.observe(this.view.wrapper);
    }

    onMouseMove = (position: undefined | Position) => {
        const reward: undefined | RewardItem = position && this.model.rewards.find(
            ({ x, y }) => x === position.x && y === position.y
        );
        this.config.onMouseOverReward?.(reward);
    };

    updateModel (model: Model) {
        this.model = model;
        this.view.render(this.model);
    }

    possibleSteps (): PossibleSteps {
        const { avatarPosition } = this.model;
        if (!avatarPosition) return {
            up: false,
            right: false,
            down: false,
            left: false,
        }
        return avatarPosition.possibleSteps();
    }

    step (direction: keyof PossibleSteps) {
        const { avatarPosition } = this.model;
        if (!avatarPosition) return;
        const position = avatarPosition.step(direction);
        if (!position || !position.isOnBoard()) return;

        const reward: undefined | RewardItem = this.model.rewards.find(
            ({ x, y }) => x === position.x && y === position.y
        );
        setTimeout(() => this.config.onStepRequested?.(position, reward), 0);
    }

    setPosition (value: { x: number, y: number }) {
        const position = Position.parse(value);
        this.updateModel({
            ...this.model,
            avatarPosition: position,
        });
    }

};
