function createNamespace( path ){
    var namespaceArr = path.split("."),
        namespace = null, 
        root = window;
    for( var i = 0; i < namespaceArr.length; i++ ) {
        namespace = namespaceArr[i];
        root[namespace] = root[namespace] || {};
        root = root[namespace];
    }
    return root;
}


function namespace( path, root ){
    var namespaceArr = path.split("."),
        namespace = null, 
        root = root || this;
    for( var i = 0; i < namespaceArr.length; i++ ) {
        namespace = namespaceArr[i];
        root[namespace] = root[namespace] || {};
        root = root[namespace];
    }
    return root;
}