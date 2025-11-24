# Backend Documentation

This document provides a detailed overview of the backend architecture and implementation of ModbusX. The backend is built with Rust and Tauri, designed to handle Modbus TCP and RTU connections efficiently while ensuring reliability and scalability.

---

## Architecture Overview

The backend of ModbusX is structured around the following principles:

- **Modularity**: Each component is designed to handle a specific responsibility, making the codebase easier to maintain and extend.
- **Asynchronous Programming**: Leveraging Rust's `tokio` runtime for non-blocking I/O operations, ensuring high performance and responsiveness.
- **Error Resilience**: Comprehensive error handling to ensure the application remains stable under various conditions.

### Key Components

1. **Connection Manager**:

   - Handles the lifecycle of Modbus connections (TCP and RTU).
   - Manages multiple simultaneous connections.
   - Ensures thread-safe operations using `tokio` and `async-trait`.

2. **Command Processor**:

   - Processes read and write requests from the frontend.
   - Validates and translates commands into Modbus protocol operations.

3. **Error Handler**:

   - Centralized error handling for connection issues, timeouts, and invalid requests.
   - Provides detailed error messages to the frontend for better debugging.


## Error Handling

The backend employs the `thiserror` crate for structured error handling. Common error scenarios include:

- **Connection Errors**:

  - TCP: Unable to connect to the server, connection refused, or timeout.
  - RTU: Serial port not found or misconfigured.

- **Protocol Errors**:

  - Invalid Modbus requests or responses.
  - CRC (Cyclic Redundancy Check) failures in RTU communication.

- **Runtime Errors**:
  - Unexpected panics or resource exhaustion.

---

This document serves as a reference for developers working on the backend of ModbusX. For further questions or contributions, refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file.
