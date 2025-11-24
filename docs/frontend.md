# Frontend Documentation

This document provides a detailed overview of the frontend architecture and implementation of ModbusX. The frontend is built with React, TypeScript, and TailwindCSS, offering a modern and responsive user interface for managing Modbus connections.

---

## UI Structure

The frontend is structured to provide a clean and intuitive user experience. The main components of the UI include:

1. **Connection Manager**:

   - Allows users to add, edit, and manage Modbus TCP and RTU connections.
   - Displays the status of each connection (e.g., connected, disconnected).

2. **Data Viewer**:

   - Displays real-time data from Modbus devices.
   - Supports both tabular and graphical views.

3. **Settings Page**:
   - Enables users to configure application-wide settings.
   - Includes options for themes, logging levels, and default connection parameters.

---

## Key Components

### 1. **Reusable UI Components**

Located in `src/components/ui`, these components are designed for reusability and consistency across the application. Examples include:

- **Button**: Standardized button styles and behaviors.
- **Dialog**: Modal dialogs for user interactions.
- **Tabs**: Tabbed navigation for organizing content.

### 2. **Page-Specific Components**

Located in `src/windows`, these components are tailored for specific pages:

- **Add Connection Page**: UI for adding new Modbus connections.
- **Settings Page**: UI for managing application settings.

### 3. **Global State Management**

The application uses `zustand` for managing global state. Key states include:

- **Connection State**: Tracks the status of Modbus connections.
- **Settings State**: Stores user preferences and application configurations.

---

## Event Handling

The frontend uses React's event handling system to manage user interactions. Key events include:

- **Connection Events**:
  - Triggered when a user adds, edits, or removes a connection.
  - Updates the global connection state and communicates with the backend.
- **Data Fetching Events**:
  - Triggered when a user requests data from a Modbus device.
  - Sends a command to the backend and updates the UI with the response.

---

## Connection Workflow

The workflow for managing Modbus connections is as follows:

1. **Add Connection**:

   - The user navigates to the "Add Connection" page.
   - The form collects connection details (e.g., IP address, port, or serial settings).
   - The frontend sends the connection details to the backend via a Tauri command.

2. **Establish Connection**:

   - The backend attempts to establish the connection.
   - The frontend updates the connection status based on the backend's response.

3. **Read/Write Operations**:

   - The user selects a connected device and initiates a read or write operation.
   - The frontend sends the operation details to the backend.
   - The backend processes the request and returns the result to the frontend.

4. **Disconnect**:
   - The user disconnects from the device.
   - The frontend updates the connection status and removes the device from the active list.

---

This document serves as a reference for developers working on the frontend of ModbusX. For further questions or contributions, refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file.
