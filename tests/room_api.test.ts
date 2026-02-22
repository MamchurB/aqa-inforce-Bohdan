import { test, expect } from '@playwright/test';
import { ApiHelper } from './models/APIHelper';


test.describe('Rooms & Booking API', () => {

  test('Create Room and verify', async ({ request }) => {
    const api = new ApiHelper(request);

    const token = await api.login();
    await api.createRoom(token);

    expect(await api.isRoomCreated(token)).toBeTruthy();
  });

  test('Create booking and verify in report', async ({ request }) => {
    const api = new ApiHelper(request);

    const token = await api.login();
    await api.createBooking();

    expect(await api.isBookingInReport(token)).toBeTruthy();
  });

  test('Edit Room and verify', async ({ request }) => {
    const api = new ApiHelper(request);

    const token = await api.login();
    const roomId = 1;

    await api.updateRoom(token, roomId);

    expect(await api.isRoomUpdated(token, roomId)).toBeTruthy();
  });

  test('Delete Room and verify', async ({ request }) => {
    const api = new ApiHelper(request);

    const token = await api.login();
    const roomId = 1;

    await api.deleteRoom(token, roomId);

    expect(await api.isRoomDeleted(token, roomId)).toBeTruthy();
  });

});