import { expect, test } from '@playwright/test';

test('GET /mythology returns successful JSON response', async ({ request }) => {
  const response = await request.get('mythology');

  await expect(response).toBeOK();
  expect(response.headers()['content-type']).toContain('application/json');

  const body = await response.json();
  expect(body).toBeTruthy();
});
