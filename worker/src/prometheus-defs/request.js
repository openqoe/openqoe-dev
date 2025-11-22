/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.io = (function() {

    /**
     * Namespace io.
     * @exports io
     * @namespace
     */
    var io = {};

    io.prometheus = (function() {

        /**
         * Namespace prometheus.
         * @memberof io
         * @namespace
         */
        var prometheus = {};

        prometheus.write = (function() {

            /**
             * Namespace write.
             * @memberof io.prometheus
             * @namespace
             */
            var write = {};

            write.v2 = (function() {

                /**
                 * Namespace v2.
                 * @memberof io.prometheus.write
                 * @namespace
                 */
                var v2 = {};

                v2.Request = (function() {

                    /**
                     * Properties of a Request.
                     * @memberof io.prometheus.write.v2
                     * @interface IRequest
                     * @property {Array.<string>|null} [symbols] Request symbols
                     * @property {Array.<io.prometheus.write.v2.ITimeSeries>|null} [timeseries] Request timeseries
                     */

                    /**
                     * Constructs a new Request.
                     * @memberof io.prometheus.write.v2
                     * @classdesc Represents a Request.
                     * @implements IRequest
                     * @constructor
                     * @param {io.prometheus.write.v2.IRequest=} [properties] Properties to set
                     */
                    function Request(properties) {
                        this.symbols = [];
                        this.timeseries = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Request symbols.
                     * @member {Array.<string>} symbols
                     * @memberof io.prometheus.write.v2.Request
                     * @instance
                     */
                    Request.prototype.symbols = $util.emptyArray;

                    /**
                     * Request timeseries.
                     * @member {Array.<io.prometheus.write.v2.ITimeSeries>} timeseries
                     * @memberof io.prometheus.write.v2.Request
                     * @instance
                     */
                    Request.prototype.timeseries = $util.emptyArray;

                    /**
                     * Creates a new Request instance using the specified properties.
                     * @function create
                     * @memberof io.prometheus.write.v2.Request
                     * @static
                     * @param {io.prometheus.write.v2.IRequest=} [properties] Properties to set
                     * @returns {io.prometheus.write.v2.Request} Request instance
                     */
                    Request.create = function create(properties) {
                        return new Request(properties);
                    };

                    /**
                     * Encodes the specified Request message. Does not implicitly {@link io.prometheus.write.v2.Request.verify|verify} messages.
                     * @function encode
                     * @memberof io.prometheus.write.v2.Request
                     * @static
                     * @param {io.prometheus.write.v2.IRequest} message Request message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Request.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.symbols != null && message.symbols.length)
                            for (var i = 0; i < message.symbols.length; ++i)
                                writer.uint32(/* id 4, wireType 2 =*/34).string(message.symbols[i]);
                        if (message.timeseries != null && message.timeseries.length)
                            for (var i = 0; i < message.timeseries.length; ++i)
                                $root.io.prometheus.write.v2.TimeSeries.encode(message.timeseries[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified Request message, length delimited. Does not implicitly {@link io.prometheus.write.v2.Request.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof io.prometheus.write.v2.Request
                     * @static
                     * @param {io.prometheus.write.v2.IRequest} message Request message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Request.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Request message from the specified reader or buffer.
                     * @function decode
                     * @memberof io.prometheus.write.v2.Request
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {io.prometheus.write.v2.Request} Request
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Request.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.io.prometheus.write.v2.Request();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 4: {
                                    if (!(message.symbols && message.symbols.length))
                                        message.symbols = [];
                                    message.symbols.push(reader.string());
                                    break;
                                }
                            case 5: {
                                    if (!(message.timeseries && message.timeseries.length))
                                        message.timeseries = [];
                                    message.timeseries.push($root.io.prometheus.write.v2.TimeSeries.decode(reader, reader.uint32()));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Request message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof io.prometheus.write.v2.Request
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {io.prometheus.write.v2.Request} Request
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Request.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Request message.
                     * @function verify
                     * @memberof io.prometheus.write.v2.Request
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Request.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.symbols != null && message.hasOwnProperty("symbols")) {
                            if (!Array.isArray(message.symbols))
                                return "symbols: array expected";
                            for (var i = 0; i < message.symbols.length; ++i)
                                if (!$util.isString(message.symbols[i]))
                                    return "symbols: string[] expected";
                        }
                        if (message.timeseries != null && message.hasOwnProperty("timeseries")) {
                            if (!Array.isArray(message.timeseries))
                                return "timeseries: array expected";
                            for (var i = 0; i < message.timeseries.length; ++i) {
                                var error = $root.io.prometheus.write.v2.TimeSeries.verify(message.timeseries[i]);
                                if (error)
                                    return "timeseries." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates a Request message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof io.prometheus.write.v2.Request
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {io.prometheus.write.v2.Request} Request
                     */
                    Request.fromObject = function fromObject(object) {
                        if (object instanceof $root.io.prometheus.write.v2.Request)
                            return object;
                        var message = new $root.io.prometheus.write.v2.Request();
                        if (object.symbols) {
                            if (!Array.isArray(object.symbols))
                                throw TypeError(".io.prometheus.write.v2.Request.symbols: array expected");
                            message.symbols = [];
                            for (var i = 0; i < object.symbols.length; ++i)
                                message.symbols[i] = String(object.symbols[i]);
                        }
                        if (object.timeseries) {
                            if (!Array.isArray(object.timeseries))
                                throw TypeError(".io.prometheus.write.v2.Request.timeseries: array expected");
                            message.timeseries = [];
                            for (var i = 0; i < object.timeseries.length; ++i) {
                                if (typeof object.timeseries[i] !== "object")
                                    throw TypeError(".io.prometheus.write.v2.Request.timeseries: object expected");
                                message.timeseries[i] = $root.io.prometheus.write.v2.TimeSeries.fromObject(object.timeseries[i]);
                            }
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a Request message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof io.prometheus.write.v2.Request
                     * @static
                     * @param {io.prometheus.write.v2.Request} message Request
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Request.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults) {
                            object.symbols = [];
                            object.timeseries = [];
                        }
                        if (message.symbols && message.symbols.length) {
                            object.symbols = [];
                            for (var j = 0; j < message.symbols.length; ++j)
                                object.symbols[j] = message.symbols[j];
                        }
                        if (message.timeseries && message.timeseries.length) {
                            object.timeseries = [];
                            for (var j = 0; j < message.timeseries.length; ++j)
                                object.timeseries[j] = $root.io.prometheus.write.v2.TimeSeries.toObject(message.timeseries[j], options);
                        }
                        return object;
                    };

                    /**
                     * Converts this Request to JSON.
                     * @function toJSON
                     * @memberof io.prometheus.write.v2.Request
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Request.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for Request
                     * @function getTypeUrl
                     * @memberof io.prometheus.write.v2.Request
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    Request.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/io.prometheus.write.v2.Request";
                    };

                    return Request;
                })();

                v2.TimeSeries = (function() {

                    /**
                     * Properties of a TimeSeries.
                     * @memberof io.prometheus.write.v2
                     * @interface ITimeSeries
                     * @property {Array.<number>|null} [labelsRefs] TimeSeries labelsRefs
                     * @property {Array.<io.prometheus.write.v2.ISample>|null} [samples] TimeSeries samples
                     * @property {Array.<io.prometheus.write.v2.IHistogram>|null} [histograms] TimeSeries histograms
                     * @property {Array.<io.prometheus.write.v2.IExemplar>|null} [exemplars] TimeSeries exemplars
                     * @property {io.prometheus.write.v2.IMetadata|null} [metadata] TimeSeries metadata
                     */

                    /**
                     * Constructs a new TimeSeries.
                     * @memberof io.prometheus.write.v2
                     * @classdesc Represents a TimeSeries.
                     * @implements ITimeSeries
                     * @constructor
                     * @param {io.prometheus.write.v2.ITimeSeries=} [properties] Properties to set
                     */
                    function TimeSeries(properties) {
                        this.labelsRefs = [];
                        this.samples = [];
                        this.histograms = [];
                        this.exemplars = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * TimeSeries labelsRefs.
                     * @member {Array.<number>} labelsRefs
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @instance
                     */
                    TimeSeries.prototype.labelsRefs = $util.emptyArray;

                    /**
                     * TimeSeries samples.
                     * @member {Array.<io.prometheus.write.v2.ISample>} samples
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @instance
                     */
                    TimeSeries.prototype.samples = $util.emptyArray;

                    /**
                     * TimeSeries histograms.
                     * @member {Array.<io.prometheus.write.v2.IHistogram>} histograms
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @instance
                     */
                    TimeSeries.prototype.histograms = $util.emptyArray;

                    /**
                     * TimeSeries exemplars.
                     * @member {Array.<io.prometheus.write.v2.IExemplar>} exemplars
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @instance
                     */
                    TimeSeries.prototype.exemplars = $util.emptyArray;

                    /**
                     * TimeSeries metadata.
                     * @member {io.prometheus.write.v2.IMetadata|null|undefined} metadata
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @instance
                     */
                    TimeSeries.prototype.metadata = null;

                    /**
                     * Creates a new TimeSeries instance using the specified properties.
                     * @function create
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @static
                     * @param {io.prometheus.write.v2.ITimeSeries=} [properties] Properties to set
                     * @returns {io.prometheus.write.v2.TimeSeries} TimeSeries instance
                     */
                    TimeSeries.create = function create(properties) {
                        return new TimeSeries(properties);
                    };

                    /**
                     * Encodes the specified TimeSeries message. Does not implicitly {@link io.prometheus.write.v2.TimeSeries.verify|verify} messages.
                     * @function encode
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @static
                     * @param {io.prometheus.write.v2.ITimeSeries} message TimeSeries message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TimeSeries.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.labelsRefs != null && message.labelsRefs.length) {
                            writer.uint32(/* id 1, wireType 2 =*/10).fork();
                            for (var i = 0; i < message.labelsRefs.length; ++i)
                                writer.uint32(message.labelsRefs[i]);
                            writer.ldelim();
                        }
                        if (message.samples != null && message.samples.length)
                            for (var i = 0; i < message.samples.length; ++i)
                                $root.io.prometheus.write.v2.Sample.encode(message.samples[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        if (message.histograms != null && message.histograms.length)
                            for (var i = 0; i < message.histograms.length; ++i)
                                $root.io.prometheus.write.v2.Histogram.encode(message.histograms[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        if (message.exemplars != null && message.exemplars.length)
                            for (var i = 0; i < message.exemplars.length; ++i)
                                $root.io.prometheus.write.v2.Exemplar.encode(message.exemplars[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                        if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                            $root.io.prometheus.write.v2.Metadata.encode(message.metadata, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified TimeSeries message, length delimited. Does not implicitly {@link io.prometheus.write.v2.TimeSeries.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @static
                     * @param {io.prometheus.write.v2.ITimeSeries} message TimeSeries message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TimeSeries.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a TimeSeries message from the specified reader or buffer.
                     * @function decode
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {io.prometheus.write.v2.TimeSeries} TimeSeries
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TimeSeries.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.io.prometheus.write.v2.TimeSeries();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.labelsRefs && message.labelsRefs.length))
                                        message.labelsRefs = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.labelsRefs.push(reader.uint32());
                                    } else
                                        message.labelsRefs.push(reader.uint32());
                                    break;
                                }
                            case 2: {
                                    if (!(message.samples && message.samples.length))
                                        message.samples = [];
                                    message.samples.push($root.io.prometheus.write.v2.Sample.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 3: {
                                    if (!(message.histograms && message.histograms.length))
                                        message.histograms = [];
                                    message.histograms.push($root.io.prometheus.write.v2.Histogram.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 4: {
                                    if (!(message.exemplars && message.exemplars.length))
                                        message.exemplars = [];
                                    message.exemplars.push($root.io.prometheus.write.v2.Exemplar.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 5: {
                                    message.metadata = $root.io.prometheus.write.v2.Metadata.decode(reader, reader.uint32());
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a TimeSeries message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {io.prometheus.write.v2.TimeSeries} TimeSeries
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TimeSeries.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a TimeSeries message.
                     * @function verify
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TimeSeries.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.labelsRefs != null && message.hasOwnProperty("labelsRefs")) {
                            if (!Array.isArray(message.labelsRefs))
                                return "labelsRefs: array expected";
                            for (var i = 0; i < message.labelsRefs.length; ++i)
                                if (!$util.isInteger(message.labelsRefs[i]))
                                    return "labelsRefs: integer[] expected";
                        }
                        if (message.samples != null && message.hasOwnProperty("samples")) {
                            if (!Array.isArray(message.samples))
                                return "samples: array expected";
                            for (var i = 0; i < message.samples.length; ++i) {
                                var error = $root.io.prometheus.write.v2.Sample.verify(message.samples[i]);
                                if (error)
                                    return "samples." + error;
                            }
                        }
                        if (message.histograms != null && message.hasOwnProperty("histograms")) {
                            if (!Array.isArray(message.histograms))
                                return "histograms: array expected";
                            for (var i = 0; i < message.histograms.length; ++i) {
                                var error = $root.io.prometheus.write.v2.Histogram.verify(message.histograms[i]);
                                if (error)
                                    return "histograms." + error;
                            }
                        }
                        if (message.exemplars != null && message.hasOwnProperty("exemplars")) {
                            if (!Array.isArray(message.exemplars))
                                return "exemplars: array expected";
                            for (var i = 0; i < message.exemplars.length; ++i) {
                                var error = $root.io.prometheus.write.v2.Exemplar.verify(message.exemplars[i]);
                                if (error)
                                    return "exemplars." + error;
                            }
                        }
                        if (message.metadata != null && message.hasOwnProperty("metadata")) {
                            var error = $root.io.prometheus.write.v2.Metadata.verify(message.metadata);
                            if (error)
                                return "metadata." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a TimeSeries message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {io.prometheus.write.v2.TimeSeries} TimeSeries
                     */
                    TimeSeries.fromObject = function fromObject(object) {
                        if (object instanceof $root.io.prometheus.write.v2.TimeSeries)
                            return object;
                        var message = new $root.io.prometheus.write.v2.TimeSeries();
                        if (object.labelsRefs) {
                            if (!Array.isArray(object.labelsRefs))
                                throw TypeError(".io.prometheus.write.v2.TimeSeries.labelsRefs: array expected");
                            message.labelsRefs = [];
                            for (var i = 0; i < object.labelsRefs.length; ++i)
                                message.labelsRefs[i] = object.labelsRefs[i] >>> 0;
                        }
                        if (object.samples) {
                            if (!Array.isArray(object.samples))
                                throw TypeError(".io.prometheus.write.v2.TimeSeries.samples: array expected");
                            message.samples = [];
                            for (var i = 0; i < object.samples.length; ++i) {
                                if (typeof object.samples[i] !== "object")
                                    throw TypeError(".io.prometheus.write.v2.TimeSeries.samples: object expected");
                                message.samples[i] = $root.io.prometheus.write.v2.Sample.fromObject(object.samples[i]);
                            }
                        }
                        if (object.histograms) {
                            if (!Array.isArray(object.histograms))
                                throw TypeError(".io.prometheus.write.v2.TimeSeries.histograms: array expected");
                            message.histograms = [];
                            for (var i = 0; i < object.histograms.length; ++i) {
                                if (typeof object.histograms[i] !== "object")
                                    throw TypeError(".io.prometheus.write.v2.TimeSeries.histograms: object expected");
                                message.histograms[i] = $root.io.prometheus.write.v2.Histogram.fromObject(object.histograms[i]);
                            }
                        }
                        if (object.exemplars) {
                            if (!Array.isArray(object.exemplars))
                                throw TypeError(".io.prometheus.write.v2.TimeSeries.exemplars: array expected");
                            message.exemplars = [];
                            for (var i = 0; i < object.exemplars.length; ++i) {
                                if (typeof object.exemplars[i] !== "object")
                                    throw TypeError(".io.prometheus.write.v2.TimeSeries.exemplars: object expected");
                                message.exemplars[i] = $root.io.prometheus.write.v2.Exemplar.fromObject(object.exemplars[i]);
                            }
                        }
                        if (object.metadata != null) {
                            if (typeof object.metadata !== "object")
                                throw TypeError(".io.prometheus.write.v2.TimeSeries.metadata: object expected");
                            message.metadata = $root.io.prometheus.write.v2.Metadata.fromObject(object.metadata);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a TimeSeries message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @static
                     * @param {io.prometheus.write.v2.TimeSeries} message TimeSeries
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TimeSeries.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults) {
                            object.labelsRefs = [];
                            object.samples = [];
                            object.histograms = [];
                            object.exemplars = [];
                        }
                        if (options.defaults)
                            object.metadata = null;
                        if (message.labelsRefs && message.labelsRefs.length) {
                            object.labelsRefs = [];
                            for (var j = 0; j < message.labelsRefs.length; ++j)
                                object.labelsRefs[j] = message.labelsRefs[j];
                        }
                        if (message.samples && message.samples.length) {
                            object.samples = [];
                            for (var j = 0; j < message.samples.length; ++j)
                                object.samples[j] = $root.io.prometheus.write.v2.Sample.toObject(message.samples[j], options);
                        }
                        if (message.histograms && message.histograms.length) {
                            object.histograms = [];
                            for (var j = 0; j < message.histograms.length; ++j)
                                object.histograms[j] = $root.io.prometheus.write.v2.Histogram.toObject(message.histograms[j], options);
                        }
                        if (message.exemplars && message.exemplars.length) {
                            object.exemplars = [];
                            for (var j = 0; j < message.exemplars.length; ++j)
                                object.exemplars[j] = $root.io.prometheus.write.v2.Exemplar.toObject(message.exemplars[j], options);
                        }
                        if (message.metadata != null && message.hasOwnProperty("metadata"))
                            object.metadata = $root.io.prometheus.write.v2.Metadata.toObject(message.metadata, options);
                        return object;
                    };

                    /**
                     * Converts this TimeSeries to JSON.
                     * @function toJSON
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TimeSeries.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for TimeSeries
                     * @function getTypeUrl
                     * @memberof io.prometheus.write.v2.TimeSeries
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    TimeSeries.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/io.prometheus.write.v2.TimeSeries";
                    };

                    return TimeSeries;
                })();

                v2.Exemplar = (function() {

                    /**
                     * Properties of an Exemplar.
                     * @memberof io.prometheus.write.v2
                     * @interface IExemplar
                     * @property {Array.<number>|null} [labelsRefs] Exemplar labelsRefs
                     * @property {number|null} [value] Exemplar value
                     * @property {number|Long|null} [timestamp] Exemplar timestamp
                     */

                    /**
                     * Constructs a new Exemplar.
                     * @memberof io.prometheus.write.v2
                     * @classdesc Represents an Exemplar.
                     * @implements IExemplar
                     * @constructor
                     * @param {io.prometheus.write.v2.IExemplar=} [properties] Properties to set
                     */
                    function Exemplar(properties) {
                        this.labelsRefs = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Exemplar labelsRefs.
                     * @member {Array.<number>} labelsRefs
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @instance
                     */
                    Exemplar.prototype.labelsRefs = $util.emptyArray;

                    /**
                     * Exemplar value.
                     * @member {number} value
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @instance
                     */
                    Exemplar.prototype.value = 0;

                    /**
                     * Exemplar timestamp.
                     * @member {number|Long} timestamp
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @instance
                     */
                    Exemplar.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Creates a new Exemplar instance using the specified properties.
                     * @function create
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @static
                     * @param {io.prometheus.write.v2.IExemplar=} [properties] Properties to set
                     * @returns {io.prometheus.write.v2.Exemplar} Exemplar instance
                     */
                    Exemplar.create = function create(properties) {
                        return new Exemplar(properties);
                    };

                    /**
                     * Encodes the specified Exemplar message. Does not implicitly {@link io.prometheus.write.v2.Exemplar.verify|verify} messages.
                     * @function encode
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @static
                     * @param {io.prometheus.write.v2.IExemplar} message Exemplar message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Exemplar.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.labelsRefs != null && message.labelsRefs.length) {
                            writer.uint32(/* id 1, wireType 2 =*/10).fork();
                            for (var i = 0; i < message.labelsRefs.length; ++i)
                                writer.uint32(message.labelsRefs[i]);
                            writer.ldelim();
                        }
                        if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                            writer.uint32(/* id 2, wireType 1 =*/17).double(message.value);
                        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestamp);
                        return writer;
                    };

                    /**
                     * Encodes the specified Exemplar message, length delimited. Does not implicitly {@link io.prometheus.write.v2.Exemplar.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @static
                     * @param {io.prometheus.write.v2.IExemplar} message Exemplar message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Exemplar.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes an Exemplar message from the specified reader or buffer.
                     * @function decode
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {io.prometheus.write.v2.Exemplar} Exemplar
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Exemplar.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.io.prometheus.write.v2.Exemplar();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    if (!(message.labelsRefs && message.labelsRefs.length))
                                        message.labelsRefs = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.labelsRefs.push(reader.uint32());
                                    } else
                                        message.labelsRefs.push(reader.uint32());
                                    break;
                                }
                            case 2: {
                                    message.value = reader.double();
                                    break;
                                }
                            case 3: {
                                    message.timestamp = reader.int64();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes an Exemplar message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {io.prometheus.write.v2.Exemplar} Exemplar
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Exemplar.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies an Exemplar message.
                     * @function verify
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Exemplar.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.labelsRefs != null && message.hasOwnProperty("labelsRefs")) {
                            if (!Array.isArray(message.labelsRefs))
                                return "labelsRefs: array expected";
                            for (var i = 0; i < message.labelsRefs.length; ++i)
                                if (!$util.isInteger(message.labelsRefs[i]))
                                    return "labelsRefs: integer[] expected";
                        }
                        if (message.value != null && message.hasOwnProperty("value"))
                            if (typeof message.value !== "number")
                                return "value: number expected";
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                                return "timestamp: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates an Exemplar message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {io.prometheus.write.v2.Exemplar} Exemplar
                     */
                    Exemplar.fromObject = function fromObject(object) {
                        if (object instanceof $root.io.prometheus.write.v2.Exemplar)
                            return object;
                        var message = new $root.io.prometheus.write.v2.Exemplar();
                        if (object.labelsRefs) {
                            if (!Array.isArray(object.labelsRefs))
                                throw TypeError(".io.prometheus.write.v2.Exemplar.labelsRefs: array expected");
                            message.labelsRefs = [];
                            for (var i = 0; i < object.labelsRefs.length; ++i)
                                message.labelsRefs[i] = object.labelsRefs[i] >>> 0;
                        }
                        if (object.value != null)
                            message.value = Number(object.value);
                        if (object.timestamp != null)
                            if ($util.Long)
                                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                            else if (typeof object.timestamp === "string")
                                message.timestamp = parseInt(object.timestamp, 10);
                            else if (typeof object.timestamp === "number")
                                message.timestamp = object.timestamp;
                            else if (typeof object.timestamp === "object")
                                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
                        return message;
                    };

                    /**
                     * Creates a plain object from an Exemplar message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @static
                     * @param {io.prometheus.write.v2.Exemplar} message Exemplar
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Exemplar.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults)
                            object.labelsRefs = [];
                        if (options.defaults) {
                            object.value = 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timestamp = options.longs === String ? "0" : 0;
                        }
                        if (message.labelsRefs && message.labelsRefs.length) {
                            object.labelsRefs = [];
                            for (var j = 0; j < message.labelsRefs.length; ++j)
                                object.labelsRefs[j] = message.labelsRefs[j];
                        }
                        if (message.value != null && message.hasOwnProperty("value"))
                            object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (typeof message.timestamp === "number")
                                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                            else
                                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                        return object;
                    };

                    /**
                     * Converts this Exemplar to JSON.
                     * @function toJSON
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Exemplar.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for Exemplar
                     * @function getTypeUrl
                     * @memberof io.prometheus.write.v2.Exemplar
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    Exemplar.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/io.prometheus.write.v2.Exemplar";
                    };

                    return Exemplar;
                })();

                v2.Sample = (function() {

                    /**
                     * Properties of a Sample.
                     * @memberof io.prometheus.write.v2
                     * @interface ISample
                     * @property {number|null} [value] Sample value
                     * @property {number|Long|null} [timestamp] Sample timestamp
                     * @property {number|Long|null} [startTimestamp] Sample startTimestamp
                     */

                    /**
                     * Constructs a new Sample.
                     * @memberof io.prometheus.write.v2
                     * @classdesc Represents a Sample.
                     * @implements ISample
                     * @constructor
                     * @param {io.prometheus.write.v2.ISample=} [properties] Properties to set
                     */
                    function Sample(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Sample value.
                     * @member {number} value
                     * @memberof io.prometheus.write.v2.Sample
                     * @instance
                     */
                    Sample.prototype.value = 0;

                    /**
                     * Sample timestamp.
                     * @member {number|Long} timestamp
                     * @memberof io.prometheus.write.v2.Sample
                     * @instance
                     */
                    Sample.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Sample startTimestamp.
                     * @member {number|Long} startTimestamp
                     * @memberof io.prometheus.write.v2.Sample
                     * @instance
                     */
                    Sample.prototype.startTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Creates a new Sample instance using the specified properties.
                     * @function create
                     * @memberof io.prometheus.write.v2.Sample
                     * @static
                     * @param {io.prometheus.write.v2.ISample=} [properties] Properties to set
                     * @returns {io.prometheus.write.v2.Sample} Sample instance
                     */
                    Sample.create = function create(properties) {
                        return new Sample(properties);
                    };

                    /**
                     * Encodes the specified Sample message. Does not implicitly {@link io.prometheus.write.v2.Sample.verify|verify} messages.
                     * @function encode
                     * @memberof io.prometheus.write.v2.Sample
                     * @static
                     * @param {io.prometheus.write.v2.ISample} message Sample message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Sample.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                            writer.uint32(/* id 1, wireType 1 =*/9).double(message.value);
                        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
                        if (message.startTimestamp != null && Object.hasOwnProperty.call(message, "startTimestamp"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.startTimestamp);
                        return writer;
                    };

                    /**
                     * Encodes the specified Sample message, length delimited. Does not implicitly {@link io.prometheus.write.v2.Sample.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof io.prometheus.write.v2.Sample
                     * @static
                     * @param {io.prometheus.write.v2.ISample} message Sample message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Sample.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Sample message from the specified reader or buffer.
                     * @function decode
                     * @memberof io.prometheus.write.v2.Sample
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {io.prometheus.write.v2.Sample} Sample
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Sample.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.io.prometheus.write.v2.Sample();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.value = reader.double();
                                    break;
                                }
                            case 2: {
                                    message.timestamp = reader.int64();
                                    break;
                                }
                            case 3: {
                                    message.startTimestamp = reader.int64();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Sample message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof io.prometheus.write.v2.Sample
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {io.prometheus.write.v2.Sample} Sample
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Sample.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Sample message.
                     * @function verify
                     * @memberof io.prometheus.write.v2.Sample
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Sample.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.value != null && message.hasOwnProperty("value"))
                            if (typeof message.value !== "number")
                                return "value: number expected";
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                                return "timestamp: integer|Long expected";
                        if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                            if (!$util.isInteger(message.startTimestamp) && !(message.startTimestamp && $util.isInteger(message.startTimestamp.low) && $util.isInteger(message.startTimestamp.high)))
                                return "startTimestamp: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a Sample message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof io.prometheus.write.v2.Sample
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {io.prometheus.write.v2.Sample} Sample
                     */
                    Sample.fromObject = function fromObject(object) {
                        if (object instanceof $root.io.prometheus.write.v2.Sample)
                            return object;
                        var message = new $root.io.prometheus.write.v2.Sample();
                        if (object.value != null)
                            message.value = Number(object.value);
                        if (object.timestamp != null)
                            if ($util.Long)
                                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                            else if (typeof object.timestamp === "string")
                                message.timestamp = parseInt(object.timestamp, 10);
                            else if (typeof object.timestamp === "number")
                                message.timestamp = object.timestamp;
                            else if (typeof object.timestamp === "object")
                                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
                        if (object.startTimestamp != null)
                            if ($util.Long)
                                (message.startTimestamp = $util.Long.fromValue(object.startTimestamp)).unsigned = false;
                            else if (typeof object.startTimestamp === "string")
                                message.startTimestamp = parseInt(object.startTimestamp, 10);
                            else if (typeof object.startTimestamp === "number")
                                message.startTimestamp = object.startTimestamp;
                            else if (typeof object.startTimestamp === "object")
                                message.startTimestamp = new $util.LongBits(object.startTimestamp.low >>> 0, object.startTimestamp.high >>> 0).toNumber();
                        return message;
                    };

                    /**
                     * Creates a plain object from a Sample message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof io.prometheus.write.v2.Sample
                     * @static
                     * @param {io.prometheus.write.v2.Sample} message Sample
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Sample.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.value = 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timestamp = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.startTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.startTimestamp = options.longs === String ? "0" : 0;
                        }
                        if (message.value != null && message.hasOwnProperty("value"))
                            object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (typeof message.timestamp === "number")
                                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                            else
                                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                        if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                            if (typeof message.startTimestamp === "number")
                                object.startTimestamp = options.longs === String ? String(message.startTimestamp) : message.startTimestamp;
                            else
                                object.startTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.startTimestamp) : options.longs === Number ? new $util.LongBits(message.startTimestamp.low >>> 0, message.startTimestamp.high >>> 0).toNumber() : message.startTimestamp;
                        return object;
                    };

                    /**
                     * Converts this Sample to JSON.
                     * @function toJSON
                     * @memberof io.prometheus.write.v2.Sample
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Sample.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for Sample
                     * @function getTypeUrl
                     * @memberof io.prometheus.write.v2.Sample
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    Sample.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/io.prometheus.write.v2.Sample";
                    };

                    return Sample;
                })();

                v2.Metadata = (function() {

                    /**
                     * Properties of a Metadata.
                     * @memberof io.prometheus.write.v2
                     * @interface IMetadata
                     * @property {io.prometheus.write.v2.Metadata.MetricType|null} [type] Metadata type
                     * @property {number|null} [helpRef] Metadata helpRef
                     * @property {number|null} [unitRef] Metadata unitRef
                     */

                    /**
                     * Constructs a new Metadata.
                     * @memberof io.prometheus.write.v2
                     * @classdesc Represents a Metadata.
                     * @implements IMetadata
                     * @constructor
                     * @param {io.prometheus.write.v2.IMetadata=} [properties] Properties to set
                     */
                    function Metadata(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Metadata type.
                     * @member {io.prometheus.write.v2.Metadata.MetricType} type
                     * @memberof io.prometheus.write.v2.Metadata
                     * @instance
                     */
                    Metadata.prototype.type = 0;

                    /**
                     * Metadata helpRef.
                     * @member {number} helpRef
                     * @memberof io.prometheus.write.v2.Metadata
                     * @instance
                     */
                    Metadata.prototype.helpRef = 0;

                    /**
                     * Metadata unitRef.
                     * @member {number} unitRef
                     * @memberof io.prometheus.write.v2.Metadata
                     * @instance
                     */
                    Metadata.prototype.unitRef = 0;

                    /**
                     * Creates a new Metadata instance using the specified properties.
                     * @function create
                     * @memberof io.prometheus.write.v2.Metadata
                     * @static
                     * @param {io.prometheus.write.v2.IMetadata=} [properties] Properties to set
                     * @returns {io.prometheus.write.v2.Metadata} Metadata instance
                     */
                    Metadata.create = function create(properties) {
                        return new Metadata(properties);
                    };

                    /**
                     * Encodes the specified Metadata message. Does not implicitly {@link io.prometheus.write.v2.Metadata.verify|verify} messages.
                     * @function encode
                     * @memberof io.prometheus.write.v2.Metadata
                     * @static
                     * @param {io.prometheus.write.v2.IMetadata} message Metadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Metadata.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                        if (message.helpRef != null && Object.hasOwnProperty.call(message, "helpRef"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.helpRef);
                        if (message.unitRef != null && Object.hasOwnProperty.call(message, "unitRef"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.unitRef);
                        return writer;
                    };

                    /**
                     * Encodes the specified Metadata message, length delimited. Does not implicitly {@link io.prometheus.write.v2.Metadata.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof io.prometheus.write.v2.Metadata
                     * @static
                     * @param {io.prometheus.write.v2.IMetadata} message Metadata message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Metadata.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Metadata message from the specified reader or buffer.
                     * @function decode
                     * @memberof io.prometheus.write.v2.Metadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {io.prometheus.write.v2.Metadata} Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Metadata.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.io.prometheus.write.v2.Metadata();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.type = reader.int32();
                                    break;
                                }
                            case 3: {
                                    message.helpRef = reader.uint32();
                                    break;
                                }
                            case 4: {
                                    message.unitRef = reader.uint32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Metadata message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof io.prometheus.write.v2.Metadata
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {io.prometheus.write.v2.Metadata} Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Metadata.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Metadata message.
                     * @function verify
                     * @memberof io.prometheus.write.v2.Metadata
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Metadata.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.type != null && message.hasOwnProperty("type"))
                            switch (message.type) {
                            default:
                                return "type: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                                break;
                            }
                        if (message.helpRef != null && message.hasOwnProperty("helpRef"))
                            if (!$util.isInteger(message.helpRef))
                                return "helpRef: integer expected";
                        if (message.unitRef != null && message.hasOwnProperty("unitRef"))
                            if (!$util.isInteger(message.unitRef))
                                return "unitRef: integer expected";
                        return null;
                    };

                    /**
                     * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof io.prometheus.write.v2.Metadata
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {io.prometheus.write.v2.Metadata} Metadata
                     */
                    Metadata.fromObject = function fromObject(object) {
                        if (object instanceof $root.io.prometheus.write.v2.Metadata)
                            return object;
                        var message = new $root.io.prometheus.write.v2.Metadata();
                        switch (object.type) {
                        default:
                            if (typeof object.type === "number") {
                                message.type = object.type;
                                break;
                            }
                            break;
                        case "METRIC_TYPE_UNSPECIFIED":
                        case 0:
                            message.type = 0;
                            break;
                        case "METRIC_TYPE_COUNTER":
                        case 1:
                            message.type = 1;
                            break;
                        case "METRIC_TYPE_GAUGE":
                        case 2:
                            message.type = 2;
                            break;
                        case "METRIC_TYPE_HISTOGRAM":
                        case 3:
                            message.type = 3;
                            break;
                        case "METRIC_TYPE_GAUGEHISTOGRAM":
                        case 4:
                            message.type = 4;
                            break;
                        case "METRIC_TYPE_SUMMARY":
                        case 5:
                            message.type = 5;
                            break;
                        case "METRIC_TYPE_INFO":
                        case 6:
                            message.type = 6;
                            break;
                        case "METRIC_TYPE_STATESET":
                        case 7:
                            message.type = 7;
                            break;
                        }
                        if (object.helpRef != null)
                            message.helpRef = object.helpRef >>> 0;
                        if (object.unitRef != null)
                            message.unitRef = object.unitRef >>> 0;
                        return message;
                    };

                    /**
                     * Creates a plain object from a Metadata message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof io.prometheus.write.v2.Metadata
                     * @static
                     * @param {io.prometheus.write.v2.Metadata} message Metadata
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Metadata.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.type = options.enums === String ? "METRIC_TYPE_UNSPECIFIED" : 0;
                            object.helpRef = 0;
                            object.unitRef = 0;
                        }
                        if (message.type != null && message.hasOwnProperty("type"))
                            object.type = options.enums === String ? $root.io.prometheus.write.v2.Metadata.MetricType[message.type] === undefined ? message.type : $root.io.prometheus.write.v2.Metadata.MetricType[message.type] : message.type;
                        if (message.helpRef != null && message.hasOwnProperty("helpRef"))
                            object.helpRef = message.helpRef;
                        if (message.unitRef != null && message.hasOwnProperty("unitRef"))
                            object.unitRef = message.unitRef;
                        return object;
                    };

                    /**
                     * Converts this Metadata to JSON.
                     * @function toJSON
                     * @memberof io.prometheus.write.v2.Metadata
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Metadata.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for Metadata
                     * @function getTypeUrl
                     * @memberof io.prometheus.write.v2.Metadata
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    Metadata.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/io.prometheus.write.v2.Metadata";
                    };

                    /**
                     * MetricType enum.
                     * @name io.prometheus.write.v2.Metadata.MetricType
                     * @enum {number}
                     * @property {number} METRIC_TYPE_UNSPECIFIED=0 METRIC_TYPE_UNSPECIFIED value
                     * @property {number} METRIC_TYPE_COUNTER=1 METRIC_TYPE_COUNTER value
                     * @property {number} METRIC_TYPE_GAUGE=2 METRIC_TYPE_GAUGE value
                     * @property {number} METRIC_TYPE_HISTOGRAM=3 METRIC_TYPE_HISTOGRAM value
                     * @property {number} METRIC_TYPE_GAUGEHISTOGRAM=4 METRIC_TYPE_GAUGEHISTOGRAM value
                     * @property {number} METRIC_TYPE_SUMMARY=5 METRIC_TYPE_SUMMARY value
                     * @property {number} METRIC_TYPE_INFO=6 METRIC_TYPE_INFO value
                     * @property {number} METRIC_TYPE_STATESET=7 METRIC_TYPE_STATESET value
                     */
                    Metadata.MetricType = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "METRIC_TYPE_UNSPECIFIED"] = 0;
                        values[valuesById[1] = "METRIC_TYPE_COUNTER"] = 1;
                        values[valuesById[2] = "METRIC_TYPE_GAUGE"] = 2;
                        values[valuesById[3] = "METRIC_TYPE_HISTOGRAM"] = 3;
                        values[valuesById[4] = "METRIC_TYPE_GAUGEHISTOGRAM"] = 4;
                        values[valuesById[5] = "METRIC_TYPE_SUMMARY"] = 5;
                        values[valuesById[6] = "METRIC_TYPE_INFO"] = 6;
                        values[valuesById[7] = "METRIC_TYPE_STATESET"] = 7;
                        return values;
                    })();

                    return Metadata;
                })();

                v2.Histogram = (function() {

                    /**
                     * Properties of a Histogram.
                     * @memberof io.prometheus.write.v2
                     * @interface IHistogram
                     * @property {number|Long|null} [countInt] Histogram countInt
                     * @property {number|null} [countFloat] Histogram countFloat
                     * @property {number|null} [sum] Histogram sum
                     * @property {number|null} [schema] Histogram schema
                     * @property {number|null} [zeroThreshold] Histogram zeroThreshold
                     * @property {number|Long|null} [zeroCountInt] Histogram zeroCountInt
                     * @property {number|null} [zeroCountFloat] Histogram zeroCountFloat
                     * @property {Array.<io.prometheus.write.v2.IBucketSpan>|null} [negativeSpans] Histogram negativeSpans
                     * @property {Array.<number|Long>|null} [negativeDeltas] Histogram negativeDeltas
                     * @property {Array.<number>|null} [negativeCounts] Histogram negativeCounts
                     * @property {Array.<io.prometheus.write.v2.IBucketSpan>|null} [positiveSpans] Histogram positiveSpans
                     * @property {Array.<number|Long>|null} [positiveDeltas] Histogram positiveDeltas
                     * @property {Array.<number>|null} [positiveCounts] Histogram positiveCounts
                     * @property {io.prometheus.write.v2.Histogram.ResetHint|null} [resetHint] Histogram resetHint
                     * @property {number|Long|null} [timestamp] Histogram timestamp
                     * @property {Array.<number>|null} [customValues] Histogram customValues
                     * @property {number|Long|null} [startTimestamp] Histogram startTimestamp
                     */

                    /**
                     * Constructs a new Histogram.
                     * @memberof io.prometheus.write.v2
                     * @classdesc Represents a Histogram.
                     * @implements IHistogram
                     * @constructor
                     * @param {io.prometheus.write.v2.IHistogram=} [properties] Properties to set
                     */
                    function Histogram(properties) {
                        this.negativeSpans = [];
                        this.negativeDeltas = [];
                        this.negativeCounts = [];
                        this.positiveSpans = [];
                        this.positiveDeltas = [];
                        this.positiveCounts = [];
                        this.customValues = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Histogram countInt.
                     * @member {number|Long|null|undefined} countInt
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.countInt = null;

                    /**
                     * Histogram countFloat.
                     * @member {number|null|undefined} countFloat
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.countFloat = null;

                    /**
                     * Histogram sum.
                     * @member {number} sum
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.sum = 0;

                    /**
                     * Histogram schema.
                     * @member {number} schema
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.schema = 0;

                    /**
                     * Histogram zeroThreshold.
                     * @member {number} zeroThreshold
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.zeroThreshold = 0;

                    /**
                     * Histogram zeroCountInt.
                     * @member {number|Long|null|undefined} zeroCountInt
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.zeroCountInt = null;

                    /**
                     * Histogram zeroCountFloat.
                     * @member {number|null|undefined} zeroCountFloat
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.zeroCountFloat = null;

                    /**
                     * Histogram negativeSpans.
                     * @member {Array.<io.prometheus.write.v2.IBucketSpan>} negativeSpans
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.negativeSpans = $util.emptyArray;

                    /**
                     * Histogram negativeDeltas.
                     * @member {Array.<number|Long>} negativeDeltas
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.negativeDeltas = $util.emptyArray;

                    /**
                     * Histogram negativeCounts.
                     * @member {Array.<number>} negativeCounts
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.negativeCounts = $util.emptyArray;

                    /**
                     * Histogram positiveSpans.
                     * @member {Array.<io.prometheus.write.v2.IBucketSpan>} positiveSpans
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.positiveSpans = $util.emptyArray;

                    /**
                     * Histogram positiveDeltas.
                     * @member {Array.<number|Long>} positiveDeltas
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.positiveDeltas = $util.emptyArray;

                    /**
                     * Histogram positiveCounts.
                     * @member {Array.<number>} positiveCounts
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.positiveCounts = $util.emptyArray;

                    /**
                     * Histogram resetHint.
                     * @member {io.prometheus.write.v2.Histogram.ResetHint} resetHint
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.resetHint = 0;

                    /**
                     * Histogram timestamp.
                     * @member {number|Long} timestamp
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Histogram customValues.
                     * @member {Array.<number>} customValues
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.customValues = $util.emptyArray;

                    /**
                     * Histogram startTimestamp.
                     * @member {number|Long} startTimestamp
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Histogram.prototype.startTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    // OneOf field names bound to virtual getters and setters
                    var $oneOfFields;

                    /**
                     * Histogram count.
                     * @member {"countInt"|"countFloat"|undefined} count
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Object.defineProperty(Histogram.prototype, "count", {
                        get: $util.oneOfGetter($oneOfFields = ["countInt", "countFloat"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    /**
                     * Histogram zeroCount.
                     * @member {"zeroCountInt"|"zeroCountFloat"|undefined} zeroCount
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     */
                    Object.defineProperty(Histogram.prototype, "zeroCount", {
                        get: $util.oneOfGetter($oneOfFields = ["zeroCountInt", "zeroCountFloat"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    /**
                     * Creates a new Histogram instance using the specified properties.
                     * @function create
                     * @memberof io.prometheus.write.v2.Histogram
                     * @static
                     * @param {io.prometheus.write.v2.IHistogram=} [properties] Properties to set
                     * @returns {io.prometheus.write.v2.Histogram} Histogram instance
                     */
                    Histogram.create = function create(properties) {
                        return new Histogram(properties);
                    };

                    /**
                     * Encodes the specified Histogram message. Does not implicitly {@link io.prometheus.write.v2.Histogram.verify|verify} messages.
                     * @function encode
                     * @memberof io.prometheus.write.v2.Histogram
                     * @static
                     * @param {io.prometheus.write.v2.IHistogram} message Histogram message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Histogram.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.countInt != null && Object.hasOwnProperty.call(message, "countInt"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.countInt);
                        if (message.countFloat != null && Object.hasOwnProperty.call(message, "countFloat"))
                            writer.uint32(/* id 2, wireType 1 =*/17).double(message.countFloat);
                        if (message.sum != null && Object.hasOwnProperty.call(message, "sum"))
                            writer.uint32(/* id 3, wireType 1 =*/25).double(message.sum);
                        if (message.schema != null && Object.hasOwnProperty.call(message, "schema"))
                            writer.uint32(/* id 4, wireType 0 =*/32).sint32(message.schema);
                        if (message.zeroThreshold != null && Object.hasOwnProperty.call(message, "zeroThreshold"))
                            writer.uint32(/* id 5, wireType 1 =*/41).double(message.zeroThreshold);
                        if (message.zeroCountInt != null && Object.hasOwnProperty.call(message, "zeroCountInt"))
                            writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.zeroCountInt);
                        if (message.zeroCountFloat != null && Object.hasOwnProperty.call(message, "zeroCountFloat"))
                            writer.uint32(/* id 7, wireType 1 =*/57).double(message.zeroCountFloat);
                        if (message.negativeSpans != null && message.negativeSpans.length)
                            for (var i = 0; i < message.negativeSpans.length; ++i)
                                $root.io.prometheus.write.v2.BucketSpan.encode(message.negativeSpans[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                        if (message.negativeDeltas != null && message.negativeDeltas.length) {
                            writer.uint32(/* id 9, wireType 2 =*/74).fork();
                            for (var i = 0; i < message.negativeDeltas.length; ++i)
                                writer.sint64(message.negativeDeltas[i]);
                            writer.ldelim();
                        }
                        if (message.negativeCounts != null && message.negativeCounts.length) {
                            writer.uint32(/* id 10, wireType 2 =*/82).fork();
                            for (var i = 0; i < message.negativeCounts.length; ++i)
                                writer.double(message.negativeCounts[i]);
                            writer.ldelim();
                        }
                        if (message.positiveSpans != null && message.positiveSpans.length)
                            for (var i = 0; i < message.positiveSpans.length; ++i)
                                $root.io.prometheus.write.v2.BucketSpan.encode(message.positiveSpans[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                        if (message.positiveDeltas != null && message.positiveDeltas.length) {
                            writer.uint32(/* id 12, wireType 2 =*/98).fork();
                            for (var i = 0; i < message.positiveDeltas.length; ++i)
                                writer.sint64(message.positiveDeltas[i]);
                            writer.ldelim();
                        }
                        if (message.positiveCounts != null && message.positiveCounts.length) {
                            writer.uint32(/* id 13, wireType 2 =*/106).fork();
                            for (var i = 0; i < message.positiveCounts.length; ++i)
                                writer.double(message.positiveCounts[i]);
                            writer.ldelim();
                        }
                        if (message.resetHint != null && Object.hasOwnProperty.call(message, "resetHint"))
                            writer.uint32(/* id 14, wireType 0 =*/112).int32(message.resetHint);
                        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                            writer.uint32(/* id 15, wireType 0 =*/120).int64(message.timestamp);
                        if (message.customValues != null && message.customValues.length) {
                            writer.uint32(/* id 16, wireType 2 =*/130).fork();
                            for (var i = 0; i < message.customValues.length; ++i)
                                writer.double(message.customValues[i]);
                            writer.ldelim();
                        }
                        if (message.startTimestamp != null && Object.hasOwnProperty.call(message, "startTimestamp"))
                            writer.uint32(/* id 17, wireType 0 =*/136).int64(message.startTimestamp);
                        return writer;
                    };

                    /**
                     * Encodes the specified Histogram message, length delimited. Does not implicitly {@link io.prometheus.write.v2.Histogram.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof io.prometheus.write.v2.Histogram
                     * @static
                     * @param {io.prometheus.write.v2.IHistogram} message Histogram message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Histogram.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Histogram message from the specified reader or buffer.
                     * @function decode
                     * @memberof io.prometheus.write.v2.Histogram
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {io.prometheus.write.v2.Histogram} Histogram
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Histogram.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.io.prometheus.write.v2.Histogram();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.countInt = reader.uint64();
                                    break;
                                }
                            case 2: {
                                    message.countFloat = reader.double();
                                    break;
                                }
                            case 3: {
                                    message.sum = reader.double();
                                    break;
                                }
                            case 4: {
                                    message.schema = reader.sint32();
                                    break;
                                }
                            case 5: {
                                    message.zeroThreshold = reader.double();
                                    break;
                                }
                            case 6: {
                                    message.zeroCountInt = reader.uint64();
                                    break;
                                }
                            case 7: {
                                    message.zeroCountFloat = reader.double();
                                    break;
                                }
                            case 8: {
                                    if (!(message.negativeSpans && message.negativeSpans.length))
                                        message.negativeSpans = [];
                                    message.negativeSpans.push($root.io.prometheus.write.v2.BucketSpan.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 9: {
                                    if (!(message.negativeDeltas && message.negativeDeltas.length))
                                        message.negativeDeltas = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.negativeDeltas.push(reader.sint64());
                                    } else
                                        message.negativeDeltas.push(reader.sint64());
                                    break;
                                }
                            case 10: {
                                    if (!(message.negativeCounts && message.negativeCounts.length))
                                        message.negativeCounts = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.negativeCounts.push(reader.double());
                                    } else
                                        message.negativeCounts.push(reader.double());
                                    break;
                                }
                            case 11: {
                                    if (!(message.positiveSpans && message.positiveSpans.length))
                                        message.positiveSpans = [];
                                    message.positiveSpans.push($root.io.prometheus.write.v2.BucketSpan.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 12: {
                                    if (!(message.positiveDeltas && message.positiveDeltas.length))
                                        message.positiveDeltas = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.positiveDeltas.push(reader.sint64());
                                    } else
                                        message.positiveDeltas.push(reader.sint64());
                                    break;
                                }
                            case 13: {
                                    if (!(message.positiveCounts && message.positiveCounts.length))
                                        message.positiveCounts = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.positiveCounts.push(reader.double());
                                    } else
                                        message.positiveCounts.push(reader.double());
                                    break;
                                }
                            case 14: {
                                    message.resetHint = reader.int32();
                                    break;
                                }
                            case 15: {
                                    message.timestamp = reader.int64();
                                    break;
                                }
                            case 16: {
                                    if (!(message.customValues && message.customValues.length))
                                        message.customValues = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.customValues.push(reader.double());
                                    } else
                                        message.customValues.push(reader.double());
                                    break;
                                }
                            case 17: {
                                    message.startTimestamp = reader.int64();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Histogram message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof io.prometheus.write.v2.Histogram
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {io.prometheus.write.v2.Histogram} Histogram
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Histogram.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Histogram message.
                     * @function verify
                     * @memberof io.prometheus.write.v2.Histogram
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Histogram.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        var properties = {};
                        if (message.countInt != null && message.hasOwnProperty("countInt")) {
                            properties.count = 1;
                            if (!$util.isInteger(message.countInt) && !(message.countInt && $util.isInteger(message.countInt.low) && $util.isInteger(message.countInt.high)))
                                return "countInt: integer|Long expected";
                        }
                        if (message.countFloat != null && message.hasOwnProperty("countFloat")) {
                            if (properties.count === 1)
                                return "count: multiple values";
                            properties.count = 1;
                            if (typeof message.countFloat !== "number")
                                return "countFloat: number expected";
                        }
                        if (message.sum != null && message.hasOwnProperty("sum"))
                            if (typeof message.sum !== "number")
                                return "sum: number expected";
                        if (message.schema != null && message.hasOwnProperty("schema"))
                            if (!$util.isInteger(message.schema))
                                return "schema: integer expected";
                        if (message.zeroThreshold != null && message.hasOwnProperty("zeroThreshold"))
                            if (typeof message.zeroThreshold !== "number")
                                return "zeroThreshold: number expected";
                        if (message.zeroCountInt != null && message.hasOwnProperty("zeroCountInt")) {
                            properties.zeroCount = 1;
                            if (!$util.isInteger(message.zeroCountInt) && !(message.zeroCountInt && $util.isInteger(message.zeroCountInt.low) && $util.isInteger(message.zeroCountInt.high)))
                                return "zeroCountInt: integer|Long expected";
                        }
                        if (message.zeroCountFloat != null && message.hasOwnProperty("zeroCountFloat")) {
                            if (properties.zeroCount === 1)
                                return "zeroCount: multiple values";
                            properties.zeroCount = 1;
                            if (typeof message.zeroCountFloat !== "number")
                                return "zeroCountFloat: number expected";
                        }
                        if (message.negativeSpans != null && message.hasOwnProperty("negativeSpans")) {
                            if (!Array.isArray(message.negativeSpans))
                                return "negativeSpans: array expected";
                            for (var i = 0; i < message.negativeSpans.length; ++i) {
                                var error = $root.io.prometheus.write.v2.BucketSpan.verify(message.negativeSpans[i]);
                                if (error)
                                    return "negativeSpans." + error;
                            }
                        }
                        if (message.negativeDeltas != null && message.hasOwnProperty("negativeDeltas")) {
                            if (!Array.isArray(message.negativeDeltas))
                                return "negativeDeltas: array expected";
                            for (var i = 0; i < message.negativeDeltas.length; ++i)
                                if (!$util.isInteger(message.negativeDeltas[i]) && !(message.negativeDeltas[i] && $util.isInteger(message.negativeDeltas[i].low) && $util.isInteger(message.negativeDeltas[i].high)))
                                    return "negativeDeltas: integer|Long[] expected";
                        }
                        if (message.negativeCounts != null && message.hasOwnProperty("negativeCounts")) {
                            if (!Array.isArray(message.negativeCounts))
                                return "negativeCounts: array expected";
                            for (var i = 0; i < message.negativeCounts.length; ++i)
                                if (typeof message.negativeCounts[i] !== "number")
                                    return "negativeCounts: number[] expected";
                        }
                        if (message.positiveSpans != null && message.hasOwnProperty("positiveSpans")) {
                            if (!Array.isArray(message.positiveSpans))
                                return "positiveSpans: array expected";
                            for (var i = 0; i < message.positiveSpans.length; ++i) {
                                var error = $root.io.prometheus.write.v2.BucketSpan.verify(message.positiveSpans[i]);
                                if (error)
                                    return "positiveSpans." + error;
                            }
                        }
                        if (message.positiveDeltas != null && message.hasOwnProperty("positiveDeltas")) {
                            if (!Array.isArray(message.positiveDeltas))
                                return "positiveDeltas: array expected";
                            for (var i = 0; i < message.positiveDeltas.length; ++i)
                                if (!$util.isInteger(message.positiveDeltas[i]) && !(message.positiveDeltas[i] && $util.isInteger(message.positiveDeltas[i].low) && $util.isInteger(message.positiveDeltas[i].high)))
                                    return "positiveDeltas: integer|Long[] expected";
                        }
                        if (message.positiveCounts != null && message.hasOwnProperty("positiveCounts")) {
                            if (!Array.isArray(message.positiveCounts))
                                return "positiveCounts: array expected";
                            for (var i = 0; i < message.positiveCounts.length; ++i)
                                if (typeof message.positiveCounts[i] !== "number")
                                    return "positiveCounts: number[] expected";
                        }
                        if (message.resetHint != null && message.hasOwnProperty("resetHint"))
                            switch (message.resetHint) {
                            default:
                                return "resetHint: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                                break;
                            }
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                                return "timestamp: integer|Long expected";
                        if (message.customValues != null && message.hasOwnProperty("customValues")) {
                            if (!Array.isArray(message.customValues))
                                return "customValues: array expected";
                            for (var i = 0; i < message.customValues.length; ++i)
                                if (typeof message.customValues[i] !== "number")
                                    return "customValues: number[] expected";
                        }
                        if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                            if (!$util.isInteger(message.startTimestamp) && !(message.startTimestamp && $util.isInteger(message.startTimestamp.low) && $util.isInteger(message.startTimestamp.high)))
                                return "startTimestamp: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a Histogram message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof io.prometheus.write.v2.Histogram
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {io.prometheus.write.v2.Histogram} Histogram
                     */
                    Histogram.fromObject = function fromObject(object) {
                        if (object instanceof $root.io.prometheus.write.v2.Histogram)
                            return object;
                        var message = new $root.io.prometheus.write.v2.Histogram();
                        if (object.countInt != null)
                            if ($util.Long)
                                (message.countInt = $util.Long.fromValue(object.countInt)).unsigned = true;
                            else if (typeof object.countInt === "string")
                                message.countInt = parseInt(object.countInt, 10);
                            else if (typeof object.countInt === "number")
                                message.countInt = object.countInt;
                            else if (typeof object.countInt === "object")
                                message.countInt = new $util.LongBits(object.countInt.low >>> 0, object.countInt.high >>> 0).toNumber(true);
                        if (object.countFloat != null)
                            message.countFloat = Number(object.countFloat);
                        if (object.sum != null)
                            message.sum = Number(object.sum);
                        if (object.schema != null)
                            message.schema = object.schema | 0;
                        if (object.zeroThreshold != null)
                            message.zeroThreshold = Number(object.zeroThreshold);
                        if (object.zeroCountInt != null)
                            if ($util.Long)
                                (message.zeroCountInt = $util.Long.fromValue(object.zeroCountInt)).unsigned = true;
                            else if (typeof object.zeroCountInt === "string")
                                message.zeroCountInt = parseInt(object.zeroCountInt, 10);
                            else if (typeof object.zeroCountInt === "number")
                                message.zeroCountInt = object.zeroCountInt;
                            else if (typeof object.zeroCountInt === "object")
                                message.zeroCountInt = new $util.LongBits(object.zeroCountInt.low >>> 0, object.zeroCountInt.high >>> 0).toNumber(true);
                        if (object.zeroCountFloat != null)
                            message.zeroCountFloat = Number(object.zeroCountFloat);
                        if (object.negativeSpans) {
                            if (!Array.isArray(object.negativeSpans))
                                throw TypeError(".io.prometheus.write.v2.Histogram.negativeSpans: array expected");
                            message.negativeSpans = [];
                            for (var i = 0; i < object.negativeSpans.length; ++i) {
                                if (typeof object.negativeSpans[i] !== "object")
                                    throw TypeError(".io.prometheus.write.v2.Histogram.negativeSpans: object expected");
                                message.negativeSpans[i] = $root.io.prometheus.write.v2.BucketSpan.fromObject(object.negativeSpans[i]);
                            }
                        }
                        if (object.negativeDeltas) {
                            if (!Array.isArray(object.negativeDeltas))
                                throw TypeError(".io.prometheus.write.v2.Histogram.negativeDeltas: array expected");
                            message.negativeDeltas = [];
                            for (var i = 0; i < object.negativeDeltas.length; ++i)
                                if ($util.Long)
                                    (message.negativeDeltas[i] = $util.Long.fromValue(object.negativeDeltas[i])).unsigned = false;
                                else if (typeof object.negativeDeltas[i] === "string")
                                    message.negativeDeltas[i] = parseInt(object.negativeDeltas[i], 10);
                                else if (typeof object.negativeDeltas[i] === "number")
                                    message.negativeDeltas[i] = object.negativeDeltas[i];
                                else if (typeof object.negativeDeltas[i] === "object")
                                    message.negativeDeltas[i] = new $util.LongBits(object.negativeDeltas[i].low >>> 0, object.negativeDeltas[i].high >>> 0).toNumber();
                        }
                        if (object.negativeCounts) {
                            if (!Array.isArray(object.negativeCounts))
                                throw TypeError(".io.prometheus.write.v2.Histogram.negativeCounts: array expected");
                            message.negativeCounts = [];
                            for (var i = 0; i < object.negativeCounts.length; ++i)
                                message.negativeCounts[i] = Number(object.negativeCounts[i]);
                        }
                        if (object.positiveSpans) {
                            if (!Array.isArray(object.positiveSpans))
                                throw TypeError(".io.prometheus.write.v2.Histogram.positiveSpans: array expected");
                            message.positiveSpans = [];
                            for (var i = 0; i < object.positiveSpans.length; ++i) {
                                if (typeof object.positiveSpans[i] !== "object")
                                    throw TypeError(".io.prometheus.write.v2.Histogram.positiveSpans: object expected");
                                message.positiveSpans[i] = $root.io.prometheus.write.v2.BucketSpan.fromObject(object.positiveSpans[i]);
                            }
                        }
                        if (object.positiveDeltas) {
                            if (!Array.isArray(object.positiveDeltas))
                                throw TypeError(".io.prometheus.write.v2.Histogram.positiveDeltas: array expected");
                            message.positiveDeltas = [];
                            for (var i = 0; i < object.positiveDeltas.length; ++i)
                                if ($util.Long)
                                    (message.positiveDeltas[i] = $util.Long.fromValue(object.positiveDeltas[i])).unsigned = false;
                                else if (typeof object.positiveDeltas[i] === "string")
                                    message.positiveDeltas[i] = parseInt(object.positiveDeltas[i], 10);
                                else if (typeof object.positiveDeltas[i] === "number")
                                    message.positiveDeltas[i] = object.positiveDeltas[i];
                                else if (typeof object.positiveDeltas[i] === "object")
                                    message.positiveDeltas[i] = new $util.LongBits(object.positiveDeltas[i].low >>> 0, object.positiveDeltas[i].high >>> 0).toNumber();
                        }
                        if (object.positiveCounts) {
                            if (!Array.isArray(object.positiveCounts))
                                throw TypeError(".io.prometheus.write.v2.Histogram.positiveCounts: array expected");
                            message.positiveCounts = [];
                            for (var i = 0; i < object.positiveCounts.length; ++i)
                                message.positiveCounts[i] = Number(object.positiveCounts[i]);
                        }
                        switch (object.resetHint) {
                        default:
                            if (typeof object.resetHint === "number") {
                                message.resetHint = object.resetHint;
                                break;
                            }
                            break;
                        case "RESET_HINT_UNSPECIFIED":
                        case 0:
                            message.resetHint = 0;
                            break;
                        case "RESET_HINT_YES":
                        case 1:
                            message.resetHint = 1;
                            break;
                        case "RESET_HINT_NO":
                        case 2:
                            message.resetHint = 2;
                            break;
                        case "RESET_HINT_GAUGE":
                        case 3:
                            message.resetHint = 3;
                            break;
                        }
                        if (object.timestamp != null)
                            if ($util.Long)
                                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                            else if (typeof object.timestamp === "string")
                                message.timestamp = parseInt(object.timestamp, 10);
                            else if (typeof object.timestamp === "number")
                                message.timestamp = object.timestamp;
                            else if (typeof object.timestamp === "object")
                                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
                        if (object.customValues) {
                            if (!Array.isArray(object.customValues))
                                throw TypeError(".io.prometheus.write.v2.Histogram.customValues: array expected");
                            message.customValues = [];
                            for (var i = 0; i < object.customValues.length; ++i)
                                message.customValues[i] = Number(object.customValues[i]);
                        }
                        if (object.startTimestamp != null)
                            if ($util.Long)
                                (message.startTimestamp = $util.Long.fromValue(object.startTimestamp)).unsigned = false;
                            else if (typeof object.startTimestamp === "string")
                                message.startTimestamp = parseInt(object.startTimestamp, 10);
                            else if (typeof object.startTimestamp === "number")
                                message.startTimestamp = object.startTimestamp;
                            else if (typeof object.startTimestamp === "object")
                                message.startTimestamp = new $util.LongBits(object.startTimestamp.low >>> 0, object.startTimestamp.high >>> 0).toNumber();
                        return message;
                    };

                    /**
                     * Creates a plain object from a Histogram message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof io.prometheus.write.v2.Histogram
                     * @static
                     * @param {io.prometheus.write.v2.Histogram} message Histogram
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Histogram.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults) {
                            object.negativeSpans = [];
                            object.negativeDeltas = [];
                            object.negativeCounts = [];
                            object.positiveSpans = [];
                            object.positiveDeltas = [];
                            object.positiveCounts = [];
                            object.customValues = [];
                        }
                        if (options.defaults) {
                            object.sum = 0;
                            object.schema = 0;
                            object.zeroThreshold = 0;
                            object.resetHint = options.enums === String ? "RESET_HINT_UNSPECIFIED" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.timestamp = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.startTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.startTimestamp = options.longs === String ? "0" : 0;
                        }
                        if (message.countInt != null && message.hasOwnProperty("countInt")) {
                            if (typeof message.countInt === "number")
                                object.countInt = options.longs === String ? String(message.countInt) : message.countInt;
                            else
                                object.countInt = options.longs === String ? $util.Long.prototype.toString.call(message.countInt) : options.longs === Number ? new $util.LongBits(message.countInt.low >>> 0, message.countInt.high >>> 0).toNumber(true) : message.countInt;
                            if (options.oneofs)
                                object.count = "countInt";
                        }
                        if (message.countFloat != null && message.hasOwnProperty("countFloat")) {
                            object.countFloat = options.json && !isFinite(message.countFloat) ? String(message.countFloat) : message.countFloat;
                            if (options.oneofs)
                                object.count = "countFloat";
                        }
                        if (message.sum != null && message.hasOwnProperty("sum"))
                            object.sum = options.json && !isFinite(message.sum) ? String(message.sum) : message.sum;
                        if (message.schema != null && message.hasOwnProperty("schema"))
                            object.schema = message.schema;
                        if (message.zeroThreshold != null && message.hasOwnProperty("zeroThreshold"))
                            object.zeroThreshold = options.json && !isFinite(message.zeroThreshold) ? String(message.zeroThreshold) : message.zeroThreshold;
                        if (message.zeroCountInt != null && message.hasOwnProperty("zeroCountInt")) {
                            if (typeof message.zeroCountInt === "number")
                                object.zeroCountInt = options.longs === String ? String(message.zeroCountInt) : message.zeroCountInt;
                            else
                                object.zeroCountInt = options.longs === String ? $util.Long.prototype.toString.call(message.zeroCountInt) : options.longs === Number ? new $util.LongBits(message.zeroCountInt.low >>> 0, message.zeroCountInt.high >>> 0).toNumber(true) : message.zeroCountInt;
                            if (options.oneofs)
                                object.zeroCount = "zeroCountInt";
                        }
                        if (message.zeroCountFloat != null && message.hasOwnProperty("zeroCountFloat")) {
                            object.zeroCountFloat = options.json && !isFinite(message.zeroCountFloat) ? String(message.zeroCountFloat) : message.zeroCountFloat;
                            if (options.oneofs)
                                object.zeroCount = "zeroCountFloat";
                        }
                        if (message.negativeSpans && message.negativeSpans.length) {
                            object.negativeSpans = [];
                            for (var j = 0; j < message.negativeSpans.length; ++j)
                                object.negativeSpans[j] = $root.io.prometheus.write.v2.BucketSpan.toObject(message.negativeSpans[j], options);
                        }
                        if (message.negativeDeltas && message.negativeDeltas.length) {
                            object.negativeDeltas = [];
                            for (var j = 0; j < message.negativeDeltas.length; ++j)
                                if (typeof message.negativeDeltas[j] === "number")
                                    object.negativeDeltas[j] = options.longs === String ? String(message.negativeDeltas[j]) : message.negativeDeltas[j];
                                else
                                    object.negativeDeltas[j] = options.longs === String ? $util.Long.prototype.toString.call(message.negativeDeltas[j]) : options.longs === Number ? new $util.LongBits(message.negativeDeltas[j].low >>> 0, message.negativeDeltas[j].high >>> 0).toNumber() : message.negativeDeltas[j];
                        }
                        if (message.negativeCounts && message.negativeCounts.length) {
                            object.negativeCounts = [];
                            for (var j = 0; j < message.negativeCounts.length; ++j)
                                object.negativeCounts[j] = options.json && !isFinite(message.negativeCounts[j]) ? String(message.negativeCounts[j]) : message.negativeCounts[j];
                        }
                        if (message.positiveSpans && message.positiveSpans.length) {
                            object.positiveSpans = [];
                            for (var j = 0; j < message.positiveSpans.length; ++j)
                                object.positiveSpans[j] = $root.io.prometheus.write.v2.BucketSpan.toObject(message.positiveSpans[j], options);
                        }
                        if (message.positiveDeltas && message.positiveDeltas.length) {
                            object.positiveDeltas = [];
                            for (var j = 0; j < message.positiveDeltas.length; ++j)
                                if (typeof message.positiveDeltas[j] === "number")
                                    object.positiveDeltas[j] = options.longs === String ? String(message.positiveDeltas[j]) : message.positiveDeltas[j];
                                else
                                    object.positiveDeltas[j] = options.longs === String ? $util.Long.prototype.toString.call(message.positiveDeltas[j]) : options.longs === Number ? new $util.LongBits(message.positiveDeltas[j].low >>> 0, message.positiveDeltas[j].high >>> 0).toNumber() : message.positiveDeltas[j];
                        }
                        if (message.positiveCounts && message.positiveCounts.length) {
                            object.positiveCounts = [];
                            for (var j = 0; j < message.positiveCounts.length; ++j)
                                object.positiveCounts[j] = options.json && !isFinite(message.positiveCounts[j]) ? String(message.positiveCounts[j]) : message.positiveCounts[j];
                        }
                        if (message.resetHint != null && message.hasOwnProperty("resetHint"))
                            object.resetHint = options.enums === String ? $root.io.prometheus.write.v2.Histogram.ResetHint[message.resetHint] === undefined ? message.resetHint : $root.io.prometheus.write.v2.Histogram.ResetHint[message.resetHint] : message.resetHint;
                        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                            if (typeof message.timestamp === "number")
                                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                            else
                                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                        if (message.customValues && message.customValues.length) {
                            object.customValues = [];
                            for (var j = 0; j < message.customValues.length; ++j)
                                object.customValues[j] = options.json && !isFinite(message.customValues[j]) ? String(message.customValues[j]) : message.customValues[j];
                        }
                        if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                            if (typeof message.startTimestamp === "number")
                                object.startTimestamp = options.longs === String ? String(message.startTimestamp) : message.startTimestamp;
                            else
                                object.startTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.startTimestamp) : options.longs === Number ? new $util.LongBits(message.startTimestamp.low >>> 0, message.startTimestamp.high >>> 0).toNumber() : message.startTimestamp;
                        return object;
                    };

                    /**
                     * Converts this Histogram to JSON.
                     * @function toJSON
                     * @memberof io.prometheus.write.v2.Histogram
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Histogram.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for Histogram
                     * @function getTypeUrl
                     * @memberof io.prometheus.write.v2.Histogram
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    Histogram.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/io.prometheus.write.v2.Histogram";
                    };

                    /**
                     * ResetHint enum.
                     * @name io.prometheus.write.v2.Histogram.ResetHint
                     * @enum {number}
                     * @property {number} RESET_HINT_UNSPECIFIED=0 RESET_HINT_UNSPECIFIED value
                     * @property {number} RESET_HINT_YES=1 RESET_HINT_YES value
                     * @property {number} RESET_HINT_NO=2 RESET_HINT_NO value
                     * @property {number} RESET_HINT_GAUGE=3 RESET_HINT_GAUGE value
                     */
                    Histogram.ResetHint = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "RESET_HINT_UNSPECIFIED"] = 0;
                        values[valuesById[1] = "RESET_HINT_YES"] = 1;
                        values[valuesById[2] = "RESET_HINT_NO"] = 2;
                        values[valuesById[3] = "RESET_HINT_GAUGE"] = 3;
                        return values;
                    })();

                    return Histogram;
                })();

                v2.BucketSpan = (function() {

                    /**
                     * Properties of a BucketSpan.
                     * @memberof io.prometheus.write.v2
                     * @interface IBucketSpan
                     * @property {number|null} [offset] BucketSpan offset
                     * @property {number|null} [length] BucketSpan length
                     */

                    /**
                     * Constructs a new BucketSpan.
                     * @memberof io.prometheus.write.v2
                     * @classdesc Represents a BucketSpan.
                     * @implements IBucketSpan
                     * @constructor
                     * @param {io.prometheus.write.v2.IBucketSpan=} [properties] Properties to set
                     */
                    function BucketSpan(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * BucketSpan offset.
                     * @member {number} offset
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @instance
                     */
                    BucketSpan.prototype.offset = 0;

                    /**
                     * BucketSpan length.
                     * @member {number} length
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @instance
                     */
                    BucketSpan.prototype.length = 0;

                    /**
                     * Creates a new BucketSpan instance using the specified properties.
                     * @function create
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @static
                     * @param {io.prometheus.write.v2.IBucketSpan=} [properties] Properties to set
                     * @returns {io.prometheus.write.v2.BucketSpan} BucketSpan instance
                     */
                    BucketSpan.create = function create(properties) {
                        return new BucketSpan(properties);
                    };

                    /**
                     * Encodes the specified BucketSpan message. Does not implicitly {@link io.prometheus.write.v2.BucketSpan.verify|verify} messages.
                     * @function encode
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @static
                     * @param {io.prometheus.write.v2.IBucketSpan} message BucketSpan message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    BucketSpan.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                            writer.uint32(/* id 1, wireType 0 =*/8).sint32(message.offset);
                        if (message.length != null && Object.hasOwnProperty.call(message, "length"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.length);
                        return writer;
                    };

                    /**
                     * Encodes the specified BucketSpan message, length delimited. Does not implicitly {@link io.prometheus.write.v2.BucketSpan.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @static
                     * @param {io.prometheus.write.v2.IBucketSpan} message BucketSpan message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    BucketSpan.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a BucketSpan message from the specified reader or buffer.
                     * @function decode
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {io.prometheus.write.v2.BucketSpan} BucketSpan
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    BucketSpan.decode = function decode(reader, length, error) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.io.prometheus.write.v2.BucketSpan();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.offset = reader.sint32();
                                    break;
                                }
                            case 2: {
                                    message.length = reader.uint32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a BucketSpan message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {io.prometheus.write.v2.BucketSpan} BucketSpan
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    BucketSpan.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a BucketSpan message.
                     * @function verify
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    BucketSpan.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.offset != null && message.hasOwnProperty("offset"))
                            if (!$util.isInteger(message.offset))
                                return "offset: integer expected";
                        if (message.length != null && message.hasOwnProperty("length"))
                            if (!$util.isInteger(message.length))
                                return "length: integer expected";
                        return null;
                    };

                    /**
                     * Creates a BucketSpan message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {io.prometheus.write.v2.BucketSpan} BucketSpan
                     */
                    BucketSpan.fromObject = function fromObject(object) {
                        if (object instanceof $root.io.prometheus.write.v2.BucketSpan)
                            return object;
                        var message = new $root.io.prometheus.write.v2.BucketSpan();
                        if (object.offset != null)
                            message.offset = object.offset | 0;
                        if (object.length != null)
                            message.length = object.length >>> 0;
                        return message;
                    };

                    /**
                     * Creates a plain object from a BucketSpan message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @static
                     * @param {io.prometheus.write.v2.BucketSpan} message BucketSpan
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    BucketSpan.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.offset = 0;
                            object.length = 0;
                        }
                        if (message.offset != null && message.hasOwnProperty("offset"))
                            object.offset = message.offset;
                        if (message.length != null && message.hasOwnProperty("length"))
                            object.length = message.length;
                        return object;
                    };

                    /**
                     * Converts this BucketSpan to JSON.
                     * @function toJSON
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    BucketSpan.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for BucketSpan
                     * @function getTypeUrl
                     * @memberof io.prometheus.write.v2.BucketSpan
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    BucketSpan.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/io.prometheus.write.v2.BucketSpan";
                    };

                    return BucketSpan;
                })();

                return v2;
            })();

            return write;
        })();

        return prometheus;
    })();

    return io;
})();

module.exports = $root;
