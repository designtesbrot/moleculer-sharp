const fs = require("fs");
const {isReadableStream} = require("helpers");

describe("Helpers", () => {
	describe("isReadableStream", () => {
		it("returns false for strings", () => {
			expect(isReadableStream("test")).toEqual(false);
		});

		it("returns false for plain objects", () => {
			expect(isReadableStream({foo: "bar"})).toEqual(false);
		});

		it("returns true for readable streams", () => {
			const s = fs.createReadStream(__filename);
			expect(isReadableStream(s)).toEqual(true);
		});
	});
});
