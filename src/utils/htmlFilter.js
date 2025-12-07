// Lightweight HTML sanitizer/filter without external dependencies
// Usage:
//   import { sanitizeHtml } from '../utils/htmlFilter';
//   const safe = sanitizeHtml(dirtyHtml, { mode: 'allowlist' });
//
// Options:
// - mode: 'allowlist' | 'strip' (default 'allowlist')
// - allowedTags: array of tag names allowed in output (default safe set)
// - allowedAttrs: array of attribute names allowed on allowed tags (default ['href','title','alt','src'])
// - allowProtocols: array of allowed URL protocols for href/src (default ['http:','https:','mailto:'])

const DEFAULT_ALLOWED_TAGS = [
  "b",
  "strong",
  "i",
  "em",
  "u",
  "br",
  "p",
  "span",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "code",
  "pre",
  "blockquote",
];

const DEFAULT_ALLOWED_ATTRS = ["href", "title", "alt", "src"];
const DEFAULT_PROTOCOLS = ["http:", "https:", "mailto:"];

function isSafeUrl(url, allowedProtocols = DEFAULT_PROTOCOLS) {
  try {
    const u = new URL(url, window.location.origin);
    return allowedProtocols.includes(u.protocol);
  } catch (e) {
    return false;
  }
}

export function sanitizeHtml(html, options = {}) {
  const {
    mode = "allowlist",
    allowedTags = DEFAULT_ALLOWED_TAGS,
    allowedAttrs = DEFAULT_ALLOWED_ATTRS,
    allowProtocols = DEFAULT_PROTOCOLS,
  } = options;

  if (typeof html !== "string" || !html.trim()) return "";

  if (mode === "strip") {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  function filterNode(node) {
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        return document.createTextNode(node.textContent);
      case Node.ELEMENT_NODE: {
        const tag = node.tagName.toLowerCase();
        if (!allowedTags.includes(tag)) {
          const frag = document.createDocumentFragment();
          node.childNodes.forEach((child) => {
            const filtered = filterNode(child);
            if (filtered) frag.appendChild(filtered);
          });
          return frag;
        }
        const el = document.createElement(tag);

        for (const attr of Array.from(node.attributes)) {
          const name = attr.name.toLowerCase();
          const value = attr.value;
          if (!allowedAttrs.includes(name)) continue;
          if (name === "href" || name === "src") {
            if (!isSafeUrl(value, allowProtocols)) continue;
          }
          el.setAttribute(name, value);
        }

        node.childNodes.forEach((child) => {
          const filtered = filterNode(child);
          if (filtered) el.appendChild(filtered);
        });
        return el;
      }
      default:
        return null;
    }
  }

  const safeFrag = document.createDocumentFragment();
  doc.body.childNodes.forEach((node) => {
    const filtered = filterNode(node);
    if (filtered) safeFrag.appendChild(filtered);
  });

  const container = document.createElement("div");
  container.appendChild(safeFrag);
  return container.innerHTML;
}

export function stripHtml(html) {
  return sanitizeHtml(html, { mode: "strip" });
}
