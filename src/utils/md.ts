/** Mini-Markdown für Frontmatter-Felder wie image_caption: nur Links [text](url). */
export function mdInlineLinks(text: string): string {
  return text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>',
  );
}
