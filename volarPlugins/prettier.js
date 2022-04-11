const { format, resolveConfigFile, resolveConfig } = require('prettier')
const { randomUUID } = require('crypto')

/**
 *
 * @param {string[]} languages
 * @returns {import('@volar/vue-language-service-types').EmbeddedLanguageServicePlugin}
 */
module.exports = function volarPrettierPlugin(languages) {
  const prettierConfig = resolveConfig.sync(resolveConfigFile.sync())

  return {
    format(document, range, options) {
      // I don't if what is return matters or not. It is `NullableResult<TextEdit[]>` after all.
      if (!languages.includes(document.languageId)) return []

      const originalText = document.getText()

      let preFormattedText = originalText
      const isHTML = document.languageId === 'html'

      // Prettier breaks {{'...long line...'}} in <template> tags, without a good fix.
      // {{'...shorter line...'}} {{'...shorter line...'}} doesn't appear to work.
      // The only real another fix is <span> {{'...shorter line...'}} </span>
      const noBreak = new Map()
      if (isHTML) {
        preFormattedText = preFormattedText
          .replace(/ *{{ *(['"][^]+?\1) *}} */g, (p0, p1) => {
            const id = `{{'${randomUUID()}'}}`
            p0 = `{{ ${p1} }}`
            noBreak.set(id, p0)
            return id
          })
          // This one is opinionated, but I just put it here, anyway.
          .replace(/> ?({{.+?}})/g, '> $1')
          .replace(/({{.+?}}) ?</g, '$1 <')
      }

      let formattedText = format(preFormattedText, {
        ...prettierConfig,
        tabWidth: options.tabSize,
        useTabs: !options.insertSpaces,
        filepath: document.uri
      })

      if (isHTML) {
        formattedText = formattedText.replace(/{{'.+?'}}/g, (p0) => {
          return noBreak.get(p0) || p0
        })
      } else {
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
