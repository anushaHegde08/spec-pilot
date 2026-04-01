# Spec Pilot

A CLI tool that converts a plain English feature spec into production-ready TypeScript code and tests using the OpenAI API.

## The Problem

Every time a developer starts a new feature, they spend hours writing the same boilerplate — a controller, a service, and a test file. Spec Pilot eliminates that by letting you describe what you want in plain English and generating all three files instantly.

## How It Works

You write this (`login.md`):

```markdown
## User Login

- POST /login accepts email and password
- Validate that email and password are not empty
- Return a JWT token if credentials are correct
- Return 401 error if credentials are wrong
```

You run this:

```bash
npx @anusha-hegde-08/spec-pilot generate --spec login.md
```

You get this:

```
controller -> output/user-login.controller.ts
service    -> output/user-login.service.ts
tests      -> output/user-login.spec.ts
```

## Installation

```bash
npm install -g @anusha-hegde-08/spec-pilot
```

Or use it without installing:

```bash
npx @anusha-hegde-08/spec-pilot generate --spec your-feature.md
```

## Setup

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Create a `.env` file in your project root:

```
OPENAI_API_KEY=your_key_here
```

## Usage

### Generate code from a spec file

```bash
spec-pilot generate --spec examples/login.md
```

### Use a custom output directory

```bash
spec-pilot generate --spec examples/login.md --out ./src/features
```

### Preview files without generating them

```bash
spec-pilot generate --spec examples/login.md --dry-run
```

### Help

```bash
spec-pilot --help
```

## Options

| Option      | Description                          | Required | Default    |
| ----------- | ------------------------------------ | -------- | ---------- |
| `--spec`    | Path to your markdown spec file      | Yes      | —          |
| `--out`     | Output directory for generated files | No       | `./output` |
| `--dry-run` | Preview files without calling the AI | No       | false      |

## Writing a Good Spec

A spec file is a markdown file with a `##` heading and bullet points.

```markdown
## Feature Name

- requirement one
- requirement two
- requirement three
```

Tips for better output:

- Be specific — the more detail you add, the better the generated code
- Use HTTP methods when describing endpoints — `POST /login`, `GET /users`
- Describe both success and error cases
- Aim for at least 3-5 bullet points per feature

## Example Specs

### User Authentication

```markdown
## User Authentication

- POST /login accepts email and password
- Validate that email and password are not empty
- Return a JWT token if credentials are correct
- Return 401 error if credentials are wrong
- Hash passwords using bcrypt before comparing
```

### Todo List

```markdown
## Todo List

- GET /todos returns all todos
- POST /todos creates a new todo
- DELETE /todos/:id deletes a todo by id
- Each todo has a title and completed status
```

## Tech Stack

- **TypeScript** — type-safe codebase
- **Node.js** — runtime environment
- **OpenAI API** — code generation
- **Commander.js** — CLI framework
- **Vitest** — unit testing
- **dotenv** — environment variable management

## Running Tests

```bash
npm test
```

## Project Structure

```
spec-pilot/
├── src/
│   ├── index.ts        - CLI entry point
│   ├── parser.ts       - reads and validates markdown spec files
│   ├── generator.ts    - calls OpenAI API and returns generated code
│   └── writer.ts       - saves generated files to disk
├── tests/
│   ├── parser.test.ts
│   ├── writer.test.ts
│   └── generator.test.ts
└── examples/
    ├── login.md
    └── todo.md
```

## Contributing

Contributions are welcome. Please open an issue before submitting a pull request so we can discuss the change.

1. Fork the repository
2. Create a feature branch — `git checkout -b feat/your-feature`
3. Commit your changes — `git commit -m "feat: add your feature"`
4. Push to the branch — `git push origin feat/your-feature`
5. Open a pull request

## License

MIT
