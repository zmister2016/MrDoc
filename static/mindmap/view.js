/*! markmap-lib v0.4.2 | MIT License */
(function (exports, d3) {
'use strict';

function count(node) {
  var sum = 0,
      children = node.children,
      i = children && children.length;
  if (!i) sum = 1;
  else while (--i >= 0) sum += children[i].value;
  node.value = sum;
}

function node_count() {
  return this.eachAfter(count);
}

function node_each(callback) {
  var node = this, current, next = [node], children, i, n;
  do {
    current = next.reverse(), next = [];
    while (node = current.pop()) {
      callback(node), children = node.children;
      if (children) for (i = 0, n = children.length; i < n; ++i) {
        next.push(children[i]);
      }
    }
  } while (next.length);
  return this;
}

function node_eachBefore(callback) {
  var node = this, nodes = [node], children, i;
  while (node = nodes.pop()) {
    callback(node), children = node.children;
    if (children) for (i = children.length - 1; i >= 0; --i) {
      nodes.push(children[i]);
    }
  }
  return this;
}

function node_eachAfter(callback) {
  var node = this, nodes = [node], next = [], children, i, n;
  while (node = nodes.pop()) {
    next.push(node), children = node.children;
    if (children) for (i = 0, n = children.length; i < n; ++i) {
      nodes.push(children[i]);
    }
  }
  while (node = next.pop()) {
    callback(node);
  }
  return this;
}

function node_sum(value) {
  return this.eachAfter(function(node) {
    var sum = +value(node.data) || 0,
        children = node.children,
        i = children && children.length;
    while (--i >= 0) sum += children[i].value;
    node.value = sum;
  });
}

function node_sort(compare) {
  return this.eachBefore(function(node) {
    if (node.children) {
      node.children.sort(compare);
    }
  });
}

function node_path(end) {
  var start = this,
      ancestor = leastCommonAncestor(start, end),
      nodes = [start];
  while (start !== ancestor) {
    start = start.parent;
    nodes.push(start);
  }
  var k = nodes.length;
  while (end !== ancestor) {
    nodes.splice(k, 0, end);
    end = end.parent;
  }
  return nodes;
}

function leastCommonAncestor(a, b) {
  if (a === b) return a;
  var aNodes = a.ancestors(),
      bNodes = b.ancestors(),
      c = null;
  a = aNodes.pop();
  b = bNodes.pop();
  while (a === b) {
    c = a;
    a = aNodes.pop();
    b = bNodes.pop();
  }
  return c;
}

function node_ancestors() {
  var node = this, nodes = [node];
  while (node = node.parent) {
    nodes.push(node);
  }
  return nodes;
}

function node_descendants() {
  var nodes = [];
  this.each(function(node) {
    nodes.push(node);
  });
  return nodes;
}

function node_leaves() {
  var leaves = [];
  this.eachBefore(function(node) {
    if (!node.children) {
      leaves.push(node);
    }
  });
  return leaves;
}

function node_links() {
  var root = this, links = [];
  root.each(function(node) {
    if (node !== root) { // Don’t include the root’s parent, if any.
      links.push({source: node.parent, target: node});
    }
  });
  return links;
}

function hierarchy(data, children) {
  var root = new Node(data),
      valued = +data.value && (root.value = data.value),
      node,
      nodes = [root],
      child,
      childs,
      i,
      n;

  if (children == null) children = defaultChildren;

  while (node = nodes.pop()) {
    if (valued) node.value = +node.data.value;
    if ((childs = children(node.data)) && (n = childs.length)) {
      node.children = new Array(n);
      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new Node(childs[i]));
        child.parent = node;
        child.depth = node.depth + 1;
      }
    }
  }

  return root.eachBefore(computeHeight);
}

function node_copy() {
  return hierarchy(this).eachBefore(copyData);
}

function defaultChildren(d) {
  return d.children;
}

function copyData(node) {
  node.data = node.data.data;
}

