import Node from "./node.js";
export default class Tree {
  constructor(array) {
    // The tree’s root is built using the buildTree method.
    this.root = this.buildTree(array);
  }

  /**
   * buildTree: Accepts an array, removes duplicates, sorts it,
   * and recursively builds a balanced binary search tree.
   * Returns the root node.
   */
  buildTree(array) {
    // Remove duplicates and sort the array
    const uniqueArray = [...new Set(array.sort((a, b) => a - b))];

    // Recursive helper function to build the tree
    const buildRec = (arr) => {
      if (arr.length === 0) return null;
      const mid = Math.floor(arr.length / 2);
      const node = new Node(arr[mid]);
      node.left = buildRec(arr.slice(0, mid));
      node.right = buildRec(arr.slice(mid + 1));
      return node;
    };

    return buildRec(uniqueArray);
  }

  /**
   * insert: Inserts a value into the BST.
   * It traverses the tree and inserts the node in its correct place.
   * No duplicates are inserted.
   */
  insert(value) {
    this.root = this._insertRec(this.root, value);
  }

  _insertRec(node, value) {
    if (node === null) {
      return new Node(value);
    }
    if (value < node.data) {
      node.left = this._insertRec(node.left, value);
    } else if (value > node.data) {
      node.right = this._insertRec(node.right, value);
    }
    // If value equals node.data, do nothing (avoiding duplicates)
    return node;
  }

  /**
   * deleteItem: Deletes a node with the given value.
   * Handles cases where the node has no child, one child, or two children.
   */
  deleteItem(value) {
    this.root = this._deleteRec(this.root, value);
  }

  _deleteRec(node, value) {
    if (node === null) return node;
    if (value < node.data) {
      node.left = this._deleteRec(node.left, value);
    } else if (value > node.data) {
      node.right = this._deleteRec(node.right, value);
    } else {
      // Node with the value found
      // Case 1: No child or only right child
      if (node.left === null) return node.right;
      // Case 2: Only left child
      if (node.right === null) return node.left;
      // Case 3: Two children: Find the in-order successor (minimum in right subtree)
      const temp = this._findMin(node.right);
      node.data = temp.data;
      node.right = this._deleteRec(node.right, temp.data);
    }
    return node;
  }

  // Helper to find the node with minimum value in a subtree
  _findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  /**
   * find: Searches the tree for a node with the given value.
   * Returns the node if found; otherwise, returns null.
   */
  find(value, node = this.root) {
    if (node === null) return null;
    if (value === node.data) return node;
    return value < node.data
      ? this.find(value, node.left)
      : this.find(value, node.right);
  }

  /**
   * levelOrder: Traverses the tree in breadth-first (level order)
   * and executes the provided callback on each node.
   * Throws an Error if no callback is provided.
   */
  levelOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }
    const queue = [];
    queue.push(this.root);
    while (queue.length > 0) {
      const current = queue.shift();
      if (current !== null) {
        callback(current);
        if (current.left) queue.push(current.left);
        if (current.right) queue.push(current.right);
      }
    }
  }

  /**
   * inOrder: Depth-first in-order traversal.
   * Traverses the left subtree, visits the node, then the right subtree.
   */
  inOrder(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }
    if (node !== null) {
      this.inOrder(callback, node.left);
      callback(node);
      this.inOrder(callback, node.right);
    }
  }

  /**
   * preOrder: Depth-first pre-order traversal.
   * Visits the node before its subtrees.
   */
  preOrder(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }
    if (node !== null) {
      callback(node);
      this.preOrder(callback, node.left);
      this.preOrder(callback, node.right);
    }
  }

  /**
   * postOrder: Depth-first post-order traversal.
   * Visits the node after its subtrees.
   */
  postOrder(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }
    if (node !== null) {
      this.postOrder(callback, node.left);
      this.postOrder(callback, node.right);
      callback(node);
    }
  }

  /**
   * height: Returns the height of the given node.
   * Height is defined as the number of edges in the longest path from the node to a leaf.
   */
  height(node) {
    if (node === null) return -1; // By convention, height of a null node is -1.
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  /**
   * depth: Returns the depth of the given node.
   * Depth is defined as the number of edges from the node to the tree's root.
   * This implementation assumes the node exists in the tree.
   */
  depth(node, current = this.root, currentDepth = 0) {
    if (current === null) return -1; // Node not found.
    if (current === node) return currentDepth;
    return node.data < current.data
      ? this.depth(node, current.left, currentDepth + 1)
      : this.depth(node, current.right, currentDepth + 1);
  }

  /**
   * isBalanced: Checks if the tree is balanced.
   * A tree is balanced if the difference between heights of the left and right subtrees
   * for every node is not more than 1.
   */
  isBalanced(node = this.root) {
    if (node === null) return true;
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    if (Math.abs(leftHeight - rightHeight) > 1) return false;
    return this.isBalanced(node.left) && this.isBalanced(node.right);
  }

  /**
   * rebalance: Rebalances an unbalanced tree.
   * It performs an in-order traversal to get a sorted array of values,
   * then rebuilds the tree using the buildTree method.
   */
  rebalance() {
    const nodes = [];
    this.inOrder((node) => nodes.push(node.data));
    this.root = this.buildTree(nodes);
  }
}

/**
 * prettyPrint: A helper function to print the tree structure to the console.
 * It visually represents the tree hierarchy.
 */
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};
