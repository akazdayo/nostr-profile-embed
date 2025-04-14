import { Hono } from "hono";
import { getUserProfile } from "../utils/nostr";
import { generateProfileSvg } from "../utils/generateSvg";
import { checkNIP05 } from "../utils/nip05";
const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflared" }));
app.get("/api/profile/:publicKey", async (c) => {
	const publicKey = c.req.param("publicKey");
	const profile = await getUserProfile(publicKey, [
		"wss://relay.damus.io",
		"wss://yabu.me",
	]);

	// NIP-05検証を実行
	let nip05Verified = false;
	if (profile.nip05) {
		nip05Verified = await checkNIP05(publicKey, profile.nip05);
		console.log(`NIP-05 verification for ${profile.nip05}: ${nip05Verified}`);
	}

	// 検証結果を含めてSVGを生成
	const response = generateProfileSvg(profile, { nip05Verified });
	return c.html(response);
});
export default app;
