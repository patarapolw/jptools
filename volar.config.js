const PRETTIER_LANG = ['html', 'typescript', 'javascript', 'css', 'scss']

module.exports = {
  plugins: [
    {
      format(document, range, options) {
        const lang = document.languageId
        if (!PRETTIER_LANG.includes(lang)) return

        let parser = lang
        switch (parser) {
          case 'javascript':
            parser = 'typescript'
        }

        let formattedText = require('prettier').format(document.getText(), {
          ...require('./.prettierrc.json'),
          parser
        })

        if (lang !== 'html') {
          formattedText = `\n${formattedText}`
        }

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
