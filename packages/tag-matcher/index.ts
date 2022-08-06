import fs from 'fs';
import matter from 'gray-matter';
import yaml from 'yaml';

function mLoad(s: string) {
  const [,fm0] = s.split(/^---\r?\n/)
  if (!fm0) {
    return { content: s, data: {} }
  }

  const [fm, content = ''] = fm0.split(/\r?\n---(\r?\n)?/)
  return { content, data: yaml.parse(fm) }
}

const s = fs.readFileSync('README.md', 'utf-8')

console.log(matter(s))
console.log(mLoad(s))
