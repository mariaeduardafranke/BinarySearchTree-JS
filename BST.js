/* BINARY SEARCH TREE */

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

const LEFT = 0;
const RIGHT = 1;

// node structure
class Node {
    constructor(value) {
        this.value = value;
        this.parent = null;
        this.children = [];         // left & right
        this.pos = { x: 0, y: 0 }   // position
        this.r = 25;                // radius
    }

    get left() {
        return this.children[LEFT];
    }

    set left(value) {
        if(value !== undefined) {
            value.parent = this;
        }
        this.children[LEFT] = value;
    }

    get right() {
        return this.children[RIGHT];
    }

    set right(value) {
        if(value !== undefined) {
            value.parent = this;
        }
        this.children[RIGHT] = value;
    }

    get position() {
        return this.pos;
    }

    set position(position) {
        this.pos = position;
    }

    get radius() {
        return this.r;
    }

}

// tree structure
class Tree {
    constructor() {
        this.root = null;                           // root node
        this.startPosition = { x: 750, y: 44 }      // root node position
        this.axisX = 350;                           // constants that allow the nodes to be moved graphically in the plane
        this.axisY = 80;

    }

    // method that allows to calculate the position of the new node in plane
    getPosition({ x, y }, isLeft = false) {
        return { x: isLeft ? x - this.axisX + y : x + this.axisX - y, y: y + this.axisY }
    }

    // method that allows to insert a new node into the tree
    insert(value) {
        const newNode = new Node(value);
        // if tree is empty
        if (this.root == null) {
            newNode.position = this.startPosition;
            this.root = newNode;
            document.getElementById('message').innerHTML = 'Done! Node value ' + value + ' was inserted into the tree.';
        }
        else {
            let node = this.root;
            while (node) {
                if (node.value == value) {
                    document.getElementById('message').innerHTML = 'Node value ' + value + ' is already inserted in the tree!';
                    break;
                }
                if (value > node.value) {
                    if (node.right == null) {
                        newNode.position = this.getPosition(node.position);
                        node.right = newNode;
                        document.getElementById('message').innerHTML = 'Done! Node value ' + value + ' was inserted into the tree.';
                        break;
                    }
                    node = node.right;
                }
                else {
                    if (node.left == null) {
                        newNode.position = this.getPosition(node.position, true);
                        node.left = newNode;
                        document.getElementById('message').innerHTML = 'Done! Node value ' + value + ' was inserted into the tree.';
                        break;
                    }
                    node = node.left;
                }
            }
        }
    }
}

