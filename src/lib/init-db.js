import db from "./db.js";

// Create tables
export function initializeDatabase() {
db.exec(`
  CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      file_url TEXT,
      created_at TEXT NOT NULL DEFAULT (
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      )
  );

  CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      role_title TEXT NOT NULL,
      status TEXT NOT NULL CHECK (
        status IN ('Applied', 'Interview', 'Rejected', 'Offer')
      ),
      salary_range TEXT,
      job_url TEXT,
      interview_date TEXT,
      resume_id TEXT,
      created_at TEXT NOT NULL DEFAULT (
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),
      FOREIGN KEY (resume_id)
        REFERENCES resumes(id)
        ON DELETE RESTRICT
  );

  CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      content TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),
      FOREIGN KEY (application_id)
        REFERENCES applications(id)
        ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_applications_status
    ON applications(status);

  CREATE INDEX IF NOT EXISTS idx_applications_interview_date
    ON applications(interview_date);
  `);
}