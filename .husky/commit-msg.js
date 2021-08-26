const chalk = require('chalk');
const { argv } = require('process');

const [_node, _run, ...args] = argv;

const content = args.join(' ').split('=')[1];

let status = 0;
if (!/^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert):.+/.test(content)) {
  console.log(chalk.bgBlack.red(`[ERROR]格式错误`));
  console.log(`你的commit message:
  ${content}
  `);
  console.log(`正确的格式为:
  (feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert): XXXX
  更多参考https://confluence.xiaoshu.biz/x/WIomAg
  `);
  status = 1;
}

process.exit(status);
