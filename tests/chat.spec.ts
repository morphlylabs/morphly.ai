import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
  test('should allow user to send a message and receive a response', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/chat');

    const chatInput = page.locator('textarea[name="message"]');
    await expect(chatInput).toBeVisible();

    const testMessage = 'Why is the sky blue?';
    await chatInput.fill(testMessage);

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();

    const repsponsePromise = page.waitForResponse(response =>
      response.url().includes('/api/chat'),
    );

    await submitButton.click();

    await expect(
      page.locator('.is-user').locator(`text=${testMessage}`),
    ).toBeVisible();

    const response = await repsponsePromise;
    await response.finished();

    await expect(page.locator('.is-assistant').first()).toBeVisible();

    await expect(chatInput).toHaveValue('');
  });
});
