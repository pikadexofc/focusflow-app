# 🌌 FocusFlow

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript: 5.8](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React: 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TailwindCSS: v4](https://img.shields.io/badge/TailwindCSS-v4-blue.svg)](https://tailwindcss.com/)
[![Capacitor: 8](https://img.shields.io/badge/Capacitor-8-orange.svg)](https://capacitorjs.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployment-brightgreen.svg)](https://focusflow-app-chi.vercel.app)

**A high-performance, local-first personal productivity engine designed for absolute focus.**  
*Engineered with a premium, low-friction dark interface, tactile feedback transitions, local-first data privacy, and optimized CPU schedules.*

[✨ Live Demo](https://focusflow-app-chi.vercel.app) • [🛠️ Setup Guide](#-running-locally) • [📦 Production Build](#-production-compilation) • [🎯 Roadmap](#-project-roadmap)

</div>

---

## 🎨 Philosophy & Design
FocusFlow operates under the core belief that productivity systems should be **low-overhead, local, and calm**. 

* **Zero Cloud Leakage**: Your data resides strictly in local storage. It is never transmitted, processed, or profiled.
* **Premium Tactile Interfaces**: High-fidelity GPU-composited animations (`transform` and `opacity` only) maintain a consistent 60 FPS profile.
* **The 80/20 Aesthetic**: 80% clean, minimal space; 20% high-fidelity premium moments. No glowing shadow resource bloat.

---

## 🏗️ Technical Architecture
```
                                 [ App.tsx ]
                             (SSOT State Node)
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
  [ DashboardTab ]              [ TasksTab ]                [ GoalsTab ]
  (Time-Burn Engine)        (Goal-Linked Queue)          (Custom Scheduler)
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     ▼
                               [ CommonUI ]
                         (Atomic UI Primitives)
                                     ▼
                                 [ DOM / Web ]
```

---

## 🛠️ Stack & Optimization Profiles
* **Framework**: React 19 + TypeScript 5.8 (Strict type checks)
* **Styling**: Tailwind CSS v4.0 + Custom GPU-accelerated Keyframe Schedules
* **Bundler & Tooling**: Vite 6 (Zero-overhead build paths)
* **Mobile Runtime**: Capacitor 8 (Cross-platform native bridges)
* **Performance Profile**: Memoized rendering dependencies for zero redundant component layout cycles.

---

## 🚀 Running Locally

### Prerequisites
* Node.js (v18+)
* npm

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/pikadexofc/focusflow-app.git
cd focusflow-app
npm install
```

### 2. Environment Configuration
Copy the environment template:
```bash
cp .env.example .env
```

### 3. Launch Development Server
Spawn the Vite bundler locally:
```bash
npm run dev
```
Open `http://localhost:3000` to interact with the environment.

---

## 🏗️ Production Compilation
To compile, tree-shake, and build the optimized distribution bundle:
```bash
npm run build
```
The static assets will be compiled directly to the `dist/` directory, optimized with index maps and CSS module caching.

---

## 🎯 Project Roadmap
- [x] State Modularization (Refactored `App.tsx` into domain-specific tab modules)
- [x] Memory & Re-render optimization (Memoization of heavy collection filters)
- [x] Accessibility Touch Target Upgrade (Conformed tap targets to 44px/48px thresholds)
- [x] Conventional Github Repository Templates & Standards
- [ ] Offline-first sync logic (optional encrypted file export protocols)

---

## ❓ FAQ & Developer Q&A

**Q: Where is my data saved?**  
A: All data is serialized and saved in local storage under the `focusflow_v1` key. It never leaves your device.

**Q: Why React 19 and Tailwind CSS v4?**  
A: To leverage Vite 6's optimized ES module compilation and compile smaller distribution bundles.

---

## 📄 License & Attribution
This project is open-source and licensed under the [MIT License](LICENSE).
Portions of the initial layout boilerplate were generated via open templates. All customized features, performance patches, memoization refactorings, and modular component specifications were developed manually.
