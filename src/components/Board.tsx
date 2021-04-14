import React from 'react';
import * as board from '../board';

const Board = class extends React.PureComponent<{
    boardState: board.BoardState;
}> {

    canvasRef = React.createRef<HTMLCanvasElement>();
    canvasCtx: null | CanvasRenderingContext2D = null;

    render () {
        if (this.canvasCtx) this.paint();
        return <canvas
            ref={this.canvasRef}
            width={board.RESOLUTION}
            height={board.RESOLUTION}
        />;
    }

    componentDidMount() {
        this.canvasCtx = this.canvasRef.current.getContext('2d');
        this.paint();
    }

    paint () {
        const ctx = this.canvasCtx;
        if (ctx === null) return;
        board.renderInto(
            this.canvasRef.current,
            this.canvasCtx,
            this.props.boardState,
        );
    }

}

export default Board;
