# **App Name**: AuthFlow

## Core Features:

- Login Form: User login form that posts data to the `https://gestor-documentos-590447208783.us-central1.run.app/api/auth/login` endpoint, using Nextjs.
- Welcome Display: Display welcome message with the user's name and role upon successful login.
- Token Storage: Store the authentication token in local storage or a cookie after login.
- Notification Icon: Include notification icon placeholder in header.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) to evoke a sense of trust and security, inspired by the professional context of document management.
- Background color: Light gray (#F0F2F5) to provide a clean, unobtrusive backdrop that ensures readability and focus.
- Accent color: Electric purple (#8E24AA) to add a touch of modernity and highlight key interactive elements.
- Body and headline font: 'Inter' (sans-serif) for a clean, modern, and highly readable user interface.
- Use simple, clear icons for notifications. Consider using a consistent style from a library like Material Design Icons.
- Implement a clean, structured layout. The login form should be centered on the page, easily accessible and user-friendly.
- Incorporate subtle animations on login success, such as a smooth transition to the dashboard.