import { Position } from './board';

export type Config = {
    element: HTMLElement;
    position?: { x: number, y: number };
    onStepRequested?: (position: Position) => void;
}

export type Model = {
    viewSize: number;
    wrapperElement: HTMLDivElement;
    avatarPosition: null | Position;
}
