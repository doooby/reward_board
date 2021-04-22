import { Position } from './model';

describe('validate position', () => {

    function p(x: any, y: any): Position {
        return new Position(x, y);
    }

    test('check distance', () => {
        expect(p(0, 0).distance(p(0, 0))).toBe(0);

        expect(p(0, 0).distance(p(0, 1))).toBe(1);
        expect(p(0, 0).distance(p(0, -1))).toBe(1);
        expect(p(0, 0).distance(p(1, 0))).toBe(1);
        expect(p(0, 0).distance(p(-1, 0))).toBe(1);

        expect(p(0, 0).distance(p(1, 1))).toBe(2);
        expect(p(0, 0).distance(p(-1, -1))).toBe(2);

        expect(p(1, 0).distance(p(1, 1))).toBe(1);
        expect(p(1, 0).distance(p(2, 1))).toBe(2);
        expect(p(1, 0).distance(p(2, 0))).toBe(1);
        expect(p(1, 0).distance(p(2, -1))).toBe(2);

        expect(p(-1, 0).distance(p(-1, -1))).toBe(1);
        expect(p(-1, 0).distance(p(-2, -1))).toBe(2);
        expect(p(-1, 0).distance(p(-2, 0))).toBe(1);
        expect(p(-1, 0).distance(p(-2, 1))).toBe(2);
    });

    test('is on board', () => {
        expect(p(0, 0).isOnBoard()).toBeTruthy();
        expect(p(1, 0).isOnBoard()).toBeTruthy();
        expect(p(1, 1).isOnBoard()).toBeFalsy();

        expect(p(0, 2).isOnBoard()).toBeTruthy();
        expect(p(0, 12).isOnBoard()).toBeTruthy();
        expect(p(0, 13).isOnBoard()).toBeTruthy();
        expect(p(0, 17).isOnBoard()).toBeTruthy();
        expect(p(0, 18).isOnBoard()).toBeFalsy();
        expect(p(0, -17).isOnBoard()).toBeTruthy();
        expect(p(0, -18).isOnBoard()).toBeFalsy();
        expect(p(-17, 0).isOnBoard()).toBeTruthy();
        expect(p(-18, 0).isOnBoard()).toBeFalsy();

        expect(p(18, 2).isOnBoard()).toBeFalsy();
        expect(p(2, 1).isOnBoard()).toBeFalsy();
        expect(p(3, 1).isOnBoard()).toBeTruthy();
        expect(p(3, 2).isOnBoard()).toBeTruthy();
        expect(p(3, 4).isOnBoard()).toBeFalsy();
        expect(p(3, 2).isOnBoard()).toBeTruthy();
        expect(p(2, 2).isOnBoard()).toBeFalsy();
        expect(p(3, 3).isOnBoard()).toBeTruthy();
        expect(p(4, 2).isOnBoard()).toBeFalsy();
        expect(p(3, 6).isOnBoard()).toBeTruthy();
        expect(p(12, 6).isOnBoard()).toBeTruthy();
    });

});
