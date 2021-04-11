interface Model {
    direction: null | "north" | "east" | "south" | "west";
    rim: null | {
        level: number;
        step: number;
    };
}

interface Step {
    y: -1 | null | 1;
    x: null | 1 | -1;
}

const RIMS_LEVELS = 4;
const RIM_STEPS = 3;

export default class Position {
    model: Model = {
        direction: null,
        rim: null,
    };

    step ({ x, y }: Step) {
        const newPosition = { ...this };

        switch (y) {
            case -1: // step back
                throw 'niy';
                return newPosition;

            case 1: // step forward
                throw 'niy';
                return newPosition;

        }

        switch (x) {
            case 1: // step to the right
                throw 'nyi';
            case -1: // step to the left
                throw 'nyi';
        }

        throw 'en.Position.step.invalid';
    }
}
