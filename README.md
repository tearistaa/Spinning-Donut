# 3D Matrix Number Donut 🍩

An interactive 3D torus projection engine built from scratch using pure mathematics, HTML5 Canvas, and modern vanilla JavaScript, styled with CSS3. Inspired by the famous C code spinning donut, this web application brings the 3D projection math to the browser with dynamic character sets, color themes, and orbit controls.

---

## 🚀 Features

- **Pure Mathematical Projection**: No heavy 3D libraries (like Three.js or WebGL) required—rendered pixel-by-pixel using trigonometric torus formulas and a Z-buffer algorithm.
- **Interactive Orbit Controls**: Click and drag (mouse or touch) to rotate the 3D donut freely from any angle.
- **Customizable Character Sets**: Switch between Binary (`0` & `1`), Digits (`0-9`), Hexadecimal (`0-9, A-F`), and Math Symbols (`0-9, + - * / = %`).
- **Dynamic Color Themes**: Choose from *Matrix Green*, *Cyberpunk Pink/Cyan*, *Amber Gold*, and *Ice Blue*.
- **Adjustable Settings**: Control rotation speed, density/resolution, and toggle auto-rotation on the fly.

---

## 🛠️ Built With

* **HTML5 Canvas**: For high-performance 2D context pixel and text rendering.
* **Vanilla JavaScript (ES6+)**: Core 3D projection math engine, matrix calculations, event listeners, and animation loop (`requestAnimationFrame`).
* **CSS3**: Modern styling, responsive layout, and clean UI control panel design.

---

## ⚙️ Development Process & How It Works

This project was built step-by-step using a pure algorithmic approach:

1. **Torus Mathematical Modeling**: 
   - Defined parametric equations for a torus ring in 3D space using major radius ($R_2$) and minor radius ($R_1$).
2. **3D Rotation & Projection Engine**: 
   - Applied rotation matrices around the X-axis ($A$) and Z-axis ($B$).
   - Calculated the reciprocal of depth coordinate ($ooz = 1/z$) to handle perspective projection onto the 2D canvas.
3. **Z-Buffer (Depth Sorting) & Lighting**: 
   - Implemented a depth buffer array to ensure closer surfaces correctly occlude background elements.
   - Calculated surface normals/luminance ($L$) to dynamically shade each character based on simulated light sources.
4. **UI & Interactivity Integration**: 
   - Added DOM controls for real-time adjustments of character sets, themes, speed, and density.
   - Implemented mouse and touch event listeners to support interactive orbit dragging.

---

## 📦 Getting Started & Running Locally

To run this project locally on your machine, follow these simple steps:

1. Clone or download this repository:
   ```bash
   git clone [https://github.com/tearistaa/Spinning-Donut.git](https://github.com/tearistaa/Spinning-Donut.git)