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
     const checkinUnavailable = '2026-06-28';
    const checkoutUnavailable = '2026-06-30';
    await booking.setDates(checkinUnavailable, checkoutUnavailable);
    await booking.navigateToMonth(checkinUnavailable);
    await booking.clickReserve();
    await booking.fillForm(firstBooking);
    await booking.clickReserve();
    const token = await reportApi.loginAndGetToken();
    const exists = await reportApi.verifyBookingExists(
      checkinUnavailable,
      checkoutUnavailable
    );

  expect(exists).toBeTruthy();
  });
});