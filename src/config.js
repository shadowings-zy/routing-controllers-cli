const fse = require('fs-extra')
const projectTypeValue = ['express', 'koa']
const eslintSettingValue = [
  'yes (Use @typescript-eslint/recommended extension)',
  'yes (I will config eslint setting later)',
  'no',
]

/**
 * 生成routing-controllers脚手架的配置
 * @param {*} program commander对象
 */
const configProject = (program) => {
  const prompts = []
  prompts.push({
    type: 'input',
    name: 'projectName',
    message: 'Please enter the project name:',
    validate(input) {
      if (!input) {
        return 'invalid project name.'
      }
      if (fse.existsSync(input)) {
        return 'directory exists, please change project name.'
      }
      return true
    },
  })

  prompts.push({
    type: 'input',
    name: 'projectDescription',
    message: 'Please enter the project description:',
    default: 'a project using routing-controllers framework.',
  })

  prompts.push({
    type: 'list',
    name: 'projectType',
    message: 'Please choose web framework (express or koa):',
    choices: [
      { title: projectTypeValue[0], value: projectTypeValue[0] },
      { title: projectTypeValue[1], value: projectTypeValue[1] },
    ],
  })

  prompts.push({
    type: 'list',
    name: 'eslintSetting',
    message: 'Do you want to use eslint to check and format your code?',
    choices: [
      { title: eslintSettingValue[0], value: eslintSettingValue[0] },
      { title: eslintSettingValue[1], value: eslintSettingValue[1] },
      { title: eslintSettingValue[2], value: eslintSettingValue[2] },
    ],
  })

  return prompts
}

module.exports = {
  projectTypeValue,
  eslintSettingValue,
  configProject
}
