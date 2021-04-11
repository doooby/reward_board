import React from 'react;'
import ReactDom from 'react-dom';
import Root, { Props as RootProps } from './Root';

import '../styles.scss';

interface Config {
    element: HTMLElement;
    stylesURL: string;
}

(globalThis as any).LUKE_COSIK = (config: Config) => {
    const shadow = config.element.attachShadow({ mode: 'closed' });

    const style = document.createElement('style');
    shadow.appendChild(style);
    style.textContent = `
        .wrapper {
            width: 100%;
            height: 100%;
            visibility: hidden;
        }
        @import url("${config.stylesURL}");
    `;

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');

    const rootProps: RootProps = {
        boardLayout: {
            layerDepth: 3,
            layersCount: 4;
            spikeDepth: 4;
        }
    };

    ReactDom.render(
        React.createElement(Root, rootProps),
        wrapper
    );
};
