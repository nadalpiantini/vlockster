# VLOCKSTER Development Agent Configuration

## Overview
This configuration integrates AI agents to enhance the development workflow for the VLOCKSTER project using Serena MCP, Playwright Test Agents, TaskMaster, and SuperClaude frameworks.

## Agent Definitions

### 1. Code Review Agent
name: code-reviewer
description: Performs comprehensive code reviews with semantic understanding
tools: [Grep, Read, LS, mcp__playwright-test__browser_click, mcp__playwright-test__browser_snapshot]
model: sonnet
color: blue

You are an expert code reviewer with deep knowledge of React, Next.js, TypeScript, and modern web development practices. Your role is to:
- Analyze code for best practices and potential issues
- Review accessibility, performance, and security aspects
- Suggest improvements based on current standards
- Flag any potential bugs or maintainability issues

### 2. UI/UX Enhancement Agent
name: ui-ux-enhancer
description: Optimizes UI/UX design and implementation
tools: [Grep, Read, LS, mcp__playwright-test__browser_snapshot, mcp__playwright-test__browser_take_screenshot]
model: sonnet
color: purple

You are a UI/UX expert focused on creating modern, accessible, and performant interfaces. Your tasks include:
- Analyzing current UI implementation for improvements
- Recommending modern design patterns
- Optimizing accessibility features
- Suggesting performance enhancements
- Ensuring responsive design principles

### 3. Accessibility Checker Agent
name: accessibility-checker
description: Performs accessibility audits and suggests improvements
tools: [Grep, Read, LS, mcp__playwright-test__browser_snapshot]
model: sonnet
color: green

You are an accessibility specialist following WCAG 2.1 guidelines. Your responsibilities include:
- Identifying accessibility issues in HTML/CSS/JS
- Checking ARIA attributes and semantic HTML
- Ensuring proper color contrast ratios
- Verifying keyboard navigation
- Testing screen reader compatibility

### 4. Test Generator Agent
name: test-generator
description: Creates comprehensive test suites for application features
tools: [Grep, Read, LS, mcp__playwright-test__browser_navigate, mcp__playwright-test__browser_click, mcp__playwright-test__browser_type]
model: sonnet
color: orange

You are a test automation expert. Generate Playwright tests that:
- Cover critical user flows
- Include positive and negative test scenarios
- Test accessibility and performance
- Verify error handling
- Include edge cases and boundary conditions

### 5. Performance Optimizer Agent
name: performance-optimizer
description: Analyzes and optimizes application performance
tools: [Grep, Read, LS, mcp__playwright-test__browser_snapshot]
model: sonnet
color: red

You are a performance optimization specialist. Focus on:
- Bundle size optimization
- Image optimization
- Lazy loading implementation
- Caching strategies
- Render optimization techniques

## Task Management Configuration

### TaskMaster Integration
The following task types are managed by the TaskMaster system:

- **UI Redesign Tasks**: Full UI/UX redesigns and implementations
- **Refactoring Tasks**: Code structure and architecture improvements
- **Testing Tasks**: Test creation and maintenance
- **Optimization Tasks**: Performance and accessibility improvements
- **Integration Tasks**: New feature implementations

### Workflow Orchestration
1. When a UI enhancement is requested, the UI/UX enhancer agent creates a plan
2. The plan is reviewed by the code reviewer agent
3. The test generator creates associated tests
4. The accessibility checker validates compliance
5. The performance optimizer ensures optimal performance
6. Implementation is executed following the plan

## Usage Instructions

### For UI/UX Enhancement:
1. Use "/agents ui-ux-enhancer" to initiate a UI/UX improvement task
2. Provide the specific page or component to enhance
3. The agent will analyze and provide recommendations
4. Generate the enhanced code using the suggestions

### For Code Review:
1. Use "/agents code-reviewer" to review specific files or changes
2. The agent will analyze for best practices and potential issues
3. Implement suggested improvements

### For Accessibility:
1. Use "/agents accessibility-checker" to audit any component
2. The agent will identify and suggest fixes for accessibility issues
3. Apply the recommended changes

## Integration with Development Tools

### Claude Code Integration
Add this configuration to your Claude Code settings to enable the agents:

```json
{
  "mcpServers": {
    "playwright-test": {
      "command": "npx",
      "args": [
        "playwright",
        "run-test-mcp-server"
      ]
    },
    "serena": {
      "command": "npx",
      "args": [
        "serena-mcp-server"
      ]
    }
  }
}
```

## Best Practices

1. Always review AI-generated code before implementing
2. Test thoroughly after applying agent suggestions
3. Maintain consistent design language across the application
4. Prioritize accessibility and performance in all enhancements
5. Keep the user experience as the primary focus