const Service = () => require("service");
const Promise = require("bluebird");
const sharp = require("sharp");
const fs = require("fs");
const {Writable} = require("stream");

describe("Service", () => {
	describe("actions", () => {
		describe("process", () => {
			it("resolves with a stream of the processed image", () => {
				let options = {
					params: {foo: "bar"},
					meta: {
						steps: [["rotate", 60], undefined, "png"]
					}
				};
				let context = {
					acquireReadStream: jest.fn().mockReturnValueOnce(Promise.resolve(fs.createReadStream(__filename))),
					Promise
				};
				let pipe = new Writable();
				pipe._write = () => {};
				pipe.rotate = jest.fn();
				pipe.png = jest.fn();
				sharp.mockReturnValueOnce(pipe);
				return Service().actions.process.handler.bind(context)(options).then(r => {
					expect(r).toEqual(pipe);
					expect(pipe.rotate.mock.calls[0]).toEqual([60]);
					expect(pipe.png.mock.calls[0]).toEqual([]);
				});
			});

			it("resolves with file info of the processed image, if the step instructions end with a toFile instruction", () => {
				let options = {
					params: {foo: "bar"},
					meta: {
						steps: [["toFile", "/some/where"]]
					}
				};
				let context = {
					acquireReadStream: jest.fn().mockReturnValueOnce(Promise.resolve(fs.createReadStream(__filename))),
					Promise
				};
				let pipe = new Writable();
				pipe._write = () => {};
				pipe.toFile = jest.fn().mockReturnValueOnce(Promise.resolve({fooz: "barz"}));
				sharp.mockReturnValueOnce(pipe);
				return Service().actions.process.handler.bind(context)(options).then(r => {
					expect(r).toEqual({fooz: "barz"});
					expect(pipe.toFile.mock.calls[0]).toEqual(["/some/where"]);
				});
			});
		});
	});
});
