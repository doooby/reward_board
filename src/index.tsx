import React from 'react';
import ReactDom from 'react-dom';
import { Config, Model } from './model';
import {Position, PossibleSteps} from './board';
import StatefulUI from './components/StatefulUI';

(globalThis as any).D3O_RewardBoard = class {
    config: Config;
    model: Model;
    updateModel: (model: Model) => void;

    constructor (config: Config) {
        this.config = config;

        const shadowRoot = config.element.attachShadow({ mode: 'closed' });
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        shadowRoot.appendChild(wrapper);

        this.model = {
            viewSize: 0,
            wrapperElement: wrapper,
            avatarPosition: Position.parse(config.position),
        }

        let setModel: (model: Model) => void;
        this.updateModel = (model) => {
            this.model = model;
            setModel(model);
        };

        ReactDom.render(
            <StatefulUI
                defaultModel={this.model}
                registerModelSetter={
                    (setter: (model: Model) => void) => setModel = setter
                }
            />,
            this.model.wrapperElement,
        );

        const observer = new ResizeObserver(
            (entries: ResizeObserverEntry[]) => {
                try {
                    const width = entries[0].contentRect.width;
                    this.changeWidth(width);
                }
                finally {}
            }
        );
        observer.observe(wrapper);
    }

    changeWidth (width: number) {
        this.updateModel({
            ...this.model,
            viewSize: width,
        });
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
