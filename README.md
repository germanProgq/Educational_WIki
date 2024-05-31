# Wiki_Area

Wiki_Area is an educational platform designed for teachers in Russia to create projects and for students to contribute to those projects and complete assignments. The platform provides a smooth and engaging user experience with a sleek interface and advanced security features.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Authentication:** Secure login and registration with hashed passwords.
- **Role-Based Access:** Custom paths and permissions for teachers, admins, and owners.
- **Project Management:** Teachers can create projects, and students can add content and complete assignments.
- **Smooth Interface:** Designed with multiple SVGs and a matching color palette for a cohesive look.
- **Animated Page Transitions:** Utilizes the Swiper library and animated page switches for a seamless experience.
- **Admin Panel:** Manage users and settings with a dedicated admin panel.
- **Profile Settings:** Users can set their full name, change their email, login, and password.
- **Image Uploads:** Custom image uploads using Multer.
- **Advanced Security:** Comprehensive security measures implemented on both frontend and backend.

## Installation

### Prerequisites

- Node.js
- PostgreSQL
- Git

### Backend Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/germanProgq/Wiki_Area.git
    cd Wiki_Area/backend
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Configure environment variables:

    Create a `.env` file in the `backend` directory with the following variables:

    ```sh
    DATABASE_URL=your_database_url
    JWT_SECRET=your_jwt_secret
    JWT_REFRESH_KEY=your_jwt_refresh

    ```

4. Start the backend server:

    ```sh
    npm start
    ```

### Frontend Setup

1. Navigate to the frontend directory:

    ```sh
    cd ../frontend
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the frontend development server:

    ```sh
    npm start
    ```

## Usage

1. **Login:** Users can log in with their credentials.
2. **Dashboard:** Teachers can create and manage projects.
3. **Assignments:** Students can view and complete assignments.
4. **Admin Panel:** Admins can manage users and settings.
5. **Profile Settings:** Users can update their profile information.

## Contributing

We welcome contributions from the community. To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request.

Please ensure your code adheres to our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For support or inquiries, please contact us at girshvinok@gmail.com
