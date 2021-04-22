import { BoardSizes, Model, mapTiles, RewardItem } from './model';

const STEP_SIZE = 2.1;
const STEP_MARGIN = 0;
const STEP_BORDER = STEP_SIZE / 10;
const AVATAR_SIZE = STEP_SIZE;

export default class View {
    wrapper: HTMLDivElement;
    canvas: HTMLCanvasElement;
    canvasCtx: null | CanvasRenderingContext2D = null;

    constructor () {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('wrapper');

        this.canvas = document.createElement('canvas');
        this.resetCanvas(0);
        this.wrapper.appendChild(this.canvas);
    }

    attach (root: ShadowRoot) {
        root.appendChild(this.wrapper);
    }

    render (model: Model) {
        if (model.viewSize !== this.canvas.width || model.viewSize !== this.canvas.height) {
            this.resetCanvas(model.viewSize);
        }
        const ctx = this.canvasCtx;
        if (ctx === null) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, model.viewSize, model.viewSize);

        const sizes: BoardSizes = {
            view: model.viewSize,
            slot: cent(STEP_SIZE + (2 * STEP_BORDER) + (2 * STEP_MARGIN), model.viewSize),
            stepMargin: cent(STEP_MARGIN, model.viewSize),
            step: cent(STEP_SIZE + (2 * STEP_BORDER), model.viewSize),
            stepBorder: cent(STEP_BORDER, model.viewSize),
            avatar: cent(AVATAR_SIZE, model.viewSize),
        };

        // render step tiles
        ctx.lineWidth = sizes.stepBorder;
        ctx.strokeStyle = 'black';
        for (let tile of mapTiles) {
            renderStep(ctx, tile, sizes);
        }

        // render rewards
        for (let reward of model.rewards) {
            renderReward(ctx, reward, sizes);
        }

        // render avatar
        if (model.avatarPosition) renderAvatar(ctx, model.avatarPosition, sizes);
    }

    resetCanvas (viewSize: number) {
        this.canvas.width = viewSize;
        this.canvas.height = viewSize;
        this.canvasCtx = this.canvas.getContext('2d')!;

        if (this.canvasCtx === null) return;
        this.canvasCtx.imageSmoothingEnabled = false;
    }

}

function renderStep (
    ctx: CanvasRenderingContext2D,
    tile: { x: number, y: number },
    sizes: BoardSizes,
) {
    const { slot, stepMargin, step } = sizes;
    const [ x, y ] = realPosition(tile, sizes);
    ctx.setTransform(1, 0, 0, 1, x - (slot / 2), y - (slot / 2));
    ctx.strokeRect(stepMargin, stepMargin, step, step);
}

function renderAvatar (
    ctx: CanvasRenderingContext2D,
    position: { x: number, y: number },
    sizes: BoardSizes,
) {
    const { avatar } = sizes;
    const [ x, y ] = realPosition(position, sizes);
    ctx.fillStyle = 'orange';
    ctx.setTransform(1, 0, 0, 1, x - (avatar / 2), y - (avatar / 2));
    ctx.fillRect(0, 0, avatar, avatar);
}

function renderReward (
    ctx: CanvasRenderingContext2D,
    rewardItem: RewardItem,
    sizes: BoardSizes,
) {
    const { avatar } = sizes;
    const [ x, y ] = realPosition(rewardItem, sizes);
    ctx.fillStyle = rewardItem.style.color;
    ctx.setTransform(1, 0, 0, 1, x - (avatar / 2), y - (avatar / 2));
    ctx.fillRect(0, 0, avatar, avatar);
}

function realPosition (
    position: { x: number, y: number },
    { view, slot }: BoardSizes,
): [ number, number ] {
    const x = (view / 2) + (position.x * slot);
    const y = (view / 2) + (position.y * slot);
    return [ x, y ];
}

function cent (realSize: number, realView: number): number {
    return Math.ceil((realSize / 100) * realView);
    // return (realSize / 100) * realView;
}