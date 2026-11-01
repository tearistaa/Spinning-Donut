const canvas = document.getElementById('donutCanvas');
const ctx = canvas.getContext('2d');

let width = 600;
let height = 500;

function resizeCanvas() {
  const containerWidth = Math.min(window.innerWidth - 40, 700);
  width = containerWidth;
  height = Math.floor(containerWidth * 0.8);
  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Parameters
let A = 0; // X-axis rotation angle
let B = 0; // Z-axis rotation angle

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

const R1 = 1;   // Cross-section radius
const R2 = 2;   // Ring radius
const K2 = 5;   // Distance from camera to torus

// Character Sets Configuration
const charSets = {
  digits: "0123456789",
  binary: "01010101",
  hex: "0123456789ABCDEF",
  math: "0123456789+-*/=%"
};

// DOM Controls Elements
const charModeSelect = document.getElementById('charMode');
const colorThemeSelect = document.getElementById('colorTheme');
const rotSpeedInput = document.getElementById('rotSpeed');
const speedValDisplay = document.getElementById('speedVal');
const densityInput = document.getElementById('density');
const densityValDisplay = document.getElementById('densityVal');
const autoRotateCheckbox = document.getElementById('autoRotate');
const resetViewBtn = document.getElementById('resetViewBtn');

rotSpeedInput.addEventListener('input', (e) => {
  speedValDisplay.textContent = parseFloat(e.target.value).toFixed(1) + 'x';
});

densityInput.addEventListener('input', (e) => {
  const labels = { '1': 'Low', '2': 'Medium', '3': 'High' };
  densityValDisplay.textContent = labels[e.target.value];
});

resetViewBtn.addEventListener('click', () => {
  A = 0;
  B = 0;
});

// Orbit Controls
canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - previousMousePosition.x;
  const deltaY = e.clientY - previousMousePosition.y;

  B += deltaX * 0.01;
  A += deltaY * 0.01;

  previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
});

canvas.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  const deltaX = e.touches[0].clientX - previousMousePosition.x;
  const deltaY = e.touches[0].clientY - previousMousePosition.y;

  B += deltaX * 0.01;
  A += deltaY * 0.01;

  previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

window.addEventListener('touchend', () => {
  isDragging = false;
});


function getColor(luminance, theme) {
  const norm = Math.max(0, Math.min(1, (luminance + 1.2) / 3));

  if (theme === 'green') {
    const g = Math.floor(120 + norm * 135);
    const b = Math.floor(norm * 80);
    return `rgb(0, ${g}, ${b})`;
  } else if (theme === 'cyberpunk') {
    if (luminance > 0.8) return '#00ffff';
    const r = Math.floor(180 + norm * 75);
    const b = Math.floor(150 + norm * 105);
    return `rgb(${r}, 0, ${b})`;
  } else if (theme === 'amber') {
    const r = Math.floor(180 + norm * 75);
    const g = Math.floor(120 + norm * 120);
    return `rgb(${r}, ${g}, 20)`;
  } else if (theme === 'ice') {
    const b = Math.floor(180 + norm * 75);
    const g = Math.floor(150 + norm * 100);
    return `rgb(100, ${g}, ${b})`;
  }
  return '#00ff66';
}

// Main Render Loop
function render() {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  const speedMult = parseFloat(rotSpeedInput.value);
  if (autoRotateCheckbox.checked && !isDragging) {
    A += 0.02 * speedMult;
    B += 0.01 * speedMult;
  }

  const charMode = charModeSelect.value;
  const chars = charSets[charMode] || charSets.digits;
  const theme = colorThemeSelect.value;

  const densityVal = parseInt(densityInput.value);
  const thetaStep = densityVal === 1 ? 0.12 : (densityVal === 2 ? 0.08 : 0.05);
  const phiStep = densityVal === 1 ? 0.06 : (densityVal === 2 ? 0.04 : 0.025);

  const fontSize = densityVal === 1 ? 14 : (densityVal === 2 ? 12 : 10);
  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const K1 = width * K2 * 3 / (8 * (R1 + R2));

  const cosA = Math.cos(A), sinA = Math.sin(A);
  const cosB = Math.cos(B), sinB = Math.sin(B);

  // Depth buffer array
  const zBuffer = new Array(width * height).fill(0);

  let charIdx = 0;

  for (let theta = 0; theta < 2 * Math.PI; theta += thetaStep) {
    const costheta = Math.cos(theta), sintheta = Math.sin(theta);

    for (let phi = 0; phi < 2 * Math.PI; phi += phiStep) {
      const cosphi = Math.cos(phi), sinphi = Math.sin(phi);

      // 3D Torus Coordinates
      const circlex = R2 + R1 * costheta;
      const circley = R1 * sintheta;

      // 3D Rotation Calculation
      const x = circlex * (cosB * cosphi + sinA * sinB * sinphi) - circley * cosA * sinB;
      const y = circlex * (sinB * cosphi - sinA * cosB * sinphi) + circley * cosA * cosB;
      const z = K2 + cosA * circlex * sinphi + circley * sinA;
      const ooz = 1 / z;

      // 2D Canvas Projection Coordinates
      const xp = Math.floor(width / 2 + K1 * ooz * x);
      const yp = Math.floor(height / 2 - K1 * ooz * y);

      // Surface Normal
      const L = cosphi * costheta * sinB - cosA * costheta * sinphi - sinA * sintheta + cosB * (cosA * sintheta - costheta * sinA * sinphi);

      if (L > -0.8) {
        if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
          const bufferIndex = xp + yp * width;
          if (ooz > zBuffer[bufferIndex]) {
            zBuffer[bufferIndex] = ooz;

            const ch = chars[charIdx % chars.length];
            charIdx++;

            ctx.fillStyle = getColor(L, theme);
            ctx.fillText(ch, xp, yp);
          }
        }
      }
    }
  }

  requestAnimationFrame(render);
}

// Start Animation Loop
render();