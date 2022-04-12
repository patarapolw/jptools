export function tryCreateElement(tag: string) {
  const element = document.createElement(tag)
  const repr = element.toString()

  const output = {
    element,
    tag,
    type: 'standard',
    isValid: repr !== '[object HTMLUnknownElement]'
  }

  if (
    [
      'annotation-xml',
      'color-profile',
      'font-face',
      'font-face-src',
      'font-face-uri',
      'font-face-format',
      'font-face-name',
      'missing-glyph'
    ].includes(tag)
  ) {
    // These are not valid customElement identifiers
    // But if not defined, they will be '[object HTMLUnknownElement]', anyway.
  } else if (tag.includes('-')) {
    output.type = 'customElement'
    if (repr === '[object HTMLElement]') {
      output.isValid = false
    }
  }

  return output
}

export function isValidElement(tag: string) {
  return tryCreateElement(tag).isValid
}
