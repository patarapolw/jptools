const PRETTIER_LANG = ['html', 'typescript', 'javascript', 'css', 'scss']

module.exports = {
  plugins: [
    {
      format(document, range, options) {
        const lang = document.languageId

        let parser = lang
        switch (parser) {
          case 'javascript':
            parser = 'typescript'
        }

        if (!PRETTIER_LANG.includes(lang)) return
        let formattedText = require('prettier')
          .format(document.getText(), {
            ...require('./.prettierrc.json'),
            parser
          })
          .replace(/^;/, '')
        if (document.languageId !== 'html') {
          formattedText = `\n${formattedText}`
        }
        require('fs').writeFileSync(
          `tmp/${new Date().toISOString()}.json`,
          JSON.stringify({ document, formattedText, lang })
        )
        // }

        if (formattedText === document.getText()) return []

        return [
          {
            range: {
              start: document.positionAt(0),
              end: document.positionAt(document.getText().length)
            },
            newText: formattedText
          }
        ]
      }
    }
  ]
}
