import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Ball extends Schema {
  @type("string") id: string = "";
  @type("string") color: string = "";
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
}

export class Player extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("number") score: number = 0;
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([ Ball ]) balls = new ArraySchema<Ball>();

  @type("string") currentTurn: string = ""; // playerId
  @type("string") gamePhase: string = "waiting"; // "waiting", "playing", "finished"
  @type("number") currentBreak: number = 0;
}
