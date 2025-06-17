# NetworkFlow

An interactive network simulator that makes internet concepts easy to understand. Watch how data travels from your computer to websites through routers, DNS servers, and the internet backbone with step-by-step visualization.

## Features

- **Interactive Network Visualization**: See how data flows through the internet in real-time
- **Educational Popups**: Click any device to learn what it does in simple terms
- **Step-by-Step Tours**: Follow packets on their journey from your computer to websites
- **Realistic Network Scenarios**: DNS resolution, web requests, CDN delivery, and DDoS attacks
- **Draggable Network Topology**: Move devices around to explore the network layout
- **Activity Logging**: Track network events and packet flow
- **Resizable Panels**: Customize your learning experience with flexible panel layout
- **Welcome Guide**: Built-in tutorial to get you started
- **Keyboard Shortcuts**: Quick panel management and navigation

## Getting Started

You need Bun runtime installed. Download it from https://bun.sh

```bash
# Install dependencies
bun install

# Start the app
bun dev
```

Open your browser to http://localhost:5173

## Building for Production

```bash
bun run build
bun run preview
```

## How to Use

The NetworkFlow interface is designed to be intuitive and educational:

### Main Components

- **Network Canvas**: The main area showing devices connected by lines. You can drag devices around and the connections will follow
- **Control Panel**: On the left side (when visible) - contains simulation controls and scenario selection
- **Activity Log**: On the right side (when visible) - shows real-time network events
- **Header Controls**: Panel management and canvas reset options

### Getting Started

1. **Welcome Guide**: First-time users see a welcome popup with a guided tour option
2. **Click Devices**: Click any device (computer, router, server) to learn what it does
3. **Start a Simulation**: Use the control panel to begin step-by-step packet tracking
4. **Watch the Journey**: See highlighted connections as data travels through the network

### Step-by-Step Learning

NetworkFlow offers detailed packet journey simulations:

- **DNS Resolution**: See how your computer finds the IP address for a website
- **Web Requests**: Follow HTTPS requests to web servers
- **CDN Delivery**: Watch how content delivery networks speed up the internet
- **DDoS Attack Simulation**: Learn about cyber attacks and protection methods

Each step shows technical details like IP addresses, protocols, and routing decisions while explaining concepts in simple language.

### Panel Management

- **Toggle Panels**: Use the header dropdown to show/hide control panel and activity log
- **Keyboard Shortcuts**: Ctrl+1 for control panel, Ctrl+2 for activity log
- **Quick Layouts**: "All" button shows everything, "Focus" button hides panels for a clean view
- **Resize Panels**: The step details window can be resized by dragging corners

### Educational Features

- **Tech Terms**: Clickable technical terms throughout the interface open helpful explanations
- **Device Information**: Each network device has detailed educational content
- **Simple Analogies**: Complex networking concepts explained with everyday comparisons
- **Visual Learning**: Color-coded connections and device states make abstract concepts concrete

## Using as a Component

NetworkFlow can be embedded in other React applications:

```tsx
import { NetworkSimulator } from './src/components/NetworkSimulator';

function App() {
  return (
    <div>
      <h1>My Learning Platform</h1>
      <NetworkSimulator 
        showControls={true}
        showLogger={true}
        autoStart={false}
      />
    </div>
  );
}
```

### Component Properties

- `className`: CSS class for styling
- `showControls`: Show/hide the control panel (default: true)
- `showLogger`: Show/hide the activity log (default: true)  
- `autoStart`: Skip welcome guide and start immediately (default: false)
- `initialScenario`: Starting scenario type (default: 'basic')
- `onStatsChange`: Callback for network statistics
- `onScenarioChange`: Callback when scenario changes

## What You'll Learn

NetworkFlow teaches networking concepts through interactive visualization:

### Network Infrastructure
- How your computer connects to the internet through routers
- The role of Internet Service Providers (ISPs)
- How the internet backbone connects everything globally
- The difference between local networks and the public internet

### DNS (Domain Name System)
- How "google.com" becomes an IP address like "172.217.164.78"
- The journey of DNS queries through multiple servers
- How caching speeds up repeated requests
- Public DNS servers like Google's 8.8.8.8

### Web Communication
- HTTPS requests and responses
- How web servers process your requests
- Content Delivery Networks (CDNs) and why they matter
- Network Address Translation (NAT) in home routers

### Network Security
- Distributed Denial of Service (DDoS) attacks
- How protection services like Cloudflare work
- Botnet operations and cyber crime
- The importance of network monitoring

### Technical Concepts Made Simple
- IP addresses and routing tables
- Protocols like HTTP, DNS, and TCP
- Packet switching and network hops
- Time To Live (TTL) and packet headers

Each concept is explained with both technical details and everyday analogies to make complex networking accessible to everyone.

## Project Structure

The app is built with modern React and TypeScript:

```
src/
├── components/              # UI components
│   ├── NetworkSimulator.tsx    # Main application container
│   ├── Device.tsx              # Interactive network devices
│   ├── Connection.tsx          # Network connection lines
│   ├── ControlPanel.tsx        # Simulation controls
│   ├── StepController.tsx      # Step navigation interface
│   ├── Logger.tsx              # Activity log display
│   ├── EducationalPopup.tsx    # Learning modal windows
│   ├── WelcomeGuide.tsx        # First-time user guide
│   ├── TechTerm.tsx            # Clickable term explanations
│   └── Tooltip.tsx             # Hover help text
├── hooks/                   # React custom hooks
│   ├── useNetworkSimulator.ts  # Main simulation logic
│   └── useEducational.ts       # Educational content system
├── contexts/                # React context providers
│   └── EducationalContext.tsx  # Global educational state
├── types/                   # TypeScript definitions
│   └── index.ts                # All type definitions
├── utils/                   # Utility functions
│   ├── constants.ts            # App-wide constants
│   ├── helpers.ts              # Helper functions
│   └── networkExplanations.ts # Educational content
└── App.tsx                  # Root application component
```

## Development

### Code Style
- TypeScript with strict typing throughout
- React functional components with hooks
- CSS modules for component styling
- ESLint for code quality

### Adding New Features
- Components go in `src/components/` with matching CSS files
- Business logic belongs in custom hooks in `src/hooks/`
- Type definitions are centralized in `src/types/index.ts`
- Educational content is managed in `src/utils/networkExplanations.ts`

### Key Architecture Principles
- Component-based design with single responsibility
- Business logic separated from UI components
- Educational content separate from application logic
- Responsive design that works on different screen sizes

## Contributing

If you'd like to help improve NetworkFlow:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Please follow the existing code style and add educational content for any new networking concepts you introduce.

## License

This project is licensed under the MIT License.

---

NetworkFlow makes networking concepts accessible through hands-on visualization. Whether you're a student learning about the internet or someone curious about how data travels when you click a link, this tool helps you see the invisible infrastructure that powers our connected world.
