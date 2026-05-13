"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateShot = exports.checkPockets = exports.checkCushions = exports.checkCollisions = void 0;
const MathUtils = __importStar(require("./math"));
const constants_1 = require("./constants");
const POCKET_POSITIONS = [
    { x: 0, y: 0 },
    { x: constants_1.TABLE_WIDTH / 2, y: 0 },
    { x: constants_1.TABLE_WIDTH, y: 0 },
    { x: 0, y: constants_1.TABLE_LENGTH },
    { x: constants_1.TABLE_WIDTH / 2, y: constants_1.TABLE_LENGTH },
    { x: constants_1.TABLE_WIDTH, y: constants_1.TABLE_LENGTH },
];
const checkCollisions = (balls) => {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const b1 = balls[i];
            const b2 = balls[j];
            if (!b1.active || !b2.active)
                continue;
            const dist = MathUtils.distance(b1.position, b2.position);
            if (dist < constants_1.BALL_RADIUS * 2) {
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
                    const overlap = constants_1.BALL_RADIUS * 2 - dist;
                    const correction = MathUtils.scale(normal, overlap / 2);
                    b1.position = MathUtils.subtract(b1.position, correction);
                    b2.position = MathUtils.add(b2.position, correction);
                }
            }
        }
    }
};
exports.checkCollisions = checkCollisions;
const checkCushions = (ball) => {
    if (!ball.active)
        return;
    if (ball.position.x - constants_1.BALL_RADIUS < 0) {
        ball.position.x = constants_1.BALL_RADIUS;
        ball.velocity.x *= -constants_1.CUSHION_RESTITUTION;
    }
    else if (ball.position.x + constants_1.BALL_RADIUS > constants_1.TABLE_WIDTH) {
        ball.position.x = constants_1.TABLE_WIDTH - constants_1.BALL_RADIUS;
        ball.velocity.x *= -constants_1.CUSHION_RESTITUTION;
    }
    if (ball.position.y - constants_1.BALL_RADIUS < 0) {
        ball.position.y = constants_1.BALL_RADIUS;
        ball.velocity.y *= -constants_1.CUSHION_RESTITUTION;
    }
    else if (ball.position.y + constants_1.BALL_RADIUS > constants_1.TABLE_LENGTH) {
        ball.position.y = constants_1.TABLE_LENGTH - constants_1.BALL_RADIUS;
        ball.velocity.y *= -constants_1.CUSHION_RESTITUTION;
    }
};
exports.checkCushions = checkCushions;
const checkPockets = (ball) => {
    if (!ball.active)
        return;
    for (const pocket of POCKET_POSITIONS) {
        if (MathUtils.distance(ball.position, pocket) < constants_1.POCKET_RADIUS) {
            ball.active = false;
            ball.velocity = { x: 0, y: 0 };
            break;
        }
    }
};
exports.checkPockets = checkPockets;
const simulateShot = (initialBalls, cuePower, angle, spin) => {
    const dt = 0.016; // 60fps simulation step
    // Deep copy initial state
    const balls = initialBalls.map(b => ({
        ...b,
        position: { ...b.position },
        velocity: { ...b.velocity }
    }));
    const trajectories = [];
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
            if (!ball.active)
                continue;
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
                const frictionForce = MathUtils.scale(MathUtils.normalize(ball.velocity), -(constants_1.FRICTION_ROLLING + constants_1.FRICTION_SLIDING));
                ball.velocity = MathUtils.add(ball.velocity, frictionForce);
                // Prevent floating-point drifting
                if (MathUtils.length(ball.velocity) < 0.1) {
                    ball.velocity = { x: 0, y: 0 };
                }
                else {
                    // Apply velocity to position
                    const displacement = MathUtils.scale(ball.velocity, dt);
                    ball.position = MathUtils.add(ball.position, displacement);
                }
            }
            else {
                ball.velocity = { x: 0, y: 0 };
            }
        }
        // Check collisions
        (0, exports.checkCollisions)(balls);
        for (const ball of balls) {
            (0, exports.checkCushions)(ball);
            (0, exports.checkPockets)(ball);
        }
        if (isMoving) {
            // Save state frame
            trajectories.push(balls.map(b => ({ ...b, position: { ...b.position }, velocity: { ...b.velocity } })));
        }
        safetyCounter++;
    }
    return trajectories;
};
exports.simulateShot = simulateShot;
//# sourceMappingURL=engine.js.map