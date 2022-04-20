/** @type {import('@volar-plugins/prettier')} */
const { volarPrettierPlugin } = require('@volar-plugins/prettier')

module.exports = {
  plugins: [
    volarPrettierPlugin({
      languages: ['html', 'css', 'scss', 'less', 'typescript', 'javascript'],
      html: {
        keepLongTemplates: true,
        breakContentsFromTags: true,
      },
    }),
  ],
}
