const { curry } = require('lodash/fp');

const isType = curry((type, node) => node.type === type);

const isMdxBlockElement = curry(
  (name, node) => isType('mdxBlockElement', node) && node.name === name
);

const isMdxSpanElement = curry(
  (name, node) => isType('mdxSpanElement', node) && node.name === name
);

const isMdxElement = curry(
  (name, node) => isMdxBlockElement(name, node) || isMdxSpanElement(name, node)
);

const findAttribute = (attributeName, node) => {
  if (!node.attributes) {
    return null;
  }
  const attribute = node.attributes.find((attr) => attr.name === attributeName);
  return attribute ? attribute.value : null;
};

module.exports = {
  isType,
  isMdxBlockElement,
  isMdxSpanElement,
  isMdxElement,
  findAttribute,
};
