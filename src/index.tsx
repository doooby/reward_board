import React from 'react';
import ReactDom from 'react-dom';
import { Config, Model } from './model';
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
            viewWidth: 0,
            // viewWidthMax: Math.max(800, config.viewWidthMax || 0),
            wrapperElement: config.wrapperElement!,
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
    }

    rerenderAndDebug () {
        const orig_model = this.model;
        this.updateModel({ ...this.model });
        const next_model = this.model;
        console.log(this.model);
        console.log('model changed: ', orig_model === next_model);
    }

    changeWidth (width: number) {
        this.updateModel({
            ...this.model,
            viewWidth: width,
        });
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
