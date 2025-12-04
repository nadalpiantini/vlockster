# BMAD-METHOD™ - Agent Directory for Cursor

This document provides a complete reference for all BMAD-METHOD™ agents available in this project.

## How to Use Agents in Cursor

In Cursor, activate agents using the `@agent-name` syntax:

- Type `@bmad-master` to activate the BMad Master agent
- Type `@dev` to activate the Developer agent
- Type `@pm` to activate the Product Manager agent
- And so on...

**Important**: Start a new chat when switching between agents to maintain clean context.

## Agent Directory

### Core Development Agents

#### 💻 `@dev` - James (Full Stack Developer)
**When to Use**: Code implementation, debugging, refactoring, and development best practices

**Source**: `.bmad-core/agents/dev.md`

**Activation**: Type `@dev` in a new chat

**Key Capabilities**:
- Implements user stories by reading requirements
- Executes tasks sequentially with comprehensive testing
- Updates Dev Agent Record sections
- Maintains minimal context overhead
- Follows coding standards from architecture documents

**Common Commands**:
- `*help` - Show available commands
- `*status` - Show current context/progress

---

#### 🏃 `@sm` - Bob (Scrum Master)
**When to Use**: Story creation, epic management, retrospectives, and agile process guidance

**Source**: `.bmad-core/agents/sm.md`

**Activation**: Type `@sm` in a new chat

**Key Capabilities**:
- Creates detailed, actionable stories for AI developers
- Prepares stories from PRD and Architecture documents
- Ensures all information comes from project documentation
- **Note**: NOT allowed to implement stories or modify code

**Common Commands**:
- `*create` - Run create-next-story task
- `*help` - Show available commands

---

#### 🧪 `@qa` - Quinn (Test Architect & Quality Advisor)
**When to Use**: Comprehensive test architecture review, quality gate decisions, and code improvement

**Source**: `.bmad-core/agents/qa.md`

**Activation**: Type `@qa` in a new chat

**Key Capabilities**:
- Provides thorough quality assessment
- Requirements traceability analysis
- Risk assessment and test strategy
- Quality gate decisions (advisory only)
- Test architecture review

**Common Commands**:
- `*help` - Show available commands
- `*gate` - Update quality gate status
- `*trace` - Requirements traceability analysis
- `*nfr` - Non-functional requirements assessment

---

### Planning & Strategy Agents

#### 📋 `@pm` - John (Product Manager)
**When to Use**: Creating PRDs, product strategy, feature prioritization, roadmap planning, and stakeholder communication

**Source**: `.bmad-core/agents/pm.md`

**Activation**: Type `@pm` in a new chat

**Key Capabilities**:
- Creates PRDs and product documentation
- Product research and strategy
- Feature prioritization
- Market analysis
- Stakeholder communication

**Common Commands**:
- `*create-doc prd` - Create a PRD document
- `*help` - Show available commands

---

#### 🏗️ `@architect` - Winston (Architect)
**When to Use**: System design, architecture documents, technology selection, API design, and infrastructure planning

**Source**: `.bmad-core/agents/architect.md`

**Activation**: Type `@architect` in a new chat

**Key Capabilities**:
- Complete systems architecture
- Cross-stack optimization
- Pragmatic technology selection
- API design
- Infrastructure planning

**Common Commands**:
- `*create-doc architecture` - Create architecture document
- `*help` - Show available commands

---

#### 📊 `@analyst` - Mary (Business Analyst)
**When to Use**: Market research, brainstorming, competitive analysis, creating project briefs, initial project discovery, and documenting existing projects (brownfield)

**Source**: `.bmad-core/agents/analyst.md`

**Activation**: Type `@analyst` in a new chat

**Key Capabilities**:
- Market research and competitive analysis
- Brainstorming facilitation
- Project brief creation
- Strategic analysis
- Brownfield project documentation

**Common Commands**:
- `*help` - Show available commands
- `*create-doc brief` - Create project brief

---

#### 📝 `@po` - Sarah (Product Owner)
**When to Use**: Backlog management, story refinement, acceptance criteria, sprint planning, and prioritization decisions

**Source**: `.bmad-core/agents/po.md`

**Activation**: Type `@po` in a new chat

**Key Capabilities**:
- Validates artifacts cohesion
- Story refinement and acceptance criteria
- Backlog management
- Process adherence
- Documentation quality assurance

**Common Commands**:
- `*help` - Show available commands
- `*validate` - Validate story against artifacts

---

#### 🎨 `@ux-expert` - Sally (UX Expert)
**When to Use**: UI/UX design, wireframes, prototypes, front-end specifications, and user experience optimization