function computeHeight(node) {
  var height = 0;
  do node.height = height;
  while ((node = node.parent) && (node.height < ++height));
}

function Node(data) {
  this.data = data;
  this.depth =
  this.height = 0;
  this.parent = null;
}

Node.prototype = hierarchy.prototype = {
  constructor: Node,
  count: node_count,
  each: node_each,
  eachAfter: node_eachAfter,
  eachBefore: node_eachBefore,
  sum: node_sum,
  sort: node_sort,
  path: node_path,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves,
  links: node_links,
  copy: node_copy
};

var version = "2.1.1";

const defaults = Object.freeze({
  children: data => data.children,
  nodeSize: node => node.data.size,
  spacing: 0,
});

// Create a layout function with customizable options. Per D3-style, the
// options can be set at any time using setter methods. The layout function
// will compute the tree node positions based on the options in effect at the
// time it is called.
function flextree(options) {
  const opts = Object.assign({}, defaults, options);
  function accessor(name) {
    const opt = opts[name];
    return typeof opt === 'function' ? opt : () => opt;
  }

  function layout(tree) {
    const wtree = wrap(getWrapper(), tree, node=>node.children);
    wtree.update();
    return wtree.data;
  }

  function getFlexNode() {
    const nodeSize = accessor('nodeSize');
    const spacing = accessor('spacing');
    return class FlexNode extends hierarchy.prototype.constructor {
      constructor(data) {
        super(data);
      }
      copy() {
        const c = wrap(this.constructor, this, node=>node.children);
        c.each(node => node.data = node.data.data);
        return c;
      }
      get size() { return nodeSize(this); }
      spacing(oNode) { return spacing(this, oNode); }
      get nodes() { return this.descendants(); }
      get xSize() { return this.size[0]; }
      get ySize() { return this.size[1]; }
      get top() { return this.y; }
      get bottom() { return this.y + this.ySize; }
      get left() { return this.x - this.xSize / 2; }
      get right() { return this.x + this.xSize / 2; }
      get root() {
        const ancs = this.ancestors();
        return ancs[ancs.length - 1];
      }
      get numChildren() {
        return this.hasChildren ? this.children.length : 0;
      }
      get hasChildren() { return !this.noChildren; }
      get noChildren() { return this.children === null; }
      get firstChild() {
        return this.hasChildren ? this.children[0] : null;
      }
      get lastChild() {
        return this.hasChildren ? this.children[this.numChildren - 1] : null;
      }
      get extents() {
        return (this.children || []).reduce(
          (acc, kid) => FlexNode.maxExtents(acc, kid.extents),
          this.nodeExtents);
      }
      get nodeExtents() {
        return {
          top: this.top,
          bottom: this.bottom,
          left: this.left,
          right: this.right,
        };
      }
      static maxExtents(e0, e1) {
        return {
          top: Math.min(e0.top, e1.top),
          bottom: Math.max(e0.bottom, e1.bottom),
          left: Math.min(e0.left, e1.left),
          right: Math.max(e0.right, e1.right),
        };
      }
    };
  }

  function getWrapper() {
    const FlexNode = getFlexNode();
    const nodeSize = accessor('nodeSize');
    const spacing = accessor('spacing');
    return class extends FlexNode {
      constructor(data) {
        super(data);
        Object.assign(this, {
          x: 0, y: 0,
          relX: 0, prelim: 0, shift: 0, change: 0,
          lExt: this, lExtRelX: 0, lThr: null,
          rExt: this, rExtRelX: 0, rThr: null,
        });
      }
      get size() { return nodeSize(this.data); }
      spacing(oNode) { return spacing(this.data, oNode.data); }
      get x() { return this.data.x; }
      set x(v) { this.data.x = v; }
      get y() { return this.data.y; }
      set y(v) { this.data.y = v; }
      update() {
        layoutChildren(this);
        resolveX(this);
        return this;
      }
    };
  }

  function wrap(FlexClass, treeData, children) {
    const _wrap = (data, parent) => {
      const node = new FlexClass(data);
      Object.assign(node, {
        parent,
        depth: parent === null ? 0 : parent.depth + 1,
        height: 0,
        length: 1,
      });
      const kidsData = children(data) || [];
      node.children = kidsData.length === 0 ? null
        : kidsData.map(kd => _wrap(kd, node));
      if (node.children) {
        Object.assign(node, node.children.reduce(
          (hl, kid) => ({
            height: Math.max(hl.height, kid.height + 1),
            length: hl.length + kid.length,
          }), node
        ));
      }
      return node;
    };
    return _wrap(treeData, null);
  }


  Object.assign(layout, {
    nodeSize(arg) {
      return arguments.length ? (opts.nodeSize = arg, layout) : opts.nodeSize;
    },
    spacing(arg) {
      return arguments.length ? (opts.spacing = arg, layout) : opts.spacing;
    },
    children(arg) {
      return arguments.length ? (opts.children = arg, layout) : opts.children;
    },
    hierarchy(treeData, children) {
      const kids = typeof children === 'undefined' ? opts.children : children;
      return wrap(getFlexNode(), treeData, kids);
    },
    dump(tree) {
      const nodeSize = accessor('nodeSize');
      const _dump = i0 => node => {
        const i1 = i0 + '  ';
        const i2 = i0 + '    ';
        const {x, y} = node;
        const size = nodeSize(node);
        const kids = (node.children || []);
        const kdumps = (kids.length === 0) ? ' ' :
          `,${i1}children: [${i2}${kids.map(_dump(i2)).join(i2)}${i1}],${i0}`;
        return `{ size: [${size.join(', ')}],${i1}x: ${x}, y: ${y}${kdumps}},`;
      };
      return _dump('\n')(tree);
    },
  });
  return layout;
}
flextree.version = version;

