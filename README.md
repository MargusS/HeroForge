# TaskList – Jira Forge App

**TaskList** is a [Atlassian Forge](https://developer.atlassian.com/platform/forge/) application that allows you to query and export Jira worklogs, filtering by key criteria such as project, date range, billing type, and SOW.

---

## 🚀 Main Features

- Search issues with worklogs by project and date range.
- Additional filters: billing type, team, and SOW.
- Grouped view of worklogs by day.
- Export results to CSV.
- Quick date presets: "Current month", "Previous month".

---

## 📁 Project Structure

```
src/
├── frontend/
│   ├── components/
│   │   ├── mainForm/
│   │   │   ├── filters/         # Filters like SOW, billing type, date pickers
│   │   │   └── MainForm.jsx     # Main form
│   │   └── taskList/            # Task grouping and rendering
│   ├── context/
│   │   └── SearchContext.jsx    # Global state for filters and tasks
│   ├── hooks/
│   │   └── useSearchTasks.jsx   # Batch search logic
│   └── App.jsx / ProviderApp.jsx
│
├── resolvers/
│   ├── mainForm/
│   │   ├── getProjects.js
│   │   ├── getSowsByProject.js
│   │   ├── getBillingTypes.js
│   │   └── getIssuesWithRecentWorklogsBatch.js
│   └── index.js
```

---

## 🧪 Requirements & Run

### 🔧 Requirements

- Node.js LTS
- Atlassian Forge CLI (`npm install -g @forge/cli`)
- Jira admin permissions (to install and authorize scopes)

### ▶️ Run locally

```bash
forge tunnel
```

---

## 🛠️ Used Scopes

```yaml
permissions:
  scopes:
    - read:jira-work
    - read:jira-user
    - manage:jira-configuration
```

> `manage:jira-configuration` is used to dynamically retrieve options for the billing type custom field.

---

## 🧩 Additional Notes

- Date filters use two `DatePicker` fields with quick preset buttons.
- Issues are retrieved in batches to avoid API limits.
- CSV files include the selected date range in the filename.

---

## 📤 CSV Export

The export button becomes available once search results are loaded.  
The file will be named based on the date range: `worklogs_YYYY-MM-DD_to_YYYY-MM-DD.csv`.

---

## ⚙️ Setup and Usage

### 1. Clone the repository

```bash
git clone https://github.com/your-org/tasklist-forge.git
cd tasklist-forge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development tunnel

```bash
forge tunnel
```

This allows live testing connected to your Jira Cloud instance.

### 4. Deploy to development or production

```bash
forge deploy --environment development
```

### 5. Install the app in your Jira instance

```bash
forge install --upgrade
```

---

## 🙌 Credits

Developed by Agustin Marani.
