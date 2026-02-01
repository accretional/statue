const defaultOptions = {
  label: 'Footnotes',
  labelId: 'footnote-label'
};

const normalizeIdentifier = (value) => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^\^+/, '')
    .replace(/[^a-z0-9_-]+/g, '-');
  const cleaned = normalized.replace(/^-+|-+$/g, '');
  return cleaned || 'note';
};

const isFootnoteReference = (node) => {
  return node?.type === 'linkReference' && typeof node.identifier === 'string' && node.identifier.startsWith('^');
};

const stripLeadingIndent = (paragraph) => {
  if (!paragraph?.children?.length) return;
  const firstText = paragraph.children.find((child) => child.type === 'text');
  if (firstText?.value) {
    firstText.value = firstText.value.replace(/^[ \t]{2,}/, '');
  }
};

const findDefinitionStarts = (children = []) => {
  const starts = [];
  for (let i = 0; i < children.length - 1; i += 1) {
    const current = children[i];
    const next = children[i + 1];
    if (isFootnoteReference(current) && next?.type === 'text' && next.value.trimStart().startsWith(':')) {
      starts.push(i);
    }
  }
  return starts;
};

const isDefinitionParagraph = (node) => {
  if (node?.type !== 'paragraph') return false;
  return findDefinitionStarts(node.children).length > 0;
};

const buildDefinitionParagraphFromSegment = (children, startIndex, endIndex) => {
  const segment = children.slice(startIndex + 1, endIndex);
  const trimmedChildren = [];
  let trimmed = false;

  for (const child of segment) {
    if (!trimmed && child?.type === 'text') {
      const value = child.value.replace(/^\s*:\s?/, '');
      trimmed = true;
      if (value.length) {
        trimmedChildren.push({ ...child, value });
      }
      continue;
    }
    trimmedChildren.push(child);
  }

  return { type: 'paragraph', children: trimmedChildren };
};

const extractDefinitionSegments = (node) => {
  if (!node?.children?.length) return [];
  const starts = findDefinitionStarts(node.children);
  if (!starts.length) return [];

  const segments = [];

  for (let index = 0; index < starts.length; index += 1) {
    const startIndex = starts[index];
    const endIndex = index + 1 < starts.length ? starts[index + 1] : node.children.length;
    const refNode = node.children[startIndex];
    const id = normalizeIdentifier(refNode.identifier || refNode.label);
    const paragraph = buildDefinitionParagraphFromSegment(node.children, startIndex, endIndex);
    segments.push({ id, nodes: [paragraph] });
  }

  return segments;
};

const createBackrefHtml = (id) => {
  return ` <a href="#fnref-${id}" class="footnote-backref" data-footnote-backref aria-label="Back to content">&#8617;</a>`;
};

const ensureParagraph = (nodes) => {
  if (!nodes.length) {
    nodes.push({ type: 'paragraph', children: [] });
  }

  const lastNode = nodes[nodes.length - 1];
  if (lastNode.type !== 'paragraph') {
    const paragraph = { type: 'paragraph', children: [] };
    nodes.push(paragraph);
    return paragraph;
  }

  if (!Array.isArray(lastNode.children)) {
    lastNode.children = [];
  }

  return lastNode;
};

const cloneNodes = (nodes) => {
  return nodes.map((node) => ({
    ...node,
    children: node.children ? cloneNodes(node.children) : node.children
  }));
};

const extractDefinitions = (tree) => {
  const definitions = new Map();
  const children = tree.children || [];

  for (let i = 0; i < children.length; i += 1) {
    const node = children[i];
    if (!isDefinitionParagraph(node)) continue;

    const segments = extractDefinitionSegments(node);
    if (!segments.length) continue;
    children.splice(i, 1);
    i -= 1;

    segments.forEach((segment) => {
      definitions.set(segment.id, segment.nodes);
    });

    const lastId = segments[segments.length - 1].id;
    const definitionNodes = definitions.get(lastId) || [];

    while (children[i + 1]?.type === 'paragraph') {
      const next = children[i + 1];
      if (next.children?.[0]?.type === 'text' && /^[ \\t]{2,}/.test(next.children[0].value)) {
        stripLeadingIndent(next);
        definitionNodes.push(next);
        children.splice(i + 1, 1);
        continue;
      }
      break;
    }
  }

  return definitions;
};

const createFootnotesSection = (order, definitions, label, labelId) => {
  const heading = {
    type: 'heading',
    depth: 2,
    data: {
      hProperties: {
        id: labelId,
        className: ['footnotes-title']
      }
    },
    children: [{ type: 'text', value: label }]
  };

  const listItems = order.map((id) => {
    const definitionNodes = definitions.get(id);
    const children = definitionNodes ? cloneNodes(definitionNodes) : [];
    const paragraph = ensureParagraph(children);

    paragraph.children.push({ type: 'html', value: createBackrefHtml(id) });

    const isLoose = children.length > 1;

    return {
      type: 'listItem',
      spread: isLoose,
      data: {
        hProperties: {
          id: `fn-${id}`,
          className: ['footnote-item'],
          'data-footnote-definition': true
        }
      },
      children
    };
  });

  const list = {
    type: 'list',
    ordered: true,
    spread: listItems.some((item) => item.spread),
    start: 1,
    data: {
      hProperties: {
        className: ['footnotes-list']
      }
    },
    children: listItems
  };

  return [
    { type: 'html', value: '<section class="footnotes" data-footnotes>' },
    heading,
    list,
    { type: 'html', value: '</section>' }
  ];
};

const remarkFootnotes = (options = {}) => {
  const { label, labelId } = { ...defaultOptions, ...options };

  return (tree) => {
    const definitions = extractDefinitions(tree);
    const order = [];
    const refOrder = new Map();
    const refCounts = new Map();

    const addReference = (id) => {
      if (!refOrder.has(id)) {
        refOrder.set(id, order.length + 1);
        order.push(id);
      }
      return refOrder.get(id);
    };

    const walk = (node) => {
      if (!node || typeof node !== 'object') return;
      if (!Array.isArray(node.children)) return;

      for (let i = 0; i < node.children.length; i += 1) {
        const child = node.children[i];
        if (!child || typeof child !== 'object') continue;

        if (isFootnoteReference(child)) {
          const id = normalizeIdentifier(child.identifier || child.label);
          const number = addReference(id);
          const count = (refCounts.get(id) || 0) + 1;
          refCounts.set(id, count);

          const refId = count === 1 ? `fnref-${id}` : `fnref-${id}-${count}`;
          const html = `<sup id=\"${refId}\"><a href=\"#fn-${id}\" class=\"footnote-ref\" data-footnote-ref aria-describedby=\"${labelId}\">${number}</a></sup>`;

          node.children[i] = { type: 'html', value: html };
          continue;
        }

        walk(child);
      }
    };

    walk(tree);

    if (!order.length) return;

    const footnotesSection = createFootnotesSection(order, definitions, label, labelId);
    tree.children.push(...footnotesSection);
  };
};

export default remarkFootnotes;