const layoutChildren = (w, y = 0) => {
  w.y = y;
  (w.children || []).reduce((acc, kid) => {
    const [i, lastLows] = acc;
    layoutChildren(kid, w.y + w.ySize);
    // The lowest vertical coordinate while extreme nodes still point
    // in current subtree.
    const lowY = (i === 0 ? kid.lExt : kid.rExt).bottom;
    if (i !== 0) separate(w, i, lastLows);
    const lows = updateLows(lowY, i, lastLows);
    return [i + 1, lows];
  }, [0, null]);
  shiftChange(w);
  positionRoot(w);
  return w;
};

// Resolves the relative coordinate properties - relX and prelim --
// to set the final, absolute x coordinate for each node. This also sets
// `prelim` to 0, so that `relX` for each node is its x-coordinate relative
// to its parent.
const resolveX = (w, prevSum, parentX) => {
  // A call to resolveX without arguments is assumed to be for the root of
  // the tree. This will set the root's x-coord to zero.
  if (typeof prevSum === 'undefined') {
    prevSum = -w.relX - w.prelim;
    parentX = 0;
  }
  const sum = prevSum + w.relX;
  w.relX = sum + w.prelim - parentX;
  w.prelim = 0;
  w.x = parentX + w.relX;
  (w.children || []).forEach(k => resolveX(k, sum, w.x));
  return w;
};

// Process shift and change for all children, to add intermediate spacing to
// each child's modifier.
const shiftChange = w => {
  (w.children || []).reduce((acc, child) => {
    const [lastShiftSum, lastChangeSum] = acc;
    const shiftSum = lastShiftSum + child.shift;
    const changeSum = lastChangeSum + shiftSum + child.change;
    child.relX += changeSum;
    return [shiftSum, changeSum];
  }, [0, 0]);
};

