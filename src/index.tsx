import { Config, Model, Position, PossibleSteps } from './model';
import View from './View';

(globalThis as any).D3O_RewardBoard = class {
    config: Config;
    model: Model = {
        viewSize: 0,
        avatarPosition: null,
    };
    view: View;

    constructor (config: Config) {
        this.config = config;

        this.view = new View();
        this.view.attach(config.element.attachShadow({ mode: 'closed' }));
        this.updateModel({
            ...this.model,
            avatarPosition: Position.parse(config.position),
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

        setTimeout(() => this.config.onStepRequested?.(position), 0);
    }

    setPosition (value: { x: number, y: number }) {
        const position = Position.parse(value);
        this.updateModel({
            ...this.model,
            avatarPosition: position,
        });
    }

};
