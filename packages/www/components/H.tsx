const H = (props: { level: number; children: any }) => {
  const lv = Math.floor(props.level)
  const Component = lv < 1 ? 'h1' : lv > 6 ? 'h6' : `h${lv}`

  // @ts-ignore
  return <Component>{props.children}</Component>
}

export default H
