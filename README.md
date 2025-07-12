Here’s a clean, professional, and self-explanatory `README.md` for your project:

---

````markdown
# 💍 Barkat – A Relationship Readiness Questionnaire App

Barkat is a modern, full-stack web application built with **Next.js** and **Tailwind CSS** to help couples explore compatibility through a thoughtfully crafted questionnaire. It supports OTP-based user verification, partner invitations, and AI-driven analysis to generate insightful relationship reports.

---

## 🧩 Features

- ✅ **OTP Verification** via Google SMTP for secure registration
- ✉️ **Partner Link Sharing** with token-based access
- 👥 **Two User Workflow** – One `inviteId`, two unique users
- 📋 **60+ Curated Questions** categorized across key relationship themes
- 🧠 **AI-Powered Report Generation** using Gemini LLM
- 🎨 Beautiful UI with **Tailwind CSS** and **Lucide React** icons
- 🧠 Interactive UI animations with **Framer Motion**
- 🗃️ Data persistence via **MySQL** (SQL2)
- 🔐 Secure test tokens and response tracking

---

## ⚙️ Tech Stack

| Frontend  | Backend   | Database | Other Libraries         |
|-----------|-----------|----------|--------------------------|
| Next.js   | Node.js   | MySQL    | Tailwind CSS, Lucide React, Framer Motion |
|           |           |          | SQL2 (MySQL client), Gemini LLM Wrapper   |

---

## 🔐 SMTP Setup

- Google SMTP is used to:
  - Send OTP for verification during registration
  - Email personalized links to invited partners

Make sure to set up Google App Passwords (or OAuth2 if required) for secure SMTP access.

---

## 🛠️ Database Schema

### Database: `barkat_app`

```sql
CREATE DATABASE barkat_app;
USE barkat_app;
````

### Tables

#### `invites`

| Column       | Type         | Description                     |
| ------------ | ------------ | ------------------------------- |
| id           | INT (PK)     | Unique invite ID                |
| yourName     | VARCHAR(100) | First user’s name               |
| yourEmail    | VARCHAR(100) | First user’s email              |
| partnerName  | VARCHAR(100) | Invited partner’s name          |
| partnerEmail | VARCHAR(100) | Invited partner’s email         |
| otp          | VARCHAR(10)  | OTP for verification            |
| expiresAt    | BIGINT       | OTP expiration timestamp        |
| test\_token  | VARCHAR(64)  | Unique token for partner access |
| createdAt    | TIMESTAMP    | Invite creation time            |

#### `users`

| Column | Type         | Description    |
| ------ | ------------ | -------------- |
| id     | INT (PK)     | Unique user ID |
| name   | VARCHAR(100) | User name      |
| email  | VARCHAR(100) | Must be unique |

#### `responses`

| Column           | Type         | Description                     |
| ---------------- | ------------ | ------------------------------- |
| id               | INT (PK)     | Response ID                     |
| invite\_id       | INT (FK)     | References `invites(id)`        |
| user\_id         | INT (FK)     | References `users(id)`          |
| question\_number | INT          | Question index                  |
| answer           | TEXT         | User's answer                   |
| type             | VARCHAR(10)  | e.g. 'text' or 'option'         |
| selected\_option | VARCHAR(255) | For multiple-choice answers     |
| submitted\_at    | TIMESTAMP    | Auto-set on response submission |

#### `questions` & `question_options`

Questions and their corresponding answer choices are stored here.

| Table              | Purpose                                 |
| ------------------ | --------------------------------------- |
| `questions`        | Stores 60+ carefully designed questions |
| `question_options` | Stores MCQ options for each question    |

---

## 🧠 AI Integration (Gemini LLM)

* After both users submit their responses, the backend triggers a wrapper over **Gemini LLM** to:

  * Analyze answers
  * Identify alignment, differences, and red flags
  * Generate a compatibility **report** for users

---

## 🚀 Flow Overview

1. **User A signs up**, enters their & partner’s name/email
2. **OTP sent via email**, verification completes
3. **Unique test token** is generated
4. **Partner (User B)** receives link, completes registration
5. Both answer questions separately
6. Responses saved in MySQL
7. Gemini LLM processes results and **generates report**

---

## ✨ UI & Design

* Minimalist black-and-white aesthetic using Tailwind
* Icons via **Lucide React**
* Smooth transitions with **Framer Motion**
* Clean typography, form layouts, and responsive views

---

## 📦 Installation

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/barkat-app.git
cd barkat-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306   
MYSQL_USER=root
MYSQL_PASSWORD= pass
MYSQL_DATABASE=barkat_app
EMAIL_USER=em@gmail.com
EMAIL_PASS=password
GEMINI_API_KEY
```

4. **Run the app**

```bash
npm run dev
```

---

## 📂 Project Structure

```
/pages
  /api         – API routes (OTP, invite, response)
  /questionnaire – Questionnaire flow
/components    – UI components
/lib           – Utilities (mailer, Gemini wrapper)
/prisma/sql2   – SQL client setup
/styles        – Tailwind and global styles
```

---

## 🧪 Example Questions

* **Family:** "How involved should extended family be in your decisions?"
* **Finance:** "Which banking style do you prefer?"
* **Parenting:** "Do you want children? If so, how many?"
* **Beliefs:** "Role of religion in daily life?"
* **Conflict:** "Preferred conflict-resolution style?"

More than **60 questions** are preloaded into the database across major life categories.

---

## 📊 Sample SQL Commands

```sql
-- Insert a sample invite
INSERT INTO invites (yourName, yourEmail, partnerName, partnerEmail) VALUES ('Ali', 'ali@example.com', 'Sara', 'sara@example.com');

-- Sample user
INSERT INTO users (name, email) VALUES ('Ali', 'ali@example.com');

-- Sample response
INSERT INTO responses (invite_id, user_id, question_number, selected_option, answer) VALUES (1, 1, 1, 'Very involved', NULL);
```

---

## 📈 Future Enhancements

* Admin dashboard for question management
* Response comparison heatmap
* Chat-style feedback from AI
* OTP expiry reminders

---

## 🛡️ License

MIT License © 2025

---

## 🙌 Acknowledgements

* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Lucide Icons](https://lucide.dev/)
* [Framer Motion](https://www.framer.com/motion/)
* [Google SMTP](https://support.google.com/mail/answer/7126229)
* [Gemini by Google](https://deepmind.google/technologies/gemini)

---


---

Let me know if you want the README in `.md` file format or want help publishing this to GitHub.
```
