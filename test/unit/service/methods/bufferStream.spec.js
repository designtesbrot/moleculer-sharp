const fs = require("fs");
const Service = require("service");
const Promise = require("bluebird");
const fetch = require("node-fetch");

describe("Service", () => {
	describe("methods", () => {
		describe("bufferStream", () => {
			it("resolves with a buffer that includes the stream", () => {
				let context = {
					Promise
				};
				let subject = fs.createReadStream(__filename);
				return Service.methods.bufferStream.bind(context)(subject).then(result => {
					expect(result).toEqual(fs.readFileSync(__filename));
				});
			});

			it("rejects if the stream encounters on error", () => {
				let context = {
					Promise
				};

				let stream = {on: jest.fn()};
				let buffering = Service.methods.bufferStream.bind(context)(stream);
				stream.on.mock.calls.find(e => e[0] === 'error')[1](new Error("Something went wrong"));
				return buffering.catch(e => {
					expect(e.message).toEqual("Something went wrong");
				});
			});
		});
	});
});
