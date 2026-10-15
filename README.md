# Maxim Agri Limited - IT Ticket Support System

A modern, responsive IT Service Desk and Ticketing System built for **Maxim Agri Limited** to streamline hardware, software, network, and access support requests across teams and branches.

---

## 🌟 Key Features

* **Employee Self-Service Portal:** Submit tickets with categories, priority levels, attachments, and descriptions.
* **Live Status Tracking:** Real-time visibility into open, in-progress, and resolved support requests.
* **IT Admin Management Board:** Kanban and list views for IT support engineers to triage, assign, and update ticket statuses.
* **Prisma ORM & SQLite Storage:** Zero-configuration local database (easily upgradeable to PostgreSQL or Cloudflare D1/Turso).
* **Network & Remote Accessibility:** Pre-configured to bind across LAN interfaces (`0.0.0.0`) and compatible with Cloudflare Tunnel for secure global remote access.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Database & ORM:** [Prisma ORM](https://www.prisma.io/) with SQLite
* **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<YOUR-USERNAME>/it_ticket_system.git
cd it_ticket_system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup the database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) (or your local IP address `http://<YOUR-IP>:4000`) in your browser.

---

## 🌐 Remote Access with Cloudflare Tunnel

To expose this system securely to remote users without port forwarding:
```bash
cloudflared tunnel --url http://localhost:4000
```
Or configure a permanent tunnel via [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) mapped to your company domain.

---

## 📂 Project Structure

```
it_ticket_system/
├── prisma/
│   └── schema.prisma         # Database schema & models
├── src/
│   ├── app/
│   │   ├── admin/            # IT Admin ticket management dashboard
│   │   ├── api/tickets/      # REST API endpoints (GET, POST, PATCH)
│   │   ├── tickets/new/      # Ticket submission form
│   │   ├── layout.js         # Root layout with sidebar navigation
│   │   └── page.js           # User dashboard & ticket statistics
│   ├── components/           # Reusable UI components
│   └── lib/prisma.js         # Prisma client singleton
├── package.json
└── README.md
```
