export default {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: ['**/dist/**', '**/coverage/**', '**/node_modules/**'],
  rules: {
    // BEM 类名带 __ / --，关闭默认 kebab-case 限制
    'selector-class-pattern': null,
    // 自定义属性统一在 variables.scss 声明，允许语义命名
    'custom-property-pattern': null,
    'declaration-empty-line-before': null,
    'no-descending-specificity': null,
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
}
