// cmd: node r.js -o build.js
({
    baseUrl: "./src/assets/js",
    mainConfigFile: "./src/assets/js/main.js",
    // comment this part to run css optimizations
    optimize:"uglify2",
    generateSourceMaps:false,
    preserveLicenseComments : false,
    findNestedDependencies : true,
    out:"./deploy/assets/js/app.min.js",
    name: "main"

    // comment this part to run js optimizations
    // optimizeCss: "standard",
    // cssImportIgnore: null,
    // cssIn: "./src/assets/css/styles.css",
    // out: "./src/assets/css/styles.min.css"
     
})


