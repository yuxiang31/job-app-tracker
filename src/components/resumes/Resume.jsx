"use client";

import AppHeader from "@/components/ui/AppHeader";
import SectionCard from "@/components/ui/SectionCard";
import { useResumeManager } from "@/hooks/useResumeManager";

export default function ResumeManager() {
	const {
		resumes: sortedResumes,
		form,
		isLoading,
		isSaving,
		message,
		error,
		updateField,
		handleSaveResume,
		handleDeleteResume,
	} = useResumeManager();

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
				<AppHeader title="Resumes" activeTab="resumes" />

				<main className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
					<SectionCard
						eyebrow="Create New Variant"
						title="Save a tailored resume link"
						description="Keep each version named by target role so you can reuse the right one quickly when applying."
					>
						<form className="space-y-4" onSubmit={handleSaveResume}>
							<label className="block">
								<span className="mb-2 block text-sm font-medium text-slate-700">
									Name
								</span>
								<input
									name="name"
									value={form.name}
									onChange={updateField}
									placeholder="Full-Stack - React heavy"
									className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
								/>
							</label>

							<label className="block">
								<span className="mb-2 block text-sm font-medium text-slate-700">
									Link
								</span>
								<input
									name="fileUrl"
									value={form.fileUrl}
									onChange={updateField}
									placeholder="https://drive.google.com/..."
									className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
								/>
							</label>

							<button
								type="submit"
								disabled={isSaving}
								className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isSaving ? "Saving Resume..." : "+ Save Resume"}
							</button>

							{message ? (
								<p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
									{message}
								</p>
							) : null}

							{error ? (
								<p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
									{error}
								</p>
							) : null}
						</form>
					</SectionCard>

					<SectionCard
						eyebrow="Existing Resumes"
						title="All saved variants in one place"
						meta={`${sortedResumes.length} saved variant${sortedResumes.length === 1 ? "" : "s"}`}
					>
						<div className="overflow-hidden rounded-3xl border border-slate-200">
							<div className="hidden grid-cols-[1.4fr_1.1fr_0.5fr] bg-slate-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 md:grid">
								<div>Resume Name</div>
								<div>Reference Link</div>
								<div className="text-right">Action</div>
							</div>

							<div className="divide-y divide-slate-200">
								{isLoading ? (
									<div className="px-5 py-12 text-sm text-slate-500">
										Loading resumes...
									</div>
								) : sortedResumes.length === 0 ? (
									<div className="px-5 py-12 text-sm text-slate-500">
										No resumes have been saved yet.
									</div>
								) : (
									sortedResumes.map((resume) => (
										<div
											key={resume.id}
											className="grid gap-3 px-5 py-4 md:grid-cols-[1.4fr_1.1fr_0.5fr] md:items-center"
										>
											<div>
												<p className="text-sm font-semibold text-slate-950">
													{resume.name}
												</p>
												<p className="mt-1 text-xs text-slate-500">
													Saved{' '}
													{resume.createdAt
														? new Date(resume.createdAt).toLocaleString()
														: "recently"}
												</p>
											</div>

											<div className="min-w-0">
												{resume.fileUrl ? (
													<a
														href={resume.fileUrl}
														target="_blank"
														rel="noreferrer"
														className="inline-flex max-w-full items-center truncate rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 hover:text-slate-950"
													>
														Open External Link
													</a>
												) : (
													<span className="text-sm text-slate-500">
														No link provided
													</span>
												)}
											</div>

											<div className="flex justify-start md:justify-end">
												<button
													type="button"
													onClick={() => handleDeleteResume(resume.id)}
													className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
												>
													Del
												</button>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</SectionCard>
				</main>
			</div>
		</div>
	);
}
