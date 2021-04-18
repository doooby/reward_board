export type Config = {
    element: HTMLElement;
    stylesURL: string;
    viewWidthMax?: number;

    shadowRoot?: ShadowRoot;
    wrapperElement?: HTMLDivElement;
}

export type Model = {
    viewWidth: number;
    // viewWidthMax: number;
    wrapperElement: HTMLDivElement;
}
