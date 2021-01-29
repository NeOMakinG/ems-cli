import {Command} from '@oclif/command'
import cli from 'cli-ux'
import {exec} from 'child_process'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as process from 'process'
import * as path from 'path'

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
        name: 'type',
        message: 'Which type of screen you want ?',
        choices: ['basic', 'basic-header', 'basic-toolbar']
      },
      {
        type: 'string',
        name: 'name',
        message: 'Whats the name ?'
      },
    ])
    .then(answers => {
      this.mooveTemplate(answers.type, answers.name)
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
    const directoryPath = path.join(__dirname, '../')

    fs.mkdirSync(`${this.path}/screens/${name}`)
    // @ts-ignore
    fs.copyFileSync(`${directoryPath}../src/templates/screens/${template}`, `${this.path}/screens/${name}/index.tsx`, (err) => {
      if (err) throw err
      console.log('source.txt was copied to destination.txt')
    })


    const screensData = fs.readFileSync(`${this.path}/navigation/cli-screens.tsx`, 'utf8')
    const content = screensData.split('// cli-imports')
    content[1] = `// cli-imports\n${content[1]}\nimport ${name} from '../screens/${name}';\n// cli-imports\n`
    const globals = content.join('\n')

    const globalsSplit = globals.split('// globals-imports')
    globalsSplit[1] = `// globals-imports\n${globalsSplit[1]}\n{name: '${name}', component: ${name}},\n// globals-imports\n`
    const final = globalsSplit.join('\n')
    fs.writeFileSync(`${this.path}/navigation/cli-screens.tsx`, final)
  }
}
