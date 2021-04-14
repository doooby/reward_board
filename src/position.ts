import { RIM_LAS_LEVEL_STEPS, RIM_STEPS, RIMS_LEVELS } from './board';

type Direction = "north" | "east" | "south" | "west";

const CLOCK_WISE = 1;
const COUNTER_CLOCK_WISE = -1;

interface Model {
    direction: null | Direction;
    rim: null | {
        level: number;
        step: number;
        sidestep: number;
    };
}

export class Position {
    model: Model = {
        direction: null,
        rim: null,
    };

    static assertValidModel (model: Model) {
        if (model.rim !== null) {
            const { rim } = model;
            switch (true) {
                case (rim.level < 1 || rim.level > RIMS_LEVELS):
                    throw new Error('en.Position.invalid.rim_level');

                case (
                    rim.step < 0
                    ||
                    (
                        rim.level < RIMS_LEVELS ?
                            rim.step > RIM_STEPS - 1
                            :
                            rim.step > RIM_LAS_LEVEL_STEPS - 1
                    )
                ):
                    throw new Error('en.Position.invalid.step');

                case (
                    rim.sidestep < 0
                    ||
                    ( rim.sidestep > ( rim.level * RIM_STEPS ) )
                    ||
                    ( rim.sidestep > 0 && rim.step < RIM_STEPS )
                ):
                    throw new Error('en.Position.invalid.sidestep');

            }
        }
    }

    stepUp () {
        const { level, step, sidestep } = this.model.rim;

        const rimSteps = level !== RIM_STEPS ? RIM_STEPS : RIM_LAS_LEVEL_STEPS;
        if (step > rimSteps) {
            this.model.rim = {
                level: level + 1,
                step: 0,
                sidestep: 0,
            };

        } else {
            this.model.rim = {
                level,
                step: step + 1,
                sidestep,
            };
        }
    }

    stepDown () {
        const { level, step } = this.model.rim;

        if (step === 0) {
            if (level === 1) this.model.rim = null;
            else this.model.rim = {
                level: level - 1,
                step: 0,
                sidestep: 0,
            };

        } else {
            this.model.rim = {
                level,
                step: step - 1,
                sidestep: 0,
            }
        }
    }

    stepRight () {
        const { direction } = this.model;
        const { level, sidestep } = this.model.rim;
        const lastStep = level * RIM_STEPS;

        if (sidestep >= lastStep) {
            this.model.direction = rotateDirection(direction, CLOCK_WISE);
            this.model.rim.sidestep = -sidestep + COUNTER_CLOCK_WISE;
        } else {
            this.model.rim.sidestep = sidestep + CLOCK_WISE;
        }
    }

    stepLeft () {
        const { direction } = this.model;
        const { level, sidestep } = this.model.rim;
        const lastStep = level * RIM_STEPS;

        if (sidestep <= -lastStep) {
            this.model.direction = rotateDirection(direction, COUNTER_CLOCK_WISE);
            this.model.rim.sidestep = -sidestep + CLOCK_WISE;
        } else {
            this.model.rim.sidestep = sidestep + COUNTER_CLOCK_WISE;
        }
    }

}

function rotateDirection (direction: Direction, rotation: 1 | -1): Direction {
    switch (direction) {
        case 'north': return rotation === 1 ? 'east' : 'west';
        case 'east': return rotation === 1 ? 'south' : 'north';
        case 'south': return rotation === 1 ? 'west' : 'east';
        case 'west': return rotation === 1 ? 'north' : 'south';
    }
}
