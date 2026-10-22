# Al-Badar Hosiery (Faisalabad)
## Custom Wholesale & Production ERP Ecosystem
### Developer Technical Documentation & System Specification Manual

- **Client & Establishment:** Al-Badar Hosiery (Shop 42, Quaid-e-Azam Market, Block A, Dijkot Rd, Faisalabad, Pakistan)
- **Executive Contact:** `+92 300 7664070` (Direct Call & WhatsApp Wholesale Desk)
- **Author:** Techmire Engineering Team
- **Document Classification:** `TECH-ABH-ERP-2026-DEV-01` • Developer Onboarding & Architecture Spec
- **Version:** `1.0.0` (Production Release)
- **Local Dev Server:** `http://localhost:3456/`
- **Companion PDF Document:** [`Al-Badar-Hosiery-Developer-Documentation.pdf`](file:///c:/Users/syedm/Desktop/Al%20Badar/Al-Badar-Hosiery-Developer-Documentation.pdf)

---

## 📋 Table of Contents
1. [Executive Summary & Business Context](#1-executive-summary--business-context)
2. [System Architecture & Offline-First Strategy](#2-system-architecture--offline-first-strategy)
3. [Repository Structure & File Inventory](#3-repository-structure--file-inventory)
4. [Production Floor ERP Modules & Business Logic](#4-production-floor-erp-modules--business-logic)
5. [Textile Engineering & Yield Calculator Formulas](#5-textile-engineering--yield-calculator-formulas)
6. [Enterprise Database Architecture (PostgreSQL & Prisma)](#6-enterprise-database-architecture-postgresql--prisma)
7. [REST API Specification](#7-rest-api-specification)
8. [Deployment, Local Setup & Factory Hardware Integration](#8-deployment-local-setup--factory-hardware-integration)
9. [Coding Standards & Maintenance Guidelines](#9-coding-standards--maintenance-guidelines)

---

## 1. Executive Summary & Business Context

Al-Badar Hosiery is a premier knitwear and undergarment manufacturer located in Faisalabad's primary wholesale textile hub (Quaid-e-Azam Market). The enterprise manufactures high-grade 1x1 ribbed vests (*baniyans*), combed cotton briefs, boxer shorts, winter thermal suits, and pique polo shirts.

### Architectural Objectives
- **Zero-Latency Floor Tracking:** Monitor 16 circular knitting looms and 4 assembly stitching lines in real time.
- **Offline Resilience:** Ensure barcode scanning and piece-rate wage calculation continue uninterrupted during grid load-shedding and broadband outages.
- **Dynamic Yield & Cost Quotations:** Provide real-time raw material consumption (bags and cones of yarn) and instant wholesale PKR quotes exportable to WhatsApp.

---

## 2. System Architecture & Offline-First Strategy

### 2.1 Multi-Tier Architecture Pipeline
```
[ Tier 1: Client & Presentation ]
  ├── B2B Wholesale Web Portal (Next.js / Vanilla SPA)
  ├── Factory Floor Kiosks (Electron Desktop)
  └── WhatsApp Direct Quote Engine (+92 300 7664070)
               │ (HTTPS / WebSockets)
               ▼
[ Tier 2: Edge & Security Gateway ]
  ├── Reverse Proxy (Nginx / Cloudflare)
  ├── Rate Limiter & Helmet Headers
  └── JWT & Role-Based Access Control (RBAC)
               │ (REST APIs)
               ▼
[ Tier 3: Application Core ]
  ├── Node.js / Express.js Production Core (server.js / APIs)
  ├── Circular Loom Telemetry Cycle (1200ms tick)
  ├── Stitching Piece-Rate Wage Engine
  └── Yarn Warehouse Bag & Cone Inventory Ledger
               │ (Prisma Client)
               ▼
[ Tier 4: Data & Hardware Layer ]
  ├── PostgreSQL 15 Primary Cluster
  ├── Local SQLite Fallback Cache on Floor Workstations
  ├── 80mm ESC/POS Thermal Barcode Printers (USB/LAN)
  └── Dust-Resistant 2D QR Barcode Scanners (USB HID)
```

### 2.2 Offline-First Floor Strategy (Faisalabad Grid Resilience)
1. **Local SQLite Buffer:** Floor terminals record bundle scans (`Bundle #ABH-9042`) locally into SQLite when internet connectivity drops.
2. **Deterministic Receipt Printing:** ESC/POS thermal printers print piece tickets locally without requiring round-trip cloud validation.
3. **Background Bidirectional Sync:** When connectivity is restored, an idempotent background agent syncs buffered transactions using vector clocks to eliminate duplicate records.

---

## 3. Repository Structure & File Inventory

### 3.1 Directory Tree
```bash
c:\Users\syedm\Desktop\Al Badar\
├── index.html                           # Main SPA Shell & ERP Interface (1,370 lines)
├── server.js                            # Native Node.js HTTP server (Port 3456)
├── README.md                            # High-level overview & quickstart
├── DEVELOPER_DOCUMENTATION.md           # This comprehensive technical guide
├── developer-docs.html                  # Print/PDF-ready master document
├── Al-Badar-Hosiery-Developer-Documentation.pdf # Generated master PDF
├── css/
│   └── styles.css                       # Enterprise design system (Tokens, Glassmorphism, Print)
├── js/
│   ├── main.js                          # Core controller, Lucide icons, sticky nav, toasts
│   ├── erp-simulator.js                 # Circular loom & stitching floor simulator
│   ├── calculator.js                    # Dynamic textile yarn yield & pricing engine
│   └── canvas.js                        # Interactive woven textile thread particle canvas
└── assets/images/
    ├── hero-factory.jpg                 # Faisalabad circular knitting floor
    ├── stitching-floor.jpg              # Multi-line stitching assembly floor
    ├── yarn-warehouse.jpg               # Yarn bags & cones warehouse
    └── undergarments-collection.jpg     # Packaged retail garment showcase
```

### 3.2 Key File Functions
- [`index.html`](file:///c:/Users/syedm/Desktop/Al%20Badar/index.html): Houses 7 core sections: Hero Showcase, Digital Ecosystem Cards, Wholesale B2B Catalog with filter tags, ERP Console Simulator (with 3 interactive tabs), Dynamic Yarn Yield Calculator, Technology Architecture, and Verified Profile.
- [`css/styles.css`](file:///c:/Users/syedm/Desktop/Al%20Badar/css/styles.css): Complete CSS variable design system (`--primary`, `--gold`, `--slate`, `--navy`), responsive layout grid, modal styling, and print rules.
- [`js/erp-simulator.js`](file:///c:/Users/syedm/Desktop/Al%20Badar/js/erp-simulator.js): Simulates 16 circular looms (RPM, kg knit, roll weight), 4 stitching lines, piece-rate QR bundle verification, and inventory issuance.
- [`js/calculator.js`](file:///c:/Users/syedm/Desktop/Al%20Badar/js/calculator.js): Textile formulas for GSM, gross yarn consumption with 7% wastage, 100 lbs bag conversion, and WhatsApp link generation.
- [`js/main.js`](file:///c:/Users/syedm/Desktop/Al%20Badar/js/main.js): Global notification system (`window.showToastNotification`), mobile drawer toggle, and catalog category filters.
- [`server.js`](file:///c:/Users/syedm/Desktop/Al%20Badar/server.js): Zero-dependency Node.js HTTP server with standard MIME-type mappings.

---

## 4. Production Floor ERP Modules & Business Logic

### 4.1 Circular Loom Telemetry Engine (`js/erp-simulator.js`)
- **Loom Capacity:** 16 Circular Looms (14 active, 2 idle/maintenance).
- **Loom RPM:** 18 – 28 RPM based on cylinder diameter (16" to 30") and needle gauge (18G to 28G).
- **Target Roll Weight:** 45 – 50 kg per fabric roll.
- **Simulation Loop:** Every `1,200 ms`, the engine increments roll weight:
  $$\Delta \text{kg} = (\text{Math.random()} \times 0.4 + 0.2) \times \text{simSpeed}$$
  When progress reaches 100%, a fabric roll completion event is emitted and queued for stitching inspection.

### 4.2 Stitching Assembly Lines & Piece-Rate Tracking
| Line ID | Garment Category | Line Supervisor | Active Tailors | Daily Target | Defect Rate |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Line 01** | 1x1 Ribbed Vests (*Baniyan*) | Master Rafiq | 14 Tailors | 350 Dozens | **0.8%** |
| **Line 02** | Combed Cotton Briefs | Master Aslam | 16 Tailors | 320 Dozens | **1.1%** |
| **Line 03** | Winter Thermal Sets | Master Tariq | 12 Tailors | 180 Dozens | **1.4%** |
| **Line 04** | Pique Polo Collared Shirts | Master Naveed | 18 Tailors | 220 Dozens | **0.9%** |

- **Piece-Rate QR Scanning:** Clicking "Simulate QR Scan" verifies `Bundle #ABH-9042` (5 Dozens), increments Line 2 count, credits the tailor's ledger, and triggers a toast alert.

### 4.3 Raw Yarn Warehouse Ledger
- **Packaging Standard:** 100 lbs (45.3592 kg) bags containing **24 cones** (~1.89 kg/cone).
- **Yarn Counts Tracked:**
  - `20/1 Carded Cotton` (PKR 820/kg): Winter thermal backings and heavy ribs.
  - `30/1 Combed Cotton` (PKR 940/kg): Flagship baniyan and brief fabric.
  - `40/1 Compact Super Combed` (PKR 1,120/kg): High-density micro-jersey.

---

## 5. Textile Engineering & Yield Calculator Formulas

Located in [`js/calculator.js`](file:///c:/Users/syedm/Desktop/Al%20Badar/js/calculator.js):

### 5.1 Mathematical Formulas
1. **Net Fabric Mass ($W_{net}$):**
   $$W_{net} = Q_{\text{dozens}} \times w_{\text{dozen}}$$
2. **Gross Yarn Mass ($W_{gross}$):**
   $$W_{gross} = W_{net} \times 1.07 \quad (\text{Includes 7\% Knitting \& Cutting Wastage})$$
3. **Bags & Cones Required:**
   $$\text{Bags} = \left\lceil \frac{W_{gross}}{45.3592} \right\rceil, \quad \text{Cones} = \text{Bags} \times 24$$
4. **Production Lead Time (Days):**
   $$\text{Knitting Days} = \max\left(1, \left\lceil \frac{W_{gross}}{650} \right\rceil\right)$$
   $$\text{Stitching Days} = \left\lceil \frac{Q_{\text{dozens}}}{280} \right\rceil$$
   $$\text{Total Days} = \text{Knitting Days} + \text{Stitching Days} + 3 \quad (\text{3 Days Dyeing/Finishing Allowance})$$
5. **Total Financial Quotation (PKR):**
   $$\text{Total PKR} = (W_{gross} \times R_{\text{yarn}}) + (W_{gross} \times R_{\text{knit}}) + (W_{gross} \times R_{\text{dye}}) + (Q \times C_{\text{stitch}}) + (Q \times C_{\text{pack}})$$

### 5.2 Garment Specifications Matrix
| Garment Spec | Fabric Structure | Weight / Doz | Knitting / kg | Stitching / Doz | Dyeing / kg |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Men's Ribbed Vest** | 175-180 GSM 1x1 Rib | **1.45 kg** | PKR 120 | PKR 480 | PKR 140 |
| **Combed Cotton Briefs** | 160-170 GSM Single Jersey | **0.95 kg** | PKR 130 | PKR 520 | PKR 150 |
| **Knit Boxer Shorts** | 180 GSM Single Jersey | **1.65 kg** | PKR 125 | PKR 650 | PKR 140 |
| **Winter Thermal Suit** | 240 GSM Brushed Interlock | **4.80 kg** | PKR 140 | PKR 1,250 | PKR 160 |
| **Pique Polo Shirt** | 210-220 GSM Honeycomb Pique | **3.20 kg** | PKR 135 | PKR 1,100 | PKR 170 |

---

## 6. Enterprise Database Architecture (PostgreSQL & Prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. Raw Yarn Inventory (Cones & 100 lbs Bags)
model YarnInventory {
  id            String            @id @default(uuid())
  yarnCount     String            // e.g. "30/1 Combed Cotton"
  millName      String            // e.g. Crescent Mills, Suraj
  lotNumber     String            @unique
  totalBags     Int               // Current in-stock 100 lbs bags
  totalCones    Int               // Total cones (bags * 24)
  netWeightKg   Decimal           @db.Decimal(10, 2)
  ratePerKgPKR  Decimal           @db.Decimal(10, 2)
  transactions  YarnTransaction[]
  createdAt     DateTime          @default(now())
}

// 2. Circular Loom & Fabric Roll
model CircularLoom {
  id            Int               @id
  loomCode      String            @unique // "LOOM-01" to "LOOM-16"
  diameterInch  Int               // e.g. 24"
  gaugeNeedles  Int               // e.g. 1,840
  currentRPM    Int               @default(24)
  status        LoomStatus        @default(RUNNING)
  rolls         FabricRoll[]
}

model FabricRoll {
  id            String            @id @default(uuid())
  rollBarcode   String            @unique // "ROLL-2026-9041"
  loomId        Int
  loom          CircularLoom      @relation(fields: [loomId], references: [id])
  weightKg      Decimal           @db.Decimal(6, 2)
  fabricGSM     Int               // Target GSM (e.g. 180)
  qcPassed      Boolean           @default(true)
  stitchingCut  Boolean           @default(false)
  createdAt     DateTime          @default(now())
}

// 3. Stitching Floor & Bundle Ticket QR
model BundleTicket {
  id            String            @id @default(uuid())
  qrCode        String            @unique // "QR-ABH-9042"
  garmentType   String            // "Men's Ribbed Vest"
  sizeCode      String            // "M", "L", "XL"
  piecesCount   Int               @default(60) // 5 Dozens
  lineId        Int
  tailorName    String?
  pieceRatePKR  Decimal           @db.Decimal(8, 2)
  isCompleted   Boolean           @default(false)
  scannedAt     DateTime?
  createdAt     DateTime          @default(now())
}

// 4. B2B Wholesale Order Ledger
model WholesaleOrder {
  id            String            @id @default(uuid())
  orderNumber   String            @unique // "ORD-ABH-2026-104"
  clientName    String
  clientPhone   String            // e.g. "+92 300 7664070"
  marketCity    String            // "Faisalabad", "Lahore", "Karachi"
  totalDozens   Int
  totalAmountPKR Decimal          @db.Decimal(12, 2)
  challanStatus OrderStatus      @default(PENDING)
  createdAt     DateTime          @default(now())
}

enum LoomStatus { RUNNING, PAUSED, MAINTENANCE, NEEDLE_BREAK }
enum OrderStatus { PENDING, IN_PRODUCTION, DISPATCHED, COMPLETED }
```

---

## 7. REST API Specification

### 7.1 Circular Loom Telemetry
- **Endpoint:** `GET /api/v1/erp/looms/status`
- **Auth:** Bearer JWT (`FLOOR_SUPERVISOR` or `ADMIN`)
- **Sample Response:**
```json
{
  "status": "success",
  "activeCount": 14,
  "totalLooms": 16,
  "looms": [
    {
      "id": 4,
      "loomCode": "LOOM-04",
      "rpm": 28,
      "fabric": "1x1 Combed Rib",
      "currentRollWeightKg": 42.6,
      "targetRollWeightKg": 50.0,
      "status": "RUNNING"
    }
  ]
}
```

### 7.2 Stitching Piece-Rate QR Scan
- **Endpoint:** `POST /api/v1/erp/stitching/scan-bundle`
- **Auth:** Terminal API Key
- **Request Body:**
```json
{
  "qrCode": "QR-ABH-9042",
  "lineId": 2,
  "tailorCode": "OP-204",
  "scannedAt": "2026-10-22T11:45:00Z"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "bundle": {
    "qrCode": "QR-ABH-9042",
    "garment": "Men's Ribbed Vest (Baniyan)",
    "dozensCredited": 5,
    "tailorWagePKR": 2400.00,
    "lineDailyTotalDozens": 285
  }
}
```

### 7.3 Raw Yarn Warehouse Gate-Pass Issuance
- **Endpoint:** `POST /api/v1/inventory/yarn/issue`
- **Auth:** Bearer JWT (`WAREHOUSE_MANAGER`)
- **Request Body:**
```json
{
  "yarnCount": "30/1 Combed Cotton",
  "lotNumber": "LOT-CR-882",
  "bagsToIssue": 10,
  "destinationLoomId": 4
}
```
- **Response (201 Created):**
```json
{
  "status": "success",
  "challanNumber": "CHL-2026-8419",
  "issuedKg": 453.6,
  "remainingBagsInStock": 332,
  "remainingConesInStock": 7968
}
```

---

## 8. Deployment, Local Setup & Factory Hardware Integration

### 8.1 Local Execution
```bash
# 1. Clone the repository
git clone https://github.com/syedmeesum1/al-badar.git
cd al-badar

# 2. Launch static server
node server.js
```
Open **`http://localhost:3456/`** in your browser.

### 8.2 Production Multi-Stage Dockerfile
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3456
CMD ["node", "server.js"]
```

### 8.3 Recommended Factory Floor Hardware
1. **Thermal Barcode Printer:** Epson TM-T88VI or Xprinter XP-N160II (80mm ESC/POS, USB/LAN) for instant roll tags and bundle tickets.
2. **2D QR Barcode Scanner:** Honeywell Voyager 1400g or Zebra DS2208 (USB HID Keyboard Emulation, IP42 dust-resistant).
3. **Floor Touch Terminal:** 15.6" IP65 fanless industrial touchscreen panel PC stationed at Stitching Line 1–4 kiosks.

---

## 9. Coding Standards & Maintenance Guidelines

- **Vanilla JavaScript & CSS System:** Avoid third-party bloated frameworks on the frontend floor terminal; maintain zero runtime dependencies for maximum render performance.
- **Adding New Garment Types:** Modify `garmentSpecs` in `js/calculator.js` by defining `name`, `kgPerDozen`, `baseStitchingCostPerDozen`, `baseKnittingCostPerKg`, `dyeingFinishingPerKg`, and `defaultGSM`.
- **Formatting & Linting:** Maintain 2-space indentation, semicolons, and strict equality operators (`===`).
- **Official Enterprise Contact:** For technical escalations, contact the Techmire Development Team or Al-Badar Hosiery Management (`+92 300 7664070`).