// Separates the latest child from its previous sibling
/* eslint-disable complexity */
const separate = (w, i, lows) => {
  const lSib = w.children[i - 1];
  const curSubtree = w.children[i];
  let rContour = lSib;
  let rSumMods = lSib.relX;
  let lContour = curSubtree;
  let lSumMods = curSubtree.relX;
  let isFirst = true;
  while (rContour && lContour) {
    if (rContour.bottom > lows.lowY) lows = lows.next;
    // How far to the left of the right side of rContour is the left side
    // of lContour? First compute the center-to-center distance, then add
    // the "spacing"
    const dist =
      (rSumMods + rContour.prelim) - (lSumMods + lContour.prelim) +
      rContour.xSize / 2 + lContour.xSize / 2 +
      rContour.spacing(lContour);
    if (dist > 0 || (dist < 0 && isFirst)) {
      lSumMods += dist;
      // Move subtree by changing relX.
      moveSubtree(curSubtree, dist);
      distributeExtra(w, i, lows.index, dist);
    }
    isFirst = false;
    // Advance highest node(s) and sum(s) of modifiers
    const rightBottom = rContour.bottom;
    const leftBottom = lContour.bottom;
    if (rightBottom <= leftBottom) {
      rContour = nextRContour(rContour);
      if (rContour) rSumMods += rContour.relX;
    }
    if (rightBottom >= leftBottom) {
      lContour = nextLContour(lContour);
      if (lContour) lSumMods += lContour.relX;
    }
  }
  // Set threads and update extreme nodes. In the first case, the
  // current subtree is taller than the left siblings.
  if (!rContour && lContour) setLThr(w, i, lContour, lSumMods);
  // In the next case, the left siblings are taller than the current subtree
  else if (rContour && !lContour) setRThr(w, i, rContour, rSumMods);
};
/* eslint-enable complexity */

// Move subtree by changing relX.
const moveSubtree = (subtree, distance) => {
  subtree.relX += distance;
  subtree.lExtRelX += distance;
  subtree.rExtRelX += distance;
};

const distributeExtra = (w, curSubtreeI, leftSibI, dist) => {
  const curSubtree = w.children[curSubtreeI];
  const n = curSubtreeI - leftSibI;
  // Are there intermediate children?
  if (n > 1) {
    const delta = dist / n;
    w.children[leftSibI + 1].shift += delta;
    curSubtree.shift -= delta;
    curSubtree.change -= dist - delta;
  }
};

const nextLContour = w => {
  return w.hasChildren ? w.firstChild : w.lThr;
};

const nextRContour = w => {
  return w.hasChildren ? w.lastChild : w.rThr;
};

const setLThr = (w, i, lContour, lSumMods) => {
  const firstChild = w.firstChild;
  const lExt = firstChild.lExt;
  const curSubtree = w.children[i];
  lExt.lThr = lContour;
  // Change relX so that the sum of modifier after following thread is correct.
  const diff = lSumMods - lContour.relX - firstChild.lExtRelX;
  lExt.relX += diff;
  // Change preliminary x coordinate so that the node does not move.
  lExt.prelim -= diff;
  // Update extreme node and its sum of modifiers.
  firstChild.lExt = curSubtree.lExt;
  firstChild.lExtRelX = curSubtree.lExtRelX;
};

// Mirror image of setLThr.
const setRThr = (w, i, rContour, rSumMods) => {
  const curSubtree = w.children[i];
  const rExt = curSubtree.rExt;
  const lSib = w.children[i - 1];
  rExt.rThr = rContour;
  const diff = rSumMods - rContour.relX - curSubtree.rExtRelX;
  rExt.relX += diff;
  rExt.prelim -= diff;
  curSubtree.rExt = lSib.rExt;
  curSubtree.rExtRelX = lSib.rExtRelX;
};

// Position root between children, taking into account their modifiers
const positionRoot = w => {
  if (w.hasChildren) {
    const k0 = w.firstChild;
    const kf = w.lastChild;
    const prelim = (k0.prelim + k0.relX - k0.xSize / 2 +
      kf.relX + kf.prelim + kf.xSize / 2 ) / 2;
    Object.assign(w, {
      prelim,
      lExt: k0.lExt, lExtRelX: k0.lExtRelX,
      rExt: kf.rExt, rExtRelX: kf.rExtRelX,
    });
  }
};

