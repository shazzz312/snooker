import * as Colyseus from "colyseus.js";

export class NetworkClient {
  private client: Colyseus.Client;
  public room!: Colyseus.Room;

  constructor(endpoint: string = "ws://localhost:2567") {
    this.client = new Colyseus.Client(endpoint);
  }

  async connect(playerName?: string) {
    try {
      this.room = await this.client.joinOrCreate("snooker", { name: playerName });
      console.log("Joined room successfully", this.room.id);

      this.setupListeners();
      return this.room;
    } catch (e) {
      console.error("Join error", e);
      throw e;
    }
  }

  private setupListeners() {
    this.room.onStateChange((state) => {
      console.log("New state:", state);
      // Here the rendering engine would pick up the new state
    });

    this.room.onMessage("CUE_STRIKE", (message) => {
      console.log("Received CUE_STRIKE from server", message);
      // Dispatch to Physics/Rendering
    });
  }

  // Linear Interpolation for smoothly moving balls to match server state
  public interpolateBalls(localBalls: any[], serverBalls: any[], alpha: number = 0.1) {
    // alpha determines how fast the local ball catches up to the server state
    serverBalls.forEach((sBall, index) => {
      if (localBalls.length > index) {
        const lBall = localBalls[index];
        lBall.x = lBall.x + (sBall.x - lBall.x) * alpha;
        lBall.y = lBall.y + (sBall.y - lBall.y) * alpha;
        lBall.z = lBall.z + (sBall.z - lBall.z) * alpha;
      }
    });
  }

  public emitCueStrike(power: number, angle: number, spin: any) {
    if (this.room) {
      this.room.send("CUE_STRIKE", { power, angle, spin });
    }
  }

  public emitBallsStopped(balls: any[], nextTurn?: string) {
    if (this.room) {
      this.room.send("BALLS_STOPPED", { balls, nextTurn });
    }
  }
}
