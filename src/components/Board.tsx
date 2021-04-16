import React from 'react';
import * as board from '../board';

const Board = class extends React.PureComponent<{
    boardState: board.BoardState;
}> {

    canvasRef = React.createRef<HTMLCanvasElement>();
    canvasCtx: null | CanvasRenderingContext2D = null;

    render () {
        this.paint();
        return <canvas
            ref={this.canvasRef}
            width={board.RESOLUTION}
            height={board.RESOLUTION}
        />;
    }

    componentDidMount() {
        this.canvasCtx = this.canvasRef.current.getContext('2d');
        board.setupCanvasContext(this.canvasCtx);
        this.paint();
    }

    paint () {
        if (this.canvasCtx === null) return;
        board.renderInto(
            this.canvasCtx,
            this.props.boardState,
        );
    }

}

export default Board;
