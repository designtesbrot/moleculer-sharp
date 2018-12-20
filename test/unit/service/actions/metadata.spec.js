const Service = () => require('service');
const Promise = require('bluebird');
const sharp = require('sharp');
describe('Service', () => {
	describe('actions', () => {
		describe('metadata', () => {
			it('resolves with the metadata of the image', () => {
				let context = {
					acquireReadStream: jest.fn().mockReturnValueOnce(Promise.resolve('foo')),
					bufferStream: jest.fn().mockReturnValueOnce(Promise.resolve('bar')),
					Promise
				};
				const image = {metadata: () => Object.assign({},{foo: 'bar'})};
				sharp.mockReturnValueOnce(Promise.resolve(image));
				return Service().actions.metadata.handler.bind(context)({params: 'someSource'}).then(r => {
					expect(r).toEqual({foo: 'bar'});
				});
			});
		});
	});
});