// Make/maintain a linked list of the indexes of left siblings and their
// lowest vertical coordinate.
const updateLows = (lowY, index, lastLows) => {
  // Remove siblings that are hidden by the new subtree.
  while (lastLows !== null && lowY >= lastLows.lowY)
    lastLows = lastLows.next;
  // Prepend the new subtree.
  return {
    lowY,
    index,
    next: lastLows,
  };
};

function walkTree(tree, callback, key = 'c') {
  const walk = (item, parent) => callback(item, () => {
    var _item$key;

    (_item$key = item[key]) == null ? void 0 : _item$key.forEach(child => {
      walk(child, item);
    });
  }, parent);

  walk(tree);
}

let canvas;

function getTextRect(items, font) {
  // re-use canvas object for better performance
  if (!canvas) canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  let maxWidth = 0;
  let width = 0;
  let row = 0;

  const walk = item => {
    if (item.t === 'text') {
      item.p = { ...item.p
      };
      if (!width && row) item.p.newline = true;
      const metrics = context.measureText(item.v);
      width += metrics.width;
      if (maxWidth < width) maxWidth = width;
    } else if (item.t === 'softbreak') {
      width = 0;
      row += 1;
    } else if (item.t === 'link') {
      item.c.forEach(walk);
    }
  };

  items.forEach(walk);
  return [maxWidth, row + 1];
}

function linkWidth(nodeData) {
  const data = nodeData.data;
  return Math.max(6 - 2 * data.d, 1.5);
}

function getKey(v) {
  const result = ['<'];
  v.forEach(item => {
    if (item.t === 'text') result.push(item.v.replace(/[<|&]/g, m => `&${m}`));else if (item.c) result.push(getKey(item.c));
  });
  result.push('>');
  return result.join('');
}

function addSpacing(tree, spacing) {
  let depth = 0;
  walkTree(tree, (item, next) => {
    item.y += depth * spacing;
    depth += 1;
    next();
    depth -= 1;
  }, 'children');
}

function getChildNodes() {
  return this.childNodes;
}

