[![Moleculer logo](http://moleculer.services/images/banner.png)](https://github.com/moleculerjs/moleculer)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdesigntesbrot%2Fmoleculer-sharp.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdesigntesbrot%2Fmoleculer-sharp?ref=badge_shield)

[![Build Status](https://travis-ci.com/designtesbrot/moleculer-sharp.svg?branch=master)](https://travis-ci.com/designtesbrot/moleculer-sharp)
[![Coverage Status](https://coveralls.io/repos/github/designtesbrot/moleculer-sharp/badge.svg?branch=master)](https://coveralls.io/github/designtesbrot/moleculer-sharp?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7f8245b6a42249a7b3f5de62d88a9ef4)](https://www.codacy.com/app/designtesbrot/moleculer-sharp?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=designtesbrot/moleculer-sharp&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/92a1e223f18762feb513/maintainability)](https://codeclimate.com/github/designtesbrot/moleculer-sharp/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/designtesbrot/moleculer-sharp/badge.svg)](https://snyk.io/test/github/designtesbrot/moleculer-sharp)
[![npm version](https://badge.fury.io/js/moleculer-sharp.svg)](https://badge.fury.io/js/moleculer-sharp)
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/33de085edc9d85004add)

# Image Manipulation Service for the Moleculer framework

This Services provides actions for manipulating images using the super fast [Sharp](http://sharp.pixelplumbing.com/en/stable/) module. It 
utilizes the file streaming capabilities of the moleculer framework

## Features

The following List details which features are implemented

- Obtain Metadata of an image at a path, being streamed or available via http(s)
- Obtain Channel Statistics of an image at a path, being streamed or available via http(s)
- Process an image with all manipulation and transformation methods available in Sharp (such as rotation, flip, convert, resize etc) 

## Install

This package is available in the npm-registry. In order to use it simply install it with yarn (or npm):

```bash
yarn add moleculer-sharp
```

## Usage

To make use of this Service, simply require it and create a new service:

```js
const fs = require("fs");
let { ServiceBroker } = require("moleculer");
let SharpService = require("moleculer-sharp");

let broker = new ServiceBroker({ logger: console });

// Create a service
broker.createService({
    mixins: SharpService,
});

// Start server
broker.start()
    .then(() => broker.call('sharp.metadata',{url: 'https://pics.me.me/welcome-to-the-internet-ill-be-your-guide-28274277.png'}))
    .then(() => broker.call('sharp.stats',{url: 'https://pics.me.me/welcome-to-the-internet-ill-be-your-guide-28274277.png'}))
    .then(() => 
        broker.call('sharp.process',{url: 'https://pics.me.me/welcome-to-the-internet-ill-be-your-guide-28274277.png'}, {meta:
            steps: [
                ["resize", 200],
                ["rotate", 30, {"background": {"r": 0, "g": 0, "b": 0, "alpha": 0}}],
                "jpeg"
            ]
        }));
```

For a more indepth example checkout out the `examples folder`. It includes a docker-compose file, running `docker-compose up` will boot a broker with a sharp service
and an API Gateway to invoke the actions of the sharp service. This project includes a [published postman collection](https://app.getpostman.com/run-collection/33de085edc9d85004add) enabling you to quickly explore the service in your local environment.

## Settings

<!-- AUTO-CONTENT-START:SETTINGS -->
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
*No settings.*

<!-- AUTO-CONTENT-END:SETTINGS -->

<!-- AUTO-CONTENT-TEMPLATE:SETTINGS
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each this}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^this}}
*No settings.*
{{/this}}

-->

## Actions

<!-- AUTO-CONTENT-START:ACTIONS -->
## `metadata` 

Fast access to (uncached) image metadata without decoding any compressed image data.

```js
broker.call('sharp.metadata',{url: 'https://pics.me.me/welcome-to-the-internet-ill-be-your-guide-28274277.png'})
```

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `params` | `String`, `ReadableStream`, `Object` | **required** | the image to acquire metadata for, can be a path, a stream or an object. If a **path** is given, this action will try to acquire a readable stream for the path. If an **object** is given, a http(s) stream will be acquired and the response body will be subject. For the location of the request, the url property will be used, while all other properties will be used as [node-fetch-options](https://www.npmjs.com/package/node-fetch#fetch-options) |

### Results
**Type:** `PromiseLike.<(Object|Error)>`




## `stats` 

Gather stats of an image

```js
broker.call('sharp.stats',{url: 'https://pics.me.me/welcome-to-the-internet-ill-be-your-guide-28274277.png'})
```

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `params` | `String`, `ReadableStream`, `Object` | **required** | the image to acquire stats for, can be a path, a stream or an object. If a **path** is given, this action will try to acquire a readable stream for the path. If an **object** is given, a http(s) stream will be acquired and the response body will be subject. For the location of the request, the url property will be used, while all other properties will be used as [node-fetch-options](https://www.npmjs.com/package/node-fetch#fetch-options) |

### Results
**Type:** `PromiseLike.<(Object|Error)>`




## `process` 

Processes an image. The action parameter indicates which image to process. The actual processing instructions
have to be provided via the `meta.steps` property of the call. Any operation that is listed on the
[Sharp Documentation](http://sharp.pixelplumbing.com/en/stable/) can be included as a step instruction. Here is an example:

```js
broker.call('sharp.process',{url: 'https://pics.me.me/welcome-to-the-internet-ill-be-your-guide-28274277.png'}, {meta:
    steps: [
        ["resize", 200],
     ["rotate", 30, {"background": {"r": 0, "g": 0, "b": 0, "alpha": 0}}],
     "jpeg"
    ]
})
```

If your last step instructions is a `toFile` instructions, the transformation output will be written to disk, and the
action will respond with meta information about the image. In any other case the action will respond with a readable
stream for your to further process.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `params` | `String`, `ReadableStream`, `Object` | **required** | the image to process, can be a path, a stream or an object. If a **path** is given, this action will try to acquire a readable stream for the path. If an **object** is given, a http(s) stream will be acquired and the response body will be subject. For the location of the request, the url property will be used, while all other properties will be used as [node-fetch-options](https://www.npmjs.com/package/node-fetch#fetch-options) |

### Results
**Type:** `PromiseLike.<(undefined|Error)>`




<!-- AUTO-CONTENT-END:ACTIONS -->

<!-- AUTO-CONTENT-TEMPLATE:ACTIONS
{{#each this}}
## `{{name}}` {{#each badges}}{{this}} {{/each}}
{{#since}}
_<sup>Since: {{this}}</sup>_
{{/since}}

{{description}}

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each params}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^params}}
*No input parameters.*
{{/params}}

{{#returns}}
### Results
**Type:** {{type}}

{{description}}
{{/returns}}

{{#hasExamples}}
### Examples
{{#each examples}}
{{this}}
{{/each}}
{{/hasExamples}}

{{/each}}
-->

# Methods

<!-- AUTO-CONTENT-START:METHODS -->
## `acquireReadStream` 

Acquire a readable stream from a given source

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `source` | `String`, `ReadableStream`, `Object` | **required** | can be a path, a stream or an object. If a **path** is given, this action will try to acquire a readable stream for the path. If an **object** is given, a http(s) stream will be acquired for the response body. For the location of the request, the url property will be used, while all other properties will be used as [node-fetch-options](https://www.npmjs.com/package/node-fetch#fetch-options) |

### Results
**Type:** `PromiseLike.<(Stream|SharpStreamAcquisitionError|Error)>`




## `bufferStream` 

Feed a Stream into a Buffer

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `stream` | `ReadableStream` | **required** |  |

### Results
**Type:** `PromiseLike.<(Buffer|Error)>`




<!-- AUTO-CONTENT-END:METHODS -->

<!-- AUTO-CONTENT-TEMPLATE:METHODS
{{#each this}}
## `{{name}}` {{#each badges}}{{this}} {{/each}}
{{#since}}
_<sup>Since: {{this}}</sup>_
{{/since}}

{{description}}

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each params}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^params}}
*No input parameters.*
{{/params}}

{{#returns}}
### Results
**Type:** {{type}}

{{description}}
{{/returns}}

{{#hasExamples}}
### Examples
{{#each examples}}
{{this}}
{{/each}}
{{/hasExamples}}

{{/each}}
-->

## Test
```
$ docker-compose exec package yarn test
```

In development with watching

```
$ docker-compose up
```

## License
moleculer-sharp is available under the [MIT license](https://tldrlegal.com/license/mit-license).


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdesigntesbrot%2Fmoleculer-sharp.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdesigntesbrot%2Fmoleculer-sharp?ref=badge_large)
