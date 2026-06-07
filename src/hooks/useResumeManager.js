import { useState, useEffect, useRef, useMemo } from "react";

const initialFormState = {
	name: "",
	fileUrl: "",
};

export function useResumeManager() {
	const [resumes, setResumes] = useState([]);
	const [form, setForm] = useState(initialFormState);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const notificationTimeoutRef = useRef(null);

	useEffect(() => {
		let isActive = true;

		async function loadResumes() {
			try {
				setIsLoading(true);
				setError("");
				const response = await fetch("/api/resumes", { cache: "no-store" });

				if (!response.ok) throw new Error("Failed to load resumes.");
				
				const data = await response.json();
				if (isActive) setResumes(Array.isArray(data) ? data : []);
			} catch (fetchError) {
				if (isActive) setError(fetchError.message || "Failed to load resumes.");
			} finally {
				if (isActive) setIsLoading(false);
			}
		}

		loadResumes();
		return () => { isActive = false; };
	}, []);

	useEffect(() => {
		if (!message && !error) return undefined;

		notificationTimeoutRef.current = setTimeout(() => {
			setMessage("");
			setError("");
		}, 4000);

		return () => {
			if (notificationTimeoutRef.current) {
				clearTimeout(notificationTimeoutRef.current);
				notificationTimeoutRef.current = null;
			}
		};
	}, [message, error]);

	const sortedResumes = useMemo(
		() =>
			[...resumes].sort((left, right) => {
				const leftTime = new Date(left.createdAt || 0).getTime();
				const rightTime = new Date(right.createdAt || 0).getTime();
				return rightTime - leftTime;
			}),
		[resumes]
	);

	function updateField(event) {
		const { name, value } = event.target;
		setForm((currentForm) => ({ ...currentForm, [name]: value }));
	}

	async function handleSaveResume(event) {
		event.preventDefault();
		const name = form.name.trim();
		const fileUrl = form.fileUrl.trim();

		if (!name || !fileUrl) {
			setError("Both name and link are required.");
			setMessage("");
			return;
		}

		try {
			setIsSaving(true);
			setError("");
			setMessage("");

			const response = await fetch("/api/resumes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, fileUrl }),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data?.error || "Failed to save resume.");

			setResumes((currentResumes) => [data, ...currentResumes]);
			setForm(initialFormState);
			setMessage("Resume variant saved.");
		} catch (saveError) {
			setError(saveError.message || "Failed to save resume.");
		} finally {
			setIsSaving(false);
		}
	}

	async function handleDeleteResume(id) {
		try {
			setError("");
			setMessage("");
			const response = await fetch(`/api/resumes/${encodeURIComponent(id)}`, { method: "DELETE" });
			
			const data = await response.json();
			if (!response.ok) throw new Error(data?.error || "Failed to delete resume.");

			setResumes((currentResumes) => currentResumes.filter((resume) => resume.id !== id));
			setMessage("Resume deleted.");
		} catch (deleteError) {
			setError(deleteError.message || "Failed to delete resume.");
		}
	}

	return {
		resumes: sortedResumes,
		form,
		isLoading,
		isSaving,
		message,
		error,
		updateField,
		handleSaveResume,
		handleDeleteResume,
	};
}