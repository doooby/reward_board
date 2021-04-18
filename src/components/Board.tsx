import React from 'react';
import * as board from '../board';
import { Model } from '../model';

export default class Board extends React.PureComponent<{
    model: Model;
    // boardState: board.BoardState;
}> {

    canvasRef = React.createRef<HTMLCanvasElement>();
    canvasCtx: null | CanvasRenderingContext2D = null;

    render () {
        const { model } = this.props;
        // if (this.canvasRef.current) {
        //     this.resetCanvas();
        // }
        //
        // this.paint();
        return <canvas
            ref={this.canvasRef}
            width={model.viewWidth}
            height={model.viewWidth}
        />;
    }

    componentDidMount() {

    }

    resetCanvas () {
        // const canvas = this.canvasRef.current;
        // if (!canvas) return;
        //
        // const { boardState } = this.props;
        // const size = Math.max(
        //     Math.floor(boardState.viewWidth),
        //     Math.floor(boardState.viewWidthMax || 800),
        // );
        // canvas.width = size;
        // canvas.height = size;
        //
        // this.canvasCtx = canvas.getContext('2d');
        // board.setupCanvasContext(this.canvasCtx);
        // this.paint();
    }

    paint () {
        // if (this.canvasCtx === null) return;
        // board.renderInto(
        //     this.canvasCtx,
        //     this.props.boardState,
        // );
    }

}
