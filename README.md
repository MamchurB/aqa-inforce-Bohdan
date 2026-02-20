# Room Booking Automation Tests

This project contains automated tests for the **Automation Testing Online** website, verifying the room booking functionality.

## Project Structure

room-booking-tests/
├─ **tests/**  
│  ├─ **models/**  
│  │  └─ `BookingData.ts`          
│  ├─ `BookingAppPage.ts`         
│  ├─ `ReportApi.ts`                 
│  ├─ `room_api.test.ts`            
│  └─ `test-cases.test.ts`        
├─ **node_modules/**                 
├─ **playwright-report/**           
├─ **test-results/**                 
├─ `package.json`                    
├─ `package-lock.json`              
├─ `playwright.config.ts`            
└─ `README.md`                    

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

## Known Issues / Bugs

- Rooms can be created with **invalid dates** via UI/API.  
- Contact field validation behaves inconsistently: a **valid email may fail** the check.  
- `GetId` method: if a **non-existent ID** is provided, the request fails due to **time-out**.  
- Other potential inconsistencies in the UI and API related to data entry.

> Recommendation: use test data cautiously in production environments.
