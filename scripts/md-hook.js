/**
 * 修改文章时，commit提交的时候，自动更改文章的updateTime字段
 * 新创建的文章，commit提交的时候，自动添加文章的pubDatetime和updateTime字段
 */

import { writeFileSync, existsSync } from 'node:fs';
import { extname, resolve, basename, dirname } from 'node:path';
import matter from 'gray-matter';

const { read, stringify } = matter;

const files = process.argv.slice(2);

const mdDir = resolve(process.cwd(), 'src/content/blog/');

for (const file of files) {
  if (!file) {
    console.error(`未知的文件 ${file}`);
    continue;
  }

  if (extname(file).toLocaleLowerCase() !== '.md') {
    console.warn(`文件 ${file} 非markdown文件`);
    continue;
  }

  if (dirname(resolve(dirname(file), basename(file))) !== mdDir) {
    console.log(`文件 ${file} 不在目录src/content/blog/内`);
    continue;
  }

  if (!existsSync(file)) {
    console.error(`文件 ${file} 不存在`);
    continue;
  }

  const { content, data } = read(file);

  if (data.draft) {
    console.log(`文件 ${file} 是草稿状态`);
    continue;
  }

  const now = new Date();

  if (!data.pubDatetime) {
    data.pubDatetime = now();
  }
  data.updateTime = new Date();

  writeFileSync(file, stringify({ content }, data));
}
