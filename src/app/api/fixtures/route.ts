// app/api/fixtures/route.ts
import { seedUsers } from "@commands/seedUsers";
import { seedPartyCategories } from "@commands/seedPartyCategories";
import { seedParties } from "@commands/seedParties";

export async function GET() {
    const stream = new ReadableStream({
        async start(controller) {
            const push = (msg: string) => {
                controller.enqueue(new TextEncoder().encode(`data: ${msg}\n\n`));
            };

            const pushEvent = (event: string, msg: string) => {
                controller.enqueue(
                    new TextEncoder().encode(`event: ${event}\ndata: ${msg}\n\n`)
                );
            };

            try {
                push("🌱 Seeding users...");
                await seedUsers(push);

                push("🌱 Seeding party categories...");
                await seedPartyCategories(push);

                push("🌱 Seeding parties ...");
                await seedParties(push);

                push("✅ All fixtures seeded successfully!");
                pushEvent("done", "fixtures_completed");
            } catch (err: any) {
                push("❌ Failed: " + (err.message || err));
                pushEvent("done", "fixtures_failed");
            } finally {
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    });
}
