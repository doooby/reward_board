import {mapTiles} from './constants';
import {BoardSizes, Model, RewardItem} from './model';
import Position from './Position';
import throttle from 'lodash.throttle';

const STEP_SIZE = 2.3;
const STEP_MARGIN = 0;
const STEP_BORDER = STEP_SIZE / 10;

const boardSizes = {
    slot: STEP_SIZE + (2 * STEP_BORDER) + (2 * STEP_MARGIN),
    stepMargin: STEP_MARGIN,
    step: STEP_SIZE + (2 * STEP_BORDER),
    stepBorder: STEP_BORDER,
};

const avatarRelSize = 40;
const avatarSizes = {
    thick: 2,
    headRadius: 7,
    headY: -7,
    pathTopY: -1,
    pathBottomY: 14,
    path1x: -3,
    path2x: -10,
    path3x: 11,
    path4x: 3,
}

export default class View {
    mouseOverPosition: null | Position = null;
    onPositionClickCallback: (position: Position) => void;
    onMouseMoveCallback: (position: undefined | Position) => void;

    wrapper: HTMLDivElement;
    canvas: HTMLCanvasElement;
    canvasCtx: null | CanvasRenderingContext2D = null;

    currentModel: null | Model = null;
    currentSizes: null | BoardSizes = null;

    constructor (props: {
        onPositionClick: (position: Position) => void,
        onMouseMove: (position: undefined | Position) => void,
    }) {
        this.onPositionClickCallback = props.onPositionClick;
        this.onMouseMoveCallback = props.onMouseMove;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('wrapper');

        this.canvas = document.createElement('canvas');
        this.resetCanvas(0);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('click', this.onPositionClick);
        this.wrapper.appendChild(this.canvas);
    }

    attach (root: ShadowRoot) {
        root.appendChild(this.wrapper);
    }

    render (model: Model) {
        this.currentModel = model;
        if (model.viewSize !== this.canvas.width || model.viewSize !== this.canvas.height) {
            this.resetCanvas(model.viewSize);
        }
        const ctx = this.canvasCtx;
        if (ctx === null) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, model.viewSize, model.viewSize);

        this.currentSizes = {
            view: model.viewSize,
            ...relativeSizes(boardSizes, model.viewSize),
        };

        // render rewards
        for (let reward of model.rewards) {
            renderReward(ctx, reward, this.currentSizes);
        }

        // render avatar
        if (model.avatarPosition) renderAvatar(ctx, model.avatarPosition, this.currentSizes, model.avatarColor);

        // render step tiles
        ctx.lineWidth = this.currentSizes.stepBorder;
        ctx.strokeStyle = 'black';
        for (let tile of mapTiles) {
            renderStep(ctx, tile, this.currentSizes);
        }
    }

    resetCanvas (viewSize: number) {
        this.canvas.width = viewSize;
        this.canvas.height = viewSize;
        this.canvasCtx = this.canvas.getContext('2d')!;

        if (this.canvasCtx === null) return;
        this.canvasCtx.imageSmoothingEnabled = false;
    }

    onPositionClick = (e: MouseEvent) => {
        e.stopPropagation();
        const position = mousePositionGet(this, e);
        if (position?.isOnBoard()) {
            this.onPositionClickCallback(position);
        }
    }

    onMouseMove = throttle(
        (e: MouseEvent) => {
            const lastPosition = this.mouseOverPosition;
            e.stopPropagation();
            const position = mousePositionGet(this, e);
            if (position === null) return;

            if (!position.isOnBoard()) {
                this.mouseOverPosition = null;
            }
            else if (lastPosition?.x !== position.x || lastPosition?.y !== position.y) {
                this.mouseOverPosition = position;
            }

            if (lastPosition !== this.mouseOverPosition) {
                this.onMouseMoveCallback(this.mouseOverPosition || undefined);
            }
        },
        400
    );

}

function renderStep (
    ctx: CanvasRenderingContext2D,
    tile: { x: number, y: number },
    sizes: BoardSizes,
) {
    const { slot, stepMargin, step } = sizes;
    const [ x, y ] = realPosition(tile, sizes);
    ctx.setTransform(1, 0, 0, 1, x - Math.floor(slot / 2), y - Math.floor(slot / 2));
    ctx.strokeRect(stepMargin, stepMargin, step, step);
}

function renderAvatar (
    ctx: CanvasRenderingContext2D,
    position: { x: number, y: number },
    sizes: BoardSizes,
    fillColor: string,
) {
    const { slot } = sizes;
    const [ x, y ] = realPosition(position, sizes);
    const avatar = relativeSizes(avatarSizes, slot, avatarRelSize, false);
    ctx.lineWidth = avatar.thick;
    ctx.strokeStyle = 'black';
    ctx.setTransform(1, 0, 0, 1, x + 0.5, y + 0.5);
    ctx.beginPath();
    ctx.ellipse(0, avatar.headY, avatar.headRadius, avatar.headRadius, 0, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.moveTo(avatar.path1x, avatar.pathTopY);
    ctx.lineTo(avatar.path2x, avatar.pathBottomY);
    ctx.lineTo(avatar.path3x, avatar.pathBottomY);
    ctx.lineTo(avatar.path4x, avatar.pathTopY);
    ctx.fill();
    ctx.stroke();
}

function renderReward (
    ctx: CanvasRenderingContext2D,
    rewardItem: RewardItem,
    sizes: BoardSizes,
) {
    const { step, stepMargin, slot } = sizes;
    const [ x, y ] = realPosition(rewardItem, sizes);
    ctx.fillStyle = rewardItem.color;
    ctx.setTransform(1, 0, 0, 1, x, y );
    const halfSlot = Math.floor(slot / 2);
    ctx.fillRect(stepMargin - halfSlot, stepMargin - halfSlot, step, step);

    const fontSize = Math.floor(slot * 0.8);
    ctx.font = `bold ${fontSize}px sans`;
    ctx.fillStyle = 'black';
    const text = rewardItem.label;
    ctx.fillText(text, - (ctx.measureText(text).width / 2), fontSize * 0.35);
}

function realPosition (
    position: { x: number, y: number },
    { view, slot }: BoardSizes,
): [ number, number ] {
    const x = (view / 2) + (position.x * slot);
    const y = (view / 2) + (position.y * slot);
    return [ x, y ];
}

function relSize (value: number, fullSize: number, relativeSize: number): number {
    return (value / relativeSize) * fullSize;
    // return (realSize / 100) * realView;
}

function relativeSizes<S extends { [prop: string]: number }> (
    sizes: S,
    fullSize: number,
    relativeSize: number = 100,
    round: boolean = true,
) {
    sizes = {...sizes};
    for (const prop of Object.keys(sizes)) {
        const value = relSize(sizes[prop], fullSize, relativeSize);
        (sizes as any)[prop] = round ? Math.round(value) : value;
    }
    return sizes;
}

function mousePositionGet (view: View, e: MouseEvent): null | Position {
    if (!view.currentModel || !view.currentSizes) return null;

    const slotSize = view.currentSizes.slot
    const centerOffset = view.currentModel.viewSize / 2;
    const rect = view.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.x - centerOffset + slotSize/2) / view.currentSizes.slot);
    const y = Math.floor((e.clientY - rect.y - centerOffset + slotSize/2) / view.currentSizes.slot);
    return new Position(x, y);
}
