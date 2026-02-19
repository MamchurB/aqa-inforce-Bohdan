import { test, expect } from '@playwright/test';

test('create room', async ({ request }) => {
const authResponse = await request.post('https://automationintesting.online/api/auth/login', {
    data: { username: 'admin', password: 'password' },
  });
  const authData = await authResponse.json();
  const token = authData.token;
    const newRoom = {
    roomName: '101',
    type: 'Suite',
    accessible: true,
    image: 'https://blog.postman.com/wp-content/uploads/2014/07/logo.png',
    description: 'This is room 101, dare you enter?',
    roomPrice: 100,
    features: ['WiFi', 'Safe'],
  };

  const createRoomResponse = await request.post('https://automationintesting.online/api/room/', {
    headers: { Cookie: `token=${token}`, 'Content-Type': 'application/json' },
    data: newRoom,
  });

  expect(createRoomResponse.ok()).toBeTruthy();

const roomsResponse = await request.get('https://automationintesting.online/api/room/', {
    headers: { Cookie: `token=${token}` },
  });

  const roomsJson: { rooms: any[] } = await roomsResponse.json(); // явно типізуємо
  const roomsArray = roomsJson.rooms || []; // якщо поле rooms є

  const exists = roomsArray.some(r => r.roomName === newRoom.roomName && r.type === newRoom.type);
  expect(exists).toBeTruthy();

});

test('create booking via API and verify', async ({ request }) => {
  // Отримуємо токен
  const authResponse = await request.post('https://automationintesting.online/api/auth/login', {
    data: { username: 'admin', password: 'password' },
  });
  const authData = await authResponse.json();
  const token = authData.token;

  // Дані бронювання
  const bookingData = {
    roomid: 1,
    firstname: "James",
    lastname: "Dean",
    depositpaid: true,
    email: "test@email.com",
    phone: "07123456789",
    bookingdates: {
      checkin: "2026-03-13",
      checkout: "2026-03-15"
    }
  };
  const bookingResponse = await request.post('https://automationintesting.online/api/booking/', {
    data: bookingData,
  });
  expect(bookingResponse.status()).toBe(201);

  // Перевіряємо, що бронювання з’явилось у звіті
  const reportResponse = await request.get('https://automationintesting.online/api/report/', {
    headers: { Cookie: `token=${token}` },
  });
  const reportJson: { report: any[] } = await reportResponse.json();
  const exists = reportJson.report.some(b =>
    b.start === bookingData.bookingdates.checkin &&
    b.end === bookingData.bookingdates.checkout &&
    b.title.includes(`${bookingData.firstname} ${bookingData.lastname}`)
  );

  expect(exists).toBeTruthy();
});

test('Edit Room via API and verify changes', async ({ request }) => {
  // 1. Отримати токен для авторизації
  const authResponse = await request.post('https://automationintesting.online/api/auth/login', {
    data: { username: 'admin', password: 'password' }
  });
  expect(authResponse.ok()).toBeTruthy();
  const authData = await authResponse.json();
  const token = authData.token;

  // 2. Дані для оновлення кімнати
  const roomId = 1; // id кімнати, яку редагуємо
  const updatedRoomData = {
    roomName: "101 Updated",
    type: "Suite",
    accessible: false,
    image: "https://blog.postman.com/wp-content/uploads/2014/07/logo.png",
    description: "Updated room description",
    roomPrice: 120,
    features: ["WiFi", "Safe", "TV"]
  };
   const updateResponse = await request.put(`https://automationintesting.online/api/room/${roomId}`, {
    data: updatedRoomData,
    headers: { Cookie: `token=${token}` }
  });
  expect(updateResponse.ok()).toBeTruthy(); // перевіряємо, що статус 200

  // 4. Перевірка змін через GET /api/room/:id
  const getRoomResponse = await request.get(`https://automationintesting.online/api/room/${roomId}`, {
    headers: { Cookie: `token=${token}` }
  });
  expect(getRoomResponse.ok()).toBeTruthy();

  const roomJson = await getRoomResponse.json();

  // 5. Перевірка, що зміни застосувалися
  expect(roomJson.roomName).toBe(updatedRoomData.roomName);
  expect(roomJson.accessible).toBe(updatedRoomData.accessible);
  expect(roomJson.roomPrice).toBe(updatedRoomData.roomPrice);
  expect(roomJson.description).toBe(updatedRoomData.description);
  expect(roomJson.features).toEqual(updatedRoomData.features);
});

test('Delete Room via API and verify it is removed', async ({ request }) => {
  // 1. Отримати токен для авторизації
  const authResponse = await request.post('https://automationintesting.online/api/auth/login', {
    data: { username: 'admin', password: 'password' }
  });
  expect(authResponse.ok()).toBeTruthy();
  const authData = await authResponse.json();
  const token = authData.token;

  // 2. Вказуємо ID кімнати, яку хочемо видалити
  const roomId = 1;
// 3. Видалення кімнати через API
  const deleteResponse = await request.delete(`https://automationintesting.online/api/room/${roomId}`, {
    headers: { Cookie: `token=${token}` }
  });
  expect(deleteResponse.ok()).toBeTruthy(); // перевірка, що статус 200

   const roomsResponse = await request.get('https://automationintesting.online/api/room/', {
    headers: { Cookie: `token=${token}` }
  });
  expect(roomsResponse.ok()).toBeTruthy();

  const roomsJson = await roomsResponse.json();
  const rooms = Array.isArray(roomsJson.rooms) ? roomsJson.rooms : roomsJson;
  const roomExists = rooms.some((r: any) => r.id === roomId);
  expect(roomExists).toBeFalsy();
});