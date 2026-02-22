import { APIRequestContext, expect } from '@playwright/test';

export class ReportApi {
  constructor(private request: APIRequestContext) {}

  async loginAndGetToken(): Promise<string> {
    const response = await this.request.post(
      'https://automationintesting.online/api/auth/login',
      { data: { username: 'admin', password: 'password' } }
    );

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    return data.token;
  }

  async getReport(token: string) {
    const response = await this.request.get(
      'https://automationintesting.online/api/report/',
      {
        headers: { Cookie: `token=${token}` }
      }
    );

    expect(response.ok()).toBeTruthy();
    return response.json();
  }

  async verifyBookingExists(checkin: string, checkout: string): Promise<boolean> {
    const token = await this.loginAndGetToken();
    const report = await this.getReport(token);

    const reportJson: { report: any[] } = await report;

    return reportJson.report.some(b =>
      b.start === checkin &&
      b.end === checkout
    );
}
}