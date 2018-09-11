# Misty

Misty is a concurrent script runner that can watch directories and restart processes on file changes. Also she's a Pokemon Gym Leader. 🤷

## When to use Misty

Misty shines when you want to launch multiple scripts within the same terminal. She is especially usefull for e.g. developing an electron app where you have to run multipe commands at once like frontend, backend, database and electron + restarting electron whenever files for the main renderer change.

## How to use Misty

Misty is controlled via the `misty.yml` in your projects root directory.

### 1. Install Misty

```shell
npm install @adlk/misty
```

### [2. Create misty.yml](#example-mistyyml)

### 3. Run Misty

```shell
npx misty
```

or

```shell
./node_modules/.bin/misty
```

### Example misty.yml

```yml
# misty.yml

frontend:
  cmd: HOST=localhost PORT=4000 yarn start
  
backend:
  cmd: yarn start
  cwd: ../backend

electron:
  cmd: ./node_modules/.bin/electron .
  cwd: ../desktop-app
  waitOn: http://localhost:4000
  watchDir: ./src

database:
  cmd: rethinkdb
  cwd: ../db
```

### Options

Every Root level element is a task. The key will be used as a task name.

- **`cmd`:** the command that should be executed
- **`cwd`:** the directory the command should be executed
- **`waitOn`:** Wait for files, ports, sockets, or http(s) to be available. Using [wait-on](https://www.npmjs.com/package/wait-on).
- **`watchDir`:**  the directory that should be watched for file changes. On file changes, the process will be restarted. (Useful for e.g. developing in electrons `main` process)
  
  `watchDir` is relative to `cwd` if defined.

### Todos

- [ ] Exit misty when task in `exec` script fails
- [ ] Add scenarios (= superset of tasks)
- [ ] Add alternative way to provide config (e.g. `npx misty --config='./my-misty-config'`)
- [ ] Tests 🚨
- [ ] Tbc
