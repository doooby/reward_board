import Position from './Position';

export type Model = {
    viewSize: number;
    avatarPosition: null | Position;
    avatarColor: string;
    rewards: Readonly<RewardItem[]>;
}

export interface RewardItem {
    x: number;
    y: number;
    color: string;
    label: string;
    id: string;
    text: string;
}

export interface BoardSizes {
    view: number,
    slot: number,
    stepMargin: number,
    step: number,
    stepBorder: number,
}


