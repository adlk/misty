import chokidar from "chokidar";
import debug from "debug";
import { FSWatcher } from "fs";

const d = debug("misty:watcher");

interface IWatcherArgs {
  watchDir: string;
  ignoreInitial?: boolean;
}

interface IOptions {
  watchDir: string | string[];
  ignoreInitial?: boolean;
}

type CallbackFunctionVariadic = (...args: any[]) => void;

export default class Watcher {
  public options: IOptions;
  public watcher: FSWatcher;

  constructor({ watchDir, ignoreInitial}: IWatcherArgs) {
    if (!watchDir) {
      throw new Error("Listening directory must be defined");
    }

    const watchDirs = watchDir.split(',');

    this.options = {
      ignoreInitial: ignoreInitial || true,
      watchDir: watchDirs,
    };

    d("Initializing Watcher with %o", this.options);

    this.watcher = this.watch();
  }

  public watch() {
    return chokidar.watch(this.options.watchDir, {
      ignoreInitial: this.options.ignoreInitial,
    });
  }

  public on(event: string, callback: CallbackFunctionVariadic): void {
    d("Running listener");
    this.watcher.on(event, (file) => {
      d("Event triggered: %o", file);
      callback(file);
    });
  }
}
