const commonConfig = {
        format: ["json:reports/cucumber-json.json", "html:reports/cucumber-html.html","pretty"],
        formatOptions: { "snippetInterface": "async-await"},
        forceExit: true,
        dryRun: false,
        paths: ['features/**/*.feature'],
        import: ['features/**/*.ts'],
        loader: ['ts-node/esm'],
}

export default {
        ...commonConfig,
        publish: false,
} 

export const publish = {
        ...commonConfig,
        publish: true, // Publish a report to the Cucumber Reports service      
}

export const firefox = {
        ...commonConfig,
        worldParameters: {
                browserconfig: "firefox"
        }
}