function markmap(svg, data, opts) {
  svg = svg.datum ? svg : d3.select(svg);
  const classList = (svg.attr('class') || '').split(' ').filter(Boolean);

  if (classList.indexOf('markmap') < 0) {
    classList.push('markmap');
    svg.attr('class', classList.join(' '));
  }

  const style = svg.append('style');
  const g = svg.append('g');
  const zoom = d3.zoom().on('zoom', handleZoom);
  const svgNode = svg.node();
  const options = {
    duration: 500,
    nodeFont: '300 16px sans-serif',
    lineHeight: 20,
    spacingVertical: 5,
    spacingHorizontal: 80,
    autoFit: false,
    fitRatio: 0.95,
    color: d3.scaleOrdinal(d3.schemeCategory10),
    colorDepth: 0,
    ...opts
  };
  const state = {};
  updateStyle();

  if (data) {
    setData(data);
    fit(); // always fit for the first render
  }

  svg.call(zoom);
  return {
    setData,
    setOptions,
    fit
  };

  function updateStyle() {
    style.text(`\
.markmap a { fill: #0097e6; }
.markmap a:hover { fill: #00a8ff; }
.markmap path { fill: none; }
.markmap text { font: ${options.nodeFont} }
.markmap tspan.markmap-em { font-style: italic; }
.markmap tspan.markmap-strong { font-weight: 500; }
.markmap g > g { cursor: pointer; }
`);
  }

  function handleZoom() {
    const {
      transform
    } = d3.event;
    g.attr('transform', transform);
  }

  function addKeys(node) {
    let i = 1;
    const {
      colorDepth
    } = options;
    walkTree(node, (item, next, parent) => {
      var _item$v;

      options.color(`${i}`); // preload colors

      item.p = {
        i,
        ...item.p
      };

      if ((_item$v = item.v) == null ? void 0 : _item$v.length) {
        var _parent$p;

        item.p.k = ((parent == null ? void 0 : (_parent$p = parent.p) == null ? void 0 : _parent$p.k) || '') + getKey(item.v);
      }

      next();
      if (!colorDepth || item.d === colorDepth) i += 1;
    });
  }

  function setOptions(opts) {
    Object.assign(options, opts);
  }

  function setData(data, opts) {
    addKeys(data);
    state.data = data;
    if (opts) setOptions(opts);
    renderData(data);
  }

  function fit() {
    const {
      width: offsetWidth,
      height: offsetHeight
    } = svgNode.getBoundingClientRect();
    const {
      minX,
      maxX,
      minY,
      maxY
    } = state;
    const naturalWidth = maxY - minY;
    const naturalHeight = maxX - minX;
    const scale = Math.min(offsetWidth / naturalWidth * options.fitRatio, offsetHeight / naturalHeight * options.fitRatio, 2);
    const initialZoom = d3.zoomIdentity.translate((offsetWidth - naturalWidth * scale) / 2 - minY * scale, (offsetHeight - naturalHeight * scale) / 2 - minX * scale).scale(scale);
    svg.transition().duration(options.duration).call(zoom.transform, initialZoom);
  }

  function handleClick(d) {
    var _data$p;

    const {
      data
    } = d;
    data.p = { ...data.p,
      f: !((_data$p = data.p) == null ? void 0 : _data$p.f)
    };
    renderData(d.data);
  }

  function handleLink(d) {
    d3.event.preventDefault();
    window.open(d.p.href);
  }

  function renderTextNode(t, d) {
    if (d.t === 'link') {
      const a = t.append('a').attr('href', d.p.href).attr('title', d.p.title).on('click', handleLink);
      const text = a.selectAll(getChildNodes).data(d => d.c);
      text.enter().each(function (d) {
        const t = d3.select(this);
        renderTextNode(t, d);
      });
    }

    if (d.t === 'text') {
      t.append('tspan').text(d.v).attr('class', d => {
        var _d$p;

        const style = ((_d$p = d.p) == null ? void 0 : _d$p.style) || {};
        return [style.em && 'markmap-em', style.strong && 'markmap-strong'].filter(Boolean).join(' ');
      }).attr('x', d => {
        var _d$p2;

        return ((_d$p2 = d.p) == null ? void 0 : _d$p2.newline) ? 8 : null;
      }).attr('dy', d => {
        var _d$p3;

        return ((_d$p3 = d.p) == null ? void 0 : _d$p3.newline) ? options.lineHeight : null;
      });
    }
  }

  function renderText(text) {
    const textNode = text.selectAll(getChildNodes).data(d => d.data.v);
    textNode.enter().each(function (d) {
      const t = d3.select(this);
      renderTextNode(t, d);
    });
    return text;
  }

  function renderData(originData) {
    var _origin$data$x, _origin$data$y;

    if (!state.data) return;
    const layout = flextree().children(d => {
      var _d$p4;

      return !((_d$p4 = d.p) == null ? void 0 : _d$p4.f) && d.c;
    }).nodeSize(d => {
      const [width, rows] = getTextRect(d.data.v, options.nodeFont);
      return [rows * options.lineHeight, width + 16];
    }).spacing((a, b) => {
      return a.parent === b.parent ? options.spacingVertical : options.spacingVertical * 2;
    });
    const tree = layout.hierarchy(state.data);
    layout(tree);
    addSpacing(tree, options.spacingHorizontal);
    const descendants = tree.descendants().reverse();
    const links = tree.links();
    const linkShape = d3.linkHorizontal();
    const minX = d3.min(descendants, d => d.x - d.xSize / 2);
    const maxX = d3.max(descendants, d => d.x + d.xSize / 2);
    const minY = d3.min(descendants, d => d.y);
    const maxY = d3.max(descendants, d => d.y + d.ySize);
    state.minX = minX;
    state.maxX = maxX;
    state.minY = minY;
    state.maxY = maxY;
    if (options.autoFit) fit();
    const origin = originData ? descendants.find(item => item.data === originData) : tree;
    const x0 = (_origin$data$x = origin.data.x0) != null ? _origin$data$x : origin.x;
    const y0 = (_origin$data$y = origin.data.y0) != null ? _origin$data$y : origin.y; // Update the nodes

    const node = g.selectAll('g').data(descendants, d => d.data.p.k);
    const nodeEnter = node.enter().append('g').attr('transform', d => `translate(${y0 + origin.ySize - d.ySize},${x0 + origin.xSize / 2 - d.xSize})`).on('click', handleClick);
    const nodeExit = node.exit().transition().duration(options.duration);
    nodeExit.select('rect').attr('width', 0).attr('x', d => d.ySize);
    nodeExit.select('text').attr('fill-opacity', 0);
    nodeExit.attr('transform', d => `translate(${origin.y + origin.ySize - d.ySize},${origin.x + origin.xSize / 2 - d.xSize})`).remove();
    const nodeMerge = node.merge(nodeEnter);
    nodeMerge.transition().duration(options.duration).attr('transform', d => `translate(${d.y},${d.x - d.xSize / 2})`);
    nodeMerge.selectAll('rect').data(d => [d], d => d.data.p.k).join(enter => {
      return enter.append('rect').attr('x', d => d.ySize).attr('y', d => d.xSize - linkWidth(d) / 2).attr('width', 0).attr('height', linkWidth);
    }, update => update, exit => exit.remove()).transition().duration(options.duration).attr('x', -1).attr('width', d => d.ySize + 2).attr('fill', d => options.color(d.data.p.i));
    nodeMerge.selectAll('circle').data(d => d.data.c ? [d] : [], d => d.data.p.k).join(enter => {
      return enter.append('circle').attr('stroke-width', '1.5').attr('cx', d => d.ySize).attr('cy', d => d.xSize).attr('r', 0);
    }, update => update, exit => exit.remove()).transition().duration(options.duration).attr('r', 6).attr('stroke', d => options.color(d.data.p.i)).attr('fill', d => {
      var _d$data$p;

      return ((_d$data$p = d.data.p) == null ? void 0 : _d$data$p.f) ? options.color(d.data.p.i) : '#fff';
    });
    nodeMerge.selectAll('text').data(d => [d], d => d.data.p.k).join(enter => {
      return enter.append('text').attr('x', 8).attr('y', options.lineHeight - 4).attr('text-anchor', 'start').attr('fill-opacity', 0).call(renderText);
    }, update => update, exit => exit.remove()).transition().duration(options.duration).attr('fill-opacity', 1); // Update the links

    g.selectAll('path').data(links, d => d.target.data.p.k).join(enter => {
      const source = [y0 + origin.ySize, x0 + origin.xSize / 2];
      return enter.insert('path', 'g').attr('d', linkShape({
        source,
        target: source
      }));
    }, update => update, exit => {
      const source = [origin.y + origin.ySize, origin.x + origin.xSize / 2];
      return exit.transition().duration(options.duration).attr('d', linkShape({
        source,
        target: source
      })).remove();
    }).transition().duration(options.duration).attr('stroke', d => options.color(d.target.data.p.i)).attr('stroke-width', d => linkWidth(d.target)).attr('d', d => {
      const source = [d.source.y + d.source.ySize, d.source.x + d.source.xSize / 2];
      const target = [d.target.y, d.target.x + d.target.xSize / 2];
      return linkShape({
        source,
        target
      });
    });
    descendants.forEach(d => {
      d.data.x0 = d.x;
      d.data.y0 = d.y;
    });
  }
}

exports.markmap = markmap;

}(this.markmap = this.markmap || {}, d3));
