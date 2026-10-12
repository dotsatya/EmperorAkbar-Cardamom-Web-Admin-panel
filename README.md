# 🌿 Emperor Akbar Cardamom — Admin Panel & CMS Suite

A modern, high-performance web administration suite and client-side Content Management System (CMS) designed for the **Emperor Akbar Green Cardamom** e-commerce platform.

Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **TypeScript**, styled in a luxury aesthetic featuring deep cardamom emerald and imperial gold accents, with full dark/light theme support.

---

## ✨ Features & Capabilities

### 1. 📊 Executive Dashboard
* **Real-time Business Metrics**: Overview of total sales revenue, order fulfillment status, active grades in inventory, and published content totals.
* **Recent Orders Stream**: Live snapshot of incoming customer purchases with direct status indicators and buyer information.
* **Quick Navigation**: Instant one-click shortcuts to catalog, recipe, and article management.

### 2. 🛍️ Products & Cardamom Grades CMS
* **Grade Management**: Manage pod sizes and grades including **Purple Grade (8 mm & above)**, **Pink Grade (7.5 mm & above)**, **Green Grade (7–8 mm)**, **Orange Grade**, and more.
* **Pricing & Inventory Control**: Real-time pricing, promotional discounts, weight options (50g, 100g, 250g, 500g), stock toggles, and promotional badges (*Sale*, *Bestseller*, *Sold Out*).
* **Rich Metadata**: Edit harvest origins, moisture percentages, aroma-lock notes, and product imagery.

### 3. 📦 Customer Orders Management
* **Order Tracking**: Inspect customer details, contact numbers, shipping addresses, ordered items, and payment methods.
* **Lifecycle Workflow**: Update order status across 5 fulfillment stages:
  * `Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered` (or `Cancelled`).
* **Search & Filter**: Search by Order ID, customer name, email, phone, or city, with status filtering.

### 4. 🍽️ Gourmet Recipes CMS
* **Culinary Archive**: Manage collaborative recipes featuring Alleppey green cardamom.
* **Detailed Recipe Builder**: Configure recipe titles, chef author, category, difficulty, prep time, cook time, and serving sizes.
* **Structured Data**: Multi-group ingredient lists and step-by-step preparation instructions.

### 5. 📰 Articles & News (Blogs CMS)
* **Knowledge Hub**: Publish and edit cardamom market analysis, crop outlook reports, buying guides, and GI origin articles.
* **Content Studio**: Edit introductory copy, section headings, paragraph blocks, author tags, and video integrations.

### 6. 🔬 Quality Grading Visualizer
* Edit pod size benchmarks and physical grading specifications used across Emperor Akbar's sorting facilities.

### 7. 🩺 Doctor of Spices (Health Topics)
* Curate scientifically backed and Ayurvedic health benefits of green cardamom (digestive health, antioxidants, respiratory wellness, oral care).

### 8. ❓ FAQ Knowledge Base
* Organize customer support questions into categorized accordions (Product & Quality, Packaging & Storage, Shipping & Orders).

### 9. ⚙️ Global Site & Hero Settings
* Configure the top announcement bar text and toggle visibility.
* Update storefront hero headlines, taglines, description, and brand chef quotes.
* Update customer care contact details (phone, email, office address, WhatsApp) and social links.
* Change administrative security credentials.

### 10. 💾 Backup & Data Resilience
* **Export Snapshot**: One-click download of the complete website data and configuration in clean JSON format.
* **Restore Snapshot**: Upload a JSON backup file to instantly restore or migrate data.
* **Factory Reset**: Revert the CMS to default catalog and settings from `websiteData.ts`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS Variables |
| **Component Primitives** | Base UI / Shadcn UI primitives |
| **Icons** | [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) |
| **State & Persistence** | Browser `localStorage` with reactive custom DOM events |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v20.x or higher recommended)
* **npm**, **pnpm**, or **yarn**

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd emperorakbar-web-admin-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

## 🔐 Admin Authentication

The panel is protected with client-side authentication persisted in local session storage:

* **Default Username**: `admin`
* **Default Password**: `akbar@admin2026`

> **Tip**: Password can be changed at any time under **Site & Hero Settings** ➔ **Security & Access Credentials**.

---

## 📁 Project Structure

```
emperorakbar-web-admin-panel/
├── app/
│   ├── dashboard/          # Shadcn starter metrics demo page
│   ├── favicon.ico
│   ├── globals.css         # Theme tokens & Tailwind CSS v4 definitions
│   ├── layout.tsx          # Root HTML layout with ThemeProvider & Tooltips
│   └── page.tsx            # Main Emperor Akbar Admin Suite entry point
├── components/
│   ├── admin/
│   │   ├── AdminLogin.tsx  # Authentication modal with credential validation
│   │   ├── ThemeToggle/    # Luxury dark/light theme switch
│   │   └── views/          # Admin view modules
│   │       ├── BackupView.tsx
│   │       ├── BlogsView.tsx
│   │       ├── DashboardView.tsx
│   │       ├── FaqsView.tsx
│   │       ├── GradingView.tsx
│   │       ├── HealthView.tsx
│   │       ├── OrdersView.tsx
│   │       ├── ProductsView.tsx
│   │       ├── RecipesView.tsx
│   │       └── SettingsView.tsx
│   ├── app-sidebar.tsx     # Main collapsible navigation sidebar
│   ├── nav-user.tsx        # User profile popover & sign-out control
│   ├── site-header.tsx     # Breadcrumb navigation & mobile sidebar trigger
│   ├── theme-provider.tsx  # Dark / Light theme context provider
│   └── ui/                 # Reusable UI component library (buttons, dialogs, etc.)
├── data/
│   └── websiteData.ts      # Master seed data for cardamom products, recipes & articles
├── hooks/
│   └── use-mobile.ts       # Responsive viewport hook
├── lib/
│   ├── adminStore.ts       # CMS state management, orders store & export/import utilities
│   └── utils.ts            # ClassName merging utilities
├── public/                 # Optimized images, cardamom assets & icons
├── package.json
└── tsconfig.json
```

---

## 📜 Available Scripts

* **`npm run dev`**: Starts the local development server with Turbopack on `localhost:3000`.
* **`npm run build`**: Type-checks and builds the production bundle.
* **`npm run start`**: Starts the production Next.js server.
* **`npm run lint`**: Runs ESLint with Next.js and TypeScript configurations.

---

## 📄 License & Attribution

Designed and developed for **Emperor Akbar Cardamom** (Samex India Pvt. Ltd.) as part of the Web Redesign Initiative by CodeWarrior Technologies. All rights reserved.
