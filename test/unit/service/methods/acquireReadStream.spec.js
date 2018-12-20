const fs = require('fs');
const Service = require('service');
const Promise = require('bluebird');
const fetch = require('node-fetch');

describe('Service', () => {
	describe('methods', () => {
		describe('acquireReadStream', () => {
			it('resolves with the source if the source is a stream', () => {
				let context = {
					Promise
				};
				let subject = fs.createReadStream(__filename);
				return Service.methods.acquireReadStream.bind(context)(subject).then(result => {
					expect(result).toEqual(subject);
				});
			});

			it('resolves with a stream if the source is a string', () => {
				let context = {
					Promise
				};
				return Service.methods.acquireReadStream.bind(context)(__filename).then(result => {
					expect(result.constructor.name).toEqual('ReadStream');
				});
			});

			it('resolves with a stream to a http source if the source is an object', () => {
				let context = {
					Promise
				};
				let subject = {
					url: 'https://example.com',
					foo: 'bar'
				};
				let res = {body: fs.createReadStream(__filename)};
				fetch.mockReturnValueOnce(Promise.resolve(res));
				return Service.methods.acquireReadStream.bind(context)(subject).then(result => {
					expect(fetch.mock.calls[0]).toEqual(['https://example.com', {foo: 'bar'}]);
					expect(result.constructor.name).toEqual('ReadStream');
				});
			});

			it('rejects if the source is NaN', () => {
				let context = {
					Promise
				};
				let subject = NaN;
				let res = {body: {fooz: 'barz'}};
				fetch.mockReturnValueOnce(Promise.resolve(res));
				return Service.methods.acquireReadStream.bind(context)(subject).catch(e => {
					expect(e.constructor.name).toEqual('SharpStreamAcquisitionError');
				});
			});
		});
	});
});
