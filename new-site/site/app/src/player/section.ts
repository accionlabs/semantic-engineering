import { useEffect, useState } from 'react';
import { cachedPage, loadPage, type Block, type PageData } from '../content/data';
import type { Loc } from '../content/film';

/** The blocks of a page under one heading (its own section and the subsections inside it), or the whole page. */
export const sectionBlocks = (data: PageData, anchor?: string): Block[] => {
  if (!anchor) return data.blocks;
  const i = data.blocks.findIndex((b) => b.k === 'h' && b.id === anchor);
  if (i < 0) return data.blocks;
  const level = (data.blocks[i] as { level: number }).level;
  const end = data.blocks.findIndex((b, j) => j > i && b.k === 'h' && b.level <= level);
  return data.blocks.slice(i + 1, end < 0 ? undefined : end).filter((b) => b.k !== 'faq');
};
/** The first paragraph of a section, as plain text. */
export const firstParagraph = (data: PageData, anchor?: string) => {
  const b = sectionBlocks(data, anchor).find((x) => x.k === 'p');
  return b && b.k !== 'h' ? (b.text ?? '') : '';
};

/** Loads a page's data for a location; undefined until it arrives. */
export const usePage = (loc?: Loc) => {
  const key = loc?.page.key;
  const [data, setData] = useState<PageData | undefined>(() => (key ? cachedPage(key) : undefined));
  useEffect(() => {
    if (!key) return;
    const hit = cachedPage(key);
    if (hit) setData(hit); else { setData(undefined); loadPage(key).then(setData).catch(() => undefined); }
  }, [key]);
  return data?.key === key ? data : undefined;
};
