import * as allure from 'allure-js-commons';
import type { StepContext } from 'allure-js-commons';
import { expect, test } from '../fixtures/api-test';

type MythologyEntity = {
  id: number;
  name: string;
  category: string;
  desc: string;
};

type MockExchange = {
  label: string;
  request: {
    method: string;
    url: string;
  };
  response: {
    status: number;
    body: unknown;
  };
};

test(
  'GET /mythology - inject mocked entity via stub',
  { tag: '@mock' },
  async ({ page }) => {
    const exchanges: MockExchange[] = [];

    await page.route('**/api/mythology', async (route) => {
      const request = route.request();

      if (request.method() !== 'GET') {
        await route.continue();
        return;
      }

      const mockedEntity: MythologyEntity = {
        id: 999999,
        name: 'Mocked Hero',
        category: 'heroes',
        desc: 'Injected via route stub',
      };

      const mockedResponse = {
        data: [mockedEntity],
      };

      exchanges.push({
        label: 'Stub GET /mythology returns mocked entity',
        request: {
          method: request.method(),
          url: request.url(),
        },
        response: {
          status: 200,
          body: mockedResponse,
        },
      });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedResponse),
      });
    });

    await page.goto('https://api.qasandbox.ru/', {
      waitUntil: 'domcontentloaded',
    });

    const result = await test.step(
      'Fetch mythology list in browser',
      async () =>
        page.evaluate(async () => {
          const response = await fetch('api/mythology');
          const data = await response.json();
          return data;
        }),
    );

    expect(JSON.stringify(result)).toContain('Mocked Hero');

    for (const exchange of exchanges) {
      await allure.step(`Mock API: ${exchange.label}`, async (stepContext: StepContext) => {
        await stepContext.parameter('method', exchange.request.method);
        await stepContext.parameter('url', exchange.request.url);
        await stepContext.parameter('status', String(exchange.response.status));

        await allure.attachment(
          'request',
          JSON.stringify(exchange.request, null, 2),
          'application/json',
        );

        await allure.attachment(
          'response',
          JSON.stringify(exchange.response, null, 2),
          'application/json',
        );
      });
    }
  },
);