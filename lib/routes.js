if (!module.parent) {
    console.log("Please don't call me directly. I am just the main app's minion.");
    process.exit(1);
}

var app = module.parent.exports.app;

// Local includes
var mod_hello = require('./hello');
//var mod_myTest = require('./rooter/myTest');
var modRiak = require('./rooter/riakTest');

/** ROUTES **/
app.get('/hello', mod_hello.root);

//app.get('/', mod_myTest.prepare, mod_myTest.root);

//app.get('/test', mod_myTest.testPage2);

app.get('/riakGet', modRiak.riakGet);
app.get('/riakGetAll', modRiak.riakGetAll);
app.get('/riakMapReduce', modRiak.riakMapReduce);


