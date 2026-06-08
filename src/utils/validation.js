export function isValidUrl(urlString) {
	try {
		const parsedUrl = new URL(urlString);
		return ["http:", "https:"].includes(parsedUrl.protocol) && parsedUrl.hostname.includes(".");
	} catch (_) {
		return false;
	}
}