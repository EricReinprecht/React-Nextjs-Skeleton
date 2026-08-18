import { NextRequest } from "next/server";

import { seedFixtures } from "../services/fixture.service";

export const seedFixturesHandler = async (request: NextRequest) => {
    const preserveUsers = request.nextUrl.searchParams.get("preserveUsers") === "true";
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const push = (message: string) => controller.enqueue(encoder.encode(`data: ${message}\n\n`));
            const done = (message: string) => controller.enqueue(encoder.encode(`event: done\ndata: ${message}\n\n`));
            try {
                await seedFixtures(preserveUsers, push);
                done("fixtures_completed");
            } catch (error) {
                push(`❌ Failed: ${error instanceof Error ? error.message : String(error)}`);
                done("fixtures_failed");
            } finally {
                controller.close();
            }
        },
    });
    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
};
