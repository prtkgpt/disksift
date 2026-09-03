import React from "react";

function inline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} rel="noopener noreferrer">{link[1]}</a>;
    return part;
  });
}

export default function MarkdownArticle({ source }: { source: string }) {
  const lines = source.replace(/\r/g, "").split("\n");
  const nodes: React.ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index++; continue; }
    if (line.startsWith("### ")) nodes.push(<h3 key={index}>{inline(line.slice(4))}</h3>);
    else if (line.startsWith("## ")) nodes.push(<h2 key={index}>{inline(line.slice(3))}</h2>);
    else if (line.startsWith("# ")) nodes.push(<h1 key={index}>{inline(line.slice(2))}</h1>);
    else if (line.startsWith("- ")) {
      const items = []; const start = index;
      while (index < lines.length && lines[index].trim().startsWith("- ")) { items.push(lines[index].trim().slice(2)); index++; }
      nodes.push(<ul key={start}>{items.map((item, i) => <li key={i}>{inline(item)}</li>)}</ul>); continue;
    } else {
      const paragraph = [line]; const start = index;
      while (++index < lines.length && lines[index].trim() && !/^#{1,3} |^- /.test(lines[index].trim())) paragraph.push(lines[index].trim());
      nodes.push(<p key={start}>{inline(paragraph.join(" "))}</p>); continue;
    }
    index++;
  }
  return <div className="article-body">{nodes}</div>;
}
