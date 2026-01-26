
🛰️ Satellite Orbit Prediction, Tracking & Pass Visualization System






📌 Project Overview

The Satellite Orbit Prediction, Tracking & Pass Visualization System is an advanced web-based aerospace application that performs:

Real-time satellite orbit propagation (SGP4)

Ground station pass prediction

2D and 3D orbit visualization

Accurate geospatial transformations

Professional-grade satellite tracking similar to NASA/NORAD systems

This system uses authentic orbital mechanics, real TLE data, and industry-standard algorithms to simulate satellite motion with high accuracy.

🧠 Domains & Applications

Aerospace Software Engineering

Orbital Mechanics & Astrodynamics

Space Situational Awareness (SSA)

Satellite Operations (SatOps)

Ground Station Scheduling

Predictive Modeling

GEOINT / ISR (non-classified)

🛠️ Technologies Used

Frontend

React + Vite

Leaflet (2D map)

CesiumJS (3D globe)

Tailwind / CSS Modules

Web Workers

Backend

Node.js

REST APIs

TLE data sources (CelesTrak, Space-Track)

Orbital Engine

satellite.js (SGP4)

ECI / ECEF / LLA transformations

GMST & sidereal time calculations

🔭 Core Features
1. Orbital Data Interpretation

Parse and validate TLEs

Extract orbital elements:

Inclination

RAAN

Eccentricity

Argument of perigee

Mean anomaly

Mean motion

Display satellite metadata

2. Orbit Propagation (SGP4)

Convert TLE → satrec

Forward & backward propagation

Support minute → multi-day prediction

Accuracy decay handling

ECI / ECEF coordinate support

3. Geospatial Transformation

ECI → ECEF → Geodetic conversion

Latitude, longitude, altitude

Sub-satellite point projection

Local sidereal time (GMST)

4. Pass Prediction

AOS / LOS detection

Peak elevation detection

Look angles (azimuth, elevation, range)

24–72 hour pass prediction

Elevation masking support

5. Visualization
🌍 2D (Leaflet)

Real-time ground track

Orbit prediction arcs

Live satellite marker

Day/night terminator

Smooth animations

🌐 3D (CesiumJS)

3D Earth globe

Orbit arcs

Satellite model

Camera follow mode

Time-dynamic rendering

6. Performance Optimization

Web Workers for propagation

Orbit point precomputation

Debounced rendering

Cached TLE updates

60 FPS animation target

🧩 System Architecture
TLE Fetch Layer
     ↓
Propagation Engine (SGP4)
     ↓
Geospatial Transformation
     ↓
Pass Prediction Engine
     ↓
Visualization Layer (2D / 3D)

🚀 Installation & Setup
git clone https://github.com/Bidhan33/Satellite-orbit-predection.git
cd Satellite-orbit-predection
npm install
npm run dev

🧪 Possible Extensions

Orbit decay prediction

Atmospheric drag modeling

Solar radiation pressure

Multi-satellite simulation

Radar line-of-sight visualization

GPU-accelerated propagation

Batch SGP4 processing

💼 Professional Impact

This project demonstrates:

Real aerospace domain knowledge

Mathematical modeling skills

Advanced visualization

High-performance web engineering

Real-world satellite tracking systems

Comparable to:

NASA real-time trackers

NORAD control displays

ESA/ISRO scheduling tools

👨‍💻 Author

Bidhan Adhikari
Software Engineer | Full-Stack Developer | Aerospace Software Enthusiast
GitHub: @Bidhan33

🏁 Status

🚧 Active Development – Full-stack integration in progress
✅ Frontend tracking system implemented
🔜 Backend propagation & pass engine