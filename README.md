# Hotel Booking System - Frontend

## Overview
The **Hotel Booking System** frontend is a modern, responsive web application built with **React.js**, designed to streamline hotel browsing, searching, and booking. It features a sleek, user-friendly interface styled with **Tailwind CSS** and **Shadcn** components, leveraging **Redux Toolkit** for state management and **React Router** for seamless navigation. This frontend interacts with a backend API to fetch and manage hotel data, providing an engaging user experience.

## Features
- 🌍 **Browse Trending Hotels**: Explore a curated list of popular hotels worldwide.  
- 🔍 **Smart Search**: Search hotels by location or query, powered by AI-based vector retrieval.  
- 🖼️ **Hotel Visuals**: View high-quality images for each hotel.  
- ⭐ **Reviews & Ratings**: Access user reviews and ratings.  
- 💰 **Price Details**: Compare hotel prices dynamically.  
- 📍 **Location Tabs**: Filter hotels by location with interactive tabs.  
- 🛠️ **Hotel Creation**: Authenticated admins can add new hotels via a form.  
- 🔒 **Authentication**: Secure sign-in/sign-up powered by **Clerk**.
- ⭐ **Wishlist**: Users can mark hotels as favorites by clicking a star icon, adding them to their wishlist.  
- 🏨 **Hotel Details & Booking**: Clicking on a hotel navigates to a detailed page where users can:  
  - View complete hotel details.  
  - Add the hotel to their wishlist.  
  - Book a hotel by selecting the number of rooms, check-in and check-out dates, and adding special requests.  
- 📌 **My Account & Bookings**: Users can:  
  - View all their completed bookings.  
  - Cancel a booking from the **My Account** section in the navigation header.  
- ❤️ **Wishlist Access**: Users can view their favorite hotels via a heart icon in the navigation.  

## Repositories
- **Backend**: [Hotel Booking Backend Repository] (https://github.com/ZafraZiaudeen/Hotel-Booking-Back_end)

## Tech Stack
- **React.js**: Core framework for UI development.  
- **Tailwind CSS**: Utility-first CSS framework for styling.  
- **Shadcn**: Pre-built, customizable UI components.  
- **Redux Toolkit & React Hooks**: Manages state efficiently.  
- **React Router**: Enables client-side navigation.  
- **React Hook Form + Zod**: Handles form validation.  
- **Clerk**: Authentication and user management.  
- **Vite**: Lightning-fast development and build tool.  

## Installation & Setup
### Prerequisites
- **Node.js** (v16 or later).

### Steps
1. **Clone the Repository**
   ```sh
   git clone https://github.com/ZafraZiaudeen/Hotel-Booking.git
   cd Hotel-Booking

### 2️⃣ Install Dependencies
```sh
npm install
```

### 2️⃣Set Up Environment Variables
Create a .env file in the root directory and add:
```sh
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3️⃣ Start the Development Server
```sh
npm run dev
```

The app will run at **http://localhost:5173**.

### Usage
- **Home Page**: Displays trending hotels and a search bar powered by vector retrieval.
- **Hotel Details**: Click a hotel card to view images, reviews, and pricing, add to wishlist, and book the hotel.
- **Wishlist**: Access favorite hotels via the heart icon in the navigation.
- **Bookings**: View and manage bookings in the My Account section.
- **Create Hotel**: Authenticated admins can access the form to add hotels.
- **Navigation**: Persistent across pages, with conditional rendering based on authentication.

### Contributing
**Fork the repository.**

**Create a branch.**
```sh
git checkout -b feature/your-feature
```

**Commit changes.**
```sh
git commit -m "Add your feature"
```

**Push to your branch.**
```sh
git push origin feature/your-feature
```

**Open a pull request.**

### Contact Me
For any inquiries, feel free to reach out via email:
zafraziaudeen@gmail.com
