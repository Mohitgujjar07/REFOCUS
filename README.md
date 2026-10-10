# REFOCOUS

> **"Reset your habits. Rebuild your strength. Refocus your life."**

REFOCOUS is a personal transformation web application designed to help users turn long-term fitness and self-improvement goals into practical daily actions. Built around real collegiate routines, progressive overload resistance training, budget-conscious Indian vegetarian nutrition (with eggs), and factual habit adherence.

---

## 1. Product Vision & Architecture

The application systematically answers five transformation questions:
1. **What am I trying to achieve?** (Clear body composition and strength milestones: 83.15 kg &rarr; 78.0 kg)
2. **What should I do today?** (Calibrated daily priorities checklist, 4-day workout session, nutrient targets)
3. **What have I actually done?** (Meal diary, completed set-and-rep tracking, step and sleep logs)
4. **Am I making progress?** (Weight trend sparklines, multi-week averages, waist circumference, volume charts)
5. **What should I change next?** (Rule-based weekly reviews with transparent adjustment guidance)

### Initial Founder Baseline
- **Starting Weight**: 83.15 kg | **Height**: 165 cm | **Phase 1 Milestone**: 78.0 kg
- **Daily Targets**: ~1,800 kcal | 120 g Protein | 8,000 steps | 7.5 hrs sleep
- **Dietary Pattern**: Vegetarian with eggs (Eggetarian) | ₹1,500/month supplementary grocery budget
- **Schedule**: College 8:30 AM – 4:00 PM (Mon–Fri) | Evening gym sessions (5:30 PM)

---

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router) with React 18
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with custom design system tokens
  - Background: Warm off-white (`#F7F8F5`)
  - Primary: Forest green (`#245B46`)
  - Typography: Clean sans-serif with tabular figures (`tabular-nums`) for numeric data
- **Icons**: Lucide React
- **Data Visualisation**: Recharts
- **Database & Auth (Architecture)**: Firebase Authentication, Cloud Firestore, Firebase Storage
- **Testing**: Built-in Node.js test runner (`node --test`) for pure calculations

---

## 3. Project Structure

```text
refocous/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (app)/
│   │   ├── layout.tsx          # Persistent application shell wrapper
│   │   ├── today/              # Primary transformation dashboard
│   │   ├── nutrition/          # Indian food diary and macro calculator
│   │   ├── training/           # 4-day workout logger with rest timer
│   │   ├── progress/           # Weight, waist and BMI trend analytics
│   │   ├── habits/             # Daily action checklist and hydration
│   │   ├── weekly-review/      # Rule-based adaptive plan adjustment
│   │   └── settings/           # Profile, milestones, targets & deletion
│   ├── onboarding/             # 8-step guided onboarding wizard
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/                 # Sidebar, MobileHeader, MobileNav, AppShell
│   ├── dashboard/              # TodayHeader, SummaryCards, Priorities, etc.
│   └── ui/                     # Button, Card, Badge, ProgressBar, StatCard, BrandLogo
├── lib/
│   ├── calculations/           # Pure, tested functions (BMI, macros, goal %)
│   ├── constants/              # Initial founder profile, food catalogue, workout templates
│   ├── dates/                  # Date formatting utilities
│   └── utils.ts                # Class merging utility
├── tests/
│   └── calculations.test.mjs   # Comprehensive calculation unit test suite
├── firestore.rules             # User-isolated security rules
├── firestore.indexes.json      # Firestore query indexes
├── storage.rules               # Private user media storage rules
├── .env.example                # Sample Firebase configuration
└── package.json
```

---

## 4. Getting Started

### Prerequisites
- Node.js `v18.17+` (Tested on Node.js `v24.13.0`)
- npm `v9+` (Tested on npm `v11.6.2`)

### Installation
```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Build production bundle
npm run build

# Start production server
npm start

# Run local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open the application.

---

## 5. Firebase Setup Guide

Follow these steps to connect your Firebase backend:

1. **Create Firebase Project**:
   - Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project** (e.g. `refocous-prod`).
2. **Enable Authentication**:
   - Navigate to **Build > Authentication** > **Get Started**.
   - Under the **Sign-in method** tab, enable **Email/Password** and click **Save**.
3. **Provision Cloud Firestore**:
   - Navigate to **Build > Firestore Database** > **Create database**.
   - Choose **Production mode** and pick your closest region (e.g. `asia-south1` or `us-central1`).
4. **Register Web App & Copy Configuration**:
   - In **Project Settings > General > Your apps**, click the **</> (Web)** icon.
   - Register app nickname `refocous-web`.
   - Copy the `firebaseConfig` keys into a `.env.local` file in your root folder:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=refocous-prod.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=refocous-prod
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=refocous-prod.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
     NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
     ```
5. **Deploy Security Rules & Indexes**:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

---

## 6. Phase Status

- [x] **Phase 1: Foundation & Application Shell** (Completed)
  - Full design system configured with calm wellness palette and tabular numerals.
  - Responsive desktop sidebar and mobile bottom navigation with quick drawer.
  - Complete Today dashboard with 6 stat cards, priorities checklist, workout card, nutrition breakdown, and weight-trend preview.
  - Dual-mode preview toggle (Sample Blueprint vs Fresh Empty State).
  - Working functional shells for Nutrition, Training, Progress, Habits, Weekly Review, Settings, Auth, and Onboarding.
  - Unit test suite with 100% pass rate.
  - Production build compiled successfully (`15/15` pages static/prerendered).
- [x] **Phase 2: Firebase Foundation & Persistence** (Completed)
  - Firebase Client initialization with emulator support and graceful fallback detection.
  - Complete Authentication system: Registration, Login, Logout, Password Reset, and persistent session state listener (`AuthContext`).
  - Route protection (`AuthGuard`) preventing unauthenticated access without flashing protected content.
  - Interactive `FirebaseSetupBanner` providing real-time setup guidance if `.env.local` is missing.
  - Typed Firestore repositories:
    - `ProfileRepository`: User profile document creation, updates, and authenticated account deletion.
    - `FoodLogRepository`: Date-based meal log queries, adding meals with nutrient snapshots, updates, and deletes.
    - `WorkoutRepository`: Completed session logging, exercises, sets, reps, volume calculations.
    - `ProgressRepository`: Chronological body composition logs (weight, waist, body fat).
    - `HabitRepository`: Custom habit persistence and daily step/sleep/water tracking.
  - Incremental UI persistence: All screens (Nutrition, Training, Progress, Habits, Settings, Onboarding, Today) wired to real Firestore operations with in-memory fallback.
  - Security Rules audited and tested (14 automated unit and security tests passing).
- [ ] **Phase 3: Core Tracking & Advanced Operations** (Next Step)
  - Natural-language food logging preparation.
  - Advanced progression overload recommendations.
  - Batch migrations & offline Firestore cache optimizations.
