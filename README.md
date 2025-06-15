# NetworkGame Flow

An interactive network simulator built with React, TypeScript, and Vite. Learn how data travels across the internet through step-by-step visualization and educational content.

## 🌟 Features

- **Interactive Network Visualization**: Drag-and-drop devices, animated packet flow
- **Step-by-Step Learning**: Watch how data travels through different network components
- **Educational Content**: Click devices to learn about routers, DNS servers, CDNs, and more
- **Multiple Scenarios**: Basic routing, DNS resolution, TCP connections, and advanced routing
- **Real-time Logging**: Track packet flow and network events
- **Responsive Design**: Works on desktop and mobile devices
- **Dual Usage**: Standalone app or embeddable component

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) runtime (recommended) or Node.js 18+
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd NetGameFlow

# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the app
bun run build

# Preview the build
bun run preview
```

## 📱 Usage

### Standalone Application

Simply run the development server and open the app in your browser. The NetworkGame Flow interface includes:

- **Control Panel**: Start/stop simulation, change scenarios, adjust settings
- **Network Canvas**: Interactive area with draggable devices and animated connections
- **Step Controller**: Navigate through simulation steps
- **Activity Logger**: Real-time event logging
- **Educational Popups**: Click devices to learn more

### As a Reusable Component

Install the package in your React project:

```tsx
import { NetworkSimulator } from 'networkgame-flow';

function MyApp() {
  const handleStatsChange = (stats) => {
    console.log('Network stats:', stats);
  };

  return (
    <div>
      <h1>My Learning Platform</h1>
      <NetworkSimulator
        initialScenario="basic"
        onStatsChange={handleStatsChange}
        showControls={true}
        showLogger={true}
      />
    </div>
  );
}
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | undefined | CSS class for container |
| `onStatsChange` | function | undefined | Callback for network statistics |
| `onScenarioChange` | function | undefined | Callback for scenario changes |
| `initialScenario` | ScenarioType | 'basic' | Starting scenario |
| `showControls` | boolean | true | Show control panel |
| `showLogger` | boolean | true | Show activity logger |
| `autoStart` | boolean | false | Auto-start simulation |

## 🏗️ Architecture

### Component Structure

```
src/
├── components/           # React components
│   ├── NetworkSimulator.tsx    # Main orchestrator
│   ├── Device.tsx             # Interactive devices
│   ├── Connection.tsx         # Network connections
│   ├── ControlPanel.tsx       # Simulation controls
│   ├── StepController.tsx     # Step navigation
│   ├── Logger.tsx             # Activity logging
│   └── EducationalPopup.tsx   # Learning modals
├── hooks/               # Custom React hooks
│   └── useNetworkSimulator.ts # Main simulation logic
├── types/               # TypeScript definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── constants.ts     # App constants
│   └── helpers.ts       # Helper functions
└── App.tsx              # Main app component
```

### Key Design Principles

- **Component-based Architecture**: Modular, reusable components
- **SOLID Principles**: Single responsibility, dependency injection
- **TypeScript**: Strict typing throughout
- **Custom Hooks**: Business logic separated from UI
- **CSS Modules**: Scoped styling
- **Performance**: React.memo, useMemo, useCallback optimizations

## 🎓 Educational Content

The simulator includes educational content about:

- **Network Devices**: Clients, routers, ISP infrastructure
- **Protocols**: HTTP, DNS, TCP/IP
- **Routing**: How packets find their way across networks
- **Internet Infrastructure**: CDNs, DNS servers, web servers
- **Network Performance**: Latency, packet loss, congestion

## 🛠️ Development

### Project Scripts

```bash
# Development
bun run dev          # Start dev server
bun run build        # Build for production
bun run preview      # Preview production build
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript check
```

### Code Style

- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting (configure in your editor)
- **TypeScript**: Strict mode enabled
- **CSS**: BEM methodology for class naming

### Adding New Features

1. **New Components**: Add to `src/components/` with corresponding CSS
2. **Business Logic**: Add custom hooks to `src/hooks/`
3. **Types**: Define interfaces in `src/types/index.ts`
4. **Constants**: Add to `src/utils/constants.ts`
5. **Utilities**: Helper functions in `src/utils/helpers.ts`

## 🔧 Configuration

### Vite Configuration

The project uses Vite for building and development. Configuration is in `vite.config.ts`:

- React plugin for JSX support
- TypeScript support
- Hot Module Replacement (HMR)
- Development server configuration

### TypeScript Configuration

- Strict mode enabled
- Modern ES modules
- React JSX support
- Path mapping for clean imports

## 📦 Dependencies

### Core Dependencies

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast build tool and dev server

### Development Dependencies

- **ESLint**: Code linting and quality
- **@types/react**: TypeScript definitions for React
- **TypeScript**: Compiler and language service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Add TypeScript types for all new code
- Include CSS for new components
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by network simulation tools and educational platforms
- Built with modern React and TypeScript best practices
- Designed for both educational use and developer integration

## 📞 Support

For questions, issues, or contributions:

- Open an issue on GitHub
- Check the documentation
- Review the code examples in this README

---

**NetworkGame Flow** - Making network concepts accessible through interactive visualization.
