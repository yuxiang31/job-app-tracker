import { useState, useEffect, useRef } from "react";
import { normalizeApplication } from "../app/applications/utils";

export function useApplicationData() {
    const [applications, setApplications] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const notificationTimeoutRef = useRef(null);

    useEffect(() => {
        let isActive = true;

        async function loadApplications() {
            try {
                setIsLoading(true);

                const [applicationsResponse, resumesResponse] = await Promise.all([
                    fetch("/api/applications", { cache: "no-store" }),
                    fetch("/api/resumes", { cache: "no-store" }),
                ]);

                if (!applicationsResponse.ok) throw new Error("Failed to load applications.");
                if (!resumesResponse.ok) throw new Error("Failed to load resumes.");

                const [applicationRows, resumeRows] = await Promise.all([
                    applicationsResponse.json(),
                    resumesResponse.json(),
                ]);

                if (!isActive) return;

                const nextApplications = Array.isArray(applicationRows)
                    ? applicationRows.map(normalizeApplication)
                    : [];

                setApplications(nextApplications);
                setResumes(Array.isArray(resumeRows) ? resumeRows : []);
            } catch (error) {
                if (!isActive) return;

                setApplications([]);
                setResumes([]);
                setNotification({
                    type: "error",
                    message: error?.message || "Failed to load application data.",
                });
            } finally {
                if (isActive) setIsLoading(false);
            }
        }

        loadApplications();

        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        if (!notification) return undefined;

        notificationTimeoutRef.current = setTimeout(() => {
            setNotification(null);
        }, 4000);

        return () => {
            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
                notificationTimeoutRef.current = null;
            }
        };
    }, [notification]);

    return {
        applications, setApplications, resumes, setResumes, isLoading, notification, setNotification,
    };
}