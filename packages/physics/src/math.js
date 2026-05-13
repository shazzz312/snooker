"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotate = exports.distance = exports.normalize = exports.length = exports.dot = exports.scale = exports.subtract = exports.add = void 0;
const add = (a, b) => ({
    x: a.x + b.x,
    y: a.y + b.y,
});
exports.add = add;
const subtract = (a, b) => ({
    x: a.x - b.x,
    y: a.y - b.y,
});
exports.subtract = subtract;
const scale = (v, scalar) => ({
    x: v.x * scalar,
    y: v.y * scalar,
});
exports.scale = scale;
const dot = (a, b) => a.x * b.x + a.y * b.y;
exports.dot = dot;
const length = (v) => Math.sqrt(v.x * v.x + v.y * v.y);
exports.length = length;
const normalize = (v) => {
    const len = (0, exports.length)(v);
    if (len === 0)
        return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
};
exports.normalize = normalize;
const distance = (a, b) => (0, exports.length)((0, exports.subtract)(a, b));
exports.distance = distance;
const rotate = (v, angleInRadians) => {
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    return {
        x: v.x * cos - v.y * sin,
        y: v.x * sin + v.y * cos,
    };
};
exports.rotate = rotate;
//# sourceMappingURL=math.js.map