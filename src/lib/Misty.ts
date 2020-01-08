import chalk from "chalk";
import concurrently from "concurrently";
import debug from "debug";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const d = debug("misty:Misty");

interface ITaskConfig {
  cmd: string;
  cwd?: string;
  waitOn?: string;
  watchDir?: string;
}

interface IConfig {
  [key: string]: ITaskConfig;
}

export default class Misty {
  public config: IConfig;
  public colors = [
    chalk.redBright,
    chalk.greenBright,
    chalk.yellowBright,
    chalk.cyanBright,
    chalk.magentaBright,
  ];

  constructor() {
    this.config = this.loadConfig();

    this.run();
  }

  public loadConfig() {
    d("Loading misty.yml configuration");
    try {
      const config: IConfig = yaml.safeLoad(fs.readFileSync("./misty.yml", "utf8"));
      d("Configuration loaded: %o", config);

      return config;
    } catch (err) {
      throw new Error("Could not load misty.yml");
    }
  }

  public run() {
    const keys = Object.keys(this.config);
    d("Preparing runner for: %o", keys);

    const commands: Array<{}> = [];

    Object.entries(this.config).forEach((entry: [string, ITaskConfig]) => {
      const name = entry[0];
      const config = entry[1];

      let command = config.cmd;

      // tslint:disable-next-line:max-line-length
      command = `node ${path.join(__dirname, "../exec.js")} --name="${name}" --watchDir="${config.watchDir}" --cmd="${command}" ${config.cwd ? `--cwd=${config.cwd}` : ""} ${process.env.DEBUG ? `--debug=${process.env.DEBUG}` : ""}`;

      if (config.waitOn) {
        command = `npx wait-on ${config.waitOn} && ${command}`;
      }

      commands.push({
        command,
        name: this.getRandomChalkColor()(name),
      });
    });

    concurrently(commands, {
      killOthers: ["failure", "success"],
      prefix: "name",
      restartTries: 1,
    }).then(() => {
      d("Successfully ran Misty ✌️");
    }, () => {
      d("Misty failed 😱");
    });
  }

  public getRandomChalkColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)].bold;
  }
}
