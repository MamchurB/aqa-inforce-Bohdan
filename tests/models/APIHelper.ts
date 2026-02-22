import { APIRequestContext, expect } from '@playwright/test';

export class ApiHelper {
  private baseUrl = 'https://automationintesting.online/api';

  constructor(private request: APIRequestContext) {}

  adminCredentials = {
    username: 'admin',
    password: 'password',
  };

  newRoom = {
    roomName: '101',
    type: 'Suite',
    accessible: true,
    image: 'https://blog.postman.com/wp-content/uploads/2014/07/logo.png',
    description: 'This is room 101',
    roomPrice: 100,
    features: ['WiFi', 'Safe'],
  };

  updatedRoom = {
    roomName: '101 Updated',
    type: 'Suite',
    accessible: false,
    image: 'https://blog.postman.com/wp-content/uploads/2014/07/logo.png',
    description: 'Updated room description',
    roomPrice: 120,
    features: ['WiFi', 'Safe', 'TV'],
  };

  booking = {
    roomid: 1,
    firstname: 'James',
    lastname: 'Dean',
    depositpaid: true,
    email: 'test@email.com',
    phone: '0712345678909',
    bookingdates: {
      checkin: '2026-04-19',
      checkout: '2026-04-21',
    },
  };

  async login(): Promise<string> {
    const response = await this.request.post(
      `${this.baseUrl}/auth/login`,
      { data: this.adminCredentials }
    );

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    return data.token;
  }

  async createRoom(token: string): Promise<void> {
    const response = await this.request.post(
      `${this.baseUrl}/room/`,
      {
        data: this.newRoom,
        headers: { Cookie: `token=${token}` },
      }
    );

    expect(response.ok()).toBeTruthy();
  }

  async isRoomCreated(token: string): Promise<boolean> {
    const response = await this.request.get(
      `${this.baseUrl}/room/`,
      { headers: { Cookie: `token=${token}` } }
    );

    const roomsJson = await response.json();
    const rooms = Array.isArray(roomsJson.rooms) ? roomsJson.rooms : roomsJson;

    return rooms.some((r: any) =>
      r.roomName === this.newRoom.roomName &&
      r.type === this.newRoom.type
    );
  }

  async updateRoom(token: string, roomId: number): Promise<void> {
    const response = await this.request.put(
      `${this.baseUrl}/room/${roomId}`,
      {
        data: this.updatedRoom,
        headers: { Cookie: `token=${token}` },
      }
    );

    expect(response.ok()).toBeTruthy();
  }

  async isRoomUpdated(token: string, roomId: number): Promise<boolean> {
    const response = await this.request.get(
      `${this.baseUrl}/room/${roomId}`,
      { headers: { Cookie: `token=${token}` } }
    );

    const room = await response.json();

    return (
      room.roomName === this.updatedRoom.roomName &&
      room.accessible === this.updatedRoom.accessible &&
      room.roomPrice === this.updatedRoom.roomPrice
    );
  }

  async deleteRoom(token: string, roomId: number): Promise<void> {
    const response = await this.request.delete(
      `${this.baseUrl}/room/${roomId}`,
      { headers: { Cookie: `token=${token}` } }
    );

    expect(response.ok()).toBeTruthy();
  }

  async isRoomDeleted(token: string, roomId: number): Promise<boolean> {
    const response = await this.request.get(
      `${this.baseUrl}/room/`,
      { headers: { Cookie: `token=${token}` } }
    );

    const roomsJson = await response.json();
    const rooms = Array.isArray(roomsJson.rooms) ? roomsJson.rooms : roomsJson;

    return !rooms.some((r: any) => r.id === roomId);
  }

  async createBooking(): Promise<void> {
    const response = await this.request.post(
      `${this.baseUrl}/booking/`,
      { data: this.booking }
    );

    expect(response.status()).toBe(201);
  }

  async isBookingInReport(token: string): Promise<boolean> {
    const reportResponse = await this.request.get('https://automationintesting.online/api/report/', {
      headers: { Cookie: `token=${token}` },
    });
    const reportJson = await reportResponse.json();
    return reportJson.report.some(b =>
      b.start === this.booking.bookingdates.checkin &&
      b.end === this.booking.bookingdates.checkout
    );
  }
  
}