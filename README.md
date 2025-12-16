# Lynk-Social
![Issues](https://img.shields.io/github/issues/nourist/Lynk-Social)
![Watchers](https://img.shields.io/github/watchers/nourist/Lynk-Social?style=social)
![Stars](https://img.shields.io/github/stars/nourist/Lynk-Social?style=social)

A modern, responsive social networking web application built with the latest web technologies.

## ✨ Features

- 🔐 **Secure Authentication**: Robust user authentication and session management powered by Supabase Auth.
- 💬 **Real-time Chat**: Instant messaging capabilities using Supabase Realtime.
- 📱 **Responsive Social Feed**: A dynamic and responsive feed for posts and updates.
- 👤 **User Profiles**: Customizable user profiles with avatars and bio.
- ⚙️ **Settings Management**: Comprehensive user settings for account customization.
- 🎨 **Modern UI/UX**: Sleek design with smooth animations using Framer Motion and Tailwind CSS.

## 🧱 Project Structure

```
Lynk-Social/
├── src/
│   ├── app/          # Next.js App Router pages and layouts
│   ├── components/   # Reusable React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions and library configurations (Supabase, Utils)
│   ├── services/     # API service functions for data fetching
│   ├── store/        # Global state management (Zustand)
│   ├── types/        # TypeScript type definitions
│   └── styles/       # Global styles
├── supabase/         # Supabase configuration, migrations, and seed data
├── public/           # Static assets (images, icons)
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation
```

## 🛠 Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Requirements

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Setup Instructions

1. **Clone the repository**

    ```bash
    git clone https://github.com/nourist/Lynk-Social.git
    cd Lynk-Social
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**

    Create a `.env` file in the root directory and add your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4. **Start the development server**

    ```bash
    npm run dev
    ```

5. **Access the application**

    Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) in your browser.

## 📸 Preview

![Client-Home](./screenshots/home-light.png#gh-light-mode-only)
![Client-Home](./screenshots/home-dark.png#gh-dark-mode-only)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or suggestions.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the [MIT](LICENSE) License.
