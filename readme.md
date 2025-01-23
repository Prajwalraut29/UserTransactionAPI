# User Transaction System

A Node.js application featuring a modular architecture for efficient user and transaction management through RESTful APIs.

## Features

- **User Management**: Retrieve users by ID.
- **Transaction Filtering**: Filter transactions by status, type, and date range.
- **Pagination Support**: Handle large datasets with ease.
- **MongoDB Integration**: Utilize the aggregation framework for advanced queries.
- **CORS Support**: Enable secure cross-origin requests.
- **Environment-Based Configuration**: Easily manage different environments.
- **Comprehensive Error Handling**: Standardized error responses for better debugging.

## Tech Stack

- **Node.js**
- **MongoDB**
- **Express.js**
- **Mongoose**

## API Documentation

Explore the complete API collection in Postman:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/galactic-comet-410662/prajwal-developing/collection/xz5uo43/orbit-wallet-api)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

Follow these steps to set up the project:

1. Clone the repository:
    ```
    git clone orbit-wallet-assignment
    ```

2. Install dependencies:
    ```
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```
    PORT=5000
    MONGODB_URI=uri
    ```

4. Start the server:
    ```
    node index.js
    ```


## Security

The following security measures are implemented:
- CORS enabled for secure cross-origin requests.
- Environment-based configuration to manage sensitive data.
- Input validation to prevent malicious data entry.
- Error sanitization to avoid leaking sensitive information.


## Contact

For any queries or support, please contact:
- Email: [rautprajwal36@gmail.com](mailto:rautprajwal36@gmail.com)
