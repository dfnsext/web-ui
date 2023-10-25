#!/usr/bin/env node

const path = require("path");
const copy = require("recursive-copy");

const args = process.argv.slice(2);

if (args.length !== 1) {
	console.error("Usage: dfns-copy-assets <destination-path>");
	process.exit(1);
}

const destinationPath = args[0];
const directoryPath = path.join("./node_modules/@dfns/web-ui/dist/dfns-web-component/assets/");

copy(directoryPath, destinationPath, function (error, results) {
	if (error) {
		console.error("Copy failed: " + error);
	} else {
		console.info("Copied " + results.length + " files");
	}
});
