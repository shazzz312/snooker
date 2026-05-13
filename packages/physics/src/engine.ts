import type { BallState, Spin, Vector2D } from './types';
import * as MathUtils from './math';
import {
  TABLE_LENGTH,
  TABLE_WIDTH,
  BALL_RADIUS,
  CUSHION_RESTITUTION,
  POCKET_RADIUS,
  FRICTION_ROLLING,
  FRICTION_SLIDING,
} from './constants';

const POCKET_POSITIONS: Vector2D[] = [
  { x: 0, y: 0 },
  { x: TABLE_WIDTH / 2, y: 0 },
  { x: TABLE_WIDTH, y: 0 },
  { x: 0, y: TABLE_LENGTH },
  { x: TABLE_WIDTH / 2, y: TABLE_LENGTH },
  { x: TABLE_WIDTH, y: TABLE_LENGTH },
];

export const checkCollisions = (balls: BallState[]) => {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const b1 = balls[i];
      const b2 = balls[j];

      if (!b1.active || !b2.active) continue;

      const dist = MathUtils.distance(b1.position, b2.position);
      if (dist < BALL_RADIUS * 2) {
        // Handle elastic collision
        const normal = MathUtils.normalize(MathUtils.subtract(b2.position, b1.position));
        const relativeVelocity = MathUtils.subtract(b1.velocity, b2.velocity);
        const speed = MathUtils.dot(relativeVelocity, normal);

        if (speed > 0) {
          const impulse = speed;
          const impulseVector = MathUtils.scale(normal, impulse);

          b1.velocity = MathUtils.subtract(b1.velocity, impulseVector);
          b2.velocity = MathUtils.add(b2.velocity, impulseVector);

          // Resolve overlap to prevent sticky balls
          const overlap = BALL_RADIUS * 2 - dist;
          const correction = MathUtils.scale(normal, overlap / 2);
          b1.position = MathUtils.subtract(b1.position, correction);
          b2.position = MathUtils.add(b2.position, correction);
        }
      }
    }
  }
};

export const checkCushions = (ball: BallState) => {
  if (!ball.active) return;

  if (ball.position.x - BALL_RADIUS < 0) {
    ball.position.x = BALL_RADIUS;
    ball.velocity.x *= -CUSHION_RESTITUTION;
  } else if (ball.position.x + BALL_RADIUS > TABLE_WIDTH) {
    ball.position.x = TABLE_WIDTH - BALL_RADIUS;
    ball.velocity.x *= -CUSHION_RESTITUTION;
  }

  if (ball.position.y - BALL_RADIUS < 0) {
    ball.position.y = BALL_RADIUS;
    ball.velocity.y *= -CUSHION_RESTITUTION;
  } else if (ball.position.y + BALL_RADIUS > TABLE_LENGTH) {
    ball.position.y = TABLE_LENGTH - BALL_RADIUS;
    ball.velocity.y *= -CUSHION_RESTITUTION;
  }
};

export const checkPockets = (ball: BallState) => {
  if (!ball.active) return;

  for (const pocket of POCKET_POSITIONS) {
    if (MathUtils.distance(ball.position, pocket) < POCKET_RADIUS) {
      ball.active = false;
      ball.velocity = { x: 0, y: 0 };
      break;
    }
  }
};

export const simulateShot = (
  initialBalls: BallState[],
  cuePower: number,
  angle: number,
  spin: Spin
): BallState[][] => {
  const dt = 0.016; // 60fps simulation step

  // Deep copy initial state
  const balls: BallState[] = initialBalls.map(b => ({
    ...b,
    position: { ...b.position },
    velocity: { ...b.velocity }
  }));

  const trajectories: BallState[][] = [];

  // Find cue ball (assume it's active and id is 'cue')
  const cueBall = balls.find(b => b.id === 'cue' && b.active);
  if (cueBall) {
    // Apply initial impulse
    const impulse = MathUtils.rotate({ x: 0, y: cuePower }, angle);
    cueBall.velocity = MathUtils.add(cueBall.velocity, impulse);
  }

  let isMoving = true;
  let safetyCounter = 0;

  // Save initial state frame
  trajectories.push(balls.map(b => ({ ...b, position: { ...b.position }, velocity: { ...b.velocity } })));

  while (isMoving && safetyCounter < 3000) { // Max ~50 seconds of simulation to prevent infinite loop
    isMoving = false;

    // Apply velocities, swerve, and friction
    for (const ball of balls) {
      if (!ball.active) continue;

      const speed = MathUtils.length(ball.velocity);
      if (speed > 0.1) {
        isMoving = true;

        // Basic Swerve logic (curve trajectory based on spin.side)
        if (ball.id === 'cue' && Math.abs(spin.side) > 0) {
            // Apply a perpendicular force based on spin side
            const dir = MathUtils.normalize(ball.velocity);
            const perp = { x: -dir.y, y: dir.x };
            const swerveForce = MathUtils.scale(perp, spin.side * speed * 0.01);
            ball.velocity = MathUtils.add(ball.velocity, swerveForce);
        }

        // Apply friction
        const frictionForce = MathUtils.scale(MathUtils.normalize(ball.velocity), -(FRICTION_ROLLING + FRICTION_SLIDING));
        ball.velocity = MathUtils.add(ball.velocity, frictionForce);

        // Prevent floating-point drifting
        if (MathUtils.length(ball.velocity) < 0.1) {
            ball.velocity = { x: 0, y: 0 };
        } else {
            // Apply velocity to position
            const displacement = MathUtils.scale(ball.velocity, dt);
            ball.position = MathUtils.add(ball.position, displacement);
        }
      } else {
         ball.velocity = { x: 0, y: 0 };
      }
    }

    // Check collisions
    checkCollisions(balls);

    for (const ball of balls) {
      checkCushions(ball);
      checkPockets(ball);
    }

    if (isMoving) {
        // Save state frame
        trajectories.push(balls.map(b => ({ ...b, position: { ...b.position }, velocity: { ...b.velocity } })));
    }

    safetyCounter++;
  }

  return trajectories;
};
