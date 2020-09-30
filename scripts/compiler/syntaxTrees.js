(function () {

/**
 * Creates a new Concrete Syntax Tree.
 */
CST.prototype = new Tree;
function CST() {}

/**
 * Creates a new Abstract Syntax Tree.
 * 
 * @param {CST} cst the CST to create the AST from 
 */
AST.prototype = new Tree;
function AST(cst) {
    if (cst) {
        this.setWithCst(cst);
    }
}

/**
 * Sets this AST, converting it from the given CST.
 *  
 * @param {CST} cst the cst
 */
AST.prototype.setWithCst = function (cst) {
    this.tree = traverse(cst.tree);
};

// ---------- CST to AST ----------
/*
 * Note that each of these function's 'node' parameter is the node of the CST the function is 
 * recursively traversing through. Each function returns a subtree (a TreeNode), which is passed 
 * up to the calling function, which is attached appropriately to that function's subtree all the 
 * way up to the AST's tree.
 */


/**
 * Traverses the given node.
 * 
 * Each of the documented nonterminals default to iteratively traversing through each child.
 * The special cases call its respective function to handle its traversal.
 */
function traverse(node) {
    switch (node.value.kind) {
        // Program
        case Nonterminal.kinds.STATEMENT:      return traverseStatement(node);
        case Nonterminal.kinds.STATEMENT_LIST: throw 'Error - Cannot decide on <StmtList>'; // Handled within traverseStatement
        // Exp
        case Nonterminal.kinds.INT_EXPR:       return traverseIntExpr(node);
        case Nonterminal.kinds.STRING_EXPR:    return traverseStringExpr(node);
        case Nonterminal.kinds.BOOLEAN_EXPR:   return traverseBooleanExpr(node);
        case Nonterminal.kinds.CHAR_LIST:      throw 'Error - Cannot decide on <CharList>'; // Handled within traverseStringExpr
        case Nonterminal.kinds.VAR_DECL:       throw 'Error - Cannot decide on <VarDecl>'; // Handled within traverseStatement
        // Type
        // Id
        // Char
        // Space
        // Digit
        // Boolean
        case Nonterminal.kinds.OP:             throw 'Error - Cannot decide on <Op>'; // Handled within traverseIntExpr
        default:                               return traverseChildren(node);
    }
}

/**
 * Traverses the children of the given node. If the node is a leaf node, returns the built leaf
 * node for the AST.
 */
function traverseChildren(node) {
    if (node.hasChildren()) {
        for (var i = 0; i < node.children.length; i++) {
            return traverse(node.children[i]);
        }
    } else {
        return buildNode(node);
    }
}

/**
 * Traverses a <Stmt> node.
 */
function traverseStatement(node) {
    var child = node.children[0].value;
    
    if (child.is(Token.kinds.PRINT)) {
        // print ( <Expr> )  -- Ignore '(' and ')'
        return buildMetaNode('print', node, [traverse(node.children[2])]);
        
    } else if (child.is(Nonterminal.kinds.ID)) {
        // <Id> = <Expr>
        return buildMetaNode('assignment', node, [traverse(node.children[0]), traverse(node.children[2])]);
        
    } else if (child.is(Nonterminal.kinds.VAR_DECL)) {
        // <VarDecl>
        node = node.children[0];
        // <Type> <Id>
        return buildMetaNode('declaration', node, [traverse(node.children[0]), traverse(node.children[1])]);
        
    } else if (child.is(Token.kinds.OPEN_BRACE)) {
        // { <StmtList> }  -- Ignore '{' and '}', create new block
        return buildMetaNode('block', node, buildChildren(node.children[1]));
        
    } else if (child.is(Token.kinds.WHILE)) {
        // while <BooleanExpr> { <StatementList> }
        return buildMetaNode('while', node, [traverse(node.children[1]),
                                             buildMetaNode('block', node, buildChildren(node.children[3]))]);
        
    } else if (child.is(Token.kinds.IF)) {
        // if <BooleanExpr> { <StatementList> }
        return buildMetaNode('if', node, [traverse(node.children[1]),
                                          buildMetaNode('block', node, buildChildren(node.children[3]))]);
    }
}

/**
 * Traverses a <IntExpr> node.
 */
function traverseIntExpr(node) {
    if (node.hasOneChild()) {
        // <Digit>
        return buildNode(traverse(node.children[0]));
        
    } else {
        // <Digit> <Op> <Expr>
        
        //                Node[<Op>]  Node[Op]    Op    '+' or '-'  
        var opName = node.children[1].children[0].value.toString();
        // ^ I know it's fugly; but it's the only thing left in this traversal that is, so I'm
        //     not going to complain too much...
        
        return buildMetaNode(opName, node, [traverse(node.children[0]), traverse(node.children[2])]);
    }
}

/**
 * Traverses a <StringExpr> node.
 */
function traverseStringExpr(node) {
    // " <CharList> " -- Ignore quotes, create new string node from the <CharList>
    return buildMetaNode('string', node, buildChildren(node.children[1]));
}

/**
 * Traverse a <BoolExpr> node. 
 */
function traverseBooleanExpr(node) {
    var child = node.children[0].value;
    
    if (child.is(Token.kinds.OPEN_PAREN)) {
        // ( <Expr> == <Expr> )
        return buildMetaNode('equal', node, [traverse(node.children[1]), traverse(node.children[3])]);
        
    } else if (child.is(Nonterminal.kinds.BOOLEAN)) {
        // <Boolean>
        return buildNode(traverse(node.children[0]));
        
    }
    
    throw 'Not implemented';
}

/**
 * Builds the children of the given node, where the node's children are of the production shown
 * here. This will iterate through each recursive node, forming an array of children appropriate 
 * for the AST.
 * 
 * <ProductionList> ::== <Production> <ProductionList>
 *                  ::== Epsilon
 * 
 * @return {Array} the node's children
 */
function buildChildren(node) {
    // For recursion productions like <CharList> and <StmtList>
    
    var child = node.children[0].value;
    
    var children = []; // For AST
    
    while (!child.is(Token.kinds.EPSILON)) {
        
        children.push(traverse(node.children[0]));
        
        node = node.children[1]; // Reassign to child <ProductionList>
        child = node.children[0].value; // Get the value of <ProductionList> first child and repeat
    }
    // Else epsilon production
    
    return children;
}

/**
 * Creates a new node using the value from the given node and the specified children.
 * 
 * This function maintains a lot of consistency. It is used both to create the leaf nodes of the 
 * AST as well as in situtations like <IntExpr> ::== <Digit>. In this instance, a simple call like
 * buildNode(traverse(<DigitNode>)) will return a leaf node containing the terminal digit.
 *  
 * @param {TreeNode} node the node containing the value to create the new node from
 * @param {Array} children (optional) the node's children
 * 
 * @return {TreeNode} the new node
 */
function buildNode(node, children) {
    var newNode = new TreeNode(node.value); // Make a copy, to be safe
    
    if (children) {
        newNode.children = children;
    }
    
    return newNode;
}

/**
 * Creates a new node containing a meta symbol like 'block' or 'decl' for use in the AST.
 * 
 * This function also keeps the traversal simple. Whenever a node need be created, calling
 * buildMetaNode(<name>, node, [traverse(<child1>), traverse(<child2>), ...]) will return the correct
 * AST node.
 * 
 * @param {String} name the name of the node as specified by the AST nonterminal types.
 * @param {TreeNode} node the node used purely to set the line number for this meta node.
 * @param {Array} children the node's children
 * 
 * @return {TreeNode} the new node
 */
function buildMetaNode(name, node, children) {
    var newNode = new TreeNode(Nonterminal.create(name, node.getFirstLeaf().line));
    
    if (children) {
        newNode.children = children;
    } else {
        throw 'An AST meta node must have children.';
    }
    
    return newNode;
}

// Make available globally
window.CST = CST;
window.AST = AST;

})();
