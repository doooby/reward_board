import Position, { PossibleSteps } from './Position';
import {Model, RewardItem} from './model';
import View from './View';
import Buttons, { ButtonsFinder } from './Buttons';

export type Config = {
    element: HTMLElement;
    defaultPosition?: { x: number, y: number };
    rewards: RewardItem[];
    avatarColor?: string;
    onStepRequested?: (position: Position) => void;
    onPositionClick?: (position: Position) => void;
    onMouseOverPosition?: (position?: Position) => void;
}

export default class Board {
    config: Config;
    model: Model = {
        viewSize: 0,
        avatarPosition: null,
        avatarColor: 'blue',
        rewards: [],
    };
    view: View;

    constructor (config: Config) {
        this.config = config;

        this.view = new View({
            onPositionClick: this.onPositionClicked,
            onMouseMove: this.onMouseMove,
        });
        this.view.attach(config.element.attachShadow({ mode: 'closed' }));
        this.updateModel({
            avatarPosition: Position.parse(config.defaultPosition),
            avatarColor: config.avatarColor || this.model.avatarColor,
            rewards: Object.freeze(config.rewards.slice(0)),
        });

        const observer = new ResizeObserver(
            (entries: ResizeObserverEntry[]) => {
                try {
                    const width = entries[0].contentRect.width;
                    this.updateModel({ viewSize: width });
                }
                finally {}
            }
        );
        observer.observe(this.view.wrapper);
    }

    onPositionClicked = (position: Position) => {
        this.config.onPositionClick?.(position);
    };

    onMouseMove = (position: undefined | Position) => {
        this.config.onMouseOverPosition?.(position);
    };

    updateModel (modelChange: Partial<Model>) {
        this.model = { ...this.model, ...modelChange };
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

        setTimeout(() => this.config.onStepRequested?.(position), 0);
    }

    setPosition (value: { x: number, y: number }) {
        const position = Position.parse(value);
        this.updateModel({ avatarPosition: position });
    }

    setRewards (rewards: RewardItem[]) {
        this.updateModel({ rewards });
    }

    rewardOnPositionGet (position: undefined | Position): undefined | RewardItem {
        return position && this.model.rewards.find(
            ({ x, y }) => x === position.x && y === position.y
        );
    }

    static findButtons (finder: ButtonsFinder): Buttons {
        return new Buttons(finder);
    }

}
