const fs = require("fs");
const sharp = require("sharp");
const {isString, isArray, isPlainObj} = require("ramda-adjunct");
const {drop, omit, prop} = require("ramda");
const fetch = require("node-fetch");
const {isReadableStream} = require("./helpers");
const {SharpStreamAcquisitionError} = require("./errors");
const Buffer = require('safe-buffer').Buffer;

/**
 * Service mixin for image manipulation using sharp
 *
 * @name moleculer-sharp
 * @module Service
 */
module.exports = {
	// Service name
	name: "sharp",

	// Default settings
	settings: {},

	methods: {
		/**
		 * Acquire a readable stream from a given source
		 *
		 * @methods
		 *
		 * @param {String|ReadableStream|{url: {string}}} source - can be a path, a stream or an object. If a **path** is given, this action will try to acquire a readable stream for the path. If an **object** is given, a http(s) stream will be acquired for the response body. For the location of the request, the url property will be used, while all other properties will be used as [node-fetch-options](https://www.npmjs.com/package/node-fetch#fetch-options)
		 *
		 * @returns {PromiseLike<Stream|SharpStreamAcquisitionError|Error>}
		 */
		acquireReadStream(source) {
			// if a plain object is given, create a ReadStream using node-fetch
			return this.Promise.resolve(source)
				.then(subject => isPlainObj(subject)
					? fetch(subject.url, omit(["url"], subject)).then(prop("body")) : subject)
				// if a string is given, create a ReadStream for the file at the strings location
				.then(subject => isString(subject) ? fs.createReadStream(subject) : subject)
				// throw an Error is the subject is not a read stream yet at this point
				.then(subject => {
					if (!isReadableStream(subject)) {
						throw new SharpStreamAcquisitionError();
					}
					else {
						return subject;
					}
				});
		},
		/**
		 * Feed a Stream into a Buffer
		 *
		 * @methods
		 *
		 * @param {ReadableStream} stream
		 *
		 * @returns {PromiseLike<Buffer|Error>}
		 */
		bufferStream(stream) {
			return new this.Promise((resolve, reject) => {
				let chunks = [];
				stream.on("error", reject);
				stream.on("data", chunk => chunks.push(chunk));
				stream.on("end", () => resolve(Buffer.concat(chunks)));
			});
		}
	},

	actions: {
		/**
		 * Fast access to (uncached) image metadata without decoding any compressed image data.
		 *
		 * ```js
		 * broker.call('sharp.metadata',{url: 'https://pics.me.me/welcome-to-the-internet-ill-be-your-guide-28274277.png'})
		 * ```
		 *
		 * @actions
		 *
		 * @param {String|ReadableStream|{url: {string}}} params - the image to acquire metadata for, can be a path, a stream or an object. If a **path** is given, this action will try to acquire a readable stream for the path. If an **object** is given, a http(s) stream will be acquired and the response body will be subject. For the location of the request, the url property will be used, while all other properties will be used as [node-fetch-options](https://www.npmjs.com/package/node-fetch#fetch-options)
		 *
		 * @returns {PromiseLike<Object|Error>}
		 */
		metadata: {
			params: [
				{type: "string"},
				{type: "object"}
			],
			handler(ctx) {
				return this.Promise.resolve(ctx.params)
					.then(source => this.acquireReadStream(source))
					.then(stream => this.bufferStream(stream))
					.then(sharp)
					.then(image => image.metadata());
			}
		},
		/**
		 * Gather stats of an image
		 *
		 * ```js
		 * broker.call('sharp.stats',{url: 'https://pics.me.me/welcome-to-the-internet-ill-be-your-guide-28274277.png'})
		 * ```
		 *
		 * @actions
		 *
		 * @param {String|ReadableStream|{url: {string}}} params - the image to acquire stats for, can be a path, a stream or an object. If a **path** is given, this action will try to acquire a readable stream for the path. If an **object** is given, a http(s) stream will be acquired and the response body will be subject. For the location of the request, the url property will be used, while all other properties will be used as [node-fetch-options](https://www.npmjs.com/package/node-fetch#fetch-options)
		 *
		 * @returns {PromiseLike<Object|Error>}
		 */
		stats: {
			params: [
				{type: "string"},
				{type: "object"}
			],
			handler(ctx) {
				return this.Promise.resolve(ctx.params)
					.then(source => this.acquireReadStream(source))
					.then(stream => this.bufferStream(stream))
					.then(sharp)
					.then(image => image.stats());
			}
		},
		/**
		 * Processes an image. The action parameter indicates which image to process. The actual processing instructions
		 * have to be provided via the `meta.steps` property of the call. Any operation that is listed on the
		 * [Sharp Documentation](http://sharp.pixelplumbing.com/en/stable/) can be included as a step instruction. Here is an example:
		 *
		 * ```js
		 * broker.call('sharp.process',{url: 'https://pics.me.me/welcome-to-the-internet-ill-be-your-guide-28274277.png'}, {meta:
		 * 	steps: [
		 * 		["resize", 200],
		 *      ["rotate", 30, {"background": {"r": 0, "g": 0, "b": 0, "alpha": 0}}],
		 *      "jpeg"
		 * 	]
		 * })
		 * ```
		 *
		 * If your last step instructions is a `toFile` instructions, the transformation output will be written to disk, and the
		 * action will respond with meta information about the image. In any other case the action will respond with a readable
		 * stream for your to further process.
		 *
		 * @actions
		 *
		 * @param {String|ReadableStream|{url: {string}}} params - the image to process, can be a path, a stream or an object. If a **path** is given, this action will try to acquire a readable stream for the path. If an **object** is given, a http(s) stream will be acquired and the response body will be subject. For the location of the request, the url property will be used, while all other properties will be used as [node-fetch-options](https://www.npmjs.com/package/node-fetch#fetch-options)
		 *
		 * @returns {PromiseLike<undefined|Error>}
		 */
		process: {
			params: [
				{type: "string"},
				{type: "object"}
			],
			handler(ctx) {
				return this.Promise.resolve({stream: ctx.params, meta: ctx.meta})
					.then(({stream, meta}) => this.acquireReadStream(stream).then(stream => Object.assign({}, {stream, meta})))
					.then(({stream, meta}) => {
						// create a new transformation pipe
						let pipe = sharp();
						let response;
						// for each step in the metadata, add a new transformation to the pipe
						meta.steps.forEach(step => {
							if (isString(step)) {
								pipe[step].apply(pipe);
							}
							else if (isArray(step)) {
								if (step[0] === "toFile") {
									response = pipe[step[0]].apply(pipe, drop(1, step));
								}
								else {
									pipe[step[0]].apply(pipe, drop(1, step));
								}
							}
						});

						// Start piping to the stream
						stream.pipe(pipe);

						return response || pipe;
					});
			}
		}
	}
};
