# Room Booking Automation Tests

Automated UI and API tests for the Room Booking application using Playwright.

---

## 📌 Project Overview

This project contains automated tests for:

- Room creation, editing and deletion via API
- Room booking via UI
- Report validation via API
- Validation of booking data and edge cases

## 📂 Project Structure

├─ **.github/**  
├─ **node_modules/**  
├─ **playwright-report/**  
├─ **test-results/**  
├─ **tests/**  
│  ├─ **models/**  
│  │  ├─ `APIHelper.ts`           — API helper methods  
│  │  ├─ `BookingAppPage.ts`      — Page Object Model for UI interactions  
│  │  └─ `ReportApi.ts`           — API helper for login and report validation  
│  ├─ `room_api.test.ts`          — API tests for room creation/editing/deletion  
│  └─ `test-cases.test.ts`        — Main UI room booking tests  
├─ `.gitignore`  
├─ `package.json`                 — Project configuration and dependencies  
├─ `package-lock.json`            — Locked dependency versions  
├─ `playwright.config.ts`         — Playwright configuration  
├─ `test-cases.txt.txt`           — Test cases documentation  
└─ `README.md`  
---

## 🚀 Installation

Clone the repository:

git clone https://github.com/MamchurB/aqa-inforce-Bohdan.git  
cd room-booking-tests  

Install dependencies:

npm install  

Install Playwright browsers:

npx playwright install  

---

## ▶️ Running Tests

Run all tests:

npx playwright test  

Run only UI tests:

npx playwright test test-cases.test.ts  

Run only API tests:

npx playwright test room_api.test.ts  

---

## 📊 View HTML Report

After test execution:

npx playwright show-report  

---

## Known Issues / Bugs

- Rooms can be created with **invalid dates** via UI/API.
- Contact field validation behaves inconsistently — a valid email may fail validation.
- `GetId` method: sending a non-existent ID may result in a time-out.
- Some API responses may return dates in ISO format, requiring normalization during validation.

---

mation Engineer
