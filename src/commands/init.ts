import {Command} from '@oclif/command'
import cli from 'cli-ux'
import {exec} from 'child_process'
import * as fs from 'fs'
import * as process from 'process'

export default class Init extends Command {
  static description = 'describe the command here'

  public path = process.cwd()

  static args = [{name: 'name'}]

  async run() {
    const {args} = this.parse(Init)
    let name = 'ems-app'

    if (!args.name) {
      name = await cli.prompt('Name your app (example: Nutripet)')
    }

    exec(`git clone git@github.com:NeOMakinG/expo-managed-starter.git ${name.toLowerCase().replace(' ', '')}`, async (err, stdout, stderr) => {
      if (err) {
        return
      }

      if (stdout || stderr) {
        this.log(stdout ?? stderr)
      }

      this.log(`./${name.toLowerCase().replace(' ', '')} app has been generated.`)

      this.modifyApp(name.toLowerCase().replace(' ', ''), name)
    })
  }

  async modifyApp(folder: string, name: string) {
    exec(`rm -rf ${this.path}/${folder}/.git`, async err => {
      if (err) {
        return
      }

      this.log(`./${folder}/.git removed.`)

      const appDatas = fs.readFileSync(`${this.path}/${folder}/app.json`)
      // @ts-ignore
      const appInfos = JSON.parse(appDatas)
      appInfos.expo.name = name
      appInfos.expo.slug = folder

      const data = JSON.stringify(appInfos, null, 2)
      fs.writeFileSync(`${this.path}/${folder}/app.json`, data)
      this.log('app.json modified.')
    })
  }
}
