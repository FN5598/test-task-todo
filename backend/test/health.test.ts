import assert from "node:assert/strict";
import test from "node:test";
import { app } from "../src/app.js";

test("GET /health returns the API status", async () => {
  const server = app.listen();

  try {
    const { port } = server.address() as { port: number };
    const response = await fetch(`http://127.0.0.1:${port}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  } finally {
    server.close();
  }
});

