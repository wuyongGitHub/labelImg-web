console.log("Worker loaded");
let offscreenCanvas = null;
let offscreenCtx = null;

let TILE_WIDTH = 0;
let TILE_HEIGHT = 0;
let OVERLAP_X = 0;
let SCALE_FACTOR = 0;

console.log("Worker loaded");

onmessage = async function (e) {
  const message = e.data;
  const { type, data } = message;

  if (type === "init") {
    console.log("Init message received");
    console.log("Ports:", e.ports);

    if (!e.ports || e.ports.length === 0) {
      console.error("No OffscreenCanvas transferred");
      return;
    }

    offscreenCanvas = e.ports[0];
    offscreenCtx = offscreenCanvas.getContext("2d");

    if (!offscreenCtx) {
      console.error("Failed to get 2D context from OffscreenCanvas");
      return;
    }

    TILE_WIDTH = data.TILE_WIDTH;
    TILE_HEIGHT = data.TILE_HEIGHT;
    OVERLAP_X = data.OVERLAP_X;
    SCALE_FACTOR = data.SCALE_FACTOR;

    console.log("Initialized with context:", offscreenCtx);
    postMessage({ type: "init-done" });
    return;
  }

  if (type === "draw-tile") {
    const { tile, url } = data;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Fetch failed: ${url}`);
      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);

      if (!offscreenCtx) {
        console.error("offscreenCtx is null when trying to draw image");
        return;
      }

      const x = Math.floor(tile.col * (TILE_WIDTH - OVERLAP_X) * SCALE_FACTOR - tile.left);
      const y = Math.floor(tile.row * TILE_HEIGHT * SCALE_FACTOR - tile.top);

      offscreenCtx.drawImage(
        imageBitmap,
        0,
        0,
        TILE_WIDTH,
        TILE_HEIGHT,
        x,
        y,
        TILE_WIDTH * SCALE_FACTOR,
        TILE_HEIGHT * SCALE_FACTOR
      );

      postMessage({ type: "tile-drawn", row: tile.row, col: tile.col });
    } catch (err) {
      console.error("Failed to draw tile:", err);
    }
  }

  if (type === "render-display") {
    const { scale } = data;

    if (!offscreenCtx) {
      console.error("offscreenCtx is null when rendering display");
      return;
    }

    const imageData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    const tmpCanvas = new OffscreenCanvas(
      imageData.width * scale,
      imageData.height * scale
    );
    const tmpCtx = tmpCanvas.getContext("2d");

    if (!tmpCtx) {
      console.error("Failed to get tmpCtx");
      return;
    }

    tmpCtx.putImageData(
      imageData,
      0,
      0,
      {
        colorSpace: "srgb",
        premultipliedAlpha: false,
      }
    );

    const blob = await tmpCanvas.convertToBlob();
    postMessage({ type: "rendered-result", blob }, [blob]);
  }
};