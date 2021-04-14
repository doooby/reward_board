import React from 'react';
import ReactDom from 'react-dom';
import Board from './components/Board';

import '../styles.scss';

interface Config {
    element: HTMLElement;
    stylesURL: string;
}

(globalThis as any).LUKE_COSIK = (config: Config) => {
    const shadow = config.element.attachShadow({ mode: 'closed' });

    const style = document.createElement('style');
    style.textContent = `
        .wrapper {
            width: 100%;
            height: 100%;
            visibility: hidden;
        }
    `;

    const externalStyles = document.createElement('link');
    externalStyles.rel = 'stylesheet';
    externalStyles.href = config.stylesURL;

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');

    shadow.appendChild(style);
    shadow.appendChild(externalStyles);
    shadow.appendChild(wrapper);

    ReactDom.render(
        React.createElement(Board, {
            boardState: {
            }
        }),
        wrapper
    );
};