// function that allows to display the tree using Breadth First Search algorithm (busca em largura)
function bfs(node) {

    ctx.clearRect(0, 0, c.width, c.height);

    const queue = [];
    const black = "#000";
    queue.push(node);
    while (queue.length !== 0) {
        const node = queue.shift();

        const { x, y } = node.position;

        const color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
        ctx.beginPath();
        ctx.arc(x, y, node.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = black;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = black;
        ctx.strokeText(node.value, x, y);

        node.children.forEach(child => {

            if(child !== undefined) {
                const { x: x1, y: y1 } = child.position;
                ctx.beginPath();
                ctx.moveTo(x, y + child.radius);
                ctx.lineTo(x1, y1 - child.radius);
                ctx.stroke();
                queue.push(child);
            }

        });

    }

}

// function that allows to search for a node in the tree
function search(node, value) {

    // if trees is empty
    if(node === null) {
        document.getElementById('message').innerHTML = 'The tree is empty! Searches are not possible. Try inserting a new node first!';
    }

    // if node is undefined
    else if(node === undefined) {
        document.getElementById('message').innerHTML = 'Node value ' + value + ' was NOT found in the tree!';
    }

    else {
        // if value is less than the node value
        // move left
        if(value < node.value) {
            search(node.left, value);
        }
    
        // if value is greater than the node value
        // move right
        else if(value > node.value) {
            search(node.right, value);
        }
    
        // if value is equal to the node value
        else if(value == node.value) {
            document.getElementById('message').innerHTML = 'Done! Node value ' + value + ' was found in the tree!';
        }
    }
}

// function that allows to remove a node from the tree
function remove(node, value, side = 0) {

    // if tree is empty
    if(node === null) {
        document.getElementById('message').innerHTML = 'The tree is empty! Removals are not possible. Try inserting a new node first!';
        return 0;
    }
    
    // if node is undefined
    else if(node === undefined) {
        document.getElementById('message').innerHTML = 'Node value ' + value + ' was NOT found in the tree!';
        return 0;
    }

    else {
        // if value is less than the node value
        // move left
        if(value < node.value) {
            remove(node.left, value, 0);
        }
    
        // if value is greater than the node value
        // move right
        else if(value > node.value) {
            remove(node.right, value, 1);
        }
    
        // if value is equal to the node value
        else if(value == node.value) {
            document.getElementById('message').innerHTML = 'Done! Node value ' + value + ' was removed from the tree!';

            // if node has no children
            if (node.left === undefined && node.right === undefined) {
                // if is a left node
                if (side === 0) {
                    // if is a root node
                    if(node.parent === null) {
                        document.getElementById('message').innerHTML = 'It is necessary to implement root node removal!';
                    } else {
                        node.parent.left = undefined;    // set left child of node's parent to undefined
                    }
                }
                // if is a right node
                else {
                    node.parent.right = undefined;   // set right child of node's parent to undefined
                }
                
            }

            // if node has only right child
            else if (node.left === undefined) {

                // if is a left node with right child
                if (side === 0) {
                    // if is a root node
                    if(node.parent === null) {
                        document.getElementById('message').innerHTML = 'It is necessary to implement root node removal!';
                    } else {
                        // link the parent of the deleted node to the right child of the deleted node
                        node.parent.children = [node.right, node.parent.right];
                        node.right.parent = node.parent;
                        // fix the position of the right child
                        node.right.position = node.position;
                    }
                }
                // if is a right node with right child
                else {
                    // link the parent of the deleted node to the right child of the deleted node
                    node.parent.children = [node.parent.left, node.right];
                    node.right.parent = node.parent;
                    // fix the position of the right child
                    node.right.position = node.position;
                }

            }

            // if node has only left child
            else if (node.right === undefined) {

                // if is a left node with left child
                if (side === 0) {
                    // if is a root node
                    if(node.parent === null) {
                        document.getElementById('message').innerHTML = 'It is necessary to implement root node removal!';
                    } else {
                        // link the parent of the deleted node to the left child of the deleted node
                        node.parent.children = [node.left, node.parent.right];
                        node.left.parent = node.parent;
                        // fix the position of the left child
                        node.left.position = node.position;
                    }
                }
                // if is a right node with left child
                else {
                    // link the parent of the deleted node to the left child of the deleted node
                    node.parent.children = [node.parent.left, node.left];
                    node.left.parent = node.parent;
                    // fix the position of the left child
                    node.left.position = node.position;
                    
                }

            }

            // if node has two children: left and right
            else {
                // storage the value of the node that will be replaced in the tree
                auxNode = node.value;
                // find minimal value of right sub tree
                minNode = findMin(node.right);
                // duplicate the node
                node.value = minNode;
                // delete the duplicate node
                let x = remove(node.right, minNode, 1);
                // update message with the value of the node that was deleted
                document.getElementById('message').innerHTML = 'Done! Node value ' + auxNode + ' was removed from the tree!';
            }

        }

        return 1;
    }

}

// function tha allows to find the minimal value of a tree
function findMin(node){
    if (node === null) {
        return undefined;
    }
    if (node.left !== undefined) {
        return findMin(node.left); // left tree is smaller
    } else {
        return node.value;
    }
}

// function that prints the tree pre-orderly
function preOrder(node) {
    if (node !== undefined) {
        document.getElementById('preOrder').innerHTML += ' --> ' + node.value;
        preOrder(node.left);  
        preOrder(node.right);
    }
}

// function that prints the tree in-orderly
function inOrder(node) {
    if (node !== undefined) {
        inOrder(node.left);
        document.getElementById('inOrder').innerHTML += ' --> ' + node.value;
        inOrder(node.right);
    }
}

// function that prints the tree post-orderly
function postOrder(node) {
    if (node !== undefined) {
        postOrder(node.left);
        postOrder(node.right);
        document.getElementById('postOrder').innerHTML += ' --> ' + node.value;
    }
}

// binary search tree
const t = new Tree();

// handle insert button click
document.getElementById('insertButton').onclick = function() {

    // get the value
    var value = parseInt(document.getElementById('insertInput').value);

    // validate the value
    if(isNaN(value) || value < 0 || value > 1000) {
        document.getElementById('message').innerHTML = 'Enter a valid value for the insertion! Integer between 0 and 1000...';

    } else {
        // clean any message
        document.getElementById('message').innerHTML = '';
        // clean input
        document.getElementById('insertInput').value = '';

        // insert the value into the tree
        t.insert(value);
        // update tree visualization area
        bfs(t.root);

        // update order print area
        document.getElementById('preOrder').innerHTML = '';
        document.getElementById('inOrder').innerHTML = '';
        document.getElementById('postOrder').innerHTML = '';
        preOrder(t.root); 
        inOrder(t.root);
        postOrder(t.root);
    }

}

// handle delete button click
document.getElementById('deleteButton').onclick = function() {

    // get the value
    var value = parseInt(document.getElementById('deleteInput').value);

    // validate the value
    if(isNaN(value) || value < 0 || value > 1000) {
        document.getElementById('message').innerHTML = 'Enter a valid value for the removal! Integer between 0 and 1000...';

    } else {

        // clean any message
        document.getElementById('message').innerHTML = '';
        // clean input
        document.getElementById('deleteInput').value = '';

        // remove the value from the tree
        let x = remove(t.root, value);

        // if any node have been removed
        if(x == 1) {
            // update tree visualization area
            bfs(t.root);
            // update order print area
            document.getElementById('preOrder').innerHTML = '';
            document.getElementById('inOrder').innerHTML = '';
            document.getElementById('postOrder').innerHTML = '';
            preOrder(t.root); 
            inOrder(t.root);
            postOrder(t.root);
        }

    }

}

// handle search button click
document.getElementById('searchButton').onclick = function() {

    // get the value
    var value = parseInt(document.getElementById('searchInput').value);

    // validate the value
    if(isNaN(value) || value < 0 || value > 1000) {
        document.getElementById('message').innerHTML = 'Enter a valid value for the search! Integer between 0 and 1000...';

    } else {
        // clean any message
        document.getElementById('message').innerHTML = '';
        // clean input
        document.getElementById('searchInput').value = '';

        // search for the value in the tree
        search(t.root, value);
    }

}