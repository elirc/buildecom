import { expect, test } from "@playwright/test";

test("buyer can browse products and enter checkout", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Marketplace" })).toBeVisible();
  await expect(page.getByText("active listings")).toBeVisible();
  await page.getByRole("link", { name: /view product/i }).first().click();
  await expect(page.getByRole("button", { name: /add to cart/i })).toBeVisible();
});
