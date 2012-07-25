var jsp = require("C:\\Users\\Vanessa\\AppData\\Roaming\\npm\\node_modules\\uglify-js").parser;
var pro = require("C:\\Users\\Vanessa\\AppData\\Roaming\\npm\\node_modules\\uglify-js").uglify;

var orig_code = "var a = 'a'";
var ast = jsp.parse(orig_code); // parse code and get the initial AST
ast = pro.ast_mangle(ast); // get a new AST with mangled names
ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
var final_code = pro.gen_code(ast); // compressed code here
console.log(final_code);