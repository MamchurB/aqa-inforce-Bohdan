import { test, expect } from '@playwright/test';

async function goToMonthAndCheckSelected(page, checkin: string) {
  const targetDate = new Date(checkin);
  const targetMonth = targetDate.getMonth();
  const targetYear = targetDate.getFullYear();

  while (true) {
    const label = await page.locator('.rbc-toolbar-label').textContent();
    if (!label) break;

    const [displayMonthStr, displayYearStr] = label.split(' ');
    const displayMonth = new Date(`${displayMonthStr} 1, 2000`).getMonth();
    const displayYear = parseInt(displayYearStr);

    if (displayMonth === targetMonth && displayYear === targetYear) break;

    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(200);
  }
}

test('book room and verify unavailable via API', async ({ page, request }) => {
  await page.goto('https://automationintesting.online/');
  await page.getByRole('link', { name: 'Book now' }).nth(1).click();

  const checkin = '2026-05-10';
  const checkout = '2026-02-21';

  await page.evaluate(({ checkin, checkout }) => {
    window.location.search = `?checkin=${checkin}&checkout=${checkout}`;
  }, { checkin, checkout });

  await page.waitForTimeout(1000);
  await goToMonthAndCheckSelected(page, checkin);
  await expect.soft(page.getByText('Selected').first()).toBeVisible();

  await page.getByRole('button', { name: 'Reserve Now' }).click();
  await page.fill('input[name="firstname"]', 'John');
  await page.fill('input[name="lastname"]', 'Doe');
  await page.fill('input[name="email"]', 'test@gmail.com');
  await page.fill('input[name="phone"]', '1234567890987');
  await page.getByRole('button', { name: 'Reserve Now' }).click();

  await expect.soft(
    page.getByRole('heading', { name: 'Booking Confirmed' })
  ).toBeVisible();

  await expect.soft(
    page.getByRole('paragraph').filter({ hasText: `${checkin} - ${checkout}` })
  ).toBeVisible();

  const authResponse = await request.post('https://automationintesting.online/api/auth/login', {
    data: { username: 'admin', password: 'password' },
  });
  const authData = await authResponse.json();
  const token = authData.token;

  interface Booking { start: string; end: string; title: string; }
  interface ReportResponse { report: Booking[] }

  const reportResponse = await request.get('https://automationintesting.online/api/report/', {
    headers: { Cookie: `token=${token}` },
  });

const reportJson = await reportResponse.json();
  function isDateUnavailable(date: string, report: Booking[]): boolean {
    if (!report || !Array.isArray(report)) return false;
  return report.some(b => b.start <= date && b.end >= date);
}

  const unavailable = isDateUnavailable(checkin, reportJson.report);
  expect(unavailable).toBeTruthy();
});