**Source**: `.bmad-core/agents/ux-expert.md`

**Activation**: Type `@ux-expert` in a new chat

**Key Capabilities**:
- User experience design
- UI/UX specifications
- Wireframes and prototypes
- Accessibility design
- AI-powered UI generation prompts

**Common Commands**:
- `*help` - Show available commands
- `*create-doc front-end-spec` - Create front-end specification

---

### Meta Agents

#### 🧙 `@bmad-master` - BMad Master
**When to Use**: Comprehensive expertise across all domains, running one-off tasks that don't require a specific persona, or wanting to use the same agent for many things

**Source**: `.bmad-core/agents/bmad-master.md`

**Activation**: Type `@bmad-master` in a new chat

**Key Capabilities**:
- Universal executor of all BMAD-METHOD capabilities
- Can run any resource directly without persona transformation
- Expert knowledge of all BMAD resources (with `*kb` mode)
- Single-session comprehensive work

**Common Commands**:
- `*help` - Show available commands
- `*kb` - Toggle Knowledge Base mode
- `*task {task-name}` - Execute a specific task
- `*create-doc {template}` - Create a document
- `*shard-doc {document} {destination}` - Shard a document
- `*execute-checklist {checklist}` - Run a checklist

**Note**: This agent can do any task that all other agents can do, aside from actual story implementation. Use this when you don't want to switch between different agents.

---

#### 🎭 `@bmad-orchestrator` - BMad Orchestrator
**When to Use**: **NOT RECOMMENDED FOR IDE** - This is a heavyweight, special-purpose agent designed for web UI teams. It utilizes a lot of context and can morph into any other agent.

**Source**: `.bmad-core/agents/bmad-orchestrator.md`

**Note**: This agent exists solely to facilitate teams within web bundles. Do not use in IDE environment.

---

## Workflow Overview

### Planning Phase (Web UI Recommended)
1. `@analyst` - Market research, brainstorming, project briefs
2. `@pm` - Create PRD from brief
3. `@ux-expert` - Create front-end spec (if needed)
4. `@architect` - Create architecture from PRD
5. `@po` - Validate and align documents

### Development Phase (IDE)
1. `@po` - Shard documents (`*shard-doc`)
2. `@sm` - Create next story (`*create`)
3. `@dev` - Implement story
4. `@qa` - Review and quality gate
5. Repeat until epic complete

## Project Structure

```
docs/
  ├── prd.md                    # Product Requirements Document
  ├── architecture.md           # System Architecture
  ├── prd/                      # Sharded PRD epics
  ├── architecture/              # Sharded architecture sections
  ├── stories/                  # User stories
  ├── epics/                    # Epic documents
  └── qa/
      ├── assessments/           # QA assessments
      └── gates/                # Quality gates

.bmad-core/
  ├── agents/                   # All agent definitions
  ├── tasks/                    # Reusable tasks
  ├── templates/                # Document templates
  ├── checklists/               # Validation checklists
  ├── workflows/                # Workflow definitions
  └── core-config.yaml          # Project configuration
```

## Quick Reference

### Common Commands (All Agents)
- `*help` - Show available commands
- `*status` - Show current context/progress
- `*exit` - Exit agent mode

### Document Management
- `*create-doc {template}` - Create a document using a template
- `*shard-doc {doc} {dest}` - Break a document into manageable pieces
- `*doc-out` - Output full document to current destination

### Task Execution
- `*task {task-name}` - Execute a specific task
- `*execute-checklist {checklist}` - Run a validation checklist

## Getting Started

1. **For Planning**: Start with `@analyst` or `@pm` to create project documentation
2. **For Development**: Use `@sm` to create stories, then `@dev` to implement
3. **For Quality**: Use `@qa` for test architecture and quality gates
4. **For Everything**: Use `@bmad-master` as a universal agent

## Important Notes

- **Always start a new chat** when switching agents in Cursor
- **Read agent files** in `.bmad-core/agents/` for complete details
- **Follow the workflow** - Planning → Sharding → Development → QA
- **Use `*help`** in any agent to see available commands
- **Check `.bmad-core/core-config.yaml`** for project-specific configuration

## Resources

- **User Guide**: `.bmad-core/user-guide.md`
- **Working in Brownfield**: `.bmad-core/working-in-the-brownfield.md`
- **BMAD Knowledge Base**: `.bmad-core/data/bmad-kb.md` (accessible via `@bmad-master` with `*kb`)

---

*Powered by BMAD-METHOD™ v4.44.3*

