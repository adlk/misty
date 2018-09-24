import chalk from "chalk";
import debug from "debug";
import minimist from "minimist";

import Execute from "./lib/Execute";

const d = debug("misty:exec");

const args: any = minimist(process.argv.slice(2));

if (args.cmd) {
  // tslint:disable-next-line:no-unused-expression
  new Execute({
    cmd: args.cmd,
    cwd: args.cwd,
    name: args.name,
    watchDir: args.watchDir,
  });
} else {
  throw new Error(chalk`{red Exec: Parameters {bold "cmd"} is missing}`);
}
