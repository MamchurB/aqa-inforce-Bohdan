import { test, expect, APIRequestContext } from '@playwright/test';

const adminCredentials = { username: 'admin', password: 'password' };

const newRoom = {
  roomName: '101',
  type: 'Suite',
  accessible: true,
  image: 'https://blog.postman.com/wp-content/uploads/2014/07/logo.png',
  description: 'This is room 101, dare you enter?',
  roomPrice: 100,
  features: ['WiFi', 'Safe'],
};

const updatedRoomData = {
  roomName: '101 Updated',
  type: 'Suite',
  accessible: false,
  image: 'https://blog.postman.com/wp-content/uploads/2014/07/logo.png',
  description: 'Updated room description',
  roomPrice: 120,
  features: ['WiFi', 'Safe', 'TV'],
};

const bookingData = {
  roomid: 1,
  firstname: 'James',
  lastname: 'Dean',
  depositpaid: true,
  email: 'test@email.com',
  phone: '07123456789',
  bookingdates: {
    checkin: '2026-03-13',
    checkout: '2026-03-15',
  },
};

async function getAdminToken(request: APIRequestContext): Promise<string> {
  const authResponse = await request.post('https://automationintesting.online/api/auth/login', {
    data: adminCredentials,
  });
  expect(authResponse.ok()).toBeTruthy();
  const authData = await authResponse.json();
  return authData.token;
}

test.describe('Rooms & Booking API', () => {
  test('Create Room and verify', async ({ request }) => {
    const token = await getAdminToken(request);

    const createResponse = await request.post('https://automationintesting.online/api/room/', {
      data: newRoom,
      headers: { Cookie: `token=${token}`, 'Content-Type': 'application/json' },
    });
    expect(createResponse.ok()).toBeTruthy();

    const roomsResponse = await request.get('https://automationintesting.online/api/room/', {
      headers: { Cookie: `token=${token}` },
    });
    const roomsJson = await roomsResponse.json();
    const roomsArray = Array.isArray(roomsJson.rooms) ? roomsJson.rooms : roomsJson;

    const exists = roomsArray.some(
      r => r.roomName === newRoom.roomName && r.type === newRoom.type
    );
    expect(exists).toBeTruthy();
  });

  test('Create booking via API and verify in report', async ({ request }) => {
    const token = await getAdminToken(request);

    const bookingResponse = await request.post('https://automationintesting.online/api/booking/', {
      data: bookingData,
    });
    expect(bookingResponse.status()).toBe(201);

    const reportResponse = await request.get('https://automationintesting.online/api/report/', {
      headers: { Cookie: `token=${token}` },
    });
    const reportJson = await reportResponse.json();
    const exists = reportJson.report.some(b =>
      b.start === bookingData.bookingdates.checkin &&
      b.end === bookingData.bookingdates.checkout &&
      b.title.includes(`${bookingData.firstname} ${bookingData.lastname}`)
    );
    expect(exists).toBeTruthy();
  });

  test('Edit Room via API and verify changes', async ({ request }) => {
    const token = await getAdminToken(request);
    const roomId = 1;

    const updateResponse = await request.put(`https://automationintesting.online/api/room/${roomId}`, {
      data: updatedRoomData,
      headers: { Cookie: `token=${token}` },
    });
    expect(updateResponse.ok()).toBeTruthy();

    const getRoomResponse = await request.get(`https://automationintesting.online/api/room/${roomId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(getRoomResponse.ok()).toBeTruthy();

    const roomJson = await getRoomResponse.json();
    expect(roomJson.roomName).toBe(updatedRoomData.roomName);
    expect(roomJson.accessible).toBe(updatedRoomData.accessible);
    expect(roomJson.roomPrice).toBe(updatedRoomData.roomPrice);
    expect(roomJson.description).toBe(updatedRoomData.description);
    expect(roomJson.features).toEqual(updatedRoomData.features);
  });

  test('Delete Room via API and verify it is removed', async ({ request }) => {
    const token = await getAdminToken(request);
    const roomId = 1;

    const deleteResponse = await request.delete(`https://automationintesting.online/api/room/${roomId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleteResponse.ok()).toBeTruthy();

    const roomsResponse = await request.get('https://automationintesting.online/api/room/', {
      headers: { Cookie: `token=${token}` },
    });
    expect(roomsResponse.ok()).toBeTruthy();

    const roomsJson = await roomsResponse.json();
    const rooms = Array.isArray(roomsJson.rooms) ? roomsJson.rooms : roomsJson;
    const roomExists = rooms.some((r: any) => r.id === roomId);
    expect(roomExists).toBeFalsy();
  });

});