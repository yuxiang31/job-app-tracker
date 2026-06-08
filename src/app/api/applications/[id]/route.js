import db from "@/lib/db";

const VALID_STATUSES = ["Applied", "Interview", "Rejected", "Offer"];

export async function GET(req, { params }) {
	const { id } = await params;
	const stmt = db.prepare(`SELECT id, company_name, role_title, status, salary_range, job_url, interview_date, resume_id, created_at FROM applications WHERE id = ?`);
	const row = stmt.get(id);

	if (!row) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

	const payload = {
		id: row.id,
		companyName: row.company_name,
		roleTitle: row.role_title,
		status: row.status,
		salaryRange: row.salary_range,
		jobUrl: row.job_url,
		interviewDate: row.interview_date,
		resumeId: row.resume_id,
		createdAt: row.created_at,
	};

	return new Response(JSON.stringify(payload), { status: 200 });
}

export async function PATCH(req, { params }) {
	const { id } = await params;
	const body = await req.json();

	if (body.status && !VALID_STATUSES.includes(body.status)) {
		return new Response(JSON.stringify({ error: "Invalid status value provided." }), { status: 400 });
	}

	const fields = [];
	const paramsSql = { id };

	if (body.companyName !== undefined) {
		fields.push("company_name = @companyName");
		paramsSql.companyName = body.companyName;
	}
	if (body.roleTitle !== undefined) {
		fields.push("role_title = @roleTitle");
		paramsSql.roleTitle = body.roleTitle;
	}
	if (body.status !== undefined) {
		fields.push("status = @status");
		paramsSql.status = body.status;
	}
	if (body.salaryRange !== undefined) {
		fields.push("salary_range = @salaryRange");
		paramsSql.salaryRange = body.salaryRange;
	}
	if (body.jobUrl !== undefined) {
		fields.push("job_url = @jobUrl");
		paramsSql.jobUrl = body.jobUrl;
	}
	if (body.interviewDate !== undefined) {
		fields.push("interview_date = @interviewDate");
		paramsSql.interviewDate = body.interviewDate;
	}
	if (body.resumeId !== undefined) {
		fields.push("resume_id = @resumeId");
		paramsSql.resumeId = body.resumeId;
	}

	if (fields.length) {
		const sql = `UPDATE applications SET ${fields.join(", ")} WHERE id = @id`;
		const stmt = db.prepare(sql);
		stmt.run(paramsSql);
	}

	// return updated record
	const getStmt = db.prepare(`SELECT id, company_name, role_title, status, salary_range, job_url, interview_date, resume_id, created_at FROM applications WHERE id = ?`);
	const row = getStmt.get(id);

	if (!row) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

	const payload = {
		id: row.id,
		companyName: row.company_name,
		roleTitle: row.role_title,
		status: row.status,
		salaryRange: row.salary_range,
		jobUrl: row.job_url,
		interviewDate: row.interview_date,
		resumeId: row.resume_id,
		createdAt: row.created_at,
	};

	return new Response(JSON.stringify(payload), { status: 200 });
}

export async function DELETE(req, { params }) {
	const { id } = await params;
	const stmt = db.prepare(`DELETE FROM applications WHERE id = ?`);
	const info = stmt.run(id);

	return new Response(JSON.stringify({ success: info.changes > 0 }), { status: 200 });
}

