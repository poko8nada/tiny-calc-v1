# Tiny Calc

A minimalist, terminal-style calculator built with Next.js 15 and React 19.

## 🚀 Features

- **Terminal Interface**: Authentic retro-modern terminal UI with scanline effects and amber/black color scheme.
- **Smart Calculation**: Powered by `mathjs` for accurate mathematical operations.
- **History Management**: Persistent calculation history using `zustand` and `localStorage`.
- **Responsive Design**: Fully optimized for both desktop and mobile devices.
- **Modern Tech Stack**: Built with the latest Next.js 15 (App Router), React 19, and Tailwind CSS 4.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Math Engine**: [Math.js](https://mathjs.org/)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

## 🏃 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Build

```bash
pnpm build
```

## 🚢 Deployment

### Docker

This project includes a `Dockerfile` for containerized deployment.

```bash
docker build -t tiny-calc .
docker run -p 8080:8080 tiny-calc
```

### Cloud Run

To deploy to Google Cloud Run:

```bash
gcloud run deploy tiny-calc --source .
```

## 📄 License

MIT
