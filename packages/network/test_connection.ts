import { NetworkClient } from "./client/NetworkClient";

async function test() {
  const client = new NetworkClient();
  try {
    console.log("Connecting client 1...");
    const room1 = await client.connect("Test Player 1");

    const client2 = new NetworkClient();
    console.log("Connecting client 2...");
    const room2 = await client2.connect("Test Player 2");

    setTimeout(() => {
        client.emitCueStrike(100, 45, { topspin: 0 });
        setTimeout(() => {
            room1.leave();
            room2.leave();
            process.exit(0);
        }, 1000);
    }, 1000);

  } catch(e) {
    console.error("Test failed", e);
    process.exit(1);
  }
}

test();
