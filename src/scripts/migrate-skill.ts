const { createClient } = require("contentful-management");

const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
const updateEntries = async () => {
    const client = createClient({
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ?? "",
    });

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID ?? "");
    const environment = await space.getEnvironment("master"); // or your environment ID

    const entries = await environment.getEntries({
        content_type: "skill", // Your content type ID
    });

    async function updateEntry(entry: any) {
        try {
            const currentEntry = await environment.getEntry(entry.sys.id);
            // Check if projectFilter is not set and needs updating
            if (
                !currentEntry.fields.projectFilter ||
                !currentEntry.fields.projectFilter["en-US"]
            ) {
                currentEntry.fields.projectFilter = { "en-US": true };
                console.log(`Updating entry ${currentEntry.sys.id}`);
                const updatedEntry = await currentEntry.update();
                await updatedEntry.publish();
                console.log("Published entry: ", currentEntry.sys.id);
                return;
            }
            if (currentEntry.sys.publishedVersion < currentEntry.sys.version) {
                await currentEntry.publish();
                console.log("Published Entry: ", currentEntry.sys.id);
            }
        } catch (error: any) {
            if (error.sys?.id === "RateLimitExceeded") {
                console.warn(
                    `[warning] Rate limit error occurred. Waiting for ${error.sys?.retryAfterMs} ms before retrying...`,
                );
                await sleep(error.sys?.retryAfterMs || 1500); // Defaulting to 1 second if retryAfterMs is not provided
                await updateEntry(entry);
                // retry logic or exit based on your use case
            } else {
                console.log(`Unhandled error for ${entry.sys.id}: `, error);
            }
        }
    }

    for (const entry of entries.items) {
        await updateEntry(entry);
    }

    console.log("All entries have been updated.");
};

updateEntries().catch(console.error);
