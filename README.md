# Project Nix 🤖✨

Welcome to Project Nix! This monorepo hosts **Nix**, a versatile Discord bot, and its accompanying **web dashboard** for seamless configuration.

## 📜 Overview

**Nix** is designed to enhance your Discord server management with three core features:

* 🎤 **Dynamic Voice Lobbies:** Automatically creates and manages temporary voice channels, keeping your server organized.
* 🧵 **Thread Watcher:** Actively monitors specified threads, preventing them from being automatically archived by Discord.
* 📢 **Customizable Member Announcements:** Delivers personalized welcome, farewell, and ban messages using fully customizable embeds.

The **web dashboard** provides a user-friendly interface to:

* Easily set up, manage, and remove voice channel lobbies.
* Toggle member announcements on or off.
* Customize the content and appearance of announcement embed messages (exclusive to the dashboard).

---

## 🚀 Features

### Bot 🤖
* **Voice Lobby Management:**
    * Dynamic creation of voice channels based on user activity.
    * Automatic cleanup of empty lobbies.
    * Configuration options for lobby behavior.
* **Thread Watcher:**
    * Select threads to keep active indefinitely.
    * Prevents important discussions from being lost to auto-archival.
* **Member Announcements:**
    * Customizable messages for members joining the server.
    * Customizable messages for members leaving the server.
    * Customizable messages for members getting banned.
    * Full embed customization for all announcement types via the dashboard.

### Dashboard 🌐
* **Lobby Configuration:** Intuitive UI for creating, viewing, updating, and deleting voice lobby setups.
* **Announcement Management:**
    * Enable or disable individually join, leave, and ban announcements.
    * Rich editor for crafting custom embed messages for each announcement type.
* **User-Friendly Interface:** Built with Nuxt.js 3 and Nuxt UI for a modern and responsive experience.

---

## 📁 Monorepo Structure

This project is a monorepo managed with pnpm workspaces.

```
/
├── bot/               \# Discord bot (TypeScript, Discord.js)
├── dashboard/         \# Web dashboard (Nuxt.js 3, TypeScript, Nuxt UI, Prisma)
├── packages/          \# Shared packages
├── pnpm-workspace.yaml \# pnpm workspace configuration
└── package.json       \# Root package.json
```

---

## 🛠️ Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

* **pnpm:** ([Installation Guide](https://pnpm.io/installation))
* **Node.js:** (Recommended: v18.x or later - *Please specify your preferred version*)
* **PostgreSQL Database:** A running instance of PostgreSQL.

### Environment Variables 🔑

You'll need to set up environment variables for both the bot and the dashboard. Create a `.env` file in the `bot/` directory and another in the `dashboard/` directory.

#### Bot (`bot/.env`)

```env
# Discord Bot Token
BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
# Discord Application Client ID
CLIENT_ID=YOUR_DISCORD_APP_CLIENT_ID

# Api URL (depends on where you run your api (dashboard))
API_URL=YOUR_API_URL
# Api Key (you generate this yourself)
API_KEY=YOUR_API_KEY
```

#### Dashboard (`dashboard/.env`)

```env
# Nuxt auth setup
NUXT_SESSION_PASSWORD=SOME_RANDOM_STRING
NUXT_OAUTH_DISCORD_CLIENT_ID=YOUR_DISCORD_CLIENT_ID
NUXT_OAUTH_DISCORD_CLIENT_SECRET=YOUR_DISCORD_CLIENT_SECRET

# Connection string to postgres database
DATABASE_URL=YOUR_DB_CONNECTION_STRING


NUXT_API_KEY=RANDOM_STRING (Make sure it's the same as in the bot .env)
NUXT_BOT_TOKEN=YOUR_BOT_TOKEN
```

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/TheDrinix/project-nix
    cd project-nix
    ```

2.  **Install dependencies from the root:**
    This command will install dependencies for all workspaces (bot, dashboard, and any shared packages).

    ```bash
    pnpm install
    ```

-----

## ⚙️ Development & Usage

### Bot (`bot/`)

1.  **Navigate to the bot directory:**

    ```bash
    cd ./bot
    ```

2.  **Set up database schema:**
    ```bash
    pnpx prisma migrate dev
    ```

3.  **Run the bot in development mode:**

    ```bash
    pnpm dev
    ```

4.  **Build the bot for production:**

    ```bash
    # Placeholder: pnpm run build
    ```


5.  **Run the bot in production:**

    ```bash
    # Placeholder: pnpm run start
    ```

    *(Please provide the actual command to run the bot in production.)*

#### Key Bot Commands 📝

*(Optional: Add examples of important bot commands here.)*

  * `/lobby create <name>` - ...
  * `/thread watch <thread_id>` - ...

-----

### Dashboard (`dashboard/`)

1.  **Navigate to the dashboard directory:**

    ```bash
    cd ./dashboard
    ```

2.  **Run the dashboard in development mode:**
    The dashboard will typically be available at `http://localhost:3000`.

    ```bash
    pnpm dev
    ```

3.  **Build the dashboard for production:**

    ```bash
    pnpm build
    ```

4.  **Start the dashboard in production:**

    ```bash
    node .output/server/index.mjs
    ```

#### Accessing the Dashboard 🌐

*(Provide details on how users access the dashboard, e.g., default URL, login requirements.)*

-----


## 🤝 Contributing

Currently, there are no formal contribution guidelines. However, if you're interested in contributing, please feel free to open an issue to discuss your ideas.

-----

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
*(Ensure you add a `LICENSE` file with the MIT License text to your repository root.)*

-----

## 📞 Contact & Support

If you encounter any issues or have questions, please open an issue on the [GitHub Issues page](https://www.google.com/search?q=https://github.com/your-username/project-nix/issues).

-----

Made with ❤️ by Drinix