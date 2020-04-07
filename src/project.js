const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const path = require('path')
const { exec } = require('child_process')
const copyTool = require('copy-dir')
const jsonfile = require('jsonfile')
const { projectTypeValue, eslintSettingValue } = require('./config')

/**
 * init project
 * @param {*} prompts
 * @param {*} setProjectName
 * @param {*} setProjectGitRepo
 */
const initProject = (prompts) => {
  inquirer.prompt(prompts).then((answer) => {
    const defaultConfig = {
      projectName: 'routing-controllers-project',
      projectDescription: 'routing-controllers-project-description',
      projectType: 'express',
      eslintSetting: 'eslint-off',
    }

    const projectName = answer.projectName || defaultConfig.projectName
    const projectDescription = answer.projectDescription || defaultConfig.projectDescription
    const projectType = answer.projectType || defaultConfig.projectType
    const eslintSetting = answer.eslintSetting || defaultConfig.eslintSetting

    generate(projectName, projectDescription, projectType, eslintSetting)
  })
}

/**
 * copy template and run npm install
 * @param {*} projectName
 * @param {*} projectDescription
 * @param {*} projectType
 * @param {*} eslintSetting
 */
const generate = (projectName, projectDescription, projectType, eslintSetting) => {
  console.log(chalk.green('start initialize project'))

  const templateExpress = path.join(__dirname, 'template', 'express')
  const templateKoa = path.join(__dirname, 'template', 'koa')
  const templateEslint = path.join(__dirname, 'template', 'eslint')
  const outputDir = path.join(process.cwd(), projectName)

  if (projectType === projectTypeValue[0]) {
    copyTool.sync(templateExpress, outputDir, { cover: true })
  } else if (projectType === projectTypeValue[1]) {
    copyTool.sync(templateKoa, outputDir, { cover: true })
  }

  const packageJsonPath = path.join(outputDir, 'package.json')
  let packageJson = jsonfile.readFileSync(packageJsonPath)
  packageJson['name'] = projectName
  packageJson['description'] = projectDescription

  if (eslintSetting !== eslintSettingValue[2]) {
    packageJson['devDependencies']['@typescript-eslint/eslint-plugin'] = '^2.26.0'
    packageJson['devDependencies']['@typescript-eslint/parser'] = '^2.26.0'
    packageJson['devDependencies']['eslint'] = '^6.8.0'
    packageJson['scripts']['eslint'] = 'eslint src/**/*.*'
  }

  if (eslintSetting === eslintSettingValue[1]) {
    const emptyEslintSetting = path.join(templateEslint, 'empty')
    copyTool.sync(emptyEslintSetting, outputDir)
  } else if (eslintSetting === eslintSettingValue[0]) {
    const recommendedEslintSetting = path.join(templateEslint, 'recommended')
    copyTool.sync(recommendedEslintSetting, outputDir)
  }

  packageJson = JSON.parse(JSON.stringify(packageJson))
  jsonfile.writeFileSync(packageJsonPath, packageJson, { spaces: 2, EOL: '\r\n' })

  // run npm install
  const installSpinner = ora(`execute ${chalk.green.bold('npm install')}`)
  installSpinner.start()
  exec(`npm install --prefix ${outputDir}`, (error, stdout, stderr) => {
    if (error) {
      installSpinner.color = 'red'
      installSpinner.fail(chalk.red('npm install failed'))
      console.log(error)
    } else {
      installSpinner.color = 'green'
      installSpinner.succeed(chalk.green('npm install successful'))
      console.log(`${stderr}${stdout}`)
    }

    console.log(chalk.green('initialize project complete'))
    console.log(chalk.green('happy coding'))
  })
}

module.exports = initProject
