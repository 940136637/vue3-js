export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'perf',
        'style',
        'docs',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    // 中文 subject 不做大小写校验
    'subject-case': [0],
    'subject-full-stop': [0],
    'header-max-length': [2, 'always', 72],
    'body-max-line-length': [0],
  },
}
