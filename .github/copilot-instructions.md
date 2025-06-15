<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# NetworkGame Flow - React TypeScript Project

This is a React TypeScript project for an interactive network simulator called NetworkGame Flow. The project is designed to:

1. **Be used as a standalone application** - can run independently with `bun dev`
2. **Be used as a reusable component** - can be imported and embedded in other React applications

## Architecture Guidelines

- **Component-based architecture**: Follow React best practices with functional components and hooks
- **TypeScript**: Use strict typing throughout the project
- **SOLID principles**: Maintain single responsibility, dependency injection, and clean interfaces
- **Custom hooks**: Extract business logic into reusable hooks
- **CSS Modules**: Use scoped CSS for component styling
- **Performance**: Optimize with React.memo, useMemo, useCallback where appropriate

## Key Components

- `NetworkSimulator`: Main orchestrating component
- `Device`: Interactive network device component
- `Connection`: Network connection visualization
- `StepController`: Step-by-step simulation controls
- `Logger`: Activity logging component
- `EducationalPopup`: Interactive learning modals

## Development Standards

- Use functional components with TypeScript interfaces
- Implement proper error boundaries
- Follow accessibility guidelines (ARIA labels, keyboard navigation)
- Use CSS custom properties for theming
- Implement responsive design patterns
- Use React Context for global state management
- Prefer composition over inheritance
