import { test, expect } from '@playwright/test';
import { BookingAppPage } from './models/BookingAppPage';
import { ReportApi } from './models/ReportApi';

let booking: BookingAppPage;

test.describe('Room Booking Tests', () => {

  test.beforeEach(async ({ page }) => {
    booking = new BookingAppPage(page);
    await booking.openHome();
    await booking.openRoom();
  });

  test('Check that the room can be booked with valid data', async ({ page }) => {
    for (const data of booking.validBookingDataSet) {
      await test.step(`Book room for ${data.firstname} ${data.lastname}`, async () => {
        await booking.setDates(data.checkin, data.checkout);
        await booking.navigateToMonth(data.checkin);
        await booking.clickReserve();
        await booking.fillForm(data);
        await booking.clickReserve();
        await booking.expectBookingConfirmed();
      });
    }
  });
  test('Check that the room can be booked with invalid data', async ({ page }) => {
    for (const scenario of booking.invalidDateCases) {
      await booking.setDates(scenario.checkin, scenario.checkout);
      await booking.clickReserve();
      await booking.expectValidationError();
    }
  });

  test('Check that the earlier booked dates show as Unavailable', async ({ page, request }) => {
    const reportApi = new ReportApi(request);
    const firstBooking = booking.validBookingDataSet[0];
     const checkinUnavaibe = '2026-06-28';
    const checkoutUnavaibe = '2026-06-30';
    await booking.setDates(checkinUnavaibe, checkoutUnavaibe);
    await booking.navigateToMonth(checkinUnavaibe);
    await booking.clickReserve();
    await booking.fillForm(firstBooking);
    await booking.clickReserve();
    const token = await reportApi.loginAndGetToken();
const report = await reportApi.getReport(token);

const reportJson: { report: any[] } = await report;
console.log(reportJson);
  const exists = reportJson.report.some(b =>
    b.start === checkinUnavaibe &&
    b.end === checkoutUnavaibe
  );

  expect(exists).toBeTruthy();
  });
});