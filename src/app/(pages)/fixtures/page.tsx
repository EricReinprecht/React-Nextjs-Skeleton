'use client'

import BasePage from "@templates/base_page";
import { useState } from "react";

export default function GenerateFixtures(props) {
    const [logs, setLogs] = useState("");

    const generateFixtures = () => {
        setLogs("");

        const eventSource = new EventSource("/api/fixtures");

        // normal log messages
        eventSource.onmessage = (event) => {
            setLogs((prev) => prev + event.data + "\n");
        };

        // listen for done event
        eventSource.addEventListener("done", (event: any) => {
            setLogs((prev) => prev + "✅ Stream finished!\n");
            eventSource.close();
        });

        eventSource.onerror = (err) => {
            console.error("SSE error", err);
            eventSource.close();
        };
    };

    return (
        <BasePage>
            <button 
                onClick={generateFixtures} 
                style={{ backgroundColor: "red" }}
            >
                Generate Fixtures
            </button>
            {logs && 
                <pre style={{
                    whiteSpace: "pre-wrap",
                    marginTop: "1rem",
                    background: "#111",
                    color: "#0f0",
                    padding: "1rem",
                    borderRadius: "8px"
                }}>
                    {logs}
                </pre>
            }
        </BasePage>
    );
}
