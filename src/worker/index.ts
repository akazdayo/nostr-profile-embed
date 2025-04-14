import { Hono } from "hono";
import { getUserProfile } from "../utils/nostr";
const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflared" }));
app.get("/api/profile/:publicKey", async (c) => {
	const publicKey = c.req.param("publicKey");
	const profile = await getUserProfile(publicKey, [
		"wss://relay.damus.io",
		"wss://yabu.me",
	]);
	return c.json(profile);
});
export default app;
