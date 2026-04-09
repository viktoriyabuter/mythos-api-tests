import { expect, test } from '@playwright/test';

import {
  createUniqueCredentialsFromEnv,
  loginUser,
  registerUser,
  type LoginResponseBody,
  type RegisterResponseBody,
} from '../../src/api/auth';

test('POST /register creates a new user', async ({ request }) => {
  const credentials = createUniqueCredentialsFromEnv();

  const response = await registerUser(request, credentials);

  await expect(response).toBeOK();
  expect(response.status()).toBe(201);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = (await response.json()) as RegisterResponseBody;

  expect(body).toEqual({
    message: 'Регистрация успешна',
  });
});

test('POST /login returns a JWT token for a registered user', async ({ request }) => {
  const credentials = createUniqueCredentialsFromEnv();

  const registerResponse = await registerUser(request, credentials);
  await expect(registerResponse).toBeOK();

  const loginResponse = await loginUser(request, credentials);

  await expect(loginResponse).toBeOK();
  expect(loginResponse.headers()['content-type']).toContain('application/json');

  const body = (await loginResponse.json()) as LoginResponseBody;
  expect(body.token).toEqual(expect.any(String));
  expect(body.token.split('.')).toHaveLength(3);
});
