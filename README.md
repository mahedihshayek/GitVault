# GitVault

**A custom-built version control system with a web dashboard, command-line interface, and cloud-based storage.**

GitVault is a full-stack version control platform that implements its own repository and commit management workflow. It combines a web-based interface for managing repositories with a command-line interface for version control operations, including initialization, staging, committing, pushing, pulling, and reverting changes.

Built with the MERN stack and integrated with AWS infrastructure, GitVault explores the fundamentals of version control systems, backend architecture, CLI development, and cloud storage.

**Live Demo:** [Open GitVault](https://main.d3orb7l0ijekf8.amplifyapp.com/)  

---

## Features

### Repository Management
- Create and manage repositories.
- Add repository descriptions.
- Choose between public and private visibility.
- View repository details.
- Delete repositories.
- Change repository visibility.
- Star repositories and view starred repositories.

### Version Control CLI
GitVault includes a command-line interface for performing Git-inspired operations:

| Command | Description |
|---|---|
| `start` | Start the application |
| `init` | Initialize a repository |
| `add` | Add files to the staging workflow |
| `commit` | Create a commit |
| `push` | Push commits to cloud storage |
| `pull` | Retrieve commits from cloud storage |
| `revert` | Revert a previous change |

### User Dashboard
- User authentication with signup and login.
- Personalized repository dashboard.
- User profile page.
- Repository activity visualization.
- Starred repositories section.

### Cloud Storage
- Store repository commit data in Amazon S3.
- Push and pull commit data through the CLI.
- Use AWS infrastructure for backend hosting and content delivery.

---

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS
- CSS
- React Router
- Axios
- Primer React
- Lucide React
- UIW React Heat Map

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- Yargs
- AWS SDK for JavaScript

### Cloud & Deployment
- **AWS EC2** — Backend hosting
- **Amazon S3** — Cloud storage for commit data
- **Amazon CloudFront** — API delivery through a CloudFront distribution
- **AWS Amplify** — Frontend hosting
- **MongoDB Atlas** — Cloud database

### Development Tools
- Git & GitHub
- npm
- Postman
- VS Code

---

## Architecture Overview

GitVault uses a client-server architecture.

```text
                  ┌──────────────────────┐
                  │      React App       │
                  │   AWS Amplify        │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    CloudFront        │
                  │    API Delivery      │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Express Backend    │
                  │      AWS EC2         │
                  └──────┬────────┬──────┘
                         │        │
                ┌────────▼───┐ ┌──▼──────────┐
                │ MongoDB    │ │ Amazon S3   │
                │ Atlas      │ │ Commit Data │
                └────────────┘ └─────────────┘
```

The React frontend communicates with the Express backend through the CloudFront distribution. MongoDB Atlas handles application data, while Amazon S3 is used for storing commit data.

The CLI provides an additional way to interact with the version-control workflow and cloud storage.

---

## Project Structure

```text
GitVault/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── index.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── ...
│
├── .gitignore
└── README.md
```

*The directory structure above is a high-level overview; individual folders may vary as the project evolves.*

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- MongoDB connection
- AWS account and S3 bucket (for cloud storage functionality)

### 1. Clone the repository

```bash
git clone https://github.com/mahedihshayek/GitVault.git
cd GitVault
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Configure your backend environment variables in a `.env` file. You will need to provide the appropriate MongoDB connection details, AWS region, S3 bucket configuration, and authentication settings.

Start the backend:

```bash
node index.js
```

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will provide a local URL in your terminal.

> Keep credentials and environment files private. Never commit `.env` files, AWS credentials, or private keys to GitHub.

---

## Deployment

GitVault uses AWS services for its deployed infrastructure:

| Component | Service |
|---|---|
| Frontend | AWS Amplify |
| Backend | AWS EC2 |
| API delivery | Amazon CloudFront |
| Commit storage | Amazon S3 |
| Database | MongoDB Atlas |

---

## Learning Outcomes

Building GitVault involved working with:

- Full-stack application architecture.
- REST API development and integration.
- Authentication and repository ownership.
- Database modeling with MongoDB and Mongoose.
- Command-line application development.
- Cloud object storage using Amazon S3.
- AWS EC2 deployment and backend process management.
- Frontend deployment and API integration.
- Git-based development workflows.

---

## Future Improvements

- Enhanced commit history and visualization.
- More advanced branching and merging workflows.
- Improved repository collaboration.
- Pull request and code review functionality.
- More detailed repository activity tracking.

---

## Author

**Mahedi Hassan Shayek**

- GitHub: [@mahedihshayek](https://github.com/mahedihshayek)
- LinkedIn: [Connect on LinkedIn](https://www.linkedin.com/)

---

*GitVault is an independent learning and development project inspired by modern version control platforms. It is not intended to be a replacement for Git or GitHub.*
