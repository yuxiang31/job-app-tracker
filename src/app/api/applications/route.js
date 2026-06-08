import db from "@/lib/db";

const VALID_STATUSES = ["Applied", "Interview", "Rejected", "Offer"];

export async function GET(req) {
	const url = new URL(req.url);
	const status = url.searchParams.get("status");
	const resumeId = url.searchParams.get("resumeId");

	let sql = `SELECT id, company_name, role_title, status, salary_range, job_url, interview_date, resume_id, created_at FROM applications`;
	const clauses = [];
	const params = {};

	if (status && VALID_STATUSES.includes(status)) {
		clauses.push("status = @status");
		params.status = status;
	}

	if (resumeId) {
		clauses.push("resume_id = @resumeId");
		params.resumeId = resumeId;
	}

	if (clauses.length) {
		sql += " WHERE " + clauses.join(" AND ");
	}

	const stmt = db.prepare(sql);
	const rows = stmt.all(params);

	const payload = rows.map((r) => ({
		id: r.id,
		companyName: r.company_name,
		roleTitle: r.role_title,
		status: r.status,
		salaryRange: r.salary_range,
		jobUrl: r.job_url,
		interviewDate: r.interview_date,
		resumeId: r.resume_id,
		createdAt: r.created_at,
	}));

	return new Response(JSON.stringify(payload), { status: 200 });
}

export async function POST(req) {
	const body = await req.json();
	const { companyName, roleTitle, status, salaryRange, jobUrl, resumeId, interviewDate } = body;

	if (!companyName || !roleTitle || companyName.length > 255 || roleTitle.length > 255) {
		return new Response(JSON.stringify({ error: "companyName and roleTitle are required and must be <=255 chars" }), { status: 400 });
	}

	if (!VALID_STATUSES.includes(status)) {
		return new Response(JSON.stringify({ error: "Invalid status value provided." }), { status: 400 });
	}

	const id = crypto.randomUUID();

	const insert = db.prepare(`INSERT INTO applications (id, company_name, role_title, status, salary_range, job_url, interview_date, resume_id) VALUES (@id, @company, @role, @status, @salary, @jobUrl, @interviewDate, @resumeId)`);
	insert.run({ id, company: companyName, role: roleTitle, status, salary: salaryRange || null, jobUrl: jobUrl || null, interviewDate: interviewDate || null, resumeId: resumeId || null });

	// create an empty note record
	const noteId = crypto.randomUUID();
	const insertNote = db.prepare(`INSERT INTO notes (id, application_id, content) VALUES (@id, @applicationId, @content)`);
	insertNote.run({ id: noteId, applicationId: id, content: "" });

	const created = {
		id,
		companyName,
		roleTitle,
		status,
		salaryRange: salaryRange || null,
		jobUrl: jobUrl || null,
		interviewDate: interviewDate || null,
		resumeId: resumeId || null,
		createdAt: new Date().toISOString(),
		// Ensure POST returns the same nested shape
		notes: [{ id: noteId, application_id: id, content: "" }],
	};

	return new Response(JSON.stringify(created), { status: 201 });
}
