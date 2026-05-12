import { Room, Client } from "@colyseus/core";
import { GameState, Player } from "../schema/GameState";

export class SnookerRoom extends Room<GameState, any> {
  maxClients = 2;

  onCreate (options: any) {
    this.setState(new GameState());
    console.log("SnookerRoom created!");

    this.onMessage("CUE_STRIKE", (client, message) => {
      // Basic validation: Is it this player's turn?
      if (this.state.currentTurn !== client.sessionId) {
        console.log(`Ignoring strike from ${client.sessionId} - not their turn`);
        return;
      }

      // Broadcast the strike to other players
      this.broadcast("CUE_STRIKE", {
        playerId: client.sessionId,
        ...message
      }, { except: client });
    });

    this.onMessage("BALLS_STOPPED", (client, message) => {
      // Accept ball state updates from clients
      // In a real authoritative setup, physics simulation runs here too.
      // For now, update state from messages.

      if (message.balls && Array.isArray(message.balls)) {
        message.balls.forEach((ballUpdate: any, index: number) => {
           if (this.state.balls.length > index) {
             const stateBall = this.state.balls[index];
             stateBall.x = ballUpdate.x;
             stateBall.y = ballUpdate.y;
             stateBall.z = ballUpdate.z;
           }
        });
      }

      if (message.nextTurn) {
        this.state.currentTurn = message.nextTurn;
      }
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    const player = new Player();
    player.id = client.sessionId;
    player.name = options.name || `Player ${this.clients.length}`;
    player.score = 0;
    this.state.players.set(client.sessionId, player);

    if (this.clients.length === 2) {
      this.state.gamePhase = "playing";
      // Pick random first turn
      const playerIds = Array.from(this.state.players.keys());
      this.state.currentTurn = playerIds[Math.floor(Math.random() * playerIds.length)];
    }
  }

  onLeave (client: Client, consented?: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);

    if (this.clients.length < 2) {
      this.state.gamePhase = "waiting";
      this.state.currentTurn = "";
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
