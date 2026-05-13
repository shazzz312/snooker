import { Vector2D } from './types';

export const add = (a: Vector2D, b: Vector2D): Vector2D => ({
  x: a.x + b.x,
  y: a.y + b.y,
});

export const subtract = (a: Vector2D, b: Vector2D): Vector2D => ({
  x: a.x - b.x,
  y: a.y - b.y,
});

export const scale = (v: Vector2D, scalar: number): Vector2D => ({
  x: v.x * scalar,
  y: v.y * scalar,
});

export const dot = (a: Vector2D, b: Vector2D): number => a.x * b.x + a.y * b.y;

export const length = (v: Vector2D): number => Math.sqrt(v.x * v.x + v.y * v.y);

export const normalize = (v: Vector2D): Vector2D => {
  const len = length(v);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
};

export const distance = (a: Vector2D, b: Vector2D): number => length(subtract(a, b));

export const rotate = (v: Vector2D, angleInRadians: number): Vector2D => {
  const cos = Math.cos(angleInRadians);
  const sin = Math.sin(angleInRadians);
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos,
  };
};
