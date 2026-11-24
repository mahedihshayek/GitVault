import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import { Star, FolderGit2, LockKeyhole, Eye, ExternalLink } from "lucide-react";
import "./starredRepository.css";

const API_URL = "http://localhost:3002";

const StarredRepositories = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchStarredRepositories = async () => {
      setLoading(true);
      setError("");

      try {
        const savedIds = JSON.parse(
          localStorage.getItem(`starredRepositories_${userId}`) || "[]",
        );

        if (!userId || !Array.isArray(savedIds) || savedIds.length === 0) {
          if (isMounted) setRepositories([]);
          return;
        }

        const results = await Promise.all(
          savedIds.map(async (repoId) => {
            try {
              const response = await axios.get(`${API_URL}/repo/${repoId}`);
              return Array.isArray(response.data)
                ? response.data[0]
                : response.data;
            } catch (err) {
              console.error(`Could not fetch repository ${repoId}:`, err);
              return null;
            }
          }),
        );

        if (isMounted) {
          setRepositories(results.filter(Boolean));
        }
      } catch (err) {
        console.error("Could not load starred repositories:", err);
        if (isMounted) {
          setError("Could not load starred repositories.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStarredRepositories();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return (
    <>
      <Navbar />

      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item
          as="button"
          onClick={() => navigate("/profile")}
          icon={BookIcon}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          as="button"
          onClick={() => navigate("/repo")}
          aria-current="page"
          icon={RepoIcon}
        >
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      <main className="starred-page">
        <section className="starred-page-content">
          <header className="starred-page-heading">
            <div>
              <h1>Starred repositories</h1>
              <p>Repositories you've starred</p>
            </div>

            <span className="starred-page-count">
              <Star size={16} fill="currentColor" />
              {repositories.length}
            </span>
          </header>

          {loading && (
            <p className="starred-page-message">
              Loading starred repositories...
            </p>
          )}

          {!loading && error && (
            <p className="starred-page-message starred-page-error">{error}</p>
          )}

          {!loading && !error && repositories.length === 0 && (
            <div className="starred-page-empty">
              <Star size={32} />
              <h2>No starred repositories</h2>
              <p>Repositories you star will appear here.</p>
            </div>
          )}

          {!loading && !error && repositories.length > 0 && (
            <div className="starred-page-list">
              {repositories.map((repo) => {
                const ownerName =
                  typeof repo.owner === "object"
                    ? repo.owner?.username ||
                      repo.owner?.name ||
                      "Unknown owner"
                    : repo.owner || "Unknown owner";

                return (
                  <article
                    className="starred-page-card"
                    key={repo._id}
                    onClick={() => navigate(`/repo/${repo._id}`)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/repo/${repo._id}`);
                      }
                    }}
                  >
                    <div className="starred-page-card-top">
                      <div className="starred-page-repo-name">
                        <FolderGit2 size={18} />
                        <h2>{repo.name}</h2>
                      </div>

                      <span className="starred-page-visibility">
                        {repo.visibility ? (
                          <>
                            <Eye size={13} />
                            Public
                          </>
                        ) : (
                          <>
                            <LockKeyhole size={13} />
                            Private
                          </>
                        )}
                      </span>
                    </div>

                    <p className="starred-page-description">
                      {repo.description || "No description provided."}
                    </p>

                    <footer className="starred-page-card-footer">
                      <span>Owner: {ownerName}</span>
                      <ExternalLink size={15} />
                    </footer>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default StarredRepositories;
