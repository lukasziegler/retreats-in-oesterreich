/** Mini Markdown for frontmatter fields like image_caption: links [text](url) only. */
export function mdInlineLinks(text: string): string {
  return text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>',
  );
}
