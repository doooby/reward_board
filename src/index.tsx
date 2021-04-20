import React from 'react';
import ReactDom from 'react-dom';
import { Config, Model } from './model';
import { Position, PossibleSteps } from './board';
import StatefulUI from './components/StatefulUI';

import '../styles.scss';

(globalThis as any).D3O_RewardBoard = class {
    model: Model;
    updateModel: (model: Model) => void;

    constructor (config: Config) {
        config.shadowRoot = config.element.attachShadow({ mode: 'closed' });
        initializers.addContentStyles(config);
        initializers.addExternalStyles(config);
        initializers.addWrapperElement(config);

        this.model = {
            viewSize: 0,
            wrapperElement: config.wrapperElement!,
            avatarPosition: new Position(0, 0),
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
        observer.observe(config.wrapperElement!);
    }

    changeWidth (width: number) {
        this.updateModel({
            ...this.model,
            viewSize: width,
        });
    }

    possibleSteps (): PossibleSteps {
        return this.model.avatarPosition.possibleSteps();
    }

    step (direction: keyof PossibleSteps): null | Position {
        const newAvatarPosition = this.model.avatarPosition.step(direction);
        if (!newAvatarPosition || !newAvatarPosition.isOnBoard()) return null;

        this.updateModel({
            ...this.model,
            avatarPosition: newAvatarPosition,
        });
        return newAvatarPosition;
    }

};

const initializers = {

    addContentStyles (config: Config) {
        const style = document.createElement('style');
        style.textContent = `
        .wrapper {
            //width: 100%;
            //height: 100%;
            visibility: hidden;
        }
    `;
        config.shadowRoot!.appendChild(style);
    },

    addExternalStyles (config: Config) {
        const externalStyles = document.createElement('link');
        externalStyles.rel = 'stylesheet';
        externalStyles.href = config.stylesURL;
        config.shadowRoot!.appendChild(externalStyles);
    },

    addWrapperElement (config: Config) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        config.wrapperElement = wrapper;
        config.shadowRoot!.appendChild(wrapper);
    },

};
