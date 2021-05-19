import Board from './Board';
import { fetch } from './fetch';
import Template from './Template';

(globalThis as any).D3O_RewardBoard = function (
    wrapper: (...args: unknown[]) => void
) {
    try {
        wrapper({ Board, fetch, Template });
    } catch (error) {
        console.error('D3O_RewardBoard failed', error);
    }
}
