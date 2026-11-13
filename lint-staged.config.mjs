export default {
  '*.{js,mjs,cjs,vue}': ['eslint --fix --max-warnings 0', 'prettier --write'],
  '*.{css,scss,vue}': ['stylelint --fix --allow-empty-input'],
  '*.{json,md,yml,yaml,html}': ['prettier --write'],
}
