export default {
        format: ["json:reports/cucumber-json.json", "html:reports/cucumber-html.html","pretty"],
        formatOptions: { "snippetInterface": "async-await"},
        //forceExit: true,
        publish: false,
        dryRun: false,
        paths: ['features/**/*.feature'],
        import: ['features/**/*.ts'],
        loader: ['ts-node/esm'],
        //importModule: ['ts-node/register']
        //requireModule: ['ts-node/register'],
} 