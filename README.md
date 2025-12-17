Food Recipes

Live Demo: https://vercel.com/ualihankyzys-projects/food-recipes
Repository: https://github.com/Ualihankyzy/food_recipes

Food Recipes is a frontend web application built with Nuxt 3 and Tailwind CSS.
The project allows users to browse recipes, create their own recipes, and save other users’ recipes. All data is managed through a mock API.

Project Overview

Food Recipes has two main user roles: Public Users and Admin.

Public Users:

Can view all recipes.

Registered users (via Login / Sign In) can create their own recipes.

Recipes can be marked as public or private.

Can save recipes from other users.

Admin:

Admin panel access is restricted to the following credentials:

Email: Adminka@gmail.com

Password: admin123

Admin can view full statistics:

Number of recipes created

Number of recipes saved

Number of registered users

Admin can edit recipes and manage users.

Admin can track which user created or saved which recipe.

Admin can also edit user information.

All data is handled through a mock API; no real backend server is used.

Application Pages

Public Pages

Home (/) — Main page displaying recipes and navigation.

Login (/login) — User login page.

Sign In (/signin) — New user registration page.

Dashboard (/dashboard) — User dashboard to view their own and saved recipes.

Profile (/profile) — User profile page to edit personal information.

Admin Pages

Admin Dashboard (/admin/dashboard) — Main admin panel with statistics.

Recipes Management (/admin/recipes) — View and edit all recipes.

Users Management (/admin/users) — Manage users and view which recipes each user created or saved.

Core Features

View all recipes (Public)

Create recipes for registered users

Mark recipes as public or private

Save other users’ recipes

Admin panel for viewing statistics (recipe creation, saves, registered users)

Admin can edit recipes and manage users

Responsive UI for desktop and mobile

Clean and minimalist design using Tailwind CSS

Project Structure
pages/
├── index.vue
├── login.vue
├── signin.vue
├── dashboard.vue
├── profile.vue
└── admin/
    ├── dashboard.vue
    ├── recipes.vue
    └── users.vue


Clear and scalable structure with separate Public and Admin sections.

All data functionality is implemented via mock API.

Technologies Used

Framework: Nuxt 3 (Vue 3)

Styling: Tailwind CSS

Language: JavaScript / Vue Single File Components

Package Manager: npm

Deployment: Vercel