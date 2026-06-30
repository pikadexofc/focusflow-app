/**
 * FocusFlow Android Icon Generator
 * Generates clean, geometric launcher icons at all required densities.
 * Design: Dark background (#030303), gradient "F" lettermark with electric cyan/indigo glow ring.
 * 100% code-generated — no AI image generation involved.
 */

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const androidRes = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

// Android mipmap density sizes (in px)
const SIZES = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
};

function drawIcon(canvas, size, round = false) {
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  // Background fill (rounded square or circle for foreground)
  if (round) {
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
  }

  // Deep dark bg
  ctx.fillStyle = '#030303';
  ctx.fillRect(0, 0, size, size);

  // Outer glow ring — electric cyan/indigo gradient
  const ring = ctx.createLinearGradient(0, 0, size, size);
  ring.addColorStop(0,   '#00f0ff');   // cyan
  ring.addColorStop(0.5, '#6366f1');   // indigo
  ring.addColorStop(1,   '#a855f7');   // violet

  const ringWidth = size * 0.045;
  const ringInset = size * 0.06;
  ctx.save();
  ctx.strokeStyle = ring;
  ctx.lineWidth = ringWidth;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  const rr = r - ringInset;
  ctx.arc(cx, cy, rr, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Inner ambient gradient fill (subtle)
  const bg2 = ctx.createRadialGradient(cx, cy * 0.6, 0, cx, cy, r * 0.85);
  bg2.addColorStop(0, 'rgba(99,102,241,0.10)');
  bg2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bg2;
  ctx.fillRect(0, 0, size, size);

  // "F" lettermark — clean geometric sans letterform
  const pad  = size * 0.30;
  const fw   = size * 0.40;   // glyph bounding width
  const fh   = size * 0.52;   // glyph bounding height
  const lx   = cx - fw / 2;
  const ty   = cy - fh / 2;
  const bar  = size * 0.085;  // bar thickness

  // Gradient for the letter
  const fg = ctx.createLinearGradient(lx, ty, lx + fw, ty + fh);
  fg.addColorStop(0, '#ffffff');
  fg.addColorStop(0.5, '#a5f3fc');  // light cyan
  fg.addColorStop(1,   '#818cf8');  // soft indigo

  ctx.fillStyle = fg;

  // Vertical stem
  ctx.beginPath();
  ctx.rect(lx, ty, bar, fh);
  ctx.fill();

  // Top horizontal bar (full width)
  ctx.beginPath();
  ctx.rect(lx, ty, fw, bar);
  ctx.fill();

  // Middle horizontal bar (shorter, 72% width)
  const midBarW = fw * 0.72;
  const midY = ty + fh * 0.44;
  ctx.beginPath();
  ctx.rect(lx, midY, midBarW, bar);
  ctx.fill();
}

function drawForeground(canvas, size) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  // Transparent background for foreground layer
  const cx = size / 2;
  const cy = size / 2;
  const fw = size * 0.40;
  const fh = size * 0.52;
  const bar = size * 0.085;
  const lx = cx - fw / 2;
  const ty = cy - fh / 2;

  const fg = ctx.createLinearGradient(lx, ty, lx + fw, ty + fh);
  fg.addColorStop(0, '#ffffff');
  fg.addColorStop(0.5, '#a5f3fc');
  fg.addColorStop(1, '#818cf8');

  ctx.fillStyle = fg;

  // Vertical stem
  ctx.rect(lx, ty, bar, fh);
  ctx.fill();

  // Top bar
  ctx.beginPath();
  ctx.rect(lx, ty, fw, bar);
  ctx.fill();

  // Middle bar
  const midBarW = fw * 0.72;
  const midY = ty + fh * 0.44;
  ctx.beginPath();
  ctx.rect(lx, midY, midBarW, bar);
  ctx.fill();
}

async function generateAll() {
  // Check canvas is available
  try {
    const { createCanvas: cc } = await import('canvas');
    console.log('✓ canvas available');
  } catch (e) {
    console.error('canvas not found, installing...');
    process.exit(1);
  }

  for (const [dir, size] of Object.entries(SIZES)) {
    const outDir = path.join(androidRes, dir);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // ic_launcher.png (square, full icon)
    const canvas1 = createCanvas(size, size);
    drawIcon(canvas1, size, false);
    fs.writeFileSync(path.join(outDir, 'ic_launcher.png'), canvas1.toBuffer('image/png'));

    // ic_launcher_round.png (circle clipped)
    const canvas2 = createCanvas(size, size);
    drawIcon(canvas2, size, true);
    fs.writeFileSync(path.join(outDir, 'ic_launcher_round.png'), canvas2.toBuffer('image/png'));

    // ic_launcher_foreground.png (F lettermark on transparent bg, for adaptive icons)
    const fgSize = Math.round(size * 1.5); // adaptive foreground is larger
    const canvas3 = createCanvas(fgSize, fgSize);
    drawForeground(canvas3, fgSize);
    fs.writeFileSync(path.join(outDir, 'ic_launcher_foreground.png'), canvas3.toBuffer('image/png'));

    console.log(`✓ ${dir} (${size}px) → ic_launcher, ic_launcher_round, ic_launcher_foreground`);
  }

  console.log('\n✅ All Android launcher icons generated successfully.');
}

generateAll().catch(console.error);
