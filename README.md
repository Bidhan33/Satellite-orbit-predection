# 🛰️ Satellite Orbit Prediction, Tracking & Pass Visualization System

<div align="center">

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)](#status)

An advanced web-based aerospace application for **real-time satellite tracking**, **orbit prediction**, and **pass visualization** using industry-standard SGP4 orbital mechanics and authentic TLE data.

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-system-architecture) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📑 Table of Contents

1. [🎯 Project Overview](#-project-overview)
2. [🌟 Highlights](#-highlights)
3. [🔭 Core Features](#-core-features)
4. [🛠️ Technology Stack](#-technology-stack)
5. [🧩 System Architecture](#-system-architecture)
6. [📁 Project Structure](#-project-structure)
7. [🚀 Quick Start](#-quick-start)
8. [📚 Documentation](#-documentation)
9. [🔮 Future Enhancements](#-future-enhancements)
10. [💼 Professional Relevance](#-professional-relevance)
11. [👨‍💻 Author](#-author)
12. [📄 License](#-license)

---

## 🎯 Project Overview

**Satellite Orbit Prediction, Tracking & Pass Visualization System** is a comprehensive aerospace software solution built with modern web technologies. It provides professional-grade satellite tracking capabilities comparable to NASA and NORAD systems, enabling users to:

- **Track satellites in real-time** across Earth using accurate orbit propagation
- **Predict pass visibility windows** (AOS/LOS times) from any ground station
- **Visualize orbital mechanics** in both 2D and 3D interactive environments
- **Access authentic orbital data** from real-time TLE (Two-Line Element) sources
- **Understand advanced astrodynamics** through interactive demos and visualizations

### Design Philosophy

This project leverages **authentic orbital mechanics** rather than simulations:
- Uses **SGP4 propagation model** (industry-standard for GEO/LEO satellites)
- Implements **real TLE data** from CelesTrak and Space-Track databases
- Applies **rigorous coordinate transformations** (ECI, ECEF, Geodetic)
- Maintains **60 FPS performance** through Web Workers and optimization

### Use Cases & Applications

| Domain | Application |
|--------|-------------|
| **Space Operations** | Ground station scheduling, satellite pass planning |
| **Aerospace Engineering** | Orbital mechanics visualization, mission planning |
| **Education** | Interactive astrodynamics teaching tool |
| **SSA (Space Situational Awareness)** | Real-time satellite tracking and monitoring |
| **Research** | Orbital propagation validation, algorithm testing |

---

## 🌟 Highlights

✅ **Real-time Satellite Tracking** – Updates satellite positions every few seconds  
✅ **24–72 Hour Pass Prediction** – Calculate when satellites pass over your location  
✅ **Dual Visualization Modes** – 2D map (Leaflet) + 3D globe (CesiumJS)  
✅ **Multi-satellite Support** – Track 30+ satellites simultaneously  
✅ **Statistical Analytics** – Real-time orbital traffic graphs and growth charts  
✅ **High Performance** – Web Workers, precomputation, 60 FPS animations  
✅ **Responsive UI** – Mobile-friendly design with modern Tailwind CSS  
✅ **Professional Grade** – SGP4 accuracy, proper coordinate systems, industry standards  

---

## 🔭 Core Features

### 1. 📡 Orbital Data Interpretation

**Functionality:**
- Parse and validate Two-Line Element (TLE) format
- Extract complete orbital elements from TLE data
- Display real-time satellite metadata and characteristics

**Extracted Parameters:**
- **Inclination (i)** – Orbital plane angle relative to equator
- **RAAN (Ω)** – Right Ascension of Ascending Node (orbital plane orientation)
- **Eccentricity (e)** – Orbit shape (0 = circular, >0 = elliptical)
- **Argument of Perigee (ω)** – Lowest point position in orbit
- **Mean Anomaly (M)** – Satellite position along orbit
- **Mean Motion (n)** – Orbital period information
- **Epoch** – Data reference time

**Sample Output:**
```
ISS (ZARYA)
├─ Inclination: 51.64°
├─ Period: 92.9 minutes
├─ Altitude: ~408 km
├─ Eccentricity: 0.0002
└─ Mean Motion: 15.54 rev/day
```

### 2. 🌍 Orbit Propagation (SGP4)

**What it Does:**
SGP4 (Simplified General Perturbations 4) is the **world-standard satellite propagation model** used by NORAD, NASA, and satellite operators worldwide.

**Capabilities:**
- Convert TLE data → satellite record (satrec) for propagation
- **Forward propagation** – Future satellite positions (1 minute to 72+ hours)
- **Backward propagation** – Historical satellite positions
- ECI (Earth-Centered Inertial) coordinate system output
- ECEF (Earth-Centered Earth-Fixed) transformations
- Automatic accuracy decay handling for longer predictions
- Sub-second computation for real-time tracking

**Accuracy:**
- ±1-2 km for near-term predictions (<24 hrs)
- Degrades gracefully for longer periods
- Validates against NORAD ephemerides

### 3. 📍 Geospatial Transformation Engine

**Coordinate System Conversions:**

```
TLE Data
   ↓
ECI Coordinates (X, Y, Z in inertial frame)
   ↓
ECEF Coordinates (Earth-fixed frame, accounts for Earth rotation)
   ↓
Geodetic Coordinates (Latitude, Longitude, Altitude)
   ↓
User Display / Map Visualization
```

**Transformations Handled:**
- **ECI → ECEF** – Account for Earth's rotation using GMST (Greenwich Mean Sidereal Time)
- **ECEF → Geodetic** – Convert Earth-fixed Cartesian to Lat/Lon/Alt
- **Sub-satellite Point** – Calculate nadir (point on Earth directly below satellite)
- **Local Sidereal Time (LST)** – Account for Earth's rotation relative to stars
- **Look Angles** – Calculate Azimuth, Elevation, Range from observer to satellite

### 4. 🎯 Pass Prediction Engine

**Ground Station Pass Calculation:**

Predicts when satellites will be visible from a ground station location within a specified time window.

**Key Metrics:**
- **AOS (Acquisition of Signal)** – Time when satellite rises above horizon
- **LOS (Loss of Signal)** – Time when satellite sets below horizon
- **Peak Elevation** – Maximum altitude angle of satellite above horizon
- **Duration** – Total visibility window
- **Azimuth Range** – Direction arc for satellite path across sky
- **Range** – Distance from ground station to satellite

**Prediction Window:**
- Typical: 24–72 hours
- Configurable elevation masking (e.g., only show passes >10° elevation)
- Accounts for observer altitude and location accuracy

**Example Pass Data:**
```
ISS Pass #1 (Tomorrow)
├─ Rise (AOS): 14:32 UTC, Azimuth 245° (WSW)
├─ Peak: 14:38 UTC, Elevation 67°
├─ Set (LOS): 14:44 UTC, Azimuth 112° (ESE)
├─ Duration: 12 minutes
└─ Max Range: 380 km
```

### 5. 📊 Visualization System

#### 🌍 2D Map View (Leaflet-based)

- **Real-time Ground Track** – Live satellite position updating every 1-5 seconds
- **Orbit Prediction Arc** – Shows predicted satellite path for next orbit
- **Satellite Marker** – Current position with heading indicator
- **Day/Night Terminator** – Demonstrates current illumination zones
- **Interactive Controls** – Drag to pan, scroll to zoom
- **Multiple Layers** – Toggle between satellite, ground tracks, and prediction arcs
- **Performance Optimized** – Smooth animations at 60 FPS

#### 🌐 3D Globe View (CesiumJS-based)

- **3D Earth Rendering** – High-resolution Earth model with textures
- **Realistic Orbit Visualization** – 3D satellite paths and orbits
- **3D Satellite Models** – Visual representation of spacecraft
- **Camera Follow Mode** – Automatically track satellite as it moves
- **Time Control** – Play, pause, speed up orbital mechanics
- **Dynamic Rendering** – Real-time position updates

### 6. 📈 Statistics & Analytics Panel

Real-time monitoring dashboard featuring:

- **Active Satellite Counter** – Live count with animated indicators
- **Orbital Traffic Graph** – Time-series data of satellite activity
- **Satellite Growth Chart** – Historical growth from 2000–2025
- **System Overview Stats** – Key metrics (avg altitude, velocity, update rate)
- **Quick Statistics Boxes** – Essential system information at a glance

### 7. ⚡ Performance Optimization

**Advanced Techniques Implemented:**
- **Web Workers** – Offload heavy SGP4 computations to background threads
- **Point Precomputation** – Calculate orbit points in batches
- **Render Debouncing** – Smooth animations without jank
- **TLE Caching** – Reduce API calls and network traffic
- **Lazy Loading** – Load components as needed
- **Memory Management** – Efficient state updates and garbage collection

**Performance Targets:**
- ✅ **60 FPS** animation on modern devices
- ✅ **<500ms** initial app load
- ✅ **<100ms** pass prediction calculation (24-72 hrs)
- ✅ **<50ms** position update render time

---

## 🛠️ Technology Stack

### Frontend Architecture

| Category | Technology | Purpose |
|----------|-----------|---------|
| **UI Framework** | React 19.2 | Component-based UI |
| **Build Tool** | Vite 7.2 | Lightning-fast dev server & builds |
| **Styling** | Tailwind CSS 4.1 | Utility-first CSS framework |
| **2D Mapping** | Leaflet 1.9 + React-Leaflet | Interactive 2D map visualization |
| **3D Visualization** | CesiumJS | 3D globe and orbit rendering |
| **Charts/Graphs** | Recharts 3.7 | Statistical data visualization |
| **Icons** | Lucide React 0.56 | Lightweight icon library |
| **Date Handling** | date-fns 4.1 | Date manipulation and formatting |

### Orbital Mechanics Engine

| Component | Library | Function |
|-----------|---------|----------|
| **Propagation** | satellite.js 6.0.1 | SGP4 implementation |
| **Coordinate Math** | satellite.js (internal) | ECI/ECEF transformations |
| **Orbital Elements** | Custom utils | TLE parsing, orbital element extraction |

### State Management & Data Flow

- **React Context API** – Global satellite data, selected satellite, observer location
- **Local Component State** – Form inputs, UI toggles, animations
- **API Integration** – REST calls to CelesTrak and Space-Track APIs

---

## 🧩 System Architecture

### Data Flow Diagram

```
┌──────────────────────────┐
│   TLE Data Sources       │
│  - CelesTrak (Free)      │
│  - Space-Track (API)     │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│    TLE Service Layer                 │
│  - Fetch & Parse TLEs               │
│  - Validate Orbital Elements         │
│  - Cache Management                  │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Propagation Service (SGP4)          │
│  - Orbit Position Calculation        │
│  - Pass Prediction Engine            │
│  - Coordinate Transformations        │
│  [Running in Web Worker]             │
└────────────┬─────────────────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
  ┌─────────┐  ┌──────────────┐
  │  State  │  │ Visualization│
  │ Context │  │   System     │
  └────┬────┘  └────┬─────────┘
       │             │
       │      ┌──────┴─────┐
       │      ▼            ▼
       │   ┌──────┐    ┌───────┐
       │   │ 2D   │    │  3D   │
       └──▶│ Map  │    │ Globe │
           └──────┘    └───────┘
```

### Component Hierarchy

```
App
├─ SatelliteProvider (Context)
│  ├─ Landing Page
│  │  ├─ Hero Section
│  │  ├─ Features Section
│  │  ├─ System Diagram
│  │  └─ CTA Section
│  │
│  └─ Tracking Dashboard
│     ├─ MissionControlPanel
│     │  ├─ SatelliteList
│     │  │  └─ Satellite Items with Details
│     │  ├─ StatisticsPanel
│     │  │  ├─ Active Counter
│     │  │  ├─ Traffic Graph
│     │  │  ├─ Growth Chart
│     │  │  └─ System Stats
│     │  │
│     │  └─ OrbitPredictionPage
│     │     ├─ SatelliteSelector
│     │     ├─ LivePositionPanel
│     │     ├─ TLEDataPanel
│     │     ├─ PassPredictionTable
│     │     └─ OrbitVisualization
│     │        ├─ 2D Map (Leaflet)
│     │        └─ 3D Globe (CesiumJS)
│     │
│     └─ UI Components (Reusable)
│        ├─ AltitudeGauge
│        ├─ VelocityGraph
│        ├─ Badge
│        ├─ Button
│        └─ GlassCard
```

---

## 📁 Project Structure

```
satellite-tracker/
├── 📄 README.md              (This file)
├── 📄 STATISTICS_PANEL_README.md
├── 📄 package.json           (Dependencies & scripts)
├── 📄 vite.config.js         (Build configuration)
├── 📄 eslint.config.js       (Code linting rules)
├── 📄 index.html             (Entry HTML)
│
├── public/                   (Static assets)
│
└── src/
    ├── 📄 main.jsx           (React entry point)
    ├── 📄 App.jsx            (Root component)
    ├── 📄 App.css            (Global styles)
    ├── 📄 index.css          (Base styles)
    │
    ├── assets/               (Images, icons, etc.)
    │
    ├── components/
    │   │
    │   ├── landing/          (Landing page sections)
    │   │   ├── Hero.jsx
    │   │   ├── Features.jsx
    │   │   ├── SystemDiagram.jsx
    │   │   ├── CTASection.jsx
    │   │   ├── GetStarted.jsx
    │   │   ├── Footer.jsx
    │   │   └── InitializingScreen.jsx
    │   │
    │   ├── tracking/         (Main tracking interface)
    │   │   ├── MissionControlPanel.jsx     (Main container)
    │   │   ├── SatelliteList.jsx           (List of satellites)
    │   │   ├── StatisticsPanel.jsx        (Stats & analytics)
    │   │   ├── OrbitPredictionPage.jsx    (Pass prediction view)
    │   │   ├── InitializingScreen.jsx
    │   │   │
    │   │   └── OrbitPrediction/           (Visualization subcomponents)
    │   │       ├── SatelliteSelector.jsx
    │   │       ├── LivePositionPanel.jsx
    │   │       ├── TLEDataPanel.jsx
    │   │       ├── PassPredictionTable.jsx
    │   │       └── OrbitVisualization.jsx (2D + 3D maps)
    │   │
    │   ├── ui/               (Reusable UI components)
    │   │   ├── Button.jsx
    │   │   ├── Badge.jsx
    │   │   ├── GlassCard.jsx
    │   │   ├── AltitudeGauge.jsx
    │   │   ├── VelocityGraph.jsx
    │   │   └── NASA3DModel.jsx
    │   │
    │   └── styles/
    │       └── satelliteListAnimations.css
    │
    ├── context/              (State management)
    │   ├── index.js
    │   ├── SatelliteContext.jsx    (Global satellite state)
    │   └── useSatellite.js         (Custom hook)
    │
    ├── services/             (API & business logic)
    │   ├── index.js
    │   ├── apiService.js           (Main API interface)
    │   ├── tleService.js           (TLE fetching & parsing)
    │   └── propagationService.js   (SGP4 propagation & passes)
    │
    └── utils/                (Utility functions)
        ├── coordinates.js          (Coordinate transformations)
        ├── timeUtils.js            (Time calculations)
        └── (other helpers)
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16+ (check with `node --version`)
- **npm** v8+ (check with `npm --version`)
- **Git** (for cloning the repository)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Bidhan33/satellite-tracker.git
cd satellite-tracker

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will open at `http://localhost:5173` with hot module reloading.

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Lint code for style issues
npm lint
```

### NPM Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server (hot reload) |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm lint` | Run ESLint to check code style |

---

## 📚 Documentation

### Core Services Overview

#### **TLE Service** (`src/services/tleService.js`)
Handles Two-Line Element data:
- Fetches satellite data from CelesTrak API
- Parses TLE format and extracts orbital elements
- Manages satellite metadata and images
- Validates TLE data integrity

```javascript
// Example Usage
import { fetchSatellitesFromCelesTrak } from './services/tleService.js';

const satellites = await fetchSatellitesFromCelesTrak('stations', 30);
// Returns array of satellites with TLE, name, catalog number, etc.
```

#### **Propagation Service** (`src/services/propagationService.js`)
Core orbital mechanics engine:
- SGP4 satellite position propagation
- Current position calculation (ECI → ECEF → Geodetic)
- Multi-day pass prediction with look angles
- Elevation masking and visibility filtering

```javascript
// Example Usage
import { propagateSatellite, predictPasses } from './services/propagationService.js';

// Get current satellite position
const position = propagateSatellite(tle, observerLocation, new Date());

// Predict passes for next 3 days
const passes = predictPasses(tle, observerLocation, 3);
```

#### **Coordinate Utilities** (`src/utils/coordinates.js`)
Geospatial transformation functions:
- ECI → ECEF coordinate conversion
- ECEF → Geodetic (Lat/Lon/Alt) conversion
- Look angles (Azimuth, Elevation, Range)
- Sub-satellite point calculation

#### **Time Utilities** (`src/utils/timeUtils.js`)
Temporal functions:
- Julian Date calculations
- GMST (Greenwich Mean Sidereal Time) computation
- Unix timestamp conversions
- Time zone handling

### Context API (Global State)

#### **SatelliteContext** (`src/context/SatelliteContext.jsx`)

Provides global state for the entire application:

```javascript
// Available state & methods
const {
  // State
  satellites,              // Array of satellite objects
  selectedSatellite,       // Currently selected satellite
  observerLocation,        // Ground station coordinates
  currentPosition,         // Real-time satellite position
  predictedPasses,         // Array of upcoming passes
  orbitalElements,         // Detailed orbital parameters
  loading,                 // Loading indicator
  error,                   // Error messages
  
  // Actions
  loadSatellites,          // Fetch satellites from API
  selectSatellite,         // Select a satellite
  updatePosition,          // Update current position
  updatePasses,            // Calculate new passes
  setObserverLocation,     // Change ground station
} = useSatellite();
```

### Data Models

#### Satellite Object
```javascript
{
  name: "ISS (ZARYA)",
  catalogNumber: "25544",
  tle1: "1 25544U 98067A   26063.12345678  .00012345  00000-0  12345-4 0  1234",
  tle2: "2 25544  51.6425 312.3920 0002044  19.4323 123.4567 15.54143421 12345",
  launchDate: "1998-11-20",
  country: "Russia",
  image: "https://example.com/iss.jpg",
  satrecords: [...], // Propagation data
}
```

#### Position Object
```javascript
{
  lat: 51.5074,           // Latitude (degrees)
  lon: -0.1278,           // Longitude (degrees)
  altitude: 408.2,        // Altitude (km)
  velocity: 7.658,        // Speed (km/s)
  range: 1542.3,          // Distance from observer (km)
  azimuth: 245.7,         // Direction (degrees 0-360)
  elevation: 42.3,        // Angle above horizon (degrees -90 to 90)
  timestamp: 1742500000,  // Unix timestamp
}
```

#### Pass Object
```javascript
{
  date: "2026-03-05",
  aos: "14:32:15",           // Acquisition of Signal (rise)
  los: "14:44:30",           // Loss of Signal (set)
  maxElevation: 67.2,        // Peak elevation (degrees)
  duration: 728,             // Total duration (seconds)
  aosAzimuth: 245.3,         // Direction at rise
  losAzimuth: 112.7,         // Direction at set
  maxRange: 380.5,           // Distance at peak
}
```

---

## 🔮 Future Enhancements

### Planned Features (Roadmap)

- [ ] **Multi-satellite Conjunction Analysis** – Detect when satellites pass close to each other
- [ ] **Orbit Decay Prediction** – Estimate when satellites will re-enter atmosphere
- [ ] **Radar Line-of-Sight Visualization** – Advanced SSA features
- [ ] **GPU-Accelerated SGP4** – Real-time propagation for 1000+ satellites
- [ ] **Weather Integration** – Cloud cover data overlaid on observations
- [ ] **Ground Station Network** – Multi-station pass coordination
- [ ] **Historical Orbit Database** – Archive and compare orbital changes
- [ ] **Mobile App** – Native iOS/Android release
- [ ] **API Endpoint** – REST endpoints for external integrations
- [ ] **Dark/Light Themes** – User preference support

### Performance Improvements

- [ ] Virtual scrolling for large satellite lists
- [ ] IndexedDB caching for offline support
- [ ] Service Workers for PWA capabilities
- [ ] Higher resolution 3D Earth models
- [ ] WASM implementation of SGP4 propagation

---

## 💼 Professional Relevance

This project demonstrates expertise across multiple aerospace and software engineering domains:

### Aerospace Domain Knowledge
- ✅ Orbital mechanics (SGP4 propagation model)
- ✅ Coordinate system transformations (ECI, ECEF, geodetic)
- ✅ Space situational awareness (SSA) concepts
- ✅ Ground station operations and pass planning
- ✅ TLE data interpretation and validation

### Software Engineering Excellence
- ✅ High-performance web applications
- ✅ Complex state management (Context API, hooks)
- ✅ Real-time data visualization
- ✅ Web Workers for background computation
- ✅ Modern frontend architecture (React, Vite)
- ✅ Responsive and accessible UI design
- ✅ API integration and error handling

### Visualization & UX Design
- ✅ Interactive mapping (Leaflet, CesiumJS)
- ✅ Real-time data dashboards
- ✅ Professional data visualization (charts, graphs)
- ✅ Mobile-responsive design
- ✅ Smooth animations and transitions

### Industry Relevance
This system is comparable to:
- **NASA Real-time Trackers** – Similar tracking algorithms
- **NORAD Space Track** – Professional SGP4 propagation
- **Satellite Tracking Software** – Ground station planning tools

---

## 👨‍💻 Author

**Bidhan Adhikari**  
Software Engineer | Full-Stack Developer | Aerospace Software Enthusiast

- 🔗 GitHub: [@Bidhan33](https://github.com/Bidhan33)
- 📧 Email: [bidhan.adhikari@example.com](mailto:bidhan.adhikari@example.com)
- 💼 LinkedIn: [Bidhan Adhikari](#)

---

## 📄 License

This project is licensed under the **MIT License** – see the LICENSE file for details.

---

## 🏁 Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend UI | ✅ Complete | React + Vite fully implemented |
| Landing Page | ✅ Complete | Hero, features, CTA sections |
| Map Visualization (2D) | ✅ Complete | Leaflet integration working |
| 3D Globe (CesiumJS) | ✅ Complete | Full 3D visualization |
| Satellite List | ✅ Complete | Real-time updates, search, filter |
| Statistics Panel | ✅ Complete | Live metrics and charts |
| TLE Service | ✅ Complete | CelesTrak integration |
| Propagation Engine | ✅ Complete | SGP4 via satellite.js |
| Pass Prediction | ✅ Complete | 24–72 hour pass calculation |
| Backend API | 🚧 In Progress | Full REST API coming soon |
| Database | 🔜 Planned | Historical tracking data |
| Mobile App | 🔜 Planned | React Native port |

---

## 🤝 Contributing

Contributions are welcome! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- Follow ESLint rules (run `npm lint`)
- Write clear commit messages
- Add comments for complex algorithms
- Test on mobile and desktop

---

<div align="center">

### Made with ❤️ for Space Enthusiasts & Engineers

**Explore the cosmos. Track the stars. Understand the orbits.**

[↑ Back to Top](#-satellite-orbit-prediction-tracking--pass-visualization-system)

</div>