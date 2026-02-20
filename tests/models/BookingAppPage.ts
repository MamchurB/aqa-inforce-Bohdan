import { Page, expect } from '@playwright/test';

export class BookingAppPage {
  readonly page: Page;

  validBookingDataSet = [
    { firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', phone: '380671234567', checkin: '2026-07-10', checkout: '2026-07-12' },
    { firstname: 'Alice', lastname: 'Smith', email: 'alice.smith@example.com', phone: '380501234567', checkin: '2026-07-13', checkout: '2026-07-15' },
    { firstname: 'Robert', lastname: 'Brown', email: 'robert.brown@example.com', phone: '380931234567', checkin: '2026-07-16', checkout: '2026-07-18' },
    { firstname: 'Maria', lastname: 'Ivanova', email: 'maria.ivanova@example.com', phone: '380991234567', checkin: '2026-07-19', checkout: '2026-07-21' },
    { firstname: 'David', lastname: 'Johnson', email: 'david.johnson@example.com', phone: '380671112233', checkin: '2026-07-22', checkout: '2026-07-24' }
  ];

  invalidDateCases = [
    { name: 'Past dates', checkin: '2024-01-01', checkout: '2024-01-03' },
    { name: 'Checkout before checkin', checkin: '2026-07-12', checkout: '2026-07-10' },
    { name: 'Same checkin and checkout date', checkin: '2026-07-10', checkout: '2026-07-10' },
    { name: 'Empty dates', checkin: '', checkout: '' },
    { name: 'Unavailable', checkin: '2026-07-10', checkout: '2026-07-12' }
  ];

  constructor(page: Page) {
    this.page = page;
  }

  async openHome() {
    await this.page.goto('https://automationintesting.online/');
  }

  async openRoom() {
    await this.page.getByRole('link', { name: 'Book now' }).nth(1).click();
  }

  async setDates(checkin: string, checkout: string) {
    await this.page.evaluate(
      ({ checkin, checkout }) => { window.location.search = `?checkin=${checkin}&checkout=${checkout}`; },
      { checkin, checkout }
    );
    await this.page.waitForTimeout(500);
  }

  async navigateToMonth(targetDateStr: string) {
    const targetDate = new Date(targetDateStr);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    while (true) {
      const label = await this.page.locator('.rbc-toolbar-label').textContent();
      if (!label) break;

      const [displayMonthStr, displayYearStr] = label.split(' ');
      const displayMonth = new Date(`${displayMonthStr} 1, 2000`).getMonth();
      const displayYear = parseInt(displayYearStr);

      if (displayMonth === targetMonth && displayYear === targetYear) break;

      await this.page.getByRole('button', { name: 'Next' }).click();
      await this.page.waitForTimeout(200);
    }
  }

  async clickReserve() {
    await this.page.getByRole('button', { name: 'Reserve Now' }).click();
  }

  async fillForm(data: Partial<{ firstname: string; lastname: string; email: string; phone: string; }>) {
    if (data.firstname) await this.page.fill('input[name="firstname"]', data.firstname);
    if (data.lastname) await this.page.fill('input[name="lastname"]', data.lastname);
    if (data.email) await this.page.fill('input[name="email"]', data.email);
    if (data.phone) await this.page.fill('input[name="phone"]', data.phone);
  }

  async expectBookingConfirmed() {
    await expect.soft(this.page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
  }

  async expectValidationError() {
    await expect.soft(this.page.getByText(/error|invalid|required/i)).toBeVisible({ timeout: 5000 });
  }
  

async isDateUnavailable(date: string, report): boolean {
  if (!report || !Array.isArray(report)) return false;

  const checkinDate = new Date(date);

  return report.some(b => {
    if (!b.start || !b.end) return false; // перевірка на null/undefined
    const startDate = new Date(b.start);
    const endDate = new Date(b.end);
    return checkinDate >= startDate && checkinDate <= endDate;
  });
}
}