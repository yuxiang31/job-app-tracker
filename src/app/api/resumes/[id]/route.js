import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(request, { params}) {
	try {
        const { id } = await params

		if (!id) {
			return NextResponse.json(
				{ error: "Resume id is required." },
				{ status: 400 }
			);
		}

		const result = db
			.prepare(
				`
					DELETE FROM resumes
					WHERE id = ?
				`
			)
			.run(id);

		if (result.changes === 0) {
			return NextResponse.json(
				{ error: "Resume not found." },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		if (
			error?.code === "SQLITE_CONSTRAINT_FOREIGNKEY" ||
			error?.message?.includes("FOREIGN KEY constraint failed")
		) {
			return NextResponse.json(
				{
					error:
						"Cannot delete resume: This version is currently linked to active job applications.",
				},
				{ status: 422 }
			);
		}

		console.error("Failed to delete resume:", error);

		return NextResponse.json(
			{ error: "Failed to delete resume." },
			{ status: 500 }
		);
	}
}
