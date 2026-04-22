import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const markdownRenderer = new marked.Renderer();

markdownRenderer.heading = function ({ tokens, depth }) {
  const mappedLevel = depth === 1 ? 4 : depth === 2 ? 5 : 6;
  const text = this.parser.parseInline(tokens);
  return `<h${mappedLevel}>${text}</h${mappedLevel}>`;
};

marked.setOptions({
  gfm: true,
  breaks: true,
  renderer: markdownRenderer
});

export function markdownToSafeHtml(markdown: string) {
  const source = markdown.trim();
  if (!source) {
    return "";
  }

  const rawHtml = marked.parse(source) as string;

  return sanitizeHtml(rawHtml, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img"
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title"]
    },
    allowedSchemes: ["http", "https", "mailto"]
  });
}
