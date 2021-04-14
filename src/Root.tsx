import React from 'react';
import Board from "./components/Board";

export interface Props {
    boardState: any;
}

export default function (props: Props) {
    return <div>
        <Board
            boardState={props.boardState}
        />
    </div>;
}
