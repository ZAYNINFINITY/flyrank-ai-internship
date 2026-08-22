import { expect, test } from "@playwright/test";

/**
 * Primary Foyer museum flow, end to end.
 *
 * Home → Enter the Museum → Entrance → Reception Hall door → Reception →
 * Curator Studio door → Curator chat → Send.
 *
 * The AI layer is stubbed: the `/api/chat` POST is intercepted and answered
 * with a canned UI-message-stream (SSE) response, so the test never touches
 * OpenRouter and stays deterministic. Everything else exercises the real
 * production routes and renderers.
 */

test.describe("primary museum flow", () => {
  test("walks home → entrance → reception → curator chat and sends a message", async ({
    page,
  }) => {
    let chatRequests = 0;
    let lastChatBody: unknown;

    // Stub the AI request before any chat happens. Deterministic SSE reply.
    await page.route("**/api/chat", async (route) => {
      chatRequests += 1;
      const request = route.request();
      lastChatBody = request.postDataJSON();

      const chunks = [
        { type: "start" },
        { type: "start-step" },
        {
          type: "text-start",
          id: "text-0",
        },
        {
          type: "text-delta",
          id: "text-0",
          delta: "The infrastructure collection holds 3 exhibits.",
        },
        {
          type: "text-end",
          id: "text-0",
        },
        { type: "finish-step" },
        { type: "finish", finishReason: "stop" },
      ];

      const body =
        chunks
          .map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`)
          .join("") + "data: [DONE]\n\n";

      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body,
      });
    });

    // ── Home (3D museum-as-homepage or flat fallback) ─────
    await page.goto("/");
    const flatEnter = page.getByRole("link", { name: "Enter the Museum" });
    const textWalls = page.getByRole("button", { name: "Accessible view" });
    await expect(flatEnter.or(textWalls)).toBeVisible({ timeout: 45000 });

    if (await flatEnter.isVisible()) {
      await flatEnter.click();
    } else {
      await page.goto("/entrance");
    }

    // ── Entrance ──────────────────────────────────────────
    await expect(page).toHaveURL(/\/entrance$/);
    await expect(
      page.getByRole("heading", { name: /enter the collection/i }),
    ).toBeVisible();

    // The museum's own door (not the breadcrumb) takes you deeper.
    const entranceExits = page.getByRole("region", { name: "Exits" });
    await entranceExits
      .getByRole("link", { name: /reception hall/i })
      .click();

    // ── Reception ─────────────────────────────────────────
    await expect(page).toHaveURL(/\/reception/);
    await expect(
      page.getByRole("heading", { name: /welcome to foyer/i }),
    ).toBeVisible();

    const receptionExits = page.getByRole("region", { name: "Exits" });
    await receptionExits
      .getByRole("link", { name: /curator studio/i })
      .click();

    // ── Curator chat ──────────────────────────────────────
    await expect(page).toHaveURL(/\/assistant/);
    await expect(
      page.getByRole("heading", { name: "Assistant" }),
    ).toBeVisible();
    await expect(page.getByText(/no conversations yet/i)).toBeVisible();

    const input = page.getByRole("textbox", { name: /type a message/i });
    await input.fill("Show me the infrastructure collection");

    await page.getByRole("button", { name: "Send message" }).click();

    // The user's message appears as a bubble.
    await expect(page.getByText("Show me the infrastructure collection")).toBeVisible();

    // The stubbed assistant reply streams in.
    await expect(
      page.getByText(/the infrastructure collection holds 3 exhibits/i),
    ).toBeVisible();

    // The mocked endpoint was hit exactly once, with our message in the body.
    expect(chatRequests).toBe(1);
    expect(lastChatBody).toMatchObject({
      messages: expect.arrayContaining([
        expect.objectContaining({
          role: "user",
          parts: expect.arrayContaining([
            expect.objectContaining({
              text: "Show me the infrastructure collection",
            }),
          ]),
        }),
      ]),
    });
  });
});
