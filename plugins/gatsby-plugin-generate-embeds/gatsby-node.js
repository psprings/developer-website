const fs = require('fs');
const path = require('path');
const unified = require('unified');
const toHast = require('mdast-util-to-hast');
const html = require('rehype-stringify');
const removeImports = require('remark-mdx-remove-imports');
const removeExports = require('remark-mdx-remove-exports');
const all = require('mdast-util-to-hast/lib/all');

const fencedCodeBlock = require('./utils/fencedCodeBlock');
const handlers = require('./utils/handlers');
const jsxImagesToChildren = require('./utils/jsxImagesToChildren');

const mdxElement = (h, node) => {
  const handler = handlers[node.name];

  if (!handler) {
    return all(h, node);
  }
  return handler(h, node);
};

const htmlGenerator = unified()
  .use(jsxImagesToChildren)
  .use(fencedCodeBlock)
  .use(removeImports)
  .use(removeExports)
  .use(html);

exports.onPostBuild = async ({ graphql, store }) => {
  const { program } = store.getState();

  const { data } = await graphql(`
    query {
      allMdx(
        filter: {
          frontmatter: { template: { eq: "GuideTemplate" } }
          fileAbsolutePath: { regex: "/src/markdown-pages/" }
        }
      ) {
        nodes {
          mdxAST
          slug
          fields {
            fileRelativePath
          }
        }
      }
      allImageSharp {
        nodes {
          parent {
            ... on File {
              relativePath
            }
          }
          original {
            src
          }
        }
      }
    }
  `);

  const { allMdx, allImageSharp } = data;

  const imageHashMap = allImageSharp.nodes.reduce(
    (acc, { original, parent }) => ({
      ...acc,
      [parent.relativePath]: original.src,
    }),
    {}
  );

  allMdx.nodes.forEach((node) => {
    const {
      slug,
      mdxAST,
      fields: { fileRelativePath },
    } = node;

    const filepath = path.join(
      program.directory,
      'public',
      `${slug}-embed.html`
    );

    const transformedAST = htmlGenerator.runSync(mdxAST);
    const html = htmlGenerator.stringify(
      toHast(transformedAST, {
        handlers: {
          mdxSpanElement: mdxElement,
          mdxBlockElement: mdxElement,
          code: handlers.CodeBlock,
          image: (h, node) =>
            handlers.image(h, node, imageHashMap, fileRelativePath),
        },
      })
    );

    fs.writeFileSync(filepath, html);
  });
};
