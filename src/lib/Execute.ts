import { ChildProcess, spawn, SpawnOptions } from "child_process";
import debug from "debug";
import path from "path";

import Watcher from "./Watcher";

const d = debug("misty:Execute");

interface IOptions {
  name: string;
  cmd: string;
  cwd?: string;
  watchDir: string;
}

export default class Execute {
  public instance?: ChildProcess;
  public config: IOptions;

  constructor({ name, cmd, cwd, watchDir }: IOptions) {
    this.config = {
      cmd,
      cwd,
      name,
      watchDir,
    };

    if (this.config.watchDir) {
      this.watch();
    }

    this.execute();
  }

  public execute() {
    d("Executing %o", this.config.name, this.config.cmd);

    const opts: SpawnOptions = {
      stdio: "inherit",
    };
    if (this.config.cwd) {
      opts.cwd = this.config.cwd;
    }

    this.instance = spawn("sh", ["-c", this.config.cmd], opts);
  }

  public watch() {
    let watchDir = this.config.watchDir;
    if (this.config.cwd) {
      watchDir = path.join(this.config.cwd, this.config.watchDir);
    }

    const watcher = new Watcher({
      watchDir,
    });

    watcher.on("add", () => {
      d("\"Add\" watch event for: %o", this.config.name);

      this.processHandler();
    });

    watcher.on("change", () => {
      d("\"Change\" watch event for: %o", this.config.name);

      this.processHandler();
    });
  }

  public processHandler() {
    if (!this.instance) { return; }

    d("Restarting process for: %o:", this.config.name);

    this.instance.kill();
    this.execute();
  }
}
