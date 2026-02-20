# Room Booking Automation Tests

This project contains automated tests for the **Automation Testing Online** website, verifying the room booking functionality.

## Project Structure

│ │ └─ BookingData.ts # Test data for valid/invalid bookings
│ ├─ BookingAppPage.ts # Page Object Model class for UI interactions
│ ├─ ReportApi.ts # API helper for login and report fetching
│ ├─ room_api.test.ts # Tests for room creation/edit/deletion via API
│ └─ test-cases.test.ts # Main room booking UI tests
├─ node_modules/
├─ playwright-report/ # Playwright HTML reports
├─ test-results/ # Raw test outputs
├─ package.json
├─ package-lock.json
├─ playwright.config.ts
└─ README.md

## Tests Overview

1. **Room API Tests** (`room_api.test.ts`)  
   - Create room, edit room, delete room, create book via API  
   - Verify roomsor booking exist or removed correctly

2. **UI Booking Tests** (`test-cases.test.ts`)  
   - Book room with valid data  
   - Attempt booking with invalid data (past dates, checkout before checkin, empty fields)  
   - Verify that earlier booked dates are unavailable

## Setup

```bash
git clone <repo_url>
cd room-booking-tests
npm install
npx playwright install
npm install
npx playwright install
