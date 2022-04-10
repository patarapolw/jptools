module.exports = {
  plugins: [
    require('./volarPlugins/prettier')(
      ['html', 'css', 'scss', 'less', 'typescript', 'javascript'],
      '.prettierrc.json'
    )
  ]
}
