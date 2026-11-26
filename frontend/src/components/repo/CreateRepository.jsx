import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@primer/react";
import "./createRepository.css";

const CreateRepository = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleCreateRepository = async (e) => {
    e.preventDefault();

    const owner = localStorage.getItem("userId");

    if (!owner) {
      setError("Please sign in before creating a repository.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("https://d2curktorzax0x.cloudfront.net/repo/create", {
        owner,
        name: name.trim(),
        description: description.trim(),
        visibility,
        content: [],
        issues: [],
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          err.response?.data ||
          "Could not create repository. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-repo-page">
      <div className="create-repo-header">
        <div>
          <h1>Create a new repository</h1>
          <p>A repository contains your project files and their history.</p>
        </div>
        <Link to="/" className="create-repo-cancel">
          Cancel
        </Link>
      </div>

      <form className="create-repo-form" onSubmit={handleCreateRepository}>
        <div className="create-repo-field">
          <label htmlFor="repo-name">Repository name</label>
          <input
            id="repo-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-project"
            required
            maxLength={100}
          />
          <small>Choose a short, memorable name for your repository.</small>
        </div>

        <div className="create-repo-field">
          <label htmlFor="repo-description">Description</label>
          <textarea
            id="repo-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this repository for?"
            rows={4}
            maxLength={350}
          />
        </div>

        <fieldset className="create-repo-visibility">
          <legend>Visibility</legend>

          <label>
            <input
              type="radio"
              name="visibility"
              checked={visibility === true}
              onChange={() => setVisibility(true)}
            />
            <span>
              <strong>Public</strong>
              <small>Anyone can see this repository.</small>
            </span>
          </label>

          <label>
            <input
              type="radio"
              name="visibility"
              checked={visibility === false}
              onChange={() => setVisibility(false)}
            />
            <span>
              <strong>Private</strong>
              <small>Only you should be able to see this repository.</small>
            </span>
          </label>
        </fieldset>

        {error && <p className="create-repo-error">{error}</p>}

        <div className="create-repo-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !name.trim()}
          >
            {loading ? "Creating..." : "Create repository"}
          </Button>
        </div>
      </form>
    </main>
  );
};

export default CreateRepository;
