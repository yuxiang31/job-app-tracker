import db from "@/lib/db";

export async function GET(req, { params }) {
	const { id: applicationId } = await params;
	const stmt = db.prepare(`SELECT id, application_id, content, updated_at FROM notes WHERE application_id = ?`);
	const row = stmt.get(applicationId);

	if (!row) {
		return new Response(JSON.stringify({ id: null, applicationId, content: "", updatedAt: null }), { status: 200 });
	}

	return new Response(JSON.stringify({ id: row.id, applicationId: row.application_id, content: row.content, updatedAt: row.updated_at }), { status: 200 });
}

export async function PUT(req, { params }) {
	const { id: applicationId } = await params;
	const body = await req.json();
	const { content } = body;

	// check if a note exists
	const getStmt = db.prepare(`SELECT id FROM notes WHERE application_id = ?`);
	const existing = getStmt.get(applicationId);

	if (existing) {
		const update = db.prepare(`UPDATE notes SET content = @content, updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) WHERE id = @id`);
		update.run({ content, id: existing.id });
		const row = db.prepare(`SELECT id, application_id, content, updated_at FROM notes WHERE id = ?`).get(existing.id);
		return new Response(JSON.stringify({ id: row.id, applicationId: row.application_id, content: row.content, updatedAt: row.updated_at }), { status: 200 });
	}

	const noteId = crypto.randomUUID();
	const insert = db.prepare(`INSERT INTO notes (id, application_id, content) VALUES (@id, @applicationId, @content)`);
	insert.run({ id: noteId, applicationId, content: content || "" });

	return new Response(JSON.stringify({ id: noteId, applicationId, content: content || "", updatedAt: new Date().toISOString() }), { status: 201 });
}

