import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Plus,
  BookMarked,
  GitFork,
  CalendarDays,
  FolderGit2,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Navbar from "../Navbar.jsx";
import "./dashboard.css";

const REPOSITORIES_PER_PAGE = 4;

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setError("Please log in to view your repositories.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://3.107.97.4:3002/repo/all");

        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const data = await response.json();

        const allRepositories = Array.isArray(data)
          ? data
          : data?.repositories || [];

        setSuggestedRepositories(allRepositories);

        const myRepositories = allRepositories.filter((repo) => {
          const ownerId =
            typeof repo.owner === "object" ? repo.owner?._id : repo.owner;

          return String(ownerId) === String(userId);
        });

        setRepositories(myRepositories);
      } catch (err) {
        console.error("Error fetching repositories:", err);
        setError("Failed to load repositories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  //search repo
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? suggestedRepositories.filter((repo) => {
        const isPublic = repo.visibility === true;
        const name = repo.name?.toLowerCase() || "";
        const description = repo.description?.toLowerCase() || "";

        return (
          isPublic &&
          (name.includes(normalizedQuery) ||
            description.includes(normalizedQuery))
        );
      })
    : repositories;

  const totalPages = Math.ceil(searchResults.length / REPOSITORIES_PER_PAGE);
  const startIndex = (currentPage - 1) * REPOSITORIES_PER_PAGE;
  const currentRepositories = searchResults.slice(
    startIndex,
    startIndex + REPOSITORIES_PER_PAGE,
  );

  const totalRepositories = repositories.length;
  const publicRepositories = repositories.filter(
    (repo) => repo.visibility === true,
  ).length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />

      <section className="dashboard">
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1>Your Repositories</h1>
              <p>Manage and explore your projects.</p>
            </div>

            <Link to="/create" className="create-btn">
              <Plus size={18} />
              New Repository
            </Link>
          </div>

          {/* Stats */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <FolderGit2 size={21} />

              <div>
                <h3>{totalRepositories}</h3>
                <p>Total Repositories</p>
              </div>
            </div>

            <div className="stat-card">
              <BookMarked size={21} />

              <div>
                <h3>{publicRepositories}</h3>
                <p>Public Repositories</p>
              </div>
            </div>
          </div>

          <div className="repository-toolbar">
            <h2>All Repositories</h2>

            <div className="search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder="Find a repository..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="repository-list">
            {loading ? (
              <p className="dashboard-message">Loading repositories...</p>
            ) : error ? (
              <p className="dashboard-message error">{error}</p>
            ) : searchResults.length > 0 ? (
              <>
                {currentRepositories.map((repo) => (
                  <div className="repository-card" key={repo._id}>
                    <div className="repo-icon">
                      <FolderGit2 size={21} />
                    </div>

                    <div className="repo-details">
                      <Link to={`/repo/${repo._id}`} className="repo-name">
                        {repo.name}
                      </Link>

                      <p>{repo.description || "No description provided."}</p>

                      <div className="repo-meta">
                        <span>
                          <GitFork size={14} />
                          Repository
                        </span>

                        <span>
                          <Clock size={14} />
                          {repo.updatedAt
                            ? new Date(repo.updatedAt).toLocaleDateString()
                            : "Recently created"}
                        </span>
                      </div>
                    </div>

                    <span className="repo-visibility">
                      {repo.visibility === true ? "Public" : "Private"}
                    </span>
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="repository-pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={17} />
                      Previous
                    </button>

                    <div className="pagination-pages">
                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1,
                      ).map((page) => (
                        <button
                          key={page}
                          className={`pagination-page ${
                            currentPage === page ? "active" : ""
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight size={17} />
                    </button>
                  </div>
                )}

                <p className="pagination-info">
                  Showing {startIndex + 1}–
                  {Math.min(
                    startIndex + REPOSITORIES_PER_PAGE,
                    searchResults.length,
                  )}{" "}
                  of {searchResults.length} repositories
                </p>
              </>
            ) : (
              <div className="empty-state">
                <FolderGit2 size={40} />

                <h3>No repositories found</h3>

                <p>
                  {searchQuery
                    ? "Try searching with another name."
                    : "You haven't created any repositories yet."}
                </p>

                {!searchQuery && (
                  <Link to="/create" className="create-btn">
                    <Plus size={17} />
                    Create Repository
                  </Link>
                )}
              </div>
            )}
          </div>
        </main>

        <aside className="dashboard-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-heading">
              <h3>Explore Repositories</h3>
              <BookMarked size={18} />
            </div>

            {suggestedRepositories.length > 0 ? (
              suggestedRepositories.slice(0, 5).map((repo) => (
                <div className="suggested-repo" key={repo._id}>
                  <FolderGit2 size={17} />

                  <div>
                    <Link to={`/repo/${repo._id}`}>{repo.name}</Link>

                    <p>{repo.description || "No description"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="sidebar-empty">No repositories to explore.</p>
            )}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-heading">
              <h3>Upcoming Events</h3>
              <CalendarDays size={18} />
            </div>

            <div className="event-item">
              <div className="event-date">
                <span>JAN</span>
                <strong>02</strong>
              </div>

              <div>
                <h4>Tech Conference</h4>
                <p>Developer community</p>
              </div>
            </div>

            <div className="event-item">
              <div className="event-date">
                <span>JAN</span>
                <strong>10</strong>
              </div>

              <div>
                <h4>Developer Meetup</h4>
                <p>Community event</p>
              </div>
            </div>

            <div className="event-item">
              <div className="event-date">
                <span>JAN</span>
                <strong>15</strong>
              </div>

              <div>
                <h4>React Summit</h4>
                <p>Frontend community</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
