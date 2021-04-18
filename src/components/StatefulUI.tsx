import React, {useState} from 'react';
import { Model } from "../model";
import Board from "./Board";

export default function StatefulUI (props: {
    defaultModel: Model;
    registerModelSetter(setter: (model: Model) => void): void;
}) {
    const [model, setModel] = useState(props.defaultModel);
    props.registerModelSetter(setModel);

    return <Board model={model}/>;
}
