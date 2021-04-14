import React from 'react';

const RESOLUTION = 200;

interface BoardState {

}

const Board = class extends React.PureComponent<{
    boardState: BoardState;
}> {

    canvasRef = React.createRef<HTMLCanvasElement>();
    canvasCtx: null | CanvasRenderingContext2D = null;

    render () {
        if (this.canvasCtx) this.paint();

        return <canvas
            ref={this.canvasRef}
            width={RESOLUTION}
            height={RESOLUTION}
        />;
    }

    componentDidMount() {
        this.canvasCtx = this.canvasRef.current.getContext('2d');
        this.paint();
    }

    paint () {
        const ctx = this.canvasCtx;
        if (ctx === null) return;

        const { width, height } = this.canvasRef.current;
        ctx.clearRect(0, 0, width, height);

    }

}

export default Board;
