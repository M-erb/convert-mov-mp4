import inquirer from 'inquirer'
import arg from 'arg'
import { execSync } from 'child_process'
import chalk from 'chalk'
import fs from 'fs-extra'

function log (...args) { console.log(...args) }

const questions = [
  {
    type: 'input',
    name: 'folder',
    message: 'Folder to search in?'
  }
]

const args = arg({
  // Types
  '--folder': String,
  '--help': Boolean,
  '--version': Boolean,

  // Aliases
  '-f': '--folder',
  '-h': '--help',
  '-v': '--version',
})

function convertVideo (fileNameWithExt, folder) {
  return new Promise((resolve, reject) => {
    const fileName = fileNameWithExt.split('.')[0]

    try {
      execSync(`ffmpeg -i ${folder}/${fileNameWithExt} -vcodec h264 -acodec mp2 ${folder}/${fileName}.mp4`, { stdio: [0, 1, 2] })
    } catch (error) {
      reject(`error with ${fileNameWithExt}`, error)
    }

    resolve()
  })
}

async function init () {
  log(chalk.blue('-==Lets get convert`in!==-'))

  let Folder = ''
  if (args['--folder']) Folder = args['--folder']
  else {
    const answers = await inquirer.prompt(questions)
    Folder = answers.folder
  }

  const files = await fs.readdir(Folder)
  const movFiles = files.filter(item => item.endsWith('.MOV'))

  log(`Found ${movFiles.length} MOV files in "${Folder}"`)
  log(chalk.bgBlue('Processing...'))

  for (const file of movFiles) {
    convertVideo(file, Folder).catch(error => console.error(error))
  }
}

init()
