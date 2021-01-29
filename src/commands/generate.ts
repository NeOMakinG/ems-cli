import {Command} from '@oclif/command'
import cli from 'cli-ux'
import {exec} from 'child_process'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as process from 'process'

export default class Generate extends Command {
  static description = 'Generate something'

  public path = process.cwd()

  static args = [{name: 'type'}, {name: 'name'}]

  async run() {
    const that = this

    inquirer
    .prompt([
      {
        type: 'rawlist',
        name: 'Which type of screen you want ?',
        choices: ['basic', 'basic-header', 'basic-toolbar']
      },
      {
        type: 'string',
        name: 'Whats the name ?'
      },
    ])
    .then(answers => {
      this.mooveTemplate(answers[0], answers[1])
    })
    .catch(error => {
      if(error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        that.log(error)
      } else {
        that.log(error)
      }
    })
  }

  async mooveTemplate(template: string, name: string) {
    fs.createReadStream(`../templates/screens/${template}`).pipe(fs.createWriteStream(`${this.path}/screens/${name}/index.tsx`))
  }
}
