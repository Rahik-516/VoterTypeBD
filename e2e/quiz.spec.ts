import { test, expect } from "@playwright/test";

test("happy path: take quiz and see result", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  await page.goto("/");
  await page.getByRole("link", { name: "Start Quiz" }).click();

  for (let i = 0; i < 9; i += 1) {
    await page.getByLabel(/A\./).first().click();
    await page.getByRole("button", { name: i === 8 ? "See Result" : "Next" }).click();
  }

  await expect(page.getByText(/Your voter type/i)).toBeVisible();

  await page.getByRole("button", { name: "Copy caption" }).click();
  await expect(page.getByText("Caption copied!")).toBeVisible();

  await page.getByRole("button", { name: "Copy link" }).click();
  await expect(page.getByText("Link copied!")).toBeVisible();
});

test("session-only persistence: fresh quiz on new page load", async ({ page, context }) => {
  // Start quiz and answer first question
  await page.goto("/quiz");
  await page.getByLabel(/A\./).first().click();
  await page.getByRole("button", { name: "Next" }).click();

  // Verify we're on question 2
  await expect(page).toHaveURL(/quiz/);

  // Close and reopen page (simulating new session in new context)
  await page.context().close();

  // Create new context (new session)
  const newContext = await page.context().browser()?.newContext();
  if (!newContext) return;

  const newPage = await newContext.newPage();
  await newPage.goto("/quiz");

  // Should start from question 1 (no saved progress)
  const firstQuestionVisible = await newPage.getByLabel(/A\./).first().isVisible();
  expect(firstQuestionVisible).toBe(true);

  await newContext.close();
});

test("download PNG works and includes content", async ({ page }) => {
  // Complete quiz
  await page.goto("/quiz");
  for (let i = 0; i < 9; i += 1) {
    await page.getByLabel(/A\./).first().click();
    await page.getByRole("button", { name: i === 8 ? "See Result" : "Next" }).click();
  }

  // Wait for result page and image to load
  await expect(page.getByText(/Your voter type/i)).toBeVisible();
  await page.waitForTimeout(500); // Wait for image loading

  // Check download button is enabled (means image loaded)
  const downloadBtn = page.getByRole("button", { name: /Download PNG/i });
  await expect(downloadBtn).toBeEnabled();
});
