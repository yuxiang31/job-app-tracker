import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
	try {
		const rows = db
			.prepare(
				`
					SELECT id, name, file_url, created_at
					FROM resumes
					ORDER BY datetime(created_at) DESC
				`
			)
			.all();

		const resumes = rows.map((row) => ({
			id: row.id,
			name: row.name,
			fileUrl: row.file_url,
			createdAt: row.created_at,
		}));

		return NextResponse.json(resumes, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch resumes:", error);

		return NextResponse.json(
			{ message: "Failed to load resume metadata" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const body = await request.json();
		const name = body?.name?.trim();
		const fileUrl = body?.fileUrl?.trim();

		if (!name || !fileUrl) {
			return NextResponse.json(
				{ error: "Both name and fileUrl are required." },
				{ status: 400 }
			);
		}

		const id = crypto.randomUUID();

		db.prepare(
			`
				INSERT INTO resumes (id, name, file_url)
				VALUES (?, ?, ?)
			`
		).run(id, name, fileUrl);

		const createdResume = db
			.prepare(
				`
					SELECT id, name, file_url, created_at
					FROM resumes
					WHERE id = ?
				`
			)
			.get(id);

		return NextResponse.json(
			{
				id: createdResume.id,
				name: createdResume.name,
				fileUrl: createdResume.file_url,
				createdAt: createdResume.created_at,
			},
			{ status: 201 }
		);
	} catch (error) {
		if (
			error?.code === "SQLITE_CONSTRAINT_UNIQUE" ||
			error?.message?.includes("UNIQUE constraint failed: resumes.name")
		) {
			return NextResponse.json(
				{ error: "A resume variant with that name already exists." },
				{ status: 409 }
			);
		}

		console.error("Failed to create resume:", error);

		return NextResponse.json(
			{ error: "Failed to create resume metadata." },
			{ status: 500 }
		);
	}
}

