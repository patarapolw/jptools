const { readFileSync, existsSync } = require('fs')
const prettier = require('prettier')

/**
 *
 * @param {string[]} languages
 * @param {string} [prettierrc]
 * @returns {import('@volar/vue-language-service-types').EmbeddedLanguageServicePlugin}
 */
module.exports = function volarPrettierPlugin(languages, prettierrc) {
  const prettierConfig =
    prettierrc && existsSync(prettierrc)
      ? JSON.parse(readFileSync(prettierrc, 'utf-8'))
      : require('cosmiconfig').cosmiconfigSync('prettier').search().config

  return {
    format(document, range, options) {
      // I don't if what is return matters or not. It is `NullableResult<TextEdit[]>` after all.
      if (!languages.includes(document.languageId)) return []

      const originalText = document.getText()
      let formattedText = prettier.format(originalText, {
        ...prettierConfig,
        tabWidth: options.tabSize,
        useTabs: !options.insertSpaces,
        filepath: document.uri
      })

      if (document.languageId !== 'html') {
        formattedText = '\n' + formattedText
      }

      if (formattedText === originalText) return []

      return [
        {
          range: {
            start: document.positionAt(0),
            end: document.positionAt(originalText.length)
          },
          newText: formattedText
        }
      ]
    }
  }
}
