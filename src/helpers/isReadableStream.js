const stream = require("stream");

module.exports = obj => obj instanceof stream.Stream &&
	(typeof obj._read === "function") &&
	(typeof obj._readableState === "object");
