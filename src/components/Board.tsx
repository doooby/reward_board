import React from 'react';
import * as board from '../board';
import { Model } from '../model';

export default class Board extends React.PureComponent<{
    model: Model;
}> {

    canvasRef = React.createRef<HTMLCanvasElement>();
    canvasCtx: null | CanvasRenderingContext2D = null;

    render () {
        const { model } = this.props;
        if (this.canvasRef.current) {
            this.resetCanvas();
        }

        this.paint();
        return <canvas
            ref={this.canvasRef}
            width={model.viewSize}
            height={model.viewSize}
        />;
    }

    resetCanvas () {
        const canvas = this.canvasRef.current;
        if (!canvas) return;

        const { model } = this.props;
        canvas.width = model.viewSize;
        canvas.height = model.viewSize;

        this.canvasCtx = canvas.getContext('2d');
        board.setupCanvasContext(this.canvasCtx!);
        this.paint();
    }

    paint () {
        if (this.canvasCtx === null) return;
        board.renderInto(
            this.canvasCtx,
            this.props.model,
        );
    }

}
