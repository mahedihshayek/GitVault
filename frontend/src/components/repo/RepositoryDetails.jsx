import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  EyeOff,
  FolderGit2,
  LockKeyhole,
  Star,
  Trash2,
} from "lucide-react";
import "./repositoryDetails.css";

const API_URL = "https://d2curktorzax0x.cloudfront.net";

function RepositoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  const ownerId =
    typeof repository?.owner === "object"
      ? repository.owner?._id
      : repository?.owner;

  const isOwner =
    currentUserId && ownerId && String(currentUserId) === String(ownerId);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/repo/${id}`);

        if (!response.ok) {
          throw new Error("Could not load this repository.");
        }

        const data = await response.json();
        const foundRepository = Array.isArray(data) ? data[0] : data;

        if (!foundRepository) {
          throw new Error("Repository not found.");
        }

        setRepository(foundRepository);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepository();
  }, [id]);

  // Load this user's saved star status for the current repository
  useEffect(() => {
    if (!currentUserId || !id) {
      setIsStarred(false);
      return;
    }

    try {
      const storageKey = `starredRepositories_${currentUserId}`;
      const savedStars = JSON.parse(localStorage.getItem(storageKey) || "[]");

      setIsStarred(savedStars.includes(id));
    } catch {
      setIsStarred(false);
    }
  }, [currentUserId, id]);

  // star toggle
  const handleToggleStar = () => {
    if (!currentUserId || !repository) return;

    try {
      const storageKey = `starredRepositories_${currentUserId}`;
      const savedStars = JSON.parse(localStorage.getItem(storageKey) || "[]");

      const updatedStars = isStarred
        ? savedStars.filter((repoId) => repoId !== id)
        : [...new Set([...savedStars, id])];

      localStorage.setItem(storageKey, JSON.stringify(updatedStars));
      setIsStarred(!isStarred);
    } catch {
      setError("Could not update your starred repositories.");
    }
  };
  const handleToggleVisibility = async () => {
    if (!repository || actionLoading) return;

    try {
      setActionLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/repo/toggle/${id}`, {
        method: "PATCH",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || "Could not change repository visibility.",
        );
      }

      setRepository((current) => ({
        ...current,
        ...data.repository,
      }));
    } catch (err) {
      setError(err.message || "Could not change repository visibility.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!repository || actionLoading) return;

    const confirmed = window.confirm(
      `Delete "${repository.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/repo/delete/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete repository.");
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Could not delete repository.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="repo-details-message">Loading repository...</div>;
  }

  if (error && !repository) {
    return (
      <div className="repo-details-message">
        <p>{error}</p>
        <Link to="/" className="repo-back-link">
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!repository) return null;

  const createdDate = repository.createdAt
    ? new Date(repository.createdAt).toLocaleDateString()
    : "Unknown";

  const ownerName =
    typeof repository.owner === "object"
      ? repository.owner?.username || repository.owner?.name || "Unknown owner"
      : "Unknown owner";

  return (
    <main className="repo-details-page">
      <Link to="/" className="repo-back-link">
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <section className="repo-details-card">
        <div className="repo-details-heading">
          <div className="repo-details-title">
            <span className="repo-details-icon">
              <FolderGit2 size={24} />
            </span>

            <div>
              <h1>{repository.name}</h1>
              <p>{repository.description || "No description provided."}</p>
            </div>
          </div>

          <span
            className={`repo-details-visibility ${
              repository.visibility ? "is-public" : "is-private"
            }`}
          >
            {repository.visibility ? (
              <>
                <Eye size={14} />
                Public
              </>
            ) : (
              <>
                <LockKeyhole size={14} />
                Private
              </>
            )}
          </span>

          {currentUserId && (
            <button
              type="button"
              className={`repo-star-btn ${isStarred ? "is-starred" : ""}`}
              onClick={handleToggleStar}
              aria-label={isStarred ? "Unstar repository" : "Star repository"}
              aria-pressed={isStarred}
            >
              <Star size={17} fill={isStarred ? "currentColor" : "none"} />
              {isStarred ? "Starred" : "Star"}
            </button>
          )}
        </div>

        <div className="repo-details-meta">
          <span>
            <CalendarDays size={15} />
            Created {createdDate}
          </span>

          <span>Owner: {ownerName}</span>
        </div>

        {error && <p className="repo-details-error">{error}</p>}

        {isOwner && (
          <div className="repo-details-actions">
            <button
              type="button"
              className="repo-action-btn"
              onClick={handleToggleVisibility}
              disabled={actionLoading}
            >
              {repository.visibility ? (
                <>
                  <EyeOff size={16} />
                  Make private
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Make public
                </>
              )}
            </button>

            <button
              type="button"
              className="repo-action-btn delete"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              <Trash2 size={16} />
              Delete repository
            </button>
          </div>
        )}
      </section>

      <section className="repo-details-content">
        <h2>Repository content</h2>

        {Array.isArray(repository.content) && repository.content.length > 0 ? (
          <ul>
            {repository.content.map((item, index) => (
              <li key={`${index}-${item}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="repo-details-muted">
            This repository doesn't have any content yet.
          </p>
        )}
      </section>
    </main>
  );
}

export default RepositoryDetails;
