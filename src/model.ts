import { Position } from './board';

export type Config = {
    element: HTMLElement;
    stylesURL: string;

    shadowRoot?: ShadowRoot;
    wrapperElement?: HTMLDivElement;
}

export type Model = {
    viewSize: number;
    wrapperElement: HTMLDivElement;
    avatarPosition: Position;
}
