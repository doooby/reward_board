import { RIM_LAS_LEVEL_STEPS, RIM_STEPS, RIMS_LEVELS } from './board';

type Direction = "north" | "east" | "south" | "west";

const CLOCK_WISE = 1;
const COUNTER_CLOCK_WISE = -1;

type Rim = {
    level: number;
    step: number;
    sidestep: number;
}

export class Position {
    direction: null | Direction = null;
    rim: null | Rim = null;

    static assertValid (position: Position) {
        const { rim } = position;
        if (rim !== null) {
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
        if (!this.direction || !this.rim) throw new Error('invalid position');
        const { level, step, sidestep } = this.rim;

        const rimSteps = level !== RIM_STEPS ? RIM_STEPS : RIM_LAS_LEVEL_STEPS;
        if (step > rimSteps) {
            this.rim = {
                level: level + 1,
                step: 0,
                sidestep: 0,
            };

        } else {
            this.rim = {
                level,
                step: step + 1,
                sidestep,
            };
        }
    }

    stepDown () {
        if (!this.direction || !this.rim) throw new Error('invalid position');
        const { level, step } = this.rim;

        if (step === 0) {
            if (level === 1) this.rim = null;
            else this.rim = {
                level: level - 1,
                step: 0,
                sidestep: 0,
            };

        } else {
            this.rim = {
                level,
                step: step - 1,
                sidestep: 0,
            }
        }
    }

    stepRight () {
        if (!this.direction || !this.rim) throw new Error('invalid position');
        const { direction } = this;
        const { level, sidestep } = this.rim;
        const lastStep = level * RIM_STEPS;

        if (sidestep >= lastStep) {
            this.direction = rotateDirection(direction, CLOCK_WISE);
            this.rim.sidestep = -sidestep + COUNTER_CLOCK_WISE;
        } else {
            this.rim.sidestep = sidestep + CLOCK_WISE;
        }
    }

    stepLeft () {
        if (!this.direction || !this.rim) throw new Error('invalid position');
        const { direction } = this;
        const { level, sidestep } = this.rim;
        const lastStep = level * RIM_STEPS;

        if (sidestep <= -lastStep) {
            this.direction = rotateDirection(direction, COUNTER_CLOCK_WISE);
            this.rim.sidestep = -sidestep + CLOCK_WISE;
        } else {
            this.rim.sidestep = sidestep + COUNTER_CLOCK_WISE;
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
