"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.physicsEventEmitter = void 0;
const events_1 = require("events");
const engine_1 = require("./engine");
exports.physicsEventEmitter = new events_1.EventEmitter();
// Listen for CUE_STRIKE event emitted by UI/Network
exports.physicsEventEmitter.on('CUE_STRIKE', (payload) => {
    const { gameState, action } = payload;
    // Run pure deterministic physics simulation
    const trajectories = (0, engine_1.simulateShot)(gameState.balls, action.cuePower, action.angle, action.spin);
    // Construct standard event response
    const update = {
        trajectories,
    };
    // Broadcast the result
    exports.physicsEventEmitter.emit('PHYSICS_UPDATE', update);
});
//# sourceMappingURL=index.js.map