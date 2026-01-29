# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification
<!-- chat-id: b6862e44-7783-4ebd-906f-8fd703f85077 -->

Assess the task's difficulty, as underestimating it leads to poor outcomes.
- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:
- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `{@artifacts_path}/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

If the task is complex enough, create a detailed implementation plan based on `{@artifacts_path}/spec.md`:
- Break down the work into concrete tasks (incrementable, testable milestones)
- Each task should reference relevant contracts and include verification steps
- Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function).

Save to `{@artifacts_path}/plan.md`. If the feature is trivial and doesn't warrant this breakdown, keep the Implementation step below as is.

---

### [x] Step: Create Project Configuration
<!-- chat-id: 4239d8c3-14ee-46f5-8db6-fcb5fe1d4e01 -->

Create package.json with required dependencies and npm scripts:
- Add express, socket.io, node-telegram-bot-api, dotenv
- Configure npm start script to run both bot.js and server.js
- Set up .gitignore with node_modules/, .env, *.log
- Create .env.example template

**Verification**: Run `npm install` successfully

---

### [x] Step: Implement Web Server
<!-- chat-id: fb77d429-eb35-40e5-b8ec-f5a3f8799d79 -->

Create server.js to:
- Serve static files (index.html, app.js, style.css)
- Initialize socket.io server
- Handle 'click' events from clients
- Emit 'update_balance' events
- Update app.js to connect to relative socket.io URL (remove hardcoded ngrok)

**Verification**: Server starts without errors, serves static files correctly

---

### [x] Step: Implement Telegram Bot
<!-- chat-id: 0dbaac2b-6a9c-4f80-813c-9e31534cd2a8 -->

Create bot.js to:
- Initialize Telegram bot with BOT_TOKEN from .env
- Handle /start command with WebApp button
- Provide instructions and welcome message

**Verification**: Bot responds to commands in Telegram

---

### [x] Step: Final Integration and Testing
<!-- chat-id: a1e83363-83d0-4f7e-aead-edf499797271 -->

1. Test complete deployment flow:
   - Run npm install
   - Configure .env with BOT_TOKEN
   - Run npm start
2. Verify end-to-end functionality:
   - Bot launches WebApp
   - UI loads correctly
   - Click events work
   - Socket.io communication functions
3. Write report to `{@artifacts_path}/report.md` describing:
   - What was implemented
   - How the solution was tested
   - Any issues encountered
