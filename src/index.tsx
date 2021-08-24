import Board from './Board';
import Position from './Position';
import { fetch } from './fetch';
import Template from './Template';

(globalThis as any).D3O_RewardBoard = function (
    wrapper: (...args: unknown[]) => void
) {
    try {
        wrapper({ Board, fetch, Template, Position });
    } catch (error) {
        console.error('D3O_RewardBoard failed', error);
    }
}
