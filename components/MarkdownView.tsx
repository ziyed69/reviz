"use client";

/** Rendu markdown simple sans dépendance externe. */

export function MarkdownView({ content }: { content: string }) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="md-list">
        {listItems.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
        ))}
      </ul>
    );
    listItems = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      nodes.push(
        <h2 key={i} className="md-h2">
          {trimmed.slice(3)}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      nodes.push(
        <h3 key={i} className="md-h3">
          {trimmed.slice(4)}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
      continue;
    }

    if (trimmed.startsWith("|")) {
      flushList();
      nodes.push(
        <pre key={i} className="md-table">
          {line}
        </pre>
      );
      continue;
    }

    if (trimmed.startsWith(">")) {
      flushList();
      nodes.push(
        <blockquote key={i} className="md-quote">
          {trimmed.replace(/^>\s?/, "")}
        </blockquote>
      );
      continue;
    }

    flushList();
    nodes.push(
      <p key={i} className="md-p" dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed) }} />
    );
  }

  flushList();

  return <article className="markdown-view">{nodes}</article>;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}
