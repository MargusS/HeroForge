# TaskList – Jira Forge App

**TaskList** es una aplicación desarrollada con [Atlassian Forge](https://developer.atlassian.com/platform/forge/) que permite consultar y exportar los partes de trabajo (worklogs) de Jira, filtrando por distintos criterios clave como proyecto, fechas, tipo de facturación o SOW.

---

## 🚀 Funcionalidades principales

- Búsqueda de tareas con worklogs por proyecto y rango de fechas.
- Filtros adicionales: tipo de facturación, equipo y SOW.
- Visualización agrupada por día.
- Exportación de los resultados a CSV.
- Presets rápidos de fecha: "Mes actual", "Mes anterior".

---

## 📁 Estructura del proyecto

```
src/
├── frontend/
│   ├── components/
│   │   ├── mainForm/
│   │   │   ├── filters/         # Filtros como SOW, tipo de facturación, fechas
│   │   │   └── MainForm.jsx     # Formulario principal
│   │   └── taskList/            # Lista y agrupación de tareas
│   ├── context/
│   │   └── SearchContext.jsx    # Estado global para filtros y resultados
│   ├── hooks/
│   │   └── useSearchTasks.jsx   # Lógica de búsqueda en lotes
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

## 🧪 Requisitos y ejecución

### 🔧 Requisitos

- Node.js LTS
- Atlassian Forge CLI (`npm install -g @forge/cli`)
- Permisos de admin en tu instancia de Jira (para instalación y scopes)

### ▶️ Ejecutar localmente

```bash
forge tunnel
```

---

## 🛠️ Scopes utilizados

```yaml
permissions:
  scopes:
    - read:jira-work
    - read:jira-user
    - manage:jira-configuration
```

> `manage:jira-configuration` se usa para recuperar dinámicamente las opciones del campo personalizado de tipo de facturación.

---

## 🧩 Notas adicionales

- Los filtros de fecha se gestionan con `DatePicker` y botones de presets.
- Los datos se recuperan en lotes (`batching`) para evitar límites del API.
- El CSV se genera con los datos visibles y usa el rango de fechas como nombre.

---

## 📤 Exportación CSV

El botón de exportación aparece tras realizar la búsqueda si hay resultados. El nombre del archivo incluye el rango de fechas (`fromDate_to_toDate.csv`).

---

## 🙌 Créditos

Desarrollado por el equipo interno de BitBox.

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

This allows you to test the app live in your connected Jira Cloud instance.

### 4. Deploy to development or production

```bash
forge deploy --environment development
```

### 5. Install the app in your Jira instance

```bash
forge install --upgrade
```
