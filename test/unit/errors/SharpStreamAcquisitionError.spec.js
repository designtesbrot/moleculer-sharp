const {SharpStreamAcquisitionError} = require("errors");

describe("Errors", () => {
	describe("SharpStreamAcquisitionError", () => {
		describe("constructor", () => {
			it("constructs with sensitive defaults", () => {
				let error = new SharpStreamAcquisitionError();
				expect(error.message).toEqual("Stream could not be acquired");
				expect(error.code).toEqual(500);
				expect(error.type).toEqual("SHARP_STREAM_ACQUISITION_ERROR");
				expect(error.data).toEqual({});
				expect(error.retryable).toEqual(false);
			});

			it("constructs with given arguments", () => {
				let error = new SharpStreamAcquisitionError("foo", 500, "BAR",
					{fooz: "barz"});
				expect(error.message).toEqual("foo");
				expect(error.code).toEqual(500);
				expect(error.type).toEqual("BAR");
				expect(error.data).toEqual({fooz: "barz"});
				expect(error.retryable).toEqual(false);
			});
		});
	});
});
