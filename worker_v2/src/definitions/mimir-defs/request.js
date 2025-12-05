/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.cortexpb = (function() {

    /**
     * Namespace cortexpb.
     * @exports cortexpb
     * @namespace
     */
    var cortexpb = {};

    cortexpb.WriteRequest = (function() {

        /**
         * Properties of a WriteRequest.
         * @memberof cortexpb
         * @interface IWriteRequest
         * @property {Array.<cortexpb.ITimeSeries>|null} [timeseries] WriteRequest timeseries
         * @property {cortexpb.WriteRequest.SourceEnum|null} [Source] WriteRequest Source
         * @property {Array.<cortexpb.IMetricMetadata>|null} [metadata] WriteRequest metadata
         * @property {Array.<string>|null} [symbolsRW2] WriteRequest symbolsRW2
         * @property {Array.<cortexpb.ITimeSeriesRW2>|null} [timeseriesRW2] WriteRequest timeseriesRW2
         * @property {boolean|null} [skipLabelValidation] WriteRequest skipLabelValidation
         * @property {boolean|null} [skipLabelCountValidation] WriteRequest skipLabelCountValidation
         */

        /**
         * Constructs a new WriteRequest.
         * @memberof cortexpb
         * @classdesc Represents a WriteRequest.
         * @implements IWriteRequest
         * @constructor
         * @param {cortexpb.IWriteRequest=} [properties] Properties to set
         */
        function WriteRequest(properties) {
            this.timeseries = [];
            this.metadata = [];
            this.symbolsRW2 = [];
            this.timeseriesRW2 = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WriteRequest timeseries.
         * @member {Array.<cortexpb.ITimeSeries>} timeseries
         * @memberof cortexpb.WriteRequest
         * @instance
         */
        WriteRequest.prototype.timeseries = $util.emptyArray;

        /**
         * WriteRequest Source.
         * @member {cortexpb.WriteRequest.SourceEnum} Source
         * @memberof cortexpb.WriteRequest
         * @instance
         */
        WriteRequest.prototype.Source = 0;

        /**
         * WriteRequest metadata.
         * @member {Array.<cortexpb.IMetricMetadata>} metadata
         * @memberof cortexpb.WriteRequest
         * @instance
         */
        WriteRequest.prototype.metadata = $util.emptyArray;

        /**
         * WriteRequest symbolsRW2.
         * @member {Array.<string>} symbolsRW2
         * @memberof cortexpb.WriteRequest
         * @instance
         */
        WriteRequest.prototype.symbolsRW2 = $util.emptyArray;

        /**
         * WriteRequest timeseriesRW2.
         * @member {Array.<cortexpb.ITimeSeriesRW2>} timeseriesRW2
         * @memberof cortexpb.WriteRequest
         * @instance
         */
        WriteRequest.prototype.timeseriesRW2 = $util.emptyArray;

        /**
         * WriteRequest skipLabelValidation.
         * @member {boolean} skipLabelValidation
         * @memberof cortexpb.WriteRequest
         * @instance
         */
        WriteRequest.prototype.skipLabelValidation = false;

        /**
         * WriteRequest skipLabelCountValidation.
         * @member {boolean} skipLabelCountValidation
         * @memberof cortexpb.WriteRequest
         * @instance
         */
        WriteRequest.prototype.skipLabelCountValidation = false;

        /**
         * Creates a new WriteRequest instance using the specified properties.
         * @function create
         * @memberof cortexpb.WriteRequest
         * @static
         * @param {cortexpb.IWriteRequest=} [properties] Properties to set
         * @returns {cortexpb.WriteRequest} WriteRequest instance
         */
        WriteRequest.create = function create(properties) {
            return new WriteRequest(properties);
        };

        /**
         * Encodes the specified WriteRequest message. Does not implicitly {@link cortexpb.WriteRequest.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.WriteRequest
         * @static
         * @param {cortexpb.IWriteRequest} message WriteRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WriteRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timeseries != null && message.timeseries.length)
                for (var i = 0; i < message.timeseries.length; ++i)
                    $root.cortexpb.TimeSeries.encode(message.timeseries[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.Source != null && Object.hasOwnProperty.call(message, "Source"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.Source);
            if (message.metadata != null && message.metadata.length)
                for (var i = 0; i < message.metadata.length; ++i)
                    $root.cortexpb.MetricMetadata.encode(message.metadata[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.symbolsRW2 != null && message.symbolsRW2.length)
                for (var i = 0; i < message.symbolsRW2.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.symbolsRW2[i]);
            if (message.timeseriesRW2 != null && message.timeseriesRW2.length)
                for (var i = 0; i < message.timeseriesRW2.length; ++i)
                    $root.cortexpb.TimeSeriesRW2.encode(message.timeseriesRW2[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.skipLabelValidation != null && Object.hasOwnProperty.call(message, "skipLabelValidation"))
                writer.uint32(/* id 1000, wireType 0 =*/8000).bool(message.skipLabelValidation);
            if (message.skipLabelCountValidation != null && Object.hasOwnProperty.call(message, "skipLabelCountValidation"))
                writer.uint32(/* id 1001, wireType 0 =*/8008).bool(message.skipLabelCountValidation);
            return writer;
        };

        /**
         * Encodes the specified WriteRequest message, length delimited. Does not implicitly {@link cortexpb.WriteRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.WriteRequest
         * @static
         * @param {cortexpb.IWriteRequest} message WriteRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WriteRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WriteRequest message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.WriteRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.WriteRequest} WriteRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WriteRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.WriteRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.timeseries && message.timeseries.length))
                            message.timeseries = [];
                        message.timeseries.push($root.cortexpb.TimeSeries.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.Source = reader.int32();
                        break;
                    }
                case 3: {
                        if (!(message.metadata && message.metadata.length))
                            message.metadata = [];
                        message.metadata.push($root.cortexpb.MetricMetadata.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        if (!(message.symbolsRW2 && message.symbolsRW2.length))
                            message.symbolsRW2 = [];
                        message.symbolsRW2.push(reader.string());
                        break;
                    }
                case 5: {
                        if (!(message.timeseriesRW2 && message.timeseriesRW2.length))
                            message.timeseriesRW2 = [];
                        message.timeseriesRW2.push($root.cortexpb.TimeSeriesRW2.decode(reader, reader.uint32()));
                        break;
                    }
                case 1000: {
                        message.skipLabelValidation = reader.bool();
                        break;
                    }
                case 1001: {
                        message.skipLabelCountValidation = reader.bool();
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
         * Decodes a WriteRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.WriteRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.WriteRequest} WriteRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WriteRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WriteRequest message.
         * @function verify
         * @memberof cortexpb.WriteRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WriteRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timeseries != null && message.hasOwnProperty("timeseries")) {
                if (!Array.isArray(message.timeseries))
                    return "timeseries: array expected";
                for (var i = 0; i < message.timeseries.length; ++i) {
                    var error = $root.cortexpb.TimeSeries.verify(message.timeseries[i]);
                    if (error)
                        return "timeseries." + error;
                }
            }
            if (message.Source != null && message.hasOwnProperty("Source"))
                switch (message.Source) {
                default:
                    return "Source: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
                if (!Array.isArray(message.metadata))
                    return "metadata: array expected";
                for (var i = 0; i < message.metadata.length; ++i) {
                    var error = $root.cortexpb.MetricMetadata.verify(message.metadata[i]);
                    if (error)
                        return "metadata." + error;
                }
            }
            if (message.symbolsRW2 != null && message.hasOwnProperty("symbolsRW2")) {
                if (!Array.isArray(message.symbolsRW2))
                    return "symbolsRW2: array expected";
                for (var i = 0; i < message.symbolsRW2.length; ++i)
                    if (!$util.isString(message.symbolsRW2[i]))
                        return "symbolsRW2: string[] expected";
            }
            if (message.timeseriesRW2 != null && message.hasOwnProperty("timeseriesRW2")) {
                if (!Array.isArray(message.timeseriesRW2))
                    return "timeseriesRW2: array expected";
                for (var i = 0; i < message.timeseriesRW2.length; ++i) {
                    var error = $root.cortexpb.TimeSeriesRW2.verify(message.timeseriesRW2[i]);
                    if (error)
                        return "timeseriesRW2." + error;
                }
            }
            if (message.skipLabelValidation != null && message.hasOwnProperty("skipLabelValidation"))
                if (typeof message.skipLabelValidation !== "boolean")
                    return "skipLabelValidation: boolean expected";
            if (message.skipLabelCountValidation != null && message.hasOwnProperty("skipLabelCountValidation"))
                if (typeof message.skipLabelCountValidation !== "boolean")
                    return "skipLabelCountValidation: boolean expected";
            return null;
        };

        /**
         * Creates a WriteRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.WriteRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.WriteRequest} WriteRequest
         */
        WriteRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.WriteRequest)
                return object;
            var message = new $root.cortexpb.WriteRequest();
            if (object.timeseries) {
                if (!Array.isArray(object.timeseries))
                    throw TypeError(".cortexpb.WriteRequest.timeseries: array expected");
                message.timeseries = [];
                for (var i = 0; i < object.timeseries.length; ++i) {
                    if (typeof object.timeseries[i] !== "object")
                        throw TypeError(".cortexpb.WriteRequest.timeseries: object expected");
                    message.timeseries[i] = $root.cortexpb.TimeSeries.fromObject(object.timeseries[i]);
                }
            }
            switch (object.Source) {
            default:
                if (typeof object.Source === "number") {
                    message.Source = object.Source;
                    break;
                }
                break;
            case "API":
            case 0:
                message.Source = 0;
                break;
            case "RULE":
            case 1:
                message.Source = 1;
                break;
            case "OTLP":
            case 2:
                message.Source = 2;
                break;
            }
            if (object.metadata) {
                if (!Array.isArray(object.metadata))
                    throw TypeError(".cortexpb.WriteRequest.metadata: array expected");
                message.metadata = [];
                for (var i = 0; i < object.metadata.length; ++i) {
                    if (typeof object.metadata[i] !== "object")
                        throw TypeError(".cortexpb.WriteRequest.metadata: object expected");
                    message.metadata[i] = $root.cortexpb.MetricMetadata.fromObject(object.metadata[i]);
                }
            }
            if (object.symbolsRW2) {
                if (!Array.isArray(object.symbolsRW2))
                    throw TypeError(".cortexpb.WriteRequest.symbolsRW2: array expected");
                message.symbolsRW2 = [];
                for (var i = 0; i < object.symbolsRW2.length; ++i)
                    message.symbolsRW2[i] = String(object.symbolsRW2[i]);
            }
            if (object.timeseriesRW2) {
                if (!Array.isArray(object.timeseriesRW2))
                    throw TypeError(".cortexpb.WriteRequest.timeseriesRW2: array expected");
                message.timeseriesRW2 = [];
                for (var i = 0; i < object.timeseriesRW2.length; ++i) {
                    if (typeof object.timeseriesRW2[i] !== "object")
                        throw TypeError(".cortexpb.WriteRequest.timeseriesRW2: object expected");
                    message.timeseriesRW2[i] = $root.cortexpb.TimeSeriesRW2.fromObject(object.timeseriesRW2[i]);
                }
            }
            if (object.skipLabelValidation != null)
                message.skipLabelValidation = Boolean(object.skipLabelValidation);
            if (object.skipLabelCountValidation != null)
                message.skipLabelCountValidation = Boolean(object.skipLabelCountValidation);
            return message;
        };

        /**
         * Creates a plain object from a WriteRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.WriteRequest
         * @static
         * @param {cortexpb.WriteRequest} message WriteRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WriteRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.timeseries = [];
                object.metadata = [];
                object.symbolsRW2 = [];
                object.timeseriesRW2 = [];
            }
            if (options.defaults) {
                object.Source = options.enums === String ? "API" : 0;
                object.skipLabelValidation = false;
                object.skipLabelCountValidation = false;
            }
            if (message.timeseries && message.timeseries.length) {
                object.timeseries = [];
                for (var j = 0; j < message.timeseries.length; ++j)
                    object.timeseries[j] = $root.cortexpb.TimeSeries.toObject(message.timeseries[j], options);
            }
            if (message.Source != null && message.hasOwnProperty("Source"))
                object.Source = options.enums === String ? $root.cortexpb.WriteRequest.SourceEnum[message.Source] === undefined ? message.Source : $root.cortexpb.WriteRequest.SourceEnum[message.Source] : message.Source;
            if (message.metadata && message.metadata.length) {
                object.metadata = [];
                for (var j = 0; j < message.metadata.length; ++j)
                    object.metadata[j] = $root.cortexpb.MetricMetadata.toObject(message.metadata[j], options);
            }
            if (message.symbolsRW2 && message.symbolsRW2.length) {
                object.symbolsRW2 = [];
                for (var j = 0; j < message.symbolsRW2.length; ++j)
                    object.symbolsRW2[j] = message.symbolsRW2[j];
            }
            if (message.timeseriesRW2 && message.timeseriesRW2.length) {
                object.timeseriesRW2 = [];
                for (var j = 0; j < message.timeseriesRW2.length; ++j)
                    object.timeseriesRW2[j] = $root.cortexpb.TimeSeriesRW2.toObject(message.timeseriesRW2[j], options);
            }
            if (message.skipLabelValidation != null && message.hasOwnProperty("skipLabelValidation"))
                object.skipLabelValidation = message.skipLabelValidation;
            if (message.skipLabelCountValidation != null && message.hasOwnProperty("skipLabelCountValidation"))
                object.skipLabelCountValidation = message.skipLabelCountValidation;
            return object;
        };

        /**
         * Converts this WriteRequest to JSON.
         * @function toJSON
         * @memberof cortexpb.WriteRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WriteRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for WriteRequest
         * @function getTypeUrl
         * @memberof cortexpb.WriteRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        WriteRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.WriteRequest";
        };

        /**
         * SourceEnum enum.
         * @name cortexpb.WriteRequest.SourceEnum
         * @enum {number}
         * @property {number} API=0 API value
         * @property {number} RULE=1 RULE value
         * @property {number} OTLP=2 OTLP value
         */
        WriteRequest.SourceEnum = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "API"] = 0;
            values[valuesById[1] = "RULE"] = 1;
            values[valuesById[2] = "OTLP"] = 2;
            return values;
        })();

        return WriteRequest;
    })();

    cortexpb.WriteResponse = (function() {

        /**
         * Properties of a WriteResponse.
         * @memberof cortexpb
         * @interface IWriteResponse
         */

        /**
         * Constructs a new WriteResponse.
         * @memberof cortexpb
         * @classdesc Represents a WriteResponse.
         * @implements IWriteResponse
         * @constructor
         * @param {cortexpb.IWriteResponse=} [properties] Properties to set
         */
        function WriteResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new WriteResponse instance using the specified properties.
         * @function create
         * @memberof cortexpb.WriteResponse
         * @static
         * @param {cortexpb.IWriteResponse=} [properties] Properties to set
         * @returns {cortexpb.WriteResponse} WriteResponse instance
         */
        WriteResponse.create = function create(properties) {
            return new WriteResponse(properties);
        };

        /**
         * Encodes the specified WriteResponse message. Does not implicitly {@link cortexpb.WriteResponse.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.WriteResponse
         * @static
         * @param {cortexpb.IWriteResponse} message WriteResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WriteResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified WriteResponse message, length delimited. Does not implicitly {@link cortexpb.WriteResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.WriteResponse
         * @static
         * @param {cortexpb.IWriteResponse} message WriteResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WriteResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WriteResponse message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.WriteResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.WriteResponse} WriteResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WriteResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.WriteResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WriteResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.WriteResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.WriteResponse} WriteResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WriteResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WriteResponse message.
         * @function verify
         * @memberof cortexpb.WriteResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WriteResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a WriteResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.WriteResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.WriteResponse} WriteResponse
         */
        WriteResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.WriteResponse)
                return object;
            return new $root.cortexpb.WriteResponse();
        };

        /**
         * Creates a plain object from a WriteResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.WriteResponse
         * @static
         * @param {cortexpb.WriteResponse} message WriteResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WriteResponse.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this WriteResponse to JSON.
         * @function toJSON
         * @memberof cortexpb.WriteResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WriteResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for WriteResponse
         * @function getTypeUrl
         * @memberof cortexpb.WriteResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        WriteResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.WriteResponse";
        };

        return WriteResponse;
    })();

    /**
     * ErrorCause enum.
     * @name cortexpb.ErrorCause
     * @enum {number}
     * @property {number} ERROR_CAUSE_UNKNOWN=0 ERROR_CAUSE_UNKNOWN value
     * @property {number} ERROR_CAUSE_REPLICAS_DID_NOT_MATCH=1 ERROR_CAUSE_REPLICAS_DID_NOT_MATCH value
     * @property {number} ERROR_CAUSE_TOO_MANY_CLUSTERS=2 ERROR_CAUSE_TOO_MANY_CLUSTERS value
     * @property {number} ERROR_CAUSE_BAD_DATA=3 ERROR_CAUSE_BAD_DATA value
     * @property {number} ERROR_CAUSE_INGESTION_RATE_LIMITED=4 ERROR_CAUSE_INGESTION_RATE_LIMITED value
     * @property {number} ERROR_CAUSE_REQUEST_RATE_LIMITED=5 ERROR_CAUSE_REQUEST_RATE_LIMITED value
     * @property {number} ERROR_CAUSE_INSTANCE_LIMIT=6 ERROR_CAUSE_INSTANCE_LIMIT value
     * @property {number} ERROR_CAUSE_SERVICE_UNAVAILABLE=7 ERROR_CAUSE_SERVICE_UNAVAILABLE value
     * @property {number} ERROR_CAUSE_TSDB_UNAVAILABLE=8 ERROR_CAUSE_TSDB_UNAVAILABLE value
     * @property {number} ERROR_CAUSE_TOO_BUSY=9 ERROR_CAUSE_TOO_BUSY value
     * @property {number} ERROR_CAUSE_CIRCUIT_BREAKER_OPEN=10 ERROR_CAUSE_CIRCUIT_BREAKER_OPEN value
     * @property {number} ERROR_CAUSE_METHOD_NOT_ALLOWED=11 ERROR_CAUSE_METHOD_NOT_ALLOWED value
     * @property {number} ERROR_CAUSE_TENANT_LIMIT=12 ERROR_CAUSE_TENANT_LIMIT value
     * @property {number} ERROR_CAUSE_ACTIVE_SERIES_LIMITED=13 ERROR_CAUSE_ACTIVE_SERIES_LIMITED value
     */
    cortexpb.ErrorCause = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "ERROR_CAUSE_UNKNOWN"] = 0;
        values[valuesById[1] = "ERROR_CAUSE_REPLICAS_DID_NOT_MATCH"] = 1;
        values[valuesById[2] = "ERROR_CAUSE_TOO_MANY_CLUSTERS"] = 2;
        values[valuesById[3] = "ERROR_CAUSE_BAD_DATA"] = 3;
        values[valuesById[4] = "ERROR_CAUSE_INGESTION_RATE_LIMITED"] = 4;
        values[valuesById[5] = "ERROR_CAUSE_REQUEST_RATE_LIMITED"] = 5;
        values[valuesById[6] = "ERROR_CAUSE_INSTANCE_LIMIT"] = 6;
        values[valuesById[7] = "ERROR_CAUSE_SERVICE_UNAVAILABLE"] = 7;
        values[valuesById[8] = "ERROR_CAUSE_TSDB_UNAVAILABLE"] = 8;
        values[valuesById[9] = "ERROR_CAUSE_TOO_BUSY"] = 9;
        values[valuesById[10] = "ERROR_CAUSE_CIRCUIT_BREAKER_OPEN"] = 10;
        values[valuesById[11] = "ERROR_CAUSE_METHOD_NOT_ALLOWED"] = 11;
        values[valuesById[12] = "ERROR_CAUSE_TENANT_LIMIT"] = 12;
        values[valuesById[13] = "ERROR_CAUSE_ACTIVE_SERIES_LIMITED"] = 13;
        return values;
    })();

    cortexpb.ErrorDetails = (function() {

        /**
         * Properties of an ErrorDetails.
         * @memberof cortexpb
         * @interface IErrorDetails
         * @property {cortexpb.ErrorCause|null} [Cause] ErrorDetails Cause
         * @property {boolean|null} [Soft] ErrorDetails Soft
         */

        /**
         * Constructs a new ErrorDetails.
         * @memberof cortexpb
         * @classdesc Represents an ErrorDetails.
         * @implements IErrorDetails
         * @constructor
         * @param {cortexpb.IErrorDetails=} [properties] Properties to set
         */
        function ErrorDetails(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ErrorDetails Cause.
         * @member {cortexpb.ErrorCause} Cause
         * @memberof cortexpb.ErrorDetails
         * @instance
         */
        ErrorDetails.prototype.Cause = 0;

        /**
         * ErrorDetails Soft.
         * @member {boolean} Soft
         * @memberof cortexpb.ErrorDetails
         * @instance
         */
        ErrorDetails.prototype.Soft = false;

        /**
         * Creates a new ErrorDetails instance using the specified properties.
         * @function create
         * @memberof cortexpb.ErrorDetails
         * @static
         * @param {cortexpb.IErrorDetails=} [properties] Properties to set
         * @returns {cortexpb.ErrorDetails} ErrorDetails instance
         */
        ErrorDetails.create = function create(properties) {
            return new ErrorDetails(properties);
        };

        /**
         * Encodes the specified ErrorDetails message. Does not implicitly {@link cortexpb.ErrorDetails.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.ErrorDetails
         * @static
         * @param {cortexpb.IErrorDetails} message ErrorDetails message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorDetails.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.Cause != null && Object.hasOwnProperty.call(message, "Cause"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.Cause);
            if (message.Soft != null && Object.hasOwnProperty.call(message, "Soft"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.Soft);
            return writer;
        };

        /**
         * Encodes the specified ErrorDetails message, length delimited. Does not implicitly {@link cortexpb.ErrorDetails.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.ErrorDetails
         * @static
         * @param {cortexpb.IErrorDetails} message ErrorDetails message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorDetails.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ErrorDetails message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.ErrorDetails
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.ErrorDetails} ErrorDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorDetails.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.ErrorDetails();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.Cause = reader.int32();
                        break;
                    }
                case 2: {
                        message.Soft = reader.bool();
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
         * Decodes an ErrorDetails message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.ErrorDetails
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.ErrorDetails} ErrorDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorDetails.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ErrorDetails message.
         * @function verify
         * @memberof cortexpb.ErrorDetails
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ErrorDetails.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.Cause != null && message.hasOwnProperty("Cause"))
                switch (message.Cause) {
                default:
                    return "Cause: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    break;
                }
            if (message.Soft != null && message.hasOwnProperty("Soft"))
                if (typeof message.Soft !== "boolean")
                    return "Soft: boolean expected";
            return null;
        };

        /**
         * Creates an ErrorDetails message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.ErrorDetails
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.ErrorDetails} ErrorDetails
         */
        ErrorDetails.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.ErrorDetails)
                return object;
            var message = new $root.cortexpb.ErrorDetails();
            switch (object.Cause) {
            default:
                if (typeof object.Cause === "number") {
                    message.Cause = object.Cause;
                    break;
                }
                break;
            case "ERROR_CAUSE_UNKNOWN":
            case 0:
                message.Cause = 0;
                break;
            case "ERROR_CAUSE_REPLICAS_DID_NOT_MATCH":
            case 1:
                message.Cause = 1;
                break;
            case "ERROR_CAUSE_TOO_MANY_CLUSTERS":
            case 2:
                message.Cause = 2;
                break;
            case "ERROR_CAUSE_BAD_DATA":
            case 3:
                message.Cause = 3;
                break;
            case "ERROR_CAUSE_INGESTION_RATE_LIMITED":
            case 4:
                message.Cause = 4;
                break;
            case "ERROR_CAUSE_REQUEST_RATE_LIMITED":
            case 5:
                message.Cause = 5;
                break;
            case "ERROR_CAUSE_INSTANCE_LIMIT":
            case 6:
                message.Cause = 6;
                break;
            case "ERROR_CAUSE_SERVICE_UNAVAILABLE":
            case 7:
                message.Cause = 7;
                break;
            case "ERROR_CAUSE_TSDB_UNAVAILABLE":
            case 8:
                message.Cause = 8;
                break;
            case "ERROR_CAUSE_TOO_BUSY":
            case 9:
                message.Cause = 9;
                break;
            case "ERROR_CAUSE_CIRCUIT_BREAKER_OPEN":
            case 10:
                message.Cause = 10;
                break;
            case "ERROR_CAUSE_METHOD_NOT_ALLOWED":
            case 11:
                message.Cause = 11;
                break;
            case "ERROR_CAUSE_TENANT_LIMIT":
            case 12:
                message.Cause = 12;
                break;
            case "ERROR_CAUSE_ACTIVE_SERIES_LIMITED":
            case 13:
                message.Cause = 13;
                break;
            }
            if (object.Soft != null)
                message.Soft = Boolean(object.Soft);
            return message;
        };

        /**
         * Creates a plain object from an ErrorDetails message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.ErrorDetails
         * @static
         * @param {cortexpb.ErrorDetails} message ErrorDetails
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ErrorDetails.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.Cause = options.enums === String ? "ERROR_CAUSE_UNKNOWN" : 0;
                object.Soft = false;
            }
            if (message.Cause != null && message.hasOwnProperty("Cause"))
                object.Cause = options.enums === String ? $root.cortexpb.ErrorCause[message.Cause] === undefined ? message.Cause : $root.cortexpb.ErrorCause[message.Cause] : message.Cause;
            if (message.Soft != null && message.hasOwnProperty("Soft"))
                object.Soft = message.Soft;
            return object;
        };

        /**
         * Converts this ErrorDetails to JSON.
         * @function toJSON
         * @memberof cortexpb.ErrorDetails
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ErrorDetails.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ErrorDetails
         * @function getTypeUrl
         * @memberof cortexpb.ErrorDetails
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ErrorDetails.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.ErrorDetails";
        };

        return ErrorDetails;
    })();

    cortexpb.TimeSeries = (function() {

        /**
         * Properties of a TimeSeries.
         * @memberof cortexpb
         * @interface ITimeSeries
         * @property {Array.<cortexpb.ILabelPair>|null} [labels] TimeSeries labels
         * @property {Array.<cortexpb.ISample>|null} [samples] TimeSeries samples
         * @property {Array.<cortexpb.IExemplar>|null} [exemplars] TimeSeries exemplars
         * @property {Array.<cortexpb.IHistogram>|null} [histograms] TimeSeries histograms
         * @property {number|Long|null} [createdTimestamp] TimeSeries createdTimestamp
         */

        /**
         * Constructs a new TimeSeries.
         * @memberof cortexpb
         * @classdesc Represents a TimeSeries.
         * @implements ITimeSeries
         * @constructor
         * @param {cortexpb.ITimeSeries=} [properties] Properties to set
         */
        function TimeSeries(properties) {
            this.labels = [];
            this.samples = [];
            this.exemplars = [];
            this.histograms = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TimeSeries labels.
         * @member {Array.<cortexpb.ILabelPair>} labels
         * @memberof cortexpb.TimeSeries
         * @instance
         */
        TimeSeries.prototype.labels = $util.emptyArray;

        /**
         * TimeSeries samples.
         * @member {Array.<cortexpb.ISample>} samples
         * @memberof cortexpb.TimeSeries
         * @instance
         */
        TimeSeries.prototype.samples = $util.emptyArray;

        /**
         * TimeSeries exemplars.
         * @member {Array.<cortexpb.IExemplar>} exemplars
         * @memberof cortexpb.TimeSeries
         * @instance
         */
        TimeSeries.prototype.exemplars = $util.emptyArray;

        /**
         * TimeSeries histograms.
         * @member {Array.<cortexpb.IHistogram>} histograms
         * @memberof cortexpb.TimeSeries
         * @instance
         */
        TimeSeries.prototype.histograms = $util.emptyArray;

        /**
         * TimeSeries createdTimestamp.
         * @member {number|Long} createdTimestamp
         * @memberof cortexpb.TimeSeries
         * @instance
         */
        TimeSeries.prototype.createdTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new TimeSeries instance using the specified properties.
         * @function create
         * @memberof cortexpb.TimeSeries
         * @static
         * @param {cortexpb.ITimeSeries=} [properties] Properties to set
         * @returns {cortexpb.TimeSeries} TimeSeries instance
         */
        TimeSeries.create = function create(properties) {
            return new TimeSeries(properties);
        };

        /**
         * Encodes the specified TimeSeries message. Does not implicitly {@link cortexpb.TimeSeries.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.TimeSeries
         * @static
         * @param {cortexpb.ITimeSeries} message TimeSeries message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TimeSeries.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.labels != null && message.labels.length)
                for (var i = 0; i < message.labels.length; ++i)
                    $root.cortexpb.LabelPair.encode(message.labels[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.samples != null && message.samples.length)
                for (var i = 0; i < message.samples.length; ++i)
                    $root.cortexpb.Sample.encode(message.samples[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.exemplars != null && message.exemplars.length)
                for (var i = 0; i < message.exemplars.length; ++i)
                    $root.cortexpb.Exemplar.encode(message.exemplars[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.histograms != null && message.histograms.length)
                for (var i = 0; i < message.histograms.length; ++i)
                    $root.cortexpb.Histogram.encode(message.histograms[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.createdTimestamp != null && Object.hasOwnProperty.call(message, "createdTimestamp"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.createdTimestamp);
            return writer;
        };

        /**
         * Encodes the specified TimeSeries message, length delimited. Does not implicitly {@link cortexpb.TimeSeries.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.TimeSeries
         * @static
         * @param {cortexpb.ITimeSeries} message TimeSeries message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TimeSeries.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TimeSeries message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.TimeSeries
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.TimeSeries} TimeSeries
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TimeSeries.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.TimeSeries();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.labels && message.labels.length))
                            message.labels = [];
                        message.labels.push($root.cortexpb.LabelPair.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        if (!(message.samples && message.samples.length))
                            message.samples = [];
                        message.samples.push($root.cortexpb.Sample.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        if (!(message.exemplars && message.exemplars.length))
                            message.exemplars = [];
                        message.exemplars.push($root.cortexpb.Exemplar.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        if (!(message.histograms && message.histograms.length))
                            message.histograms = [];
                        message.histograms.push($root.cortexpb.Histogram.decode(reader, reader.uint32()));
                        break;
                    }
                case 6: {
                        message.createdTimestamp = reader.int64();
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
         * @memberof cortexpb.TimeSeries
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.TimeSeries} TimeSeries
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
         * @memberof cortexpb.TimeSeries
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TimeSeries.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.labels != null && message.hasOwnProperty("labels")) {
                if (!Array.isArray(message.labels))
                    return "labels: array expected";
                for (var i = 0; i < message.labels.length; ++i) {
                    var error = $root.cortexpb.LabelPair.verify(message.labels[i]);
                    if (error)
                        return "labels." + error;
                }
            }
            if (message.samples != null && message.hasOwnProperty("samples")) {
                if (!Array.isArray(message.samples))
                    return "samples: array expected";
                for (var i = 0; i < message.samples.length; ++i) {
                    var error = $root.cortexpb.Sample.verify(message.samples[i]);
                    if (error)
                        return "samples." + error;
                }
            }
            if (message.exemplars != null && message.hasOwnProperty("exemplars")) {
                if (!Array.isArray(message.exemplars))
                    return "exemplars: array expected";
                for (var i = 0; i < message.exemplars.length; ++i) {
                    var error = $root.cortexpb.Exemplar.verify(message.exemplars[i]);
                    if (error)
                        return "exemplars." + error;
                }
            }
            if (message.histograms != null && message.hasOwnProperty("histograms")) {
                if (!Array.isArray(message.histograms))
                    return "histograms: array expected";
                for (var i = 0; i < message.histograms.length; ++i) {
                    var error = $root.cortexpb.Histogram.verify(message.histograms[i]);
                    if (error)
                        return "histograms." + error;
                }
            }
            if (message.createdTimestamp != null && message.hasOwnProperty("createdTimestamp"))
                if (!$util.isInteger(message.createdTimestamp) && !(message.createdTimestamp && $util.isInteger(message.createdTimestamp.low) && $util.isInteger(message.createdTimestamp.high)))
                    return "createdTimestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a TimeSeries message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.TimeSeries
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.TimeSeries} TimeSeries
         */
        TimeSeries.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.TimeSeries)
                return object;
            var message = new $root.cortexpb.TimeSeries();
            if (object.labels) {
                if (!Array.isArray(object.labels))
                    throw TypeError(".cortexpb.TimeSeries.labels: array expected");
                message.labels = [];
                for (var i = 0; i < object.labels.length; ++i) {
                    if (typeof object.labels[i] !== "object")
                        throw TypeError(".cortexpb.TimeSeries.labels: object expected");
                    message.labels[i] = $root.cortexpb.LabelPair.fromObject(object.labels[i]);
                }
            }
            if (object.samples) {
                if (!Array.isArray(object.samples))
                    throw TypeError(".cortexpb.TimeSeries.samples: array expected");
                message.samples = [];
                for (var i = 0; i < object.samples.length; ++i) {
                    if (typeof object.samples[i] !== "object")
                        throw TypeError(".cortexpb.TimeSeries.samples: object expected");
                    message.samples[i] = $root.cortexpb.Sample.fromObject(object.samples[i]);
                }
            }
            if (object.exemplars) {
                if (!Array.isArray(object.exemplars))
                    throw TypeError(".cortexpb.TimeSeries.exemplars: array expected");
                message.exemplars = [];
                for (var i = 0; i < object.exemplars.length; ++i) {
                    if (typeof object.exemplars[i] !== "object")
                        throw TypeError(".cortexpb.TimeSeries.exemplars: object expected");
                    message.exemplars[i] = $root.cortexpb.Exemplar.fromObject(object.exemplars[i]);
                }
            }
            if (object.histograms) {
                if (!Array.isArray(object.histograms))
                    throw TypeError(".cortexpb.TimeSeries.histograms: array expected");
                message.histograms = [];
                for (var i = 0; i < object.histograms.length; ++i) {
                    if (typeof object.histograms[i] !== "object")
                        throw TypeError(".cortexpb.TimeSeries.histograms: object expected");
                    message.histograms[i] = $root.cortexpb.Histogram.fromObject(object.histograms[i]);
                }
            }
            if (object.createdTimestamp != null)
                if ($util.Long)
                    (message.createdTimestamp = $util.Long.fromValue(object.createdTimestamp)).unsigned = false;
                else if (typeof object.createdTimestamp === "string")
                    message.createdTimestamp = parseInt(object.createdTimestamp, 10);
                else if (typeof object.createdTimestamp === "number")
                    message.createdTimestamp = object.createdTimestamp;
                else if (typeof object.createdTimestamp === "object")
                    message.createdTimestamp = new $util.LongBits(object.createdTimestamp.low >>> 0, object.createdTimestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a TimeSeries message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.TimeSeries
         * @static
         * @param {cortexpb.TimeSeries} message TimeSeries
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TimeSeries.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.labels = [];
                object.samples = [];
                object.exemplars = [];
                object.histograms = [];
            }
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.createdTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.createdTimestamp = options.longs === String ? "0" : 0;
            if (message.labels && message.labels.length) {
                object.labels = [];
                for (var j = 0; j < message.labels.length; ++j)
                    object.labels[j] = $root.cortexpb.LabelPair.toObject(message.labels[j], options);
            }
            if (message.samples && message.samples.length) {
                object.samples = [];
                for (var j = 0; j < message.samples.length; ++j)
                    object.samples[j] = $root.cortexpb.Sample.toObject(message.samples[j], options);
            }
            if (message.exemplars && message.exemplars.length) {
                object.exemplars = [];
                for (var j = 0; j < message.exemplars.length; ++j)
                    object.exemplars[j] = $root.cortexpb.Exemplar.toObject(message.exemplars[j], options);
            }
            if (message.histograms && message.histograms.length) {
                object.histograms = [];
                for (var j = 0; j < message.histograms.length; ++j)
                    object.histograms[j] = $root.cortexpb.Histogram.toObject(message.histograms[j], options);
            }
            if (message.createdTimestamp != null && message.hasOwnProperty("createdTimestamp"))
                if (typeof message.createdTimestamp === "number")
                    object.createdTimestamp = options.longs === String ? String(message.createdTimestamp) : message.createdTimestamp;
                else
                    object.createdTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.createdTimestamp) : options.longs === Number ? new $util.LongBits(message.createdTimestamp.low >>> 0, message.createdTimestamp.high >>> 0).toNumber() : message.createdTimestamp;
            return object;
        };

        /**
         * Converts this TimeSeries to JSON.
         * @function toJSON
         * @memberof cortexpb.TimeSeries
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TimeSeries.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TimeSeries
         * @function getTypeUrl
         * @memberof cortexpb.TimeSeries
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TimeSeries.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.TimeSeries";
        };

        return TimeSeries;
    })();

    cortexpb.LabelPair = (function() {

        /**
         * Properties of a LabelPair.
         * @memberof cortexpb
         * @interface ILabelPair
         * @property {Uint8Array|null} [name] LabelPair name
         * @property {Uint8Array|null} [value] LabelPair value
         */

        /**
         * Constructs a new LabelPair.
         * @memberof cortexpb
         * @classdesc Represents a LabelPair.
         * @implements ILabelPair
         * @constructor
         * @param {cortexpb.ILabelPair=} [properties] Properties to set
         */
        function LabelPair(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LabelPair name.
         * @member {Uint8Array} name
         * @memberof cortexpb.LabelPair
         * @instance
         */
        LabelPair.prototype.name = $util.newBuffer([]);

        /**
         * LabelPair value.
         * @member {Uint8Array} value
         * @memberof cortexpb.LabelPair
         * @instance
         */
        LabelPair.prototype.value = $util.newBuffer([]);

        /**
         * Creates a new LabelPair instance using the specified properties.
         * @function create
         * @memberof cortexpb.LabelPair
         * @static
         * @param {cortexpb.ILabelPair=} [properties] Properties to set
         * @returns {cortexpb.LabelPair} LabelPair instance
         */
        LabelPair.create = function create(properties) {
            return new LabelPair(properties);
        };

        /**
         * Encodes the specified LabelPair message. Does not implicitly {@link cortexpb.LabelPair.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.LabelPair
         * @static
         * @param {cortexpb.ILabelPair} message LabelPair message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LabelPair.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.name);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
            return writer;
        };

        /**
         * Encodes the specified LabelPair message, length delimited. Does not implicitly {@link cortexpb.LabelPair.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.LabelPair
         * @static
         * @param {cortexpb.ILabelPair} message LabelPair message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LabelPair.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LabelPair message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.LabelPair
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.LabelPair} LabelPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LabelPair.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.LabelPair();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.bytes();
                        break;
                    }
                case 2: {
                        message.value = reader.bytes();
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
         * Decodes a LabelPair message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.LabelPair
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.LabelPair} LabelPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LabelPair.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LabelPair message.
         * @function verify
         * @memberof cortexpb.LabelPair
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LabelPair.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!(message.name && typeof message.name.length === "number" || $util.isString(message.name)))
                    return "name: buffer expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                    return "value: buffer expected";
            return null;
        };

        /**
         * Creates a LabelPair message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.LabelPair
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.LabelPair} LabelPair
         */
        LabelPair.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.LabelPair)
                return object;
            var message = new $root.cortexpb.LabelPair();
            if (object.name != null)
                if (typeof object.name === "string")
                    $util.base64.decode(object.name, message.name = $util.newBuffer($util.base64.length(object.name)), 0);
                else if (object.name.length >= 0)
                    message.name = object.name;
            if (object.value != null)
                if (typeof object.value === "string")
                    $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                else if (object.value.length >= 0)
                    message.value = object.value;
            return message;
        };

        /**
         * Creates a plain object from a LabelPair message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.LabelPair
         * @static
         * @param {cortexpb.LabelPair} message LabelPair
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LabelPair.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.name = "";
                else {
                    object.name = [];
                    if (options.bytes !== Array)
                        object.name = $util.newBuffer(object.name);
                }
                if (options.bytes === String)
                    object.value = "";
                else {
                    object.value = [];
                    if (options.bytes !== Array)
                        object.value = $util.newBuffer(object.value);
                }
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = options.bytes === String ? $util.base64.encode(message.name, 0, message.name.length) : options.bytes === Array ? Array.prototype.slice.call(message.name) : message.name;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
            return object;
        };

        /**
         * Converts this LabelPair to JSON.
         * @function toJSON
         * @memberof cortexpb.LabelPair
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LabelPair.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LabelPair
         * @function getTypeUrl
         * @memberof cortexpb.LabelPair
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LabelPair.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.LabelPair";
        };

        return LabelPair;
    })();

    cortexpb.Sample = (function() {

        /**
         * Properties of a Sample.
         * @memberof cortexpb
         * @interface ISample
         * @property {number|Long|null} [timestampMs] Sample timestampMs
         * @property {number|null} [value] Sample value
         */

        /**
         * Constructs a new Sample.
         * @memberof cortexpb
         * @classdesc Represents a Sample.
         * @implements ISample
         * @constructor
         * @param {cortexpb.ISample=} [properties] Properties to set
         */
        function Sample(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Sample timestampMs.
         * @member {number|Long} timestampMs
         * @memberof cortexpb.Sample
         * @instance
         */
        Sample.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Sample value.
         * @member {number} value
         * @memberof cortexpb.Sample
         * @instance
         */
        Sample.prototype.value = 0;

        /**
         * Creates a new Sample instance using the specified properties.
         * @function create
         * @memberof cortexpb.Sample
         * @static
         * @param {cortexpb.ISample=} [properties] Properties to set
         * @returns {cortexpb.Sample} Sample instance
         */
        Sample.create = function create(properties) {
            return new Sample(properties);
        };

        /**
         * Encodes the specified Sample message. Does not implicitly {@link cortexpb.Sample.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.Sample
         * @static
         * @param {cortexpb.ISample} message Sample message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Sample.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.value);
            if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestampMs);
            return writer;
        };

        /**
         * Encodes the specified Sample message, length delimited. Does not implicitly {@link cortexpb.Sample.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.Sample
         * @static
         * @param {cortexpb.ISample} message Sample message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Sample.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Sample message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.Sample
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.Sample} Sample
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Sample.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.Sample();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 2: {
                        message.timestampMs = reader.int64();
                        break;
                    }
                case 1: {
                        message.value = reader.double();
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
         * @memberof cortexpb.Sample
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.Sample} Sample
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
         * @memberof cortexpb.Sample
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Sample.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (!$util.isInteger(message.timestampMs) && !(message.timestampMs && $util.isInteger(message.timestampMs.low) && $util.isInteger(message.timestampMs.high)))
                    return "timestampMs: integer|Long expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (typeof message.value !== "number")
                    return "value: number expected";
            return null;
        };

        /**
         * Creates a Sample message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.Sample
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.Sample} Sample
         */
        Sample.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.Sample)
                return object;
            var message = new $root.cortexpb.Sample();
            if (object.timestampMs != null)
                if ($util.Long)
                    (message.timestampMs = $util.Long.fromValue(object.timestampMs)).unsigned = false;
                else if (typeof object.timestampMs === "string")
                    message.timestampMs = parseInt(object.timestampMs, 10);
                else if (typeof object.timestampMs === "number")
                    message.timestampMs = object.timestampMs;
                else if (typeof object.timestampMs === "object")
                    message.timestampMs = new $util.LongBits(object.timestampMs.low >>> 0, object.timestampMs.high >>> 0).toNumber();
            if (object.value != null)
                message.value = Number(object.value);
            return message;
        };

        /**
         * Creates a plain object from a Sample message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.Sample
         * @static
         * @param {cortexpb.Sample} message Sample
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
                    object.timestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampMs = options.longs === String ? "0" : 0;
            }
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (typeof message.timestampMs === "number")
                    object.timestampMs = options.longs === String ? String(message.timestampMs) : message.timestampMs;
                else
                    object.timestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.timestampMs) : options.longs === Number ? new $util.LongBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0).toNumber() : message.timestampMs;
            return object;
        };

        /**
         * Converts this Sample to JSON.
         * @function toJSON
         * @memberof cortexpb.Sample
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Sample.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Sample
         * @function getTypeUrl
         * @memberof cortexpb.Sample
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Sample.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.Sample";
        };

        return Sample;
    })();

    cortexpb.MetricMetadata = (function() {

        /**
         * Properties of a MetricMetadata.
         * @memberof cortexpb
         * @interface IMetricMetadata
         * @property {cortexpb.MetricMetadata.MetricType|null} [type] MetricMetadata type
         * @property {string|null} [metricFamilyName] MetricMetadata metricFamilyName
         * @property {string|null} [help] MetricMetadata help
         * @property {string|null} [unit] MetricMetadata unit
         */

        /**
         * Constructs a new MetricMetadata.
         * @memberof cortexpb
         * @classdesc Represents a MetricMetadata.
         * @implements IMetricMetadata
         * @constructor
         * @param {cortexpb.IMetricMetadata=} [properties] Properties to set
         */
        function MetricMetadata(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MetricMetadata type.
         * @member {cortexpb.MetricMetadata.MetricType} type
         * @memberof cortexpb.MetricMetadata
         * @instance
         */
        MetricMetadata.prototype.type = 0;

        /**
         * MetricMetadata metricFamilyName.
         * @member {string} metricFamilyName
         * @memberof cortexpb.MetricMetadata
         * @instance
         */
        MetricMetadata.prototype.metricFamilyName = "";

        /**
         * MetricMetadata help.
         * @member {string} help
         * @memberof cortexpb.MetricMetadata
         * @instance
         */
        MetricMetadata.prototype.help = "";

        /**
         * MetricMetadata unit.
         * @member {string} unit
         * @memberof cortexpb.MetricMetadata
         * @instance
         */
        MetricMetadata.prototype.unit = "";

        /**
         * Creates a new MetricMetadata instance using the specified properties.
         * @function create
         * @memberof cortexpb.MetricMetadata
         * @static
         * @param {cortexpb.IMetricMetadata=} [properties] Properties to set
         * @returns {cortexpb.MetricMetadata} MetricMetadata instance
         */
        MetricMetadata.create = function create(properties) {
            return new MetricMetadata(properties);
        };

        /**
         * Encodes the specified MetricMetadata message. Does not implicitly {@link cortexpb.MetricMetadata.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.MetricMetadata
         * @static
         * @param {cortexpb.IMetricMetadata} message MetricMetadata message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MetricMetadata.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.metricFamilyName != null && Object.hasOwnProperty.call(message, "metricFamilyName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.metricFamilyName);
            if (message.help != null && Object.hasOwnProperty.call(message, "help"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.help);
            if (message.unit != null && Object.hasOwnProperty.call(message, "unit"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.unit);
            return writer;
        };

        /**
         * Encodes the specified MetricMetadata message, length delimited. Does not implicitly {@link cortexpb.MetricMetadata.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.MetricMetadata
         * @static
         * @param {cortexpb.IMetricMetadata} message MetricMetadata message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MetricMetadata.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MetricMetadata message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.MetricMetadata
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.MetricMetadata} MetricMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MetricMetadata.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.MetricMetadata();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.int32();
                        break;
                    }
                case 2: {
                        message.metricFamilyName = reader.string();
                        break;
                    }
                case 4: {
                        message.help = reader.string();
                        break;
                    }
                case 5: {
                        message.unit = reader.string();
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
         * Decodes a MetricMetadata message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.MetricMetadata
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.MetricMetadata} MetricMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MetricMetadata.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MetricMetadata message.
         * @function verify
         * @memberof cortexpb.MetricMetadata
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MetricMetadata.verify = function verify(message) {
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
            if (message.metricFamilyName != null && message.hasOwnProperty("metricFamilyName"))
                if (!$util.isString(message.metricFamilyName))
                    return "metricFamilyName: string expected";
            if (message.help != null && message.hasOwnProperty("help"))
                if (!$util.isString(message.help))
                    return "help: string expected";
            if (message.unit != null && message.hasOwnProperty("unit"))
                if (!$util.isString(message.unit))
                    return "unit: string expected";
            return null;
        };

        /**
         * Creates a MetricMetadata message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.MetricMetadata
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.MetricMetadata} MetricMetadata
         */
        MetricMetadata.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.MetricMetadata)
                return object;
            var message = new $root.cortexpb.MetricMetadata();
            switch (object.type) {
            default:
                if (typeof object.type === "number") {
                    message.type = object.type;
                    break;
                }
                break;
            case "UNKNOWN":
            case 0:
                message.type = 0;
                break;
            case "COUNTER":
            case 1:
                message.type = 1;
                break;
            case "GAUGE":
            case 2:
                message.type = 2;
                break;
            case "HISTOGRAM":
            case 3:
                message.type = 3;
                break;
            case "GAUGEHISTOGRAM":
            case 4:
                message.type = 4;
                break;
            case "SUMMARY":
            case 5:
                message.type = 5;
                break;
            case "INFO":
            case 6:
                message.type = 6;
                break;
            case "STATESET":
            case 7:
                message.type = 7;
                break;
            }
            if (object.metricFamilyName != null)
                message.metricFamilyName = String(object.metricFamilyName);
            if (object.help != null)
                message.help = String(object.help);
            if (object.unit != null)
                message.unit = String(object.unit);
            return message;
        };

        /**
         * Creates a plain object from a MetricMetadata message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.MetricMetadata
         * @static
         * @param {cortexpb.MetricMetadata} message MetricMetadata
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MetricMetadata.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "UNKNOWN" : 0;
                object.metricFamilyName = "";
                object.help = "";
                object.unit = "";
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.cortexpb.MetricMetadata.MetricType[message.type] === undefined ? message.type : $root.cortexpb.MetricMetadata.MetricType[message.type] : message.type;
            if (message.metricFamilyName != null && message.hasOwnProperty("metricFamilyName"))
                object.metricFamilyName = message.metricFamilyName;
            if (message.help != null && message.hasOwnProperty("help"))
                object.help = message.help;
            if (message.unit != null && message.hasOwnProperty("unit"))
                object.unit = message.unit;
            return object;
        };

        /**
         * Converts this MetricMetadata to JSON.
         * @function toJSON
         * @memberof cortexpb.MetricMetadata
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MetricMetadata.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MetricMetadata
         * @function getTypeUrl
         * @memberof cortexpb.MetricMetadata
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MetricMetadata.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.MetricMetadata";
        };

        /**
         * MetricType enum.
         * @name cortexpb.MetricMetadata.MetricType
         * @enum {number}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} COUNTER=1 COUNTER value
         * @property {number} GAUGE=2 GAUGE value
         * @property {number} HISTOGRAM=3 HISTOGRAM value
         * @property {number} GAUGEHISTOGRAM=4 GAUGEHISTOGRAM value
         * @property {number} SUMMARY=5 SUMMARY value
         * @property {number} INFO=6 INFO value
         * @property {number} STATESET=7 STATESET value
         */
        MetricMetadata.MetricType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "COUNTER"] = 1;
            values[valuesById[2] = "GAUGE"] = 2;
            values[valuesById[3] = "HISTOGRAM"] = 3;
            values[valuesById[4] = "GAUGEHISTOGRAM"] = 4;
            values[valuesById[5] = "SUMMARY"] = 5;
            values[valuesById[6] = "INFO"] = 6;
            values[valuesById[7] = "STATESET"] = 7;
            return values;
        })();

        return MetricMetadata;
    })();

    cortexpb.Metric = (function() {

        /**
         * Properties of a Metric.
         * @memberof cortexpb
         * @interface IMetric
         * @property {Array.<cortexpb.ILabelPair>|null} [labels] Metric labels
         */

        /**
         * Constructs a new Metric.
         * @memberof cortexpb
         * @classdesc Represents a Metric.
         * @implements IMetric
         * @constructor
         * @param {cortexpb.IMetric=} [properties] Properties to set
         */
        function Metric(properties) {
            this.labels = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Metric labels.
         * @member {Array.<cortexpb.ILabelPair>} labels
         * @memberof cortexpb.Metric
         * @instance
         */
        Metric.prototype.labels = $util.emptyArray;

        /**
         * Creates a new Metric instance using the specified properties.
         * @function create
         * @memberof cortexpb.Metric
         * @static
         * @param {cortexpb.IMetric=} [properties] Properties to set
         * @returns {cortexpb.Metric} Metric instance
         */
        Metric.create = function create(properties) {
            return new Metric(properties);
        };

        /**
         * Encodes the specified Metric message. Does not implicitly {@link cortexpb.Metric.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.Metric
         * @static
         * @param {cortexpb.IMetric} message Metric message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Metric.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.labels != null && message.labels.length)
                for (var i = 0; i < message.labels.length; ++i)
                    $root.cortexpb.LabelPair.encode(message.labels[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Metric message, length delimited. Does not implicitly {@link cortexpb.Metric.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.Metric
         * @static
         * @param {cortexpb.IMetric} message Metric message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Metric.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Metric message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.Metric
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.Metric} Metric
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Metric.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.Metric();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.labels && message.labels.length))
                            message.labels = [];
                        message.labels.push($root.cortexpb.LabelPair.decode(reader, reader.uint32()));
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
         * Decodes a Metric message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.Metric
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.Metric} Metric
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Metric.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Metric message.
         * @function verify
         * @memberof cortexpb.Metric
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Metric.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.labels != null && message.hasOwnProperty("labels")) {
                if (!Array.isArray(message.labels))
                    return "labels: array expected";
                for (var i = 0; i < message.labels.length; ++i) {
                    var error = $root.cortexpb.LabelPair.verify(message.labels[i]);
                    if (error)
                        return "labels." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Metric message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.Metric
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.Metric} Metric
         */
        Metric.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.Metric)
                return object;
            var message = new $root.cortexpb.Metric();
            if (object.labels) {
                if (!Array.isArray(object.labels))
                    throw TypeError(".cortexpb.Metric.labels: array expected");
                message.labels = [];
                for (var i = 0; i < object.labels.length; ++i) {
                    if (typeof object.labels[i] !== "object")
                        throw TypeError(".cortexpb.Metric.labels: object expected");
                    message.labels[i] = $root.cortexpb.LabelPair.fromObject(object.labels[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Metric message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.Metric
         * @static
         * @param {cortexpb.Metric} message Metric
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Metric.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.labels = [];
            if (message.labels && message.labels.length) {
                object.labels = [];
                for (var j = 0; j < message.labels.length; ++j)
                    object.labels[j] = $root.cortexpb.LabelPair.toObject(message.labels[j], options);
            }
            return object;
        };

        /**
         * Converts this Metric to JSON.
         * @function toJSON
         * @memberof cortexpb.Metric
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Metric.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Metric
         * @function getTypeUrl
         * @memberof cortexpb.Metric
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Metric.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.Metric";
        };

        return Metric;
    })();

    cortexpb.Exemplar = (function() {

        /**
         * Properties of an Exemplar.
         * @memberof cortexpb
         * @interface IExemplar
         * @property {Array.<cortexpb.ILabelPair>|null} [labels] Exemplar labels
         * @property {number|null} [value] Exemplar value
         * @property {number|Long|null} [timestampMs] Exemplar timestampMs
         */

        /**
         * Constructs a new Exemplar.
         * @memberof cortexpb
         * @classdesc Represents an Exemplar.
         * @implements IExemplar
         * @constructor
         * @param {cortexpb.IExemplar=} [properties] Properties to set
         */
        function Exemplar(properties) {
            this.labels = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Exemplar labels.
         * @member {Array.<cortexpb.ILabelPair>} labels
         * @memberof cortexpb.Exemplar
         * @instance
         */
        Exemplar.prototype.labels = $util.emptyArray;

        /**
         * Exemplar value.
         * @member {number} value
         * @memberof cortexpb.Exemplar
         * @instance
         */
        Exemplar.prototype.value = 0;

        /**
         * Exemplar timestampMs.
         * @member {number|Long} timestampMs
         * @memberof cortexpb.Exemplar
         * @instance
         */
        Exemplar.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new Exemplar instance using the specified properties.
         * @function create
         * @memberof cortexpb.Exemplar
         * @static
         * @param {cortexpb.IExemplar=} [properties] Properties to set
         * @returns {cortexpb.Exemplar} Exemplar instance
         */
        Exemplar.create = function create(properties) {
            return new Exemplar(properties);
        };

        /**
         * Encodes the specified Exemplar message. Does not implicitly {@link cortexpb.Exemplar.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.Exemplar
         * @static
         * @param {cortexpb.IExemplar} message Exemplar message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Exemplar.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.labels != null && message.labels.length)
                for (var i = 0; i < message.labels.length; ++i)
                    $root.cortexpb.LabelPair.encode(message.labels[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.value);
            if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestampMs);
            return writer;
        };

        /**
         * Encodes the specified Exemplar message, length delimited. Does not implicitly {@link cortexpb.Exemplar.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.Exemplar
         * @static
         * @param {cortexpb.IExemplar} message Exemplar message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Exemplar.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Exemplar message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.Exemplar
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.Exemplar} Exemplar
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Exemplar.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.Exemplar();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.labels && message.labels.length))
                            message.labels = [];
                        message.labels.push($root.cortexpb.LabelPair.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.value = reader.double();
                        break;
                    }
                case 3: {
                        message.timestampMs = reader.int64();
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
         * @memberof cortexpb.Exemplar
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.Exemplar} Exemplar
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
         * @memberof cortexpb.Exemplar
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Exemplar.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.labels != null && message.hasOwnProperty("labels")) {
                if (!Array.isArray(message.labels))
                    return "labels: array expected";
                for (var i = 0; i < message.labels.length; ++i) {
                    var error = $root.cortexpb.LabelPair.verify(message.labels[i]);
                    if (error)
                        return "labels." + error;
                }
            }
            if (message.value != null && message.hasOwnProperty("value"))
                if (typeof message.value !== "number")
                    return "value: number expected";
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (!$util.isInteger(message.timestampMs) && !(message.timestampMs && $util.isInteger(message.timestampMs.low) && $util.isInteger(message.timestampMs.high)))
                    return "timestampMs: integer|Long expected";
            return null;
        };

        /**
         * Creates an Exemplar message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.Exemplar
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.Exemplar} Exemplar
         */
        Exemplar.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.Exemplar)
                return object;
            var message = new $root.cortexpb.Exemplar();
            if (object.labels) {
                if (!Array.isArray(object.labels))
                    throw TypeError(".cortexpb.Exemplar.labels: array expected");
                message.labels = [];
                for (var i = 0; i < object.labels.length; ++i) {
                    if (typeof object.labels[i] !== "object")
                        throw TypeError(".cortexpb.Exemplar.labels: object expected");
                    message.labels[i] = $root.cortexpb.LabelPair.fromObject(object.labels[i]);
                }
            }
            if (object.value != null)
                message.value = Number(object.value);
            if (object.timestampMs != null)
                if ($util.Long)
                    (message.timestampMs = $util.Long.fromValue(object.timestampMs)).unsigned = false;
                else if (typeof object.timestampMs === "string")
                    message.timestampMs = parseInt(object.timestampMs, 10);
                else if (typeof object.timestampMs === "number")
                    message.timestampMs = object.timestampMs;
                else if (typeof object.timestampMs === "object")
                    message.timestampMs = new $util.LongBits(object.timestampMs.low >>> 0, object.timestampMs.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from an Exemplar message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.Exemplar
         * @static
         * @param {cortexpb.Exemplar} message Exemplar
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Exemplar.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.labels = [];
            if (options.defaults) {
                object.value = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampMs = options.longs === String ? "0" : 0;
            }
            if (message.labels && message.labels.length) {
                object.labels = [];
                for (var j = 0; j < message.labels.length; ++j)
                    object.labels[j] = $root.cortexpb.LabelPair.toObject(message.labels[j], options);
            }
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (typeof message.timestampMs === "number")
                    object.timestampMs = options.longs === String ? String(message.timestampMs) : message.timestampMs;
                else
                    object.timestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.timestampMs) : options.longs === Number ? new $util.LongBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0).toNumber() : message.timestampMs;
            return object;
        };

        /**
         * Converts this Exemplar to JSON.
         * @function toJSON
         * @memberof cortexpb.Exemplar
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Exemplar.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Exemplar
         * @function getTypeUrl
         * @memberof cortexpb.Exemplar
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Exemplar.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.Exemplar";
        };

        return Exemplar;
    })();

    cortexpb.Histogram = (function() {

        /**
         * Properties of a Histogram.
         * @memberof cortexpb
         * @interface IHistogram
         * @property {number|Long|null} [countInt] Histogram countInt
         * @property {number|null} [countFloat] Histogram countFloat
         * @property {number|null} [sum] Histogram sum
         * @property {number|null} [schema] Histogram schema
         * @property {number|null} [zeroThreshold] Histogram zeroThreshold
         * @property {number|Long|null} [zeroCountInt] Histogram zeroCountInt
         * @property {number|null} [zeroCountFloat] Histogram zeroCountFloat
         * @property {Array.<cortexpb.IBucketSpan>|null} [negativeSpans] Histogram negativeSpans
         * @property {Array.<number|Long>|null} [negativeDeltas] Histogram negativeDeltas
         * @property {Array.<number>|null} [negativeCounts] Histogram negativeCounts
         * @property {Array.<cortexpb.IBucketSpan>|null} [positiveSpans] Histogram positiveSpans
         * @property {Array.<number|Long>|null} [positiveDeltas] Histogram positiveDeltas
         * @property {Array.<number>|null} [positiveCounts] Histogram positiveCounts
         * @property {cortexpb.Histogram.ResetHint|null} [resetHint] Histogram resetHint
         * @property {number|Long|null} [timestamp] Histogram timestamp
         * @property {Array.<number>|null} [customValues] Histogram customValues
         */

        /**
         * Constructs a new Histogram.
         * @memberof cortexpb
         * @classdesc Represents a Histogram.
         * @implements IHistogram
         * @constructor
         * @param {cortexpb.IHistogram=} [properties] Properties to set
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
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.countInt = null;

        /**
         * Histogram countFloat.
         * @member {number|null|undefined} countFloat
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.countFloat = null;

        /**
         * Histogram sum.
         * @member {number} sum
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.sum = 0;

        /**
         * Histogram schema.
         * @member {number} schema
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.schema = 0;

        /**
         * Histogram zeroThreshold.
         * @member {number} zeroThreshold
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.zeroThreshold = 0;

        /**
         * Histogram zeroCountInt.
         * @member {number|Long|null|undefined} zeroCountInt
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.zeroCountInt = null;

        /**
         * Histogram zeroCountFloat.
         * @member {number|null|undefined} zeroCountFloat
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.zeroCountFloat = null;

        /**
         * Histogram negativeSpans.
         * @member {Array.<cortexpb.IBucketSpan>} negativeSpans
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.negativeSpans = $util.emptyArray;

        /**
         * Histogram negativeDeltas.
         * @member {Array.<number|Long>} negativeDeltas
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.negativeDeltas = $util.emptyArray;

        /**
         * Histogram negativeCounts.
         * @member {Array.<number>} negativeCounts
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.negativeCounts = $util.emptyArray;

        /**
         * Histogram positiveSpans.
         * @member {Array.<cortexpb.IBucketSpan>} positiveSpans
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.positiveSpans = $util.emptyArray;

        /**
         * Histogram positiveDeltas.
         * @member {Array.<number|Long>} positiveDeltas
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.positiveDeltas = $util.emptyArray;

        /**
         * Histogram positiveCounts.
         * @member {Array.<number>} positiveCounts
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.positiveCounts = $util.emptyArray;

        /**
         * Histogram resetHint.
         * @member {cortexpb.Histogram.ResetHint} resetHint
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.resetHint = 0;

        /**
         * Histogram timestamp.
         * @member {number|Long} timestamp
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Histogram customValues.
         * @member {Array.<number>} customValues
         * @memberof cortexpb.Histogram
         * @instance
         */
        Histogram.prototype.customValues = $util.emptyArray;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * Histogram count.
         * @member {"countInt"|"countFloat"|undefined} count
         * @memberof cortexpb.Histogram
         * @instance
         */
        Object.defineProperty(Histogram.prototype, "count", {
            get: $util.oneOfGetter($oneOfFields = ["countInt", "countFloat"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Histogram zeroCount.
         * @member {"zeroCountInt"|"zeroCountFloat"|undefined} zeroCount
         * @memberof cortexpb.Histogram
         * @instance
         */
        Object.defineProperty(Histogram.prototype, "zeroCount", {
            get: $util.oneOfGetter($oneOfFields = ["zeroCountInt", "zeroCountFloat"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Histogram instance using the specified properties.
         * @function create
         * @memberof cortexpb.Histogram
         * @static
         * @param {cortexpb.IHistogram=} [properties] Properties to set
         * @returns {cortexpb.Histogram} Histogram instance
         */
        Histogram.create = function create(properties) {
            return new Histogram(properties);
        };

        /**
         * Encodes the specified Histogram message. Does not implicitly {@link cortexpb.Histogram.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.Histogram
         * @static
         * @param {cortexpb.IHistogram} message Histogram message or plain object to encode
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
                    $root.cortexpb.BucketSpan.encode(message.negativeSpans[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
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
                    $root.cortexpb.BucketSpan.encode(message.positiveSpans[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
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
            return writer;
        };

        /**
         * Encodes the specified Histogram message, length delimited. Does not implicitly {@link cortexpb.Histogram.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.Histogram
         * @static
         * @param {cortexpb.IHistogram} message Histogram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Histogram.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Histogram message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.Histogram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.Histogram} Histogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Histogram.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.Histogram();
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
                        message.negativeSpans.push($root.cortexpb.BucketSpan.decode(reader, reader.uint32()));
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
                        message.positiveSpans.push($root.cortexpb.BucketSpan.decode(reader, reader.uint32()));
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
         * @memberof cortexpb.Histogram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.Histogram} Histogram
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
         * @memberof cortexpb.Histogram
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
                    var error = $root.cortexpb.BucketSpan.verify(message.negativeSpans[i]);
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
                    var error = $root.cortexpb.BucketSpan.verify(message.positiveSpans[i]);
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
            return null;
        };

        /**
         * Creates a Histogram message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.Histogram
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.Histogram} Histogram
         */
        Histogram.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.Histogram)
                return object;
            var message = new $root.cortexpb.Histogram();
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
                    throw TypeError(".cortexpb.Histogram.negativeSpans: array expected");
                message.negativeSpans = [];
                for (var i = 0; i < object.negativeSpans.length; ++i) {
                    if (typeof object.negativeSpans[i] !== "object")
                        throw TypeError(".cortexpb.Histogram.negativeSpans: object expected");
                    message.negativeSpans[i] = $root.cortexpb.BucketSpan.fromObject(object.negativeSpans[i]);
                }
            }
            if (object.negativeDeltas) {
                if (!Array.isArray(object.negativeDeltas))
                    throw TypeError(".cortexpb.Histogram.negativeDeltas: array expected");
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
                    throw TypeError(".cortexpb.Histogram.negativeCounts: array expected");
                message.negativeCounts = [];
                for (var i = 0; i < object.negativeCounts.length; ++i)
                    message.negativeCounts[i] = Number(object.negativeCounts[i]);
            }
            if (object.positiveSpans) {
                if (!Array.isArray(object.positiveSpans))
                    throw TypeError(".cortexpb.Histogram.positiveSpans: array expected");
                message.positiveSpans = [];
                for (var i = 0; i < object.positiveSpans.length; ++i) {
                    if (typeof object.positiveSpans[i] !== "object")
                        throw TypeError(".cortexpb.Histogram.positiveSpans: object expected");
                    message.positiveSpans[i] = $root.cortexpb.BucketSpan.fromObject(object.positiveSpans[i]);
                }
            }
            if (object.positiveDeltas) {
                if (!Array.isArray(object.positiveDeltas))
                    throw TypeError(".cortexpb.Histogram.positiveDeltas: array expected");
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
                    throw TypeError(".cortexpb.Histogram.positiveCounts: array expected");
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
            case "UNKNOWN":
            case 0:
                message.resetHint = 0;
                break;
            case "YES":
            case 1:
                message.resetHint = 1;
                break;
            case "NO":
            case 2:
                message.resetHint = 2;
                break;
            case "GAUGE":
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
                    throw TypeError(".cortexpb.Histogram.customValues: array expected");
                message.customValues = [];
                for (var i = 0; i < object.customValues.length; ++i)
                    message.customValues[i] = Number(object.customValues[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a Histogram message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.Histogram
         * @static
         * @param {cortexpb.Histogram} message Histogram
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
                object.resetHint = options.enums === String ? "UNKNOWN" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
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
                    object.negativeSpans[j] = $root.cortexpb.BucketSpan.toObject(message.negativeSpans[j], options);
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
                    object.positiveSpans[j] = $root.cortexpb.BucketSpan.toObject(message.positiveSpans[j], options);
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
                object.resetHint = options.enums === String ? $root.cortexpb.Histogram.ResetHint[message.resetHint] === undefined ? message.resetHint : $root.cortexpb.Histogram.ResetHint[message.resetHint] : message.resetHint;
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
            return object;
        };

        /**
         * Converts this Histogram to JSON.
         * @function toJSON
         * @memberof cortexpb.Histogram
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Histogram.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Histogram
         * @function getTypeUrl
         * @memberof cortexpb.Histogram
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Histogram.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.Histogram";
        };

        /**
         * ResetHint enum.
         * @name cortexpb.Histogram.ResetHint
         * @enum {number}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} YES=1 YES value
         * @property {number} NO=2 NO value
         * @property {number} GAUGE=3 GAUGE value
         */
        Histogram.ResetHint = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "YES"] = 1;
            values[valuesById[2] = "NO"] = 2;
            values[valuesById[3] = "GAUGE"] = 3;
            return values;
        })();

        return Histogram;
    })();

    cortexpb.FloatHistogram = (function() {

        /**
         * Properties of a FloatHistogram.
         * @memberof cortexpb
         * @interface IFloatHistogram
         * @property {number|null} [counterResetHint] FloatHistogram counterResetHint
         * @property {number|null} [schema] FloatHistogram schema
         * @property {number|null} [zeroThreshold] FloatHistogram zeroThreshold
         * @property {number|null} [zeroCount] FloatHistogram zeroCount
         * @property {number|null} [count] FloatHistogram count
         * @property {number|null} [sum] FloatHistogram sum
         * @property {Array.<cortexpb.IBucketSpan>|null} [positiveSpans] FloatHistogram positiveSpans
         * @property {Array.<cortexpb.IBucketSpan>|null} [negativeSpans] FloatHistogram negativeSpans
         * @property {Array.<number>|null} [positiveBuckets] FloatHistogram positiveBuckets
         * @property {Array.<number>|null} [negativeBuckets] FloatHistogram negativeBuckets
         * @property {Array.<number>|null} [customValues] FloatHistogram customValues
         */

        /**
         * Constructs a new FloatHistogram.
         * @memberof cortexpb
         * @classdesc Represents a FloatHistogram.
         * @implements IFloatHistogram
         * @constructor
         * @param {cortexpb.IFloatHistogram=} [properties] Properties to set
         */
        function FloatHistogram(properties) {
            this.positiveSpans = [];
            this.negativeSpans = [];
            this.positiveBuckets = [];
            this.negativeBuckets = [];
            this.customValues = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FloatHistogram counterResetHint.
         * @member {number} counterResetHint
         * @memberof cortexpb.FloatHistogram
         * @instance
         */
        FloatHistogram.prototype.counterResetHint = 0;

        /**
         * FloatHistogram schema.
         * @member {number} schema
         * @memberof cortexpb.FloatHistogram
         * @instance
         */
        FloatHistogram.prototype.schema = 0;

        /**
         * FloatHistogram zeroThreshold.
         * @member {number} zeroThreshold
         * @memberof cortexpb.FloatHistogram
         * @instance
         */
        FloatHistogram.prototype.zeroThreshold = 0;

        /**
         * FloatHistogram zeroCount.
         * @member {number} zeroCount
         * @memberof cortexpb.FloatHistogram
         * @instance
         */
        FloatHistogram.prototype.zeroCount = 0;

        /**
         * FloatHistogram count.
         * @member {number} count
         * @memberof cortexpb.FloatHistogram
         * @instance
         */
        FloatHistogram.prototype.count = 0;

        /**
         * FloatHistogram sum.
         * @member {number} sum
         * @memberof cortexpb.FloatHistogram
         * @instance
         */
        FloatHistogram.prototype.sum = 0;

        /**
         * FloatHistogram positiveSpans.
         * @member {Array.<cortexpb.IBucketSpan>} positiveSpans
         * @memberof cortexpb.FloatHistogram
         * @instance
         */
        FloatHistogram.prototype.positiveSpans = $util.emptyArray;

        /**
         * FloatHistogram negativeSpans.
         * @member {Array.<cortexpb.IBucketSpan>} negativeSpans
         * @memberof cortexpb.FloatHistogram
         * @instance
         */
        FloatHistogram.prototype.negativeSpans = $util.emptyArray;

        /**
         * FloatHistogram positiveBuckets.
         * @member {Array.<number>} positiveBuckets
         * @memberof cortexpb.FloatHistogram
         * @instance
         */
        FloatHistogram.prototype.positiveBuckets = $util.emptyArray;

        /**
         * FloatHistogram negativeBuckets.
         * @member {Array.<number>} negativeBuckets
         * @memberof cortexpb.FloatHistogram
         * @instance
         */
        FloatHistogram.prototype.negativeBuckets = $util.emptyArray;

        /**
         * FloatHistogram customValues.
         * @member {Array.<number>} customValues
         * @memberof cortexpb.FloatHistogram
         * @instance
         */
        FloatHistogram.prototype.customValues = $util.emptyArray;

        /**
         * Creates a new FloatHistogram instance using the specified properties.
         * @function create
         * @memberof cortexpb.FloatHistogram
         * @static
         * @param {cortexpb.IFloatHistogram=} [properties] Properties to set
         * @returns {cortexpb.FloatHistogram} FloatHistogram instance
         */
        FloatHistogram.create = function create(properties) {
            return new FloatHistogram(properties);
        };

        /**
         * Encodes the specified FloatHistogram message. Does not implicitly {@link cortexpb.FloatHistogram.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.FloatHistogram
         * @static
         * @param {cortexpb.IFloatHistogram} message FloatHistogram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FloatHistogram.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.count);
            if (message.sum != null && Object.hasOwnProperty.call(message, "sum"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.sum);
            if (message.schema != null && Object.hasOwnProperty.call(message, "schema"))
                writer.uint32(/* id 4, wireType 0 =*/32).sint32(message.schema);
            if (message.zeroThreshold != null && Object.hasOwnProperty.call(message, "zeroThreshold"))
                writer.uint32(/* id 5, wireType 1 =*/41).double(message.zeroThreshold);
            if (message.zeroCount != null && Object.hasOwnProperty.call(message, "zeroCount"))
                writer.uint32(/* id 7, wireType 1 =*/57).double(message.zeroCount);
            if (message.negativeSpans != null && message.negativeSpans.length)
                for (var i = 0; i < message.negativeSpans.length; ++i)
                    $root.cortexpb.BucketSpan.encode(message.negativeSpans[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.negativeBuckets != null && message.negativeBuckets.length) {
                writer.uint32(/* id 10, wireType 2 =*/82).fork();
                for (var i = 0; i < message.negativeBuckets.length; ++i)
                    writer.double(message.negativeBuckets[i]);
                writer.ldelim();
            }
            if (message.positiveSpans != null && message.positiveSpans.length)
                for (var i = 0; i < message.positiveSpans.length; ++i)
                    $root.cortexpb.BucketSpan.encode(message.positiveSpans[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.positiveBuckets != null && message.positiveBuckets.length) {
                writer.uint32(/* id 13, wireType 2 =*/106).fork();
                for (var i = 0; i < message.positiveBuckets.length; ++i)
                    writer.double(message.positiveBuckets[i]);
                writer.ldelim();
            }
            if (message.counterResetHint != null && Object.hasOwnProperty.call(message, "counterResetHint"))
                writer.uint32(/* id 14, wireType 0 =*/112).uint32(message.counterResetHint);
            if (message.customValues != null && message.customValues.length) {
                writer.uint32(/* id 16, wireType 2 =*/130).fork();
                for (var i = 0; i < message.customValues.length; ++i)
                    writer.double(message.customValues[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified FloatHistogram message, length delimited. Does not implicitly {@link cortexpb.FloatHistogram.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.FloatHistogram
         * @static
         * @param {cortexpb.IFloatHistogram} message FloatHistogram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FloatHistogram.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FloatHistogram message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.FloatHistogram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.FloatHistogram} FloatHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FloatHistogram.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.FloatHistogram();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 14: {
                        message.counterResetHint = reader.uint32();
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
                case 7: {
                        message.zeroCount = reader.double();
                        break;
                    }
                case 2: {
                        message.count = reader.double();
                        break;
                    }
                case 3: {
                        message.sum = reader.double();
                        break;
                    }
                case 11: {
                        if (!(message.positiveSpans && message.positiveSpans.length))
                            message.positiveSpans = [];
                        message.positiveSpans.push($root.cortexpb.BucketSpan.decode(reader, reader.uint32()));
                        break;
                    }
                case 8: {
                        if (!(message.negativeSpans && message.negativeSpans.length))
                            message.negativeSpans = [];
                        message.negativeSpans.push($root.cortexpb.BucketSpan.decode(reader, reader.uint32()));
                        break;
                    }
                case 13: {
                        if (!(message.positiveBuckets && message.positiveBuckets.length))
                            message.positiveBuckets = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.positiveBuckets.push(reader.double());
                        } else
                            message.positiveBuckets.push(reader.double());
                        break;
                    }
                case 10: {
                        if (!(message.negativeBuckets && message.negativeBuckets.length))
                            message.negativeBuckets = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.negativeBuckets.push(reader.double());
                        } else
                            message.negativeBuckets.push(reader.double());
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
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FloatHistogram message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.FloatHistogram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.FloatHistogram} FloatHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FloatHistogram.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FloatHistogram message.
         * @function verify
         * @memberof cortexpb.FloatHistogram
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FloatHistogram.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.counterResetHint != null && message.hasOwnProperty("counterResetHint"))
                if (!$util.isInteger(message.counterResetHint))
                    return "counterResetHint: integer expected";
            if (message.schema != null && message.hasOwnProperty("schema"))
                if (!$util.isInteger(message.schema))
                    return "schema: integer expected";
            if (message.zeroThreshold != null && message.hasOwnProperty("zeroThreshold"))
                if (typeof message.zeroThreshold !== "number")
                    return "zeroThreshold: number expected";
            if (message.zeroCount != null && message.hasOwnProperty("zeroCount"))
                if (typeof message.zeroCount !== "number")
                    return "zeroCount: number expected";
            if (message.count != null && message.hasOwnProperty("count"))
                if (typeof message.count !== "number")
                    return "count: number expected";
            if (message.sum != null && message.hasOwnProperty("sum"))
                if (typeof message.sum !== "number")
                    return "sum: number expected";
            if (message.positiveSpans != null && message.hasOwnProperty("positiveSpans")) {
                if (!Array.isArray(message.positiveSpans))
                    return "positiveSpans: array expected";
                for (var i = 0; i < message.positiveSpans.length; ++i) {
                    var error = $root.cortexpb.BucketSpan.verify(message.positiveSpans[i]);
                    if (error)
                        return "positiveSpans." + error;
                }
            }
            if (message.negativeSpans != null && message.hasOwnProperty("negativeSpans")) {
                if (!Array.isArray(message.negativeSpans))
                    return "negativeSpans: array expected";
                for (var i = 0; i < message.negativeSpans.length; ++i) {
                    var error = $root.cortexpb.BucketSpan.verify(message.negativeSpans[i]);
                    if (error)
                        return "negativeSpans." + error;
                }
            }
            if (message.positiveBuckets != null && message.hasOwnProperty("positiveBuckets")) {
                if (!Array.isArray(message.positiveBuckets))
                    return "positiveBuckets: array expected";
                for (var i = 0; i < message.positiveBuckets.length; ++i)
                    if (typeof message.positiveBuckets[i] !== "number")
                        return "positiveBuckets: number[] expected";
            }
            if (message.negativeBuckets != null && message.hasOwnProperty("negativeBuckets")) {
                if (!Array.isArray(message.negativeBuckets))
                    return "negativeBuckets: array expected";
                for (var i = 0; i < message.negativeBuckets.length; ++i)
                    if (typeof message.negativeBuckets[i] !== "number")
                        return "negativeBuckets: number[] expected";
            }
            if (message.customValues != null && message.hasOwnProperty("customValues")) {
                if (!Array.isArray(message.customValues))
                    return "customValues: array expected";
                for (var i = 0; i < message.customValues.length; ++i)
                    if (typeof message.customValues[i] !== "number")
                        return "customValues: number[] expected";
            }
            return null;
        };

        /**
         * Creates a FloatHistogram message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.FloatHistogram
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.FloatHistogram} FloatHistogram
         */
        FloatHistogram.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.FloatHistogram)
                return object;
            var message = new $root.cortexpb.FloatHistogram();
            if (object.counterResetHint != null)
                message.counterResetHint = object.counterResetHint >>> 0;
            if (object.schema != null)
                message.schema = object.schema | 0;
            if (object.zeroThreshold != null)
                message.zeroThreshold = Number(object.zeroThreshold);
            if (object.zeroCount != null)
                message.zeroCount = Number(object.zeroCount);
            if (object.count != null)
                message.count = Number(object.count);
            if (object.sum != null)
                message.sum = Number(object.sum);
            if (object.positiveSpans) {
                if (!Array.isArray(object.positiveSpans))
                    throw TypeError(".cortexpb.FloatHistogram.positiveSpans: array expected");
                message.positiveSpans = [];
                for (var i = 0; i < object.positiveSpans.length; ++i) {
                    if (typeof object.positiveSpans[i] !== "object")
                        throw TypeError(".cortexpb.FloatHistogram.positiveSpans: object expected");
                    message.positiveSpans[i] = $root.cortexpb.BucketSpan.fromObject(object.positiveSpans[i]);
                }
            }
            if (object.negativeSpans) {
                if (!Array.isArray(object.negativeSpans))
                    throw TypeError(".cortexpb.FloatHistogram.negativeSpans: array expected");
                message.negativeSpans = [];
                for (var i = 0; i < object.negativeSpans.length; ++i) {
                    if (typeof object.negativeSpans[i] !== "object")
                        throw TypeError(".cortexpb.FloatHistogram.negativeSpans: object expected");
                    message.negativeSpans[i] = $root.cortexpb.BucketSpan.fromObject(object.negativeSpans[i]);
                }
            }
            if (object.positiveBuckets) {
                if (!Array.isArray(object.positiveBuckets))
                    throw TypeError(".cortexpb.FloatHistogram.positiveBuckets: array expected");
                message.positiveBuckets = [];
                for (var i = 0; i < object.positiveBuckets.length; ++i)
                    message.positiveBuckets[i] = Number(object.positiveBuckets[i]);
            }
            if (object.negativeBuckets) {
                if (!Array.isArray(object.negativeBuckets))
                    throw TypeError(".cortexpb.FloatHistogram.negativeBuckets: array expected");
                message.negativeBuckets = [];
                for (var i = 0; i < object.negativeBuckets.length; ++i)
                    message.negativeBuckets[i] = Number(object.negativeBuckets[i]);
            }
            if (object.customValues) {
                if (!Array.isArray(object.customValues))
                    throw TypeError(".cortexpb.FloatHistogram.customValues: array expected");
                message.customValues = [];
                for (var i = 0; i < object.customValues.length; ++i)
                    message.customValues[i] = Number(object.customValues[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a FloatHistogram message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.FloatHistogram
         * @static
         * @param {cortexpb.FloatHistogram} message FloatHistogram
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FloatHistogram.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.negativeSpans = [];
                object.negativeBuckets = [];
                object.positiveSpans = [];
                object.positiveBuckets = [];
                object.customValues = [];
            }
            if (options.defaults) {
                object.count = 0;
                object.sum = 0;
                object.schema = 0;
                object.zeroThreshold = 0;
                object.zeroCount = 0;
                object.counterResetHint = 0;
            }
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = options.json && !isFinite(message.count) ? String(message.count) : message.count;
            if (message.sum != null && message.hasOwnProperty("sum"))
                object.sum = options.json && !isFinite(message.sum) ? String(message.sum) : message.sum;
            if (message.schema != null && message.hasOwnProperty("schema"))
                object.schema = message.schema;
            if (message.zeroThreshold != null && message.hasOwnProperty("zeroThreshold"))
                object.zeroThreshold = options.json && !isFinite(message.zeroThreshold) ? String(message.zeroThreshold) : message.zeroThreshold;
            if (message.zeroCount != null && message.hasOwnProperty("zeroCount"))
                object.zeroCount = options.json && !isFinite(message.zeroCount) ? String(message.zeroCount) : message.zeroCount;
            if (message.negativeSpans && message.negativeSpans.length) {
                object.negativeSpans = [];
                for (var j = 0; j < message.negativeSpans.length; ++j)
                    object.negativeSpans[j] = $root.cortexpb.BucketSpan.toObject(message.negativeSpans[j], options);
            }
            if (message.negativeBuckets && message.negativeBuckets.length) {
                object.negativeBuckets = [];
                for (var j = 0; j < message.negativeBuckets.length; ++j)
                    object.negativeBuckets[j] = options.json && !isFinite(message.negativeBuckets[j]) ? String(message.negativeBuckets[j]) : message.negativeBuckets[j];
            }
            if (message.positiveSpans && message.positiveSpans.length) {
                object.positiveSpans = [];
                for (var j = 0; j < message.positiveSpans.length; ++j)
                    object.positiveSpans[j] = $root.cortexpb.BucketSpan.toObject(message.positiveSpans[j], options);
            }
            if (message.positiveBuckets && message.positiveBuckets.length) {
                object.positiveBuckets = [];
                for (var j = 0; j < message.positiveBuckets.length; ++j)
                    object.positiveBuckets[j] = options.json && !isFinite(message.positiveBuckets[j]) ? String(message.positiveBuckets[j]) : message.positiveBuckets[j];
            }
            if (message.counterResetHint != null && message.hasOwnProperty("counterResetHint"))
                object.counterResetHint = message.counterResetHint;
            if (message.customValues && message.customValues.length) {
                object.customValues = [];
                for (var j = 0; j < message.customValues.length; ++j)
                    object.customValues[j] = options.json && !isFinite(message.customValues[j]) ? String(message.customValues[j]) : message.customValues[j];
            }
            return object;
        };

        /**
         * Converts this FloatHistogram to JSON.
         * @function toJSON
         * @memberof cortexpb.FloatHistogram
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FloatHistogram.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FloatHistogram
         * @function getTypeUrl
         * @memberof cortexpb.FloatHistogram
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FloatHistogram.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.FloatHistogram";
        };

        return FloatHistogram;
    })();

    cortexpb.BucketSpan = (function() {

        /**
         * Properties of a BucketSpan.
         * @memberof cortexpb
         * @interface IBucketSpan
         * @property {number|null} [offset] BucketSpan offset
         * @property {number|null} [length] BucketSpan length
         */

        /**
         * Constructs a new BucketSpan.
         * @memberof cortexpb
         * @classdesc Represents a BucketSpan.
         * @implements IBucketSpan
         * @constructor
         * @param {cortexpb.IBucketSpan=} [properties] Properties to set
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
         * @memberof cortexpb.BucketSpan
         * @instance
         */
        BucketSpan.prototype.offset = 0;

        /**
         * BucketSpan length.
         * @member {number} length
         * @memberof cortexpb.BucketSpan
         * @instance
         */
        BucketSpan.prototype.length = 0;

        /**
         * Creates a new BucketSpan instance using the specified properties.
         * @function create
         * @memberof cortexpb.BucketSpan
         * @static
         * @param {cortexpb.IBucketSpan=} [properties] Properties to set
         * @returns {cortexpb.BucketSpan} BucketSpan instance
         */
        BucketSpan.create = function create(properties) {
            return new BucketSpan(properties);
        };

        /**
         * Encodes the specified BucketSpan message. Does not implicitly {@link cortexpb.BucketSpan.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.BucketSpan
         * @static
         * @param {cortexpb.IBucketSpan} message BucketSpan message or plain object to encode
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
         * Encodes the specified BucketSpan message, length delimited. Does not implicitly {@link cortexpb.BucketSpan.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.BucketSpan
         * @static
         * @param {cortexpb.IBucketSpan} message BucketSpan message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BucketSpan.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BucketSpan message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.BucketSpan
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.BucketSpan} BucketSpan
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BucketSpan.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.BucketSpan();
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
         * @memberof cortexpb.BucketSpan
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.BucketSpan} BucketSpan
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
         * @memberof cortexpb.BucketSpan
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
         * @memberof cortexpb.BucketSpan
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.BucketSpan} BucketSpan
         */
        BucketSpan.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.BucketSpan)
                return object;
            var message = new $root.cortexpb.BucketSpan();
            if (object.offset != null)
                message.offset = object.offset | 0;
            if (object.length != null)
                message.length = object.length >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a BucketSpan message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.BucketSpan
         * @static
         * @param {cortexpb.BucketSpan} message BucketSpan
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
         * @memberof cortexpb.BucketSpan
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BucketSpan.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BucketSpan
         * @function getTypeUrl
         * @memberof cortexpb.BucketSpan
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BucketSpan.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.BucketSpan";
        };

        return BucketSpan;
    })();

    cortexpb.FloatHistogramPair = (function() {

        /**
         * Properties of a FloatHistogramPair.
         * @memberof cortexpb
         * @interface IFloatHistogramPair
         * @property {number|Long|null} [timestampMs] FloatHistogramPair timestampMs
         * @property {cortexpb.IFloatHistogram|null} [histogram] FloatHistogramPair histogram
         */

        /**
         * Constructs a new FloatHistogramPair.
         * @memberof cortexpb
         * @classdesc Represents a FloatHistogramPair.
         * @implements IFloatHistogramPair
         * @constructor
         * @param {cortexpb.IFloatHistogramPair=} [properties] Properties to set
         */
        function FloatHistogramPair(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FloatHistogramPair timestampMs.
         * @member {number|Long} timestampMs
         * @memberof cortexpb.FloatHistogramPair
         * @instance
         */
        FloatHistogramPair.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * FloatHistogramPair histogram.
         * @member {cortexpb.IFloatHistogram|null|undefined} histogram
         * @memberof cortexpb.FloatHistogramPair
         * @instance
         */
        FloatHistogramPair.prototype.histogram = null;

        /**
         * Creates a new FloatHistogramPair instance using the specified properties.
         * @function create
         * @memberof cortexpb.FloatHistogramPair
         * @static
         * @param {cortexpb.IFloatHistogramPair=} [properties] Properties to set
         * @returns {cortexpb.FloatHistogramPair} FloatHistogramPair instance
         */
        FloatHistogramPair.create = function create(properties) {
            return new FloatHistogramPair(properties);
        };

        /**
         * Encodes the specified FloatHistogramPair message. Does not implicitly {@link cortexpb.FloatHistogramPair.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.FloatHistogramPair
         * @static
         * @param {cortexpb.IFloatHistogramPair} message FloatHistogramPair message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FloatHistogramPair.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.histogram != null && Object.hasOwnProperty.call(message, "histogram"))
                $root.cortexpb.FloatHistogram.encode(message.histogram, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestampMs);
            return writer;
        };

        /**
         * Encodes the specified FloatHistogramPair message, length delimited. Does not implicitly {@link cortexpb.FloatHistogramPair.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.FloatHistogramPair
         * @static
         * @param {cortexpb.IFloatHistogramPair} message FloatHistogramPair message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FloatHistogramPair.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FloatHistogramPair message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.FloatHistogramPair
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.FloatHistogramPair} FloatHistogramPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FloatHistogramPair.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.FloatHistogramPair();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 2: {
                        message.timestampMs = reader.int64();
                        break;
                    }
                case 1: {
                        message.histogram = $root.cortexpb.FloatHistogram.decode(reader, reader.uint32());
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
         * Decodes a FloatHistogramPair message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.FloatHistogramPair
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.FloatHistogramPair} FloatHistogramPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FloatHistogramPair.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FloatHistogramPair message.
         * @function verify
         * @memberof cortexpb.FloatHistogramPair
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FloatHistogramPair.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (!$util.isInteger(message.timestampMs) && !(message.timestampMs && $util.isInteger(message.timestampMs.low) && $util.isInteger(message.timestampMs.high)))
                    return "timestampMs: integer|Long expected";
            if (message.histogram != null && message.hasOwnProperty("histogram")) {
                var error = $root.cortexpb.FloatHistogram.verify(message.histogram);
                if (error)
                    return "histogram." + error;
            }
            return null;
        };

        /**
         * Creates a FloatHistogramPair message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.FloatHistogramPair
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.FloatHistogramPair} FloatHistogramPair
         */
        FloatHistogramPair.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.FloatHistogramPair)
                return object;
            var message = new $root.cortexpb.FloatHistogramPair();
            if (object.timestampMs != null)
                if ($util.Long)
                    (message.timestampMs = $util.Long.fromValue(object.timestampMs)).unsigned = false;
                else if (typeof object.timestampMs === "string")
                    message.timestampMs = parseInt(object.timestampMs, 10);
                else if (typeof object.timestampMs === "number")
                    message.timestampMs = object.timestampMs;
                else if (typeof object.timestampMs === "object")
                    message.timestampMs = new $util.LongBits(object.timestampMs.low >>> 0, object.timestampMs.high >>> 0).toNumber();
            if (object.histogram != null) {
                if (typeof object.histogram !== "object")
                    throw TypeError(".cortexpb.FloatHistogramPair.histogram: object expected");
                message.histogram = $root.cortexpb.FloatHistogram.fromObject(object.histogram);
            }
            return message;
        };

        /**
         * Creates a plain object from a FloatHistogramPair message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.FloatHistogramPair
         * @static
         * @param {cortexpb.FloatHistogramPair} message FloatHistogramPair
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FloatHistogramPair.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.histogram = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampMs = options.longs === String ? "0" : 0;
            }
            if (message.histogram != null && message.hasOwnProperty("histogram"))
                object.histogram = $root.cortexpb.FloatHistogram.toObject(message.histogram, options);
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (typeof message.timestampMs === "number")
                    object.timestampMs = options.longs === String ? String(message.timestampMs) : message.timestampMs;
                else
                    object.timestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.timestampMs) : options.longs === Number ? new $util.LongBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0).toNumber() : message.timestampMs;
            return object;
        };

        /**
         * Converts this FloatHistogramPair to JSON.
         * @function toJSON
         * @memberof cortexpb.FloatHistogramPair
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FloatHistogramPair.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FloatHistogramPair
         * @function getTypeUrl
         * @memberof cortexpb.FloatHistogramPair
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FloatHistogramPair.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.FloatHistogramPair";
        };

        return FloatHistogramPair;
    })();

    cortexpb.SampleHistogram = (function() {

        /**
         * Properties of a SampleHistogram.
         * @memberof cortexpb
         * @interface ISampleHistogram
         * @property {number|null} [count] SampleHistogram count
         * @property {number|null} [sum] SampleHistogram sum
         * @property {Array.<cortexpb.IHistogramBucket>|null} [buckets] SampleHistogram buckets
         */

        /**
         * Constructs a new SampleHistogram.
         * @memberof cortexpb
         * @classdesc Represents a SampleHistogram.
         * @implements ISampleHistogram
         * @constructor
         * @param {cortexpb.ISampleHistogram=} [properties] Properties to set
         */
        function SampleHistogram(properties) {
            this.buckets = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SampleHistogram count.
         * @member {number} count
         * @memberof cortexpb.SampleHistogram
         * @instance
         */
        SampleHistogram.prototype.count = 0;

        /**
         * SampleHistogram sum.
         * @member {number} sum
         * @memberof cortexpb.SampleHistogram
         * @instance
         */
        SampleHistogram.prototype.sum = 0;

        /**
         * SampleHistogram buckets.
         * @member {Array.<cortexpb.IHistogramBucket>} buckets
         * @memberof cortexpb.SampleHistogram
         * @instance
         */
        SampleHistogram.prototype.buckets = $util.emptyArray;

        /**
         * Creates a new SampleHistogram instance using the specified properties.
         * @function create
         * @memberof cortexpb.SampleHistogram
         * @static
         * @param {cortexpb.ISampleHistogram=} [properties] Properties to set
         * @returns {cortexpb.SampleHistogram} SampleHistogram instance
         */
        SampleHistogram.create = function create(properties) {
            return new SampleHistogram(properties);
        };

        /**
         * Encodes the specified SampleHistogram message. Does not implicitly {@link cortexpb.SampleHistogram.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.SampleHistogram
         * @static
         * @param {cortexpb.ISampleHistogram} message SampleHistogram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SampleHistogram.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.count);
            if (message.sum != null && Object.hasOwnProperty.call(message, "sum"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.sum);
            if (message.buckets != null && message.buckets.length)
                for (var i = 0; i < message.buckets.length; ++i)
                    $root.cortexpb.HistogramBucket.encode(message.buckets[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SampleHistogram message, length delimited. Does not implicitly {@link cortexpb.SampleHistogram.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.SampleHistogram
         * @static
         * @param {cortexpb.ISampleHistogram} message SampleHistogram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SampleHistogram.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SampleHistogram message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.SampleHistogram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.SampleHistogram} SampleHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SampleHistogram.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.SampleHistogram();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.count = reader.double();
                        break;
                    }
                case 2: {
                        message.sum = reader.double();
                        break;
                    }
                case 3: {
                        if (!(message.buckets && message.buckets.length))
                            message.buckets = [];
                        message.buckets.push($root.cortexpb.HistogramBucket.decode(reader, reader.uint32()));
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
         * Decodes a SampleHistogram message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.SampleHistogram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.SampleHistogram} SampleHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SampleHistogram.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SampleHistogram message.
         * @function verify
         * @memberof cortexpb.SampleHistogram
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SampleHistogram.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.count != null && message.hasOwnProperty("count"))
                if (typeof message.count !== "number")
                    return "count: number expected";
            if (message.sum != null && message.hasOwnProperty("sum"))
                if (typeof message.sum !== "number")
                    return "sum: number expected";
            if (message.buckets != null && message.hasOwnProperty("buckets")) {
                if (!Array.isArray(message.buckets))
                    return "buckets: array expected";
                for (var i = 0; i < message.buckets.length; ++i) {
                    var error = $root.cortexpb.HistogramBucket.verify(message.buckets[i]);
                    if (error)
                        return "buckets." + error;
                }
            }
            return null;
        };

        /**
         * Creates a SampleHistogram message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.SampleHistogram
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.SampleHistogram} SampleHistogram
         */
        SampleHistogram.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.SampleHistogram)
                return object;
            var message = new $root.cortexpb.SampleHistogram();
            if (object.count != null)
                message.count = Number(object.count);
            if (object.sum != null)
                message.sum = Number(object.sum);
            if (object.buckets) {
                if (!Array.isArray(object.buckets))
                    throw TypeError(".cortexpb.SampleHistogram.buckets: array expected");
                message.buckets = [];
                for (var i = 0; i < object.buckets.length; ++i) {
                    if (typeof object.buckets[i] !== "object")
                        throw TypeError(".cortexpb.SampleHistogram.buckets: object expected");
                    message.buckets[i] = $root.cortexpb.HistogramBucket.fromObject(object.buckets[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a SampleHistogram message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.SampleHistogram
         * @static
         * @param {cortexpb.SampleHistogram} message SampleHistogram
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SampleHistogram.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.buckets = [];
            if (options.defaults) {
                object.count = 0;
                object.sum = 0;
            }
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = options.json && !isFinite(message.count) ? String(message.count) : message.count;
            if (message.sum != null && message.hasOwnProperty("sum"))
                object.sum = options.json && !isFinite(message.sum) ? String(message.sum) : message.sum;
            if (message.buckets && message.buckets.length) {
                object.buckets = [];
                for (var j = 0; j < message.buckets.length; ++j)
                    object.buckets[j] = $root.cortexpb.HistogramBucket.toObject(message.buckets[j], options);
            }
            return object;
        };

        /**
         * Converts this SampleHistogram to JSON.
         * @function toJSON
         * @memberof cortexpb.SampleHistogram
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SampleHistogram.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SampleHistogram
         * @function getTypeUrl
         * @memberof cortexpb.SampleHistogram
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SampleHistogram.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.SampleHistogram";
        };

        return SampleHistogram;
    })();

    cortexpb.HistogramBucket = (function() {

        /**
         * Properties of a HistogramBucket.
         * @memberof cortexpb
         * @interface IHistogramBucket
         * @property {number|null} [boundaries] HistogramBucket boundaries
         * @property {number|null} [lower] HistogramBucket lower
         * @property {number|null} [upper] HistogramBucket upper
         * @property {number|null} [count] HistogramBucket count
         */

        /**
         * Constructs a new HistogramBucket.
         * @memberof cortexpb
         * @classdesc Represents a HistogramBucket.
         * @implements IHistogramBucket
         * @constructor
         * @param {cortexpb.IHistogramBucket=} [properties] Properties to set
         */
        function HistogramBucket(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HistogramBucket boundaries.
         * @member {number} boundaries
         * @memberof cortexpb.HistogramBucket
         * @instance
         */
        HistogramBucket.prototype.boundaries = 0;

        /**
         * HistogramBucket lower.
         * @member {number} lower
         * @memberof cortexpb.HistogramBucket
         * @instance
         */
        HistogramBucket.prototype.lower = 0;

        /**
         * HistogramBucket upper.
         * @member {number} upper
         * @memberof cortexpb.HistogramBucket
         * @instance
         */
        HistogramBucket.prototype.upper = 0;

        /**
         * HistogramBucket count.
         * @member {number} count
         * @memberof cortexpb.HistogramBucket
         * @instance
         */
        HistogramBucket.prototype.count = 0;

        /**
         * Creates a new HistogramBucket instance using the specified properties.
         * @function create
         * @memberof cortexpb.HistogramBucket
         * @static
         * @param {cortexpb.IHistogramBucket=} [properties] Properties to set
         * @returns {cortexpb.HistogramBucket} HistogramBucket instance
         */
        HistogramBucket.create = function create(properties) {
            return new HistogramBucket(properties);
        };

        /**
         * Encodes the specified HistogramBucket message. Does not implicitly {@link cortexpb.HistogramBucket.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.HistogramBucket
         * @static
         * @param {cortexpb.IHistogramBucket} message HistogramBucket message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HistogramBucket.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.boundaries != null && Object.hasOwnProperty.call(message, "boundaries"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.boundaries);
            if (message.lower != null && Object.hasOwnProperty.call(message, "lower"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.lower);
            if (message.upper != null && Object.hasOwnProperty.call(message, "upper"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.upper);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.count);
            return writer;
        };

        /**
         * Encodes the specified HistogramBucket message, length delimited. Does not implicitly {@link cortexpb.HistogramBucket.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.HistogramBucket
         * @static
         * @param {cortexpb.IHistogramBucket} message HistogramBucket message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HistogramBucket.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HistogramBucket message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.HistogramBucket
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.HistogramBucket} HistogramBucket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HistogramBucket.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.HistogramBucket();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.boundaries = reader.int32();
                        break;
                    }
                case 2: {
                        message.lower = reader.double();
                        break;
                    }
                case 3: {
                        message.upper = reader.double();
                        break;
                    }
                case 4: {
                        message.count = reader.double();
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
         * Decodes a HistogramBucket message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.HistogramBucket
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.HistogramBucket} HistogramBucket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HistogramBucket.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HistogramBucket message.
         * @function verify
         * @memberof cortexpb.HistogramBucket
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HistogramBucket.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.boundaries != null && message.hasOwnProperty("boundaries"))
                if (!$util.isInteger(message.boundaries))
                    return "boundaries: integer expected";
            if (message.lower != null && message.hasOwnProperty("lower"))
                if (typeof message.lower !== "number")
                    return "lower: number expected";
            if (message.upper != null && message.hasOwnProperty("upper"))
                if (typeof message.upper !== "number")
                    return "upper: number expected";
            if (message.count != null && message.hasOwnProperty("count"))
                if (typeof message.count !== "number")
                    return "count: number expected";
            return null;
        };

        /**
         * Creates a HistogramBucket message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.HistogramBucket
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.HistogramBucket} HistogramBucket
         */
        HistogramBucket.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.HistogramBucket)
                return object;
            var message = new $root.cortexpb.HistogramBucket();
            if (object.boundaries != null)
                message.boundaries = object.boundaries | 0;
            if (object.lower != null)
                message.lower = Number(object.lower);
            if (object.upper != null)
                message.upper = Number(object.upper);
            if (object.count != null)
                message.count = Number(object.count);
            return message;
        };

        /**
         * Creates a plain object from a HistogramBucket message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.HistogramBucket
         * @static
         * @param {cortexpb.HistogramBucket} message HistogramBucket
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HistogramBucket.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.boundaries = 0;
                object.lower = 0;
                object.upper = 0;
                object.count = 0;
            }
            if (message.boundaries != null && message.hasOwnProperty("boundaries"))
                object.boundaries = message.boundaries;
            if (message.lower != null && message.hasOwnProperty("lower"))
                object.lower = options.json && !isFinite(message.lower) ? String(message.lower) : message.lower;
            if (message.upper != null && message.hasOwnProperty("upper"))
                object.upper = options.json && !isFinite(message.upper) ? String(message.upper) : message.upper;
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = options.json && !isFinite(message.count) ? String(message.count) : message.count;
            return object;
        };

        /**
         * Converts this HistogramBucket to JSON.
         * @function toJSON
         * @memberof cortexpb.HistogramBucket
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HistogramBucket.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HistogramBucket
         * @function getTypeUrl
         * @memberof cortexpb.HistogramBucket
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HistogramBucket.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.HistogramBucket";
        };

        return HistogramBucket;
    })();

    cortexpb.SampleHistogramPair = (function() {

        /**
         * Properties of a SampleHistogramPair.
         * @memberof cortexpb
         * @interface ISampleHistogramPair
         * @property {number|Long|null} [timestamp] SampleHistogramPair timestamp
         * @property {cortexpb.ISampleHistogram|null} [histogram] SampleHistogramPair histogram
         */

        /**
         * Constructs a new SampleHistogramPair.
         * @memberof cortexpb
         * @classdesc Represents a SampleHistogramPair.
         * @implements ISampleHistogramPair
         * @constructor
         * @param {cortexpb.ISampleHistogramPair=} [properties] Properties to set
         */
        function SampleHistogramPair(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SampleHistogramPair timestamp.
         * @member {number|Long} timestamp
         * @memberof cortexpb.SampleHistogramPair
         * @instance
         */
        SampleHistogramPair.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * SampleHistogramPair histogram.
         * @member {cortexpb.ISampleHistogram|null|undefined} histogram
         * @memberof cortexpb.SampleHistogramPair
         * @instance
         */
        SampleHistogramPair.prototype.histogram = null;

        /**
         * Creates a new SampleHistogramPair instance using the specified properties.
         * @function create
         * @memberof cortexpb.SampleHistogramPair
         * @static
         * @param {cortexpb.ISampleHistogramPair=} [properties] Properties to set
         * @returns {cortexpb.SampleHistogramPair} SampleHistogramPair instance
         */
        SampleHistogramPair.create = function create(properties) {
            return new SampleHistogramPair(properties);
        };

        /**
         * Encodes the specified SampleHistogramPair message. Does not implicitly {@link cortexpb.SampleHistogramPair.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.SampleHistogramPair
         * @static
         * @param {cortexpb.ISampleHistogramPair} message SampleHistogramPair message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SampleHistogramPair.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.histogram != null && Object.hasOwnProperty.call(message, "histogram"))
                $root.cortexpb.SampleHistogram.encode(message.histogram, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified SampleHistogramPair message, length delimited. Does not implicitly {@link cortexpb.SampleHistogramPair.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.SampleHistogramPair
         * @static
         * @param {cortexpb.ISampleHistogramPair} message SampleHistogramPair message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SampleHistogramPair.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SampleHistogramPair message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.SampleHistogramPair
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.SampleHistogramPair} SampleHistogramPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SampleHistogramPair.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.SampleHistogramPair();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 2: {
                        message.timestamp = reader.int64();
                        break;
                    }
                case 1: {
                        message.histogram = $root.cortexpb.SampleHistogram.decode(reader, reader.uint32());
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
         * Decodes a SampleHistogramPair message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.SampleHistogramPair
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.SampleHistogramPair} SampleHistogramPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SampleHistogramPair.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SampleHistogramPair message.
         * @function verify
         * @memberof cortexpb.SampleHistogramPair
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SampleHistogramPair.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.histogram != null && message.hasOwnProperty("histogram")) {
                var error = $root.cortexpb.SampleHistogram.verify(message.histogram);
                if (error)
                    return "histogram." + error;
            }
            return null;
        };

        /**
         * Creates a SampleHistogramPair message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.SampleHistogramPair
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.SampleHistogramPair} SampleHistogramPair
         */
        SampleHistogramPair.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.SampleHistogramPair)
                return object;
            var message = new $root.cortexpb.SampleHistogramPair();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.histogram != null) {
                if (typeof object.histogram !== "object")
                    throw TypeError(".cortexpb.SampleHistogramPair.histogram: object expected");
                message.histogram = $root.cortexpb.SampleHistogram.fromObject(object.histogram);
            }
            return message;
        };

        /**
         * Creates a plain object from a SampleHistogramPair message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.SampleHistogramPair
         * @static
         * @param {cortexpb.SampleHistogramPair} message SampleHistogramPair
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SampleHistogramPair.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.histogram = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            }
            if (message.histogram != null && message.hasOwnProperty("histogram"))
                object.histogram = $root.cortexpb.SampleHistogram.toObject(message.histogram, options);
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this SampleHistogramPair to JSON.
         * @function toJSON
         * @memberof cortexpb.SampleHistogramPair
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SampleHistogramPair.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SampleHistogramPair
         * @function getTypeUrl
         * @memberof cortexpb.SampleHistogramPair
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SampleHistogramPair.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.SampleHistogramPair";
        };

        return SampleHistogramPair;
    })();

    /**
     * QueryStatus enum.
     * @name cortexpb.QueryStatus
     * @enum {number}
     * @property {number} QUERY_STATUS_ERROR=0 QUERY_STATUS_ERROR value
     * @property {number} QUERY_STATUS_SUCCESS=1 QUERY_STATUS_SUCCESS value
     */
    cortexpb.QueryStatus = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "QUERY_STATUS_ERROR"] = 0;
        values[valuesById[1] = "QUERY_STATUS_SUCCESS"] = 1;
        return values;
    })();

    /**
     * QueryErrorType enum.
     * @name cortexpb.QueryErrorType
     * @enum {number}
     * @property {number} QUERY_ERROR_TYPE_NONE=0 QUERY_ERROR_TYPE_NONE value
     * @property {number} QUERY_ERROR_TYPE_TIMEOUT=1 QUERY_ERROR_TYPE_TIMEOUT value
     * @property {number} QUERY_ERROR_TYPE_CANCELED=2 QUERY_ERROR_TYPE_CANCELED value
     * @property {number} QUERY_ERROR_TYPE_EXECUTION=3 QUERY_ERROR_TYPE_EXECUTION value
     * @property {number} QUERY_ERROR_TYPE_BAD_DATA=4 QUERY_ERROR_TYPE_BAD_DATA value
     * @property {number} QUERY_ERROR_TYPE_INTERNAL=5 QUERY_ERROR_TYPE_INTERNAL value
     * @property {number} QUERY_ERROR_TYPE_UNAVAILABLE=6 QUERY_ERROR_TYPE_UNAVAILABLE value
     * @property {number} QUERY_ERROR_TYPE_NOT_FOUND=7 QUERY_ERROR_TYPE_NOT_FOUND value
     * @property {number} QUERY_ERROR_TYPE_NOT_ACCEPTABLE=8 QUERY_ERROR_TYPE_NOT_ACCEPTABLE value
     * @property {number} QUERY_ERROR_TYPE_TOO_MANY_REQUESTS=9 QUERY_ERROR_TYPE_TOO_MANY_REQUESTS value
     * @property {number} QUERY_ERROR_TYPE_TOO_LARGE_ENTRY=10 QUERY_ERROR_TYPE_TOO_LARGE_ENTRY value
     */
    cortexpb.QueryErrorType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "QUERY_ERROR_TYPE_NONE"] = 0;
        values[valuesById[1] = "QUERY_ERROR_TYPE_TIMEOUT"] = 1;
        values[valuesById[2] = "QUERY_ERROR_TYPE_CANCELED"] = 2;
        values[valuesById[3] = "QUERY_ERROR_TYPE_EXECUTION"] = 3;
        values[valuesById[4] = "QUERY_ERROR_TYPE_BAD_DATA"] = 4;
        values[valuesById[5] = "QUERY_ERROR_TYPE_INTERNAL"] = 5;
        values[valuesById[6] = "QUERY_ERROR_TYPE_UNAVAILABLE"] = 6;
        values[valuesById[7] = "QUERY_ERROR_TYPE_NOT_FOUND"] = 7;
        values[valuesById[8] = "QUERY_ERROR_TYPE_NOT_ACCEPTABLE"] = 8;
        values[valuesById[9] = "QUERY_ERROR_TYPE_TOO_MANY_REQUESTS"] = 9;
        values[valuesById[10] = "QUERY_ERROR_TYPE_TOO_LARGE_ENTRY"] = 10;
        return values;
    })();

    cortexpb.QueryResponse = (function() {

        /**
         * Properties of a QueryResponse.
         * @memberof cortexpb
         * @interface IQueryResponse
         * @property {cortexpb.QueryStatus|null} [status] QueryResponse status
         * @property {cortexpb.QueryErrorType|null} [errorType] QueryResponse errorType
         * @property {string|null} [error] QueryResponse error
         * @property {cortexpb.IStringData|null} [string] QueryResponse string
         * @property {cortexpb.IVectorData|null} [vector] QueryResponse vector
         * @property {cortexpb.IScalarData|null} [scalar] QueryResponse scalar
         * @property {cortexpb.IMatrixData|null} [matrix] QueryResponse matrix
         * @property {Array.<string>|null} [warnings] QueryResponse warnings
         * @property {Array.<string>|null} [infos] QueryResponse infos
         */

        /**
         * Constructs a new QueryResponse.
         * @memberof cortexpb
         * @classdesc Represents a QueryResponse.
         * @implements IQueryResponse
         * @constructor
         * @param {cortexpb.IQueryResponse=} [properties] Properties to set
         */
        function QueryResponse(properties) {
            this.warnings = [];
            this.infos = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QueryResponse status.
         * @member {cortexpb.QueryStatus} status
         * @memberof cortexpb.QueryResponse
         * @instance
         */
        QueryResponse.prototype.status = 0;

        /**
         * QueryResponse errorType.
         * @member {cortexpb.QueryErrorType} errorType
         * @memberof cortexpb.QueryResponse
         * @instance
         */
        QueryResponse.prototype.errorType = 0;

        /**
         * QueryResponse error.
         * @member {string} error
         * @memberof cortexpb.QueryResponse
         * @instance
         */
        QueryResponse.prototype.error = "";

        /**
         * QueryResponse string.
         * @member {cortexpb.IStringData|null|undefined} string
         * @memberof cortexpb.QueryResponse
         * @instance
         */
        QueryResponse.prototype.string = null;

        /**
         * QueryResponse vector.
         * @member {cortexpb.IVectorData|null|undefined} vector
         * @memberof cortexpb.QueryResponse
         * @instance
         */
        QueryResponse.prototype.vector = null;

        /**
         * QueryResponse scalar.
         * @member {cortexpb.IScalarData|null|undefined} scalar
         * @memberof cortexpb.QueryResponse
         * @instance
         */
        QueryResponse.prototype.scalar = null;

        /**
         * QueryResponse matrix.
         * @member {cortexpb.IMatrixData|null|undefined} matrix
         * @memberof cortexpb.QueryResponse
         * @instance
         */
        QueryResponse.prototype.matrix = null;

        /**
         * QueryResponse warnings.
         * @member {Array.<string>} warnings
         * @memberof cortexpb.QueryResponse
         * @instance
         */
        QueryResponse.prototype.warnings = $util.emptyArray;

        /**
         * QueryResponse infos.
         * @member {Array.<string>} infos
         * @memberof cortexpb.QueryResponse
         * @instance
         */
        QueryResponse.prototype.infos = $util.emptyArray;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * QueryResponse data.
         * @member {"string"|"vector"|"scalar"|"matrix"|undefined} data
         * @memberof cortexpb.QueryResponse
         * @instance
         */
        Object.defineProperty(QueryResponse.prototype, "data", {
            get: $util.oneOfGetter($oneOfFields = ["string", "vector", "scalar", "matrix"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new QueryResponse instance using the specified properties.
         * @function create
         * @memberof cortexpb.QueryResponse
         * @static
         * @param {cortexpb.IQueryResponse=} [properties] Properties to set
         * @returns {cortexpb.QueryResponse} QueryResponse instance
         */
        QueryResponse.create = function create(properties) {
            return new QueryResponse(properties);
        };

        /**
         * Encodes the specified QueryResponse message. Does not implicitly {@link cortexpb.QueryResponse.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.QueryResponse
         * @static
         * @param {cortexpb.IQueryResponse} message QueryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
            if (message.errorType != null && Object.hasOwnProperty.call(message, "errorType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.errorType);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.error);
            if (message.string != null && Object.hasOwnProperty.call(message, "string"))
                $root.cortexpb.StringData.encode(message.string, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.vector != null && Object.hasOwnProperty.call(message, "vector"))
                $root.cortexpb.VectorData.encode(message.vector, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.scalar != null && Object.hasOwnProperty.call(message, "scalar"))
                $root.cortexpb.ScalarData.encode(message.scalar, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.matrix != null && Object.hasOwnProperty.call(message, "matrix"))
                $root.cortexpb.MatrixData.encode(message.matrix, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.warnings != null && message.warnings.length)
                for (var i = 0; i < message.warnings.length; ++i)
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.warnings[i]);
            if (message.infos != null && message.infos.length)
                for (var i = 0; i < message.infos.length; ++i)
                    writer.uint32(/* id 9, wireType 2 =*/74).string(message.infos[i]);
            return writer;
        };

        /**
         * Encodes the specified QueryResponse message, length delimited. Does not implicitly {@link cortexpb.QueryResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.QueryResponse
         * @static
         * @param {cortexpb.IQueryResponse} message QueryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a QueryResponse message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.QueryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.QueryResponse} QueryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.QueryResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.status = reader.int32();
                        break;
                    }
                case 2: {
                        message.errorType = reader.int32();
                        break;
                    }
                case 3: {
                        message.error = reader.string();
                        break;
                    }
                case 4: {
                        message.string = $root.cortexpb.StringData.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.vector = $root.cortexpb.VectorData.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.scalar = $root.cortexpb.ScalarData.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.matrix = $root.cortexpb.MatrixData.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        if (!(message.warnings && message.warnings.length))
                            message.warnings = [];
                        message.warnings.push(reader.string());
                        break;
                    }
                case 9: {
                        if (!(message.infos && message.infos.length))
                            message.infos = [];
                        message.infos.push(reader.string());
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
         * Decodes a QueryResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.QueryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.QueryResponse} QueryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a QueryResponse message.
         * @function verify
         * @memberof cortexpb.QueryResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        QueryResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.status != null && message.hasOwnProperty("status"))
                switch (message.status) {
                default:
                    return "status: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.errorType != null && message.hasOwnProperty("errorType"))
                switch (message.errorType) {
                default:
                    return "errorType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    break;
                }
            if (message.error != null && message.hasOwnProperty("error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            if (message.string != null && message.hasOwnProperty("string")) {
                properties.data = 1;
                {
                    var error = $root.cortexpb.StringData.verify(message.string);
                    if (error)
                        return "string." + error;
                }
            }
            if (message.vector != null && message.hasOwnProperty("vector")) {
                if (properties.data === 1)
                    return "data: multiple values";
                properties.data = 1;
                {
                    var error = $root.cortexpb.VectorData.verify(message.vector);
                    if (error)
                        return "vector." + error;
                }
            }
            if (message.scalar != null && message.hasOwnProperty("scalar")) {
                if (properties.data === 1)
                    return "data: multiple values";
                properties.data = 1;
                {
                    var error = $root.cortexpb.ScalarData.verify(message.scalar);
                    if (error)
                        return "scalar." + error;
                }
            }
            if (message.matrix != null && message.hasOwnProperty("matrix")) {
                if (properties.data === 1)
                    return "data: multiple values";
                properties.data = 1;
                {
                    var error = $root.cortexpb.MatrixData.verify(message.matrix);
                    if (error)
                        return "matrix." + error;
                }
            }
            if (message.warnings != null && message.hasOwnProperty("warnings")) {
                if (!Array.isArray(message.warnings))
                    return "warnings: array expected";
                for (var i = 0; i < message.warnings.length; ++i)
                    if (!$util.isString(message.warnings[i]))
                        return "warnings: string[] expected";
            }
            if (message.infos != null && message.hasOwnProperty("infos")) {
                if (!Array.isArray(message.infos))
                    return "infos: array expected";
                for (var i = 0; i < message.infos.length; ++i)
                    if (!$util.isString(message.infos[i]))
                        return "infos: string[] expected";
            }
            return null;
        };

        /**
         * Creates a QueryResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.QueryResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.QueryResponse} QueryResponse
         */
        QueryResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.QueryResponse)
                return object;
            var message = new $root.cortexpb.QueryResponse();
            switch (object.status) {
            default:
                if (typeof object.status === "number") {
                    message.status = object.status;
                    break;
                }
                break;
            case "QUERY_STATUS_ERROR":
            case 0:
                message.status = 0;
                break;
            case "QUERY_STATUS_SUCCESS":
            case 1:
                message.status = 1;
                break;
            }
            switch (object.errorType) {
            default:
                if (typeof object.errorType === "number") {
                    message.errorType = object.errorType;
                    break;
                }
                break;
            case "QUERY_ERROR_TYPE_NONE":
            case 0:
                message.errorType = 0;
                break;
            case "QUERY_ERROR_TYPE_TIMEOUT":
            case 1:
                message.errorType = 1;
                break;
            case "QUERY_ERROR_TYPE_CANCELED":
            case 2:
                message.errorType = 2;
                break;
            case "QUERY_ERROR_TYPE_EXECUTION":
            case 3:
                message.errorType = 3;
                break;
            case "QUERY_ERROR_TYPE_BAD_DATA":
            case 4:
                message.errorType = 4;
                break;
            case "QUERY_ERROR_TYPE_INTERNAL":
            case 5:
                message.errorType = 5;
                break;
            case "QUERY_ERROR_TYPE_UNAVAILABLE":
            case 6:
                message.errorType = 6;
                break;
            case "QUERY_ERROR_TYPE_NOT_FOUND":
            case 7:
                message.errorType = 7;
                break;
            case "QUERY_ERROR_TYPE_NOT_ACCEPTABLE":
            case 8:
                message.errorType = 8;
                break;
            case "QUERY_ERROR_TYPE_TOO_MANY_REQUESTS":
            case 9:
                message.errorType = 9;
                break;
            case "QUERY_ERROR_TYPE_TOO_LARGE_ENTRY":
            case 10:
                message.errorType = 10;
                break;
            }
            if (object.error != null)
                message.error = String(object.error);
            if (object.string != null) {
                if (typeof object.string !== "object")
                    throw TypeError(".cortexpb.QueryResponse.string: object expected");
                message.string = $root.cortexpb.StringData.fromObject(object.string);
            }
            if (object.vector != null) {
                if (typeof object.vector !== "object")
                    throw TypeError(".cortexpb.QueryResponse.vector: object expected");
                message.vector = $root.cortexpb.VectorData.fromObject(object.vector);
            }
            if (object.scalar != null) {
                if (typeof object.scalar !== "object")
                    throw TypeError(".cortexpb.QueryResponse.scalar: object expected");
                message.scalar = $root.cortexpb.ScalarData.fromObject(object.scalar);
            }
            if (object.matrix != null) {
                if (typeof object.matrix !== "object")
                    throw TypeError(".cortexpb.QueryResponse.matrix: object expected");
                message.matrix = $root.cortexpb.MatrixData.fromObject(object.matrix);
            }
            if (object.warnings) {
                if (!Array.isArray(object.warnings))
                    throw TypeError(".cortexpb.QueryResponse.warnings: array expected");
                message.warnings = [];
                for (var i = 0; i < object.warnings.length; ++i)
                    message.warnings[i] = String(object.warnings[i]);
            }
            if (object.infos) {
                if (!Array.isArray(object.infos))
                    throw TypeError(".cortexpb.QueryResponse.infos: array expected");
                message.infos = [];
                for (var i = 0; i < object.infos.length; ++i)
                    message.infos[i] = String(object.infos[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a QueryResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.QueryResponse
         * @static
         * @param {cortexpb.QueryResponse} message QueryResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        QueryResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.warnings = [];
                object.infos = [];
            }
            if (options.defaults) {
                object.status = options.enums === String ? "QUERY_STATUS_ERROR" : 0;
                object.errorType = options.enums === String ? "QUERY_ERROR_TYPE_NONE" : 0;
                object.error = "";
            }
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = options.enums === String ? $root.cortexpb.QueryStatus[message.status] === undefined ? message.status : $root.cortexpb.QueryStatus[message.status] : message.status;
            if (message.errorType != null && message.hasOwnProperty("errorType"))
                object.errorType = options.enums === String ? $root.cortexpb.QueryErrorType[message.errorType] === undefined ? message.errorType : $root.cortexpb.QueryErrorType[message.errorType] : message.errorType;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            if (message.string != null && message.hasOwnProperty("string")) {
                object.string = $root.cortexpb.StringData.toObject(message.string, options);
                if (options.oneofs)
                    object.data = "string";
            }
            if (message.vector != null && message.hasOwnProperty("vector")) {
                object.vector = $root.cortexpb.VectorData.toObject(message.vector, options);
                if (options.oneofs)
                    object.data = "vector";
            }
            if (message.scalar != null && message.hasOwnProperty("scalar")) {
                object.scalar = $root.cortexpb.ScalarData.toObject(message.scalar, options);
                if (options.oneofs)
                    object.data = "scalar";
            }
            if (message.matrix != null && message.hasOwnProperty("matrix")) {
                object.matrix = $root.cortexpb.MatrixData.toObject(message.matrix, options);
                if (options.oneofs)
                    object.data = "matrix";
            }
            if (message.warnings && message.warnings.length) {
                object.warnings = [];
                for (var j = 0; j < message.warnings.length; ++j)
                    object.warnings[j] = message.warnings[j];
            }
            if (message.infos && message.infos.length) {
                object.infos = [];
                for (var j = 0; j < message.infos.length; ++j)
                    object.infos[j] = message.infos[j];
            }
            return object;
        };

        /**
         * Converts this QueryResponse to JSON.
         * @function toJSON
         * @memberof cortexpb.QueryResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        QueryResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for QueryResponse
         * @function getTypeUrl
         * @memberof cortexpb.QueryResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        QueryResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.QueryResponse";
        };

        return QueryResponse;
    })();

    cortexpb.StringData = (function() {

        /**
         * Properties of a StringData.
         * @memberof cortexpb
         * @interface IStringData
         * @property {string|null} [value] StringData value
         * @property {number|Long|null} [timestampMs] StringData timestampMs
         */

        /**
         * Constructs a new StringData.
         * @memberof cortexpb
         * @classdesc Represents a StringData.
         * @implements IStringData
         * @constructor
         * @param {cortexpb.IStringData=} [properties] Properties to set
         */
        function StringData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StringData value.
         * @member {string} value
         * @memberof cortexpb.StringData
         * @instance
         */
        StringData.prototype.value = "";

        /**
         * StringData timestampMs.
         * @member {number|Long} timestampMs
         * @memberof cortexpb.StringData
         * @instance
         */
        StringData.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new StringData instance using the specified properties.
         * @function create
         * @memberof cortexpb.StringData
         * @static
         * @param {cortexpb.IStringData=} [properties] Properties to set
         * @returns {cortexpb.StringData} StringData instance
         */
        StringData.create = function create(properties) {
            return new StringData(properties);
        };

        /**
         * Encodes the specified StringData message. Does not implicitly {@link cortexpb.StringData.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.StringData
         * @static
         * @param {cortexpb.IStringData} message StringData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StringData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
            if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestampMs);
            return writer;
        };

        /**
         * Encodes the specified StringData message, length delimited. Does not implicitly {@link cortexpb.StringData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.StringData
         * @static
         * @param {cortexpb.IStringData} message StringData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StringData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StringData message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.StringData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.StringData} StringData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StringData.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.StringData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.value = reader.string();
                        break;
                    }
                case 2: {
                        message.timestampMs = reader.int64();
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
         * Decodes a StringData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.StringData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.StringData} StringData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StringData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StringData message.
         * @function verify
         * @memberof cortexpb.StringData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StringData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isString(message.value))
                    return "value: string expected";
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (!$util.isInteger(message.timestampMs) && !(message.timestampMs && $util.isInteger(message.timestampMs.low) && $util.isInteger(message.timestampMs.high)))
                    return "timestampMs: integer|Long expected";
            return null;
        };

        /**
         * Creates a StringData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.StringData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.StringData} StringData
         */
        StringData.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.StringData)
                return object;
            var message = new $root.cortexpb.StringData();
            if (object.value != null)
                message.value = String(object.value);
            if (object.timestampMs != null)
                if ($util.Long)
                    (message.timestampMs = $util.Long.fromValue(object.timestampMs)).unsigned = false;
                else if (typeof object.timestampMs === "string")
                    message.timestampMs = parseInt(object.timestampMs, 10);
                else if (typeof object.timestampMs === "number")
                    message.timestampMs = object.timestampMs;
                else if (typeof object.timestampMs === "object")
                    message.timestampMs = new $util.LongBits(object.timestampMs.low >>> 0, object.timestampMs.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a StringData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.StringData
         * @static
         * @param {cortexpb.StringData} message StringData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StringData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.value = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampMs = options.longs === String ? "0" : 0;
            }
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (typeof message.timestampMs === "number")
                    object.timestampMs = options.longs === String ? String(message.timestampMs) : message.timestampMs;
                else
                    object.timestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.timestampMs) : options.longs === Number ? new $util.LongBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0).toNumber() : message.timestampMs;
            return object;
        };

        /**
         * Converts this StringData to JSON.
         * @function toJSON
         * @memberof cortexpb.StringData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StringData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for StringData
         * @function getTypeUrl
         * @memberof cortexpb.StringData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        StringData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.StringData";
        };

        return StringData;
    })();

    cortexpb.VectorData = (function() {

        /**
         * Properties of a VectorData.
         * @memberof cortexpb
         * @interface IVectorData
         * @property {Array.<cortexpb.IVectorSample>|null} [samples] VectorData samples
         * @property {Array.<cortexpb.IVectorHistogram>|null} [histograms] VectorData histograms
         */

        /**
         * Constructs a new VectorData.
         * @memberof cortexpb
         * @classdesc Represents a VectorData.
         * @implements IVectorData
         * @constructor
         * @param {cortexpb.IVectorData=} [properties] Properties to set
         */
        function VectorData(properties) {
            this.samples = [];
            this.histograms = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VectorData samples.
         * @member {Array.<cortexpb.IVectorSample>} samples
         * @memberof cortexpb.VectorData
         * @instance
         */
        VectorData.prototype.samples = $util.emptyArray;

        /**
         * VectorData histograms.
         * @member {Array.<cortexpb.IVectorHistogram>} histograms
         * @memberof cortexpb.VectorData
         * @instance
         */
        VectorData.prototype.histograms = $util.emptyArray;

        /**
         * Creates a new VectorData instance using the specified properties.
         * @function create
         * @memberof cortexpb.VectorData
         * @static
         * @param {cortexpb.IVectorData=} [properties] Properties to set
         * @returns {cortexpb.VectorData} VectorData instance
         */
        VectorData.create = function create(properties) {
            return new VectorData(properties);
        };

        /**
         * Encodes the specified VectorData message. Does not implicitly {@link cortexpb.VectorData.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.VectorData
         * @static
         * @param {cortexpb.IVectorData} message VectorData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VectorData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.samples != null && message.samples.length)
                for (var i = 0; i < message.samples.length; ++i)
                    $root.cortexpb.VectorSample.encode(message.samples[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.histograms != null && message.histograms.length)
                for (var i = 0; i < message.histograms.length; ++i)
                    $root.cortexpb.VectorHistogram.encode(message.histograms[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified VectorData message, length delimited. Does not implicitly {@link cortexpb.VectorData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.VectorData
         * @static
         * @param {cortexpb.IVectorData} message VectorData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VectorData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VectorData message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.VectorData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.VectorData} VectorData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VectorData.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.VectorData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.samples && message.samples.length))
                            message.samples = [];
                        message.samples.push($root.cortexpb.VectorSample.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        if (!(message.histograms && message.histograms.length))
                            message.histograms = [];
                        message.histograms.push($root.cortexpb.VectorHistogram.decode(reader, reader.uint32()));
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
         * Decodes a VectorData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.VectorData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.VectorData} VectorData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VectorData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VectorData message.
         * @function verify
         * @memberof cortexpb.VectorData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VectorData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.samples != null && message.hasOwnProperty("samples")) {
                if (!Array.isArray(message.samples))
                    return "samples: array expected";
                for (var i = 0; i < message.samples.length; ++i) {
                    var error = $root.cortexpb.VectorSample.verify(message.samples[i]);
                    if (error)
                        return "samples." + error;
                }
            }
            if (message.histograms != null && message.hasOwnProperty("histograms")) {
                if (!Array.isArray(message.histograms))
                    return "histograms: array expected";
                for (var i = 0; i < message.histograms.length; ++i) {
                    var error = $root.cortexpb.VectorHistogram.verify(message.histograms[i]);
                    if (error)
                        return "histograms." + error;
                }
            }
            return null;
        };

        /**
         * Creates a VectorData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.VectorData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.VectorData} VectorData
         */
        VectorData.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.VectorData)
                return object;
            var message = new $root.cortexpb.VectorData();
            if (object.samples) {
                if (!Array.isArray(object.samples))
                    throw TypeError(".cortexpb.VectorData.samples: array expected");
                message.samples = [];
                for (var i = 0; i < object.samples.length; ++i) {
                    if (typeof object.samples[i] !== "object")
                        throw TypeError(".cortexpb.VectorData.samples: object expected");
                    message.samples[i] = $root.cortexpb.VectorSample.fromObject(object.samples[i]);
                }
            }
            if (object.histograms) {
                if (!Array.isArray(object.histograms))
                    throw TypeError(".cortexpb.VectorData.histograms: array expected");
                message.histograms = [];
                for (var i = 0; i < object.histograms.length; ++i) {
                    if (typeof object.histograms[i] !== "object")
                        throw TypeError(".cortexpb.VectorData.histograms: object expected");
                    message.histograms[i] = $root.cortexpb.VectorHistogram.fromObject(object.histograms[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a VectorData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.VectorData
         * @static
         * @param {cortexpb.VectorData} message VectorData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VectorData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.samples = [];
                object.histograms = [];
            }
            if (message.samples && message.samples.length) {
                object.samples = [];
                for (var j = 0; j < message.samples.length; ++j)
                    object.samples[j] = $root.cortexpb.VectorSample.toObject(message.samples[j], options);
            }
            if (message.histograms && message.histograms.length) {
                object.histograms = [];
                for (var j = 0; j < message.histograms.length; ++j)
                    object.histograms[j] = $root.cortexpb.VectorHistogram.toObject(message.histograms[j], options);
            }
            return object;
        };

        /**
         * Converts this VectorData to JSON.
         * @function toJSON
         * @memberof cortexpb.VectorData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VectorData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for VectorData
         * @function getTypeUrl
         * @memberof cortexpb.VectorData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        VectorData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.VectorData";
        };

        return VectorData;
    })();

    cortexpb.VectorSample = (function() {

        /**
         * Properties of a VectorSample.
         * @memberof cortexpb
         * @interface IVectorSample
         * @property {Array.<string>|null} [metric] VectorSample metric
         * @property {number|null} [value] VectorSample value
         * @property {number|Long|null} [timestampMs] VectorSample timestampMs
         */

        /**
         * Constructs a new VectorSample.
         * @memberof cortexpb
         * @classdesc Represents a VectorSample.
         * @implements IVectorSample
         * @constructor
         * @param {cortexpb.IVectorSample=} [properties] Properties to set
         */
        function VectorSample(properties) {
            this.metric = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VectorSample metric.
         * @member {Array.<string>} metric
         * @memberof cortexpb.VectorSample
         * @instance
         */
        VectorSample.prototype.metric = $util.emptyArray;

        /**
         * VectorSample value.
         * @member {number} value
         * @memberof cortexpb.VectorSample
         * @instance
         */
        VectorSample.prototype.value = 0;

        /**
         * VectorSample timestampMs.
         * @member {number|Long} timestampMs
         * @memberof cortexpb.VectorSample
         * @instance
         */
        VectorSample.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new VectorSample instance using the specified properties.
         * @function create
         * @memberof cortexpb.VectorSample
         * @static
         * @param {cortexpb.IVectorSample=} [properties] Properties to set
         * @returns {cortexpb.VectorSample} VectorSample instance
         */
        VectorSample.create = function create(properties) {
            return new VectorSample(properties);
        };

        /**
         * Encodes the specified VectorSample message. Does not implicitly {@link cortexpb.VectorSample.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.VectorSample
         * @static
         * @param {cortexpb.IVectorSample} message VectorSample message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VectorSample.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.metric != null && message.metric.length)
                for (var i = 0; i < message.metric.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.metric[i]);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.value);
            if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestampMs);
            return writer;
        };

        /**
         * Encodes the specified VectorSample message, length delimited. Does not implicitly {@link cortexpb.VectorSample.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.VectorSample
         * @static
         * @param {cortexpb.IVectorSample} message VectorSample message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VectorSample.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VectorSample message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.VectorSample
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.VectorSample} VectorSample
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VectorSample.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.VectorSample();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.metric && message.metric.length))
                            message.metric = [];
                        message.metric.push(reader.string());
                        break;
                    }
                case 2: {
                        message.value = reader.double();
                        break;
                    }
                case 3: {
                        message.timestampMs = reader.int64();
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
         * Decodes a VectorSample message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.VectorSample
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.VectorSample} VectorSample
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VectorSample.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VectorSample message.
         * @function verify
         * @memberof cortexpb.VectorSample
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VectorSample.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.metric != null && message.hasOwnProperty("metric")) {
                if (!Array.isArray(message.metric))
                    return "metric: array expected";
                for (var i = 0; i < message.metric.length; ++i)
                    if (!$util.isString(message.metric[i]))
                        return "metric: string[] expected";
            }
            if (message.value != null && message.hasOwnProperty("value"))
                if (typeof message.value !== "number")
                    return "value: number expected";
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (!$util.isInteger(message.timestampMs) && !(message.timestampMs && $util.isInteger(message.timestampMs.low) && $util.isInteger(message.timestampMs.high)))
                    return "timestampMs: integer|Long expected";
            return null;
        };

        /**
         * Creates a VectorSample message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.VectorSample
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.VectorSample} VectorSample
         */
        VectorSample.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.VectorSample)
                return object;
            var message = new $root.cortexpb.VectorSample();
            if (object.metric) {
                if (!Array.isArray(object.metric))
                    throw TypeError(".cortexpb.VectorSample.metric: array expected");
                message.metric = [];
                for (var i = 0; i < object.metric.length; ++i)
                    message.metric[i] = String(object.metric[i]);
            }
            if (object.value != null)
                message.value = Number(object.value);
            if (object.timestampMs != null)
                if ($util.Long)
                    (message.timestampMs = $util.Long.fromValue(object.timestampMs)).unsigned = false;
                else if (typeof object.timestampMs === "string")
                    message.timestampMs = parseInt(object.timestampMs, 10);
                else if (typeof object.timestampMs === "number")
                    message.timestampMs = object.timestampMs;
                else if (typeof object.timestampMs === "object")
                    message.timestampMs = new $util.LongBits(object.timestampMs.low >>> 0, object.timestampMs.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a VectorSample message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.VectorSample
         * @static
         * @param {cortexpb.VectorSample} message VectorSample
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VectorSample.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.metric = [];
            if (options.defaults) {
                object.value = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampMs = options.longs === String ? "0" : 0;
            }
            if (message.metric && message.metric.length) {
                object.metric = [];
                for (var j = 0; j < message.metric.length; ++j)
                    object.metric[j] = message.metric[j];
            }
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (typeof message.timestampMs === "number")
                    object.timestampMs = options.longs === String ? String(message.timestampMs) : message.timestampMs;
                else
                    object.timestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.timestampMs) : options.longs === Number ? new $util.LongBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0).toNumber() : message.timestampMs;
            return object;
        };

        /**
         * Converts this VectorSample to JSON.
         * @function toJSON
         * @memberof cortexpb.VectorSample
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VectorSample.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for VectorSample
         * @function getTypeUrl
         * @memberof cortexpb.VectorSample
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        VectorSample.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.VectorSample";
        };

        return VectorSample;
    })();

    cortexpb.VectorHistogram = (function() {

        /**
         * Properties of a VectorHistogram.
         * @memberof cortexpb
         * @interface IVectorHistogram
         * @property {Array.<string>|null} [metric] VectorHistogram metric
         * @property {cortexpb.IFloatHistogram|null} [histogram] VectorHistogram histogram
         * @property {number|Long|null} [timestampMs] VectorHistogram timestampMs
         */

        /**
         * Constructs a new VectorHistogram.
         * @memberof cortexpb
         * @classdesc Represents a VectorHistogram.
         * @implements IVectorHistogram
         * @constructor
         * @param {cortexpb.IVectorHistogram=} [properties] Properties to set
         */
        function VectorHistogram(properties) {
            this.metric = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VectorHistogram metric.
         * @member {Array.<string>} metric
         * @memberof cortexpb.VectorHistogram
         * @instance
         */
        VectorHistogram.prototype.metric = $util.emptyArray;

        /**
         * VectorHistogram histogram.
         * @member {cortexpb.IFloatHistogram|null|undefined} histogram
         * @memberof cortexpb.VectorHistogram
         * @instance
         */
        VectorHistogram.prototype.histogram = null;

        /**
         * VectorHistogram timestampMs.
         * @member {number|Long} timestampMs
         * @memberof cortexpb.VectorHistogram
         * @instance
         */
        VectorHistogram.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new VectorHistogram instance using the specified properties.
         * @function create
         * @memberof cortexpb.VectorHistogram
         * @static
         * @param {cortexpb.IVectorHistogram=} [properties] Properties to set
         * @returns {cortexpb.VectorHistogram} VectorHistogram instance
         */
        VectorHistogram.create = function create(properties) {
            return new VectorHistogram(properties);
        };

        /**
         * Encodes the specified VectorHistogram message. Does not implicitly {@link cortexpb.VectorHistogram.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.VectorHistogram
         * @static
         * @param {cortexpb.IVectorHistogram} message VectorHistogram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VectorHistogram.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.metric != null && message.metric.length)
                for (var i = 0; i < message.metric.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.metric[i]);
            if (message.histogram != null && Object.hasOwnProperty.call(message, "histogram"))
                $root.cortexpb.FloatHistogram.encode(message.histogram, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestampMs);
            return writer;
        };

        /**
         * Encodes the specified VectorHistogram message, length delimited. Does not implicitly {@link cortexpb.VectorHistogram.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.VectorHistogram
         * @static
         * @param {cortexpb.IVectorHistogram} message VectorHistogram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VectorHistogram.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VectorHistogram message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.VectorHistogram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.VectorHistogram} VectorHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VectorHistogram.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.VectorHistogram();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.metric && message.metric.length))
                            message.metric = [];
                        message.metric.push(reader.string());
                        break;
                    }
                case 2: {
                        message.histogram = $root.cortexpb.FloatHistogram.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.timestampMs = reader.int64();
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
         * Decodes a VectorHistogram message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.VectorHistogram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.VectorHistogram} VectorHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VectorHistogram.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VectorHistogram message.
         * @function verify
         * @memberof cortexpb.VectorHistogram
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VectorHistogram.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.metric != null && message.hasOwnProperty("metric")) {
                if (!Array.isArray(message.metric))
                    return "metric: array expected";
                for (var i = 0; i < message.metric.length; ++i)
                    if (!$util.isString(message.metric[i]))
                        return "metric: string[] expected";
            }
            if (message.histogram != null && message.hasOwnProperty("histogram")) {
                var error = $root.cortexpb.FloatHistogram.verify(message.histogram);
                if (error)
                    return "histogram." + error;
            }
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (!$util.isInteger(message.timestampMs) && !(message.timestampMs && $util.isInteger(message.timestampMs.low) && $util.isInteger(message.timestampMs.high)))
                    return "timestampMs: integer|Long expected";
            return null;
        };

        /**
         * Creates a VectorHistogram message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.VectorHistogram
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.VectorHistogram} VectorHistogram
         */
        VectorHistogram.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.VectorHistogram)
                return object;
            var message = new $root.cortexpb.VectorHistogram();
            if (object.metric) {
                if (!Array.isArray(object.metric))
                    throw TypeError(".cortexpb.VectorHistogram.metric: array expected");
                message.metric = [];
                for (var i = 0; i < object.metric.length; ++i)
                    message.metric[i] = String(object.metric[i]);
            }
            if (object.histogram != null) {
                if (typeof object.histogram !== "object")
                    throw TypeError(".cortexpb.VectorHistogram.histogram: object expected");
                message.histogram = $root.cortexpb.FloatHistogram.fromObject(object.histogram);
            }
            if (object.timestampMs != null)
                if ($util.Long)
                    (message.timestampMs = $util.Long.fromValue(object.timestampMs)).unsigned = false;
                else if (typeof object.timestampMs === "string")
                    message.timestampMs = parseInt(object.timestampMs, 10);
                else if (typeof object.timestampMs === "number")
                    message.timestampMs = object.timestampMs;
                else if (typeof object.timestampMs === "object")
                    message.timestampMs = new $util.LongBits(object.timestampMs.low >>> 0, object.timestampMs.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a VectorHistogram message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.VectorHistogram
         * @static
         * @param {cortexpb.VectorHistogram} message VectorHistogram
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VectorHistogram.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.metric = [];
            if (options.defaults) {
                object.histogram = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampMs = options.longs === String ? "0" : 0;
            }
            if (message.metric && message.metric.length) {
                object.metric = [];
                for (var j = 0; j < message.metric.length; ++j)
                    object.metric[j] = message.metric[j];
            }
            if (message.histogram != null && message.hasOwnProperty("histogram"))
                object.histogram = $root.cortexpb.FloatHistogram.toObject(message.histogram, options);
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (typeof message.timestampMs === "number")
                    object.timestampMs = options.longs === String ? String(message.timestampMs) : message.timestampMs;
                else
                    object.timestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.timestampMs) : options.longs === Number ? new $util.LongBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0).toNumber() : message.timestampMs;
            return object;
        };

        /**
         * Converts this VectorHistogram to JSON.
         * @function toJSON
         * @memberof cortexpb.VectorHistogram
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VectorHistogram.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for VectorHistogram
         * @function getTypeUrl
         * @memberof cortexpb.VectorHistogram
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        VectorHistogram.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.VectorHistogram";
        };

        return VectorHistogram;
    })();

    cortexpb.ScalarData = (function() {

        /**
         * Properties of a ScalarData.
         * @memberof cortexpb
         * @interface IScalarData
         * @property {number|null} [value] ScalarData value
         * @property {number|Long|null} [timestampMs] ScalarData timestampMs
         */

        /**
         * Constructs a new ScalarData.
         * @memberof cortexpb
         * @classdesc Represents a ScalarData.
         * @implements IScalarData
         * @constructor
         * @param {cortexpb.IScalarData=} [properties] Properties to set
         */
        function ScalarData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ScalarData value.
         * @member {number} value
         * @memberof cortexpb.ScalarData
         * @instance
         */
        ScalarData.prototype.value = 0;

        /**
         * ScalarData timestampMs.
         * @member {number|Long} timestampMs
         * @memberof cortexpb.ScalarData
         * @instance
         */
        ScalarData.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new ScalarData instance using the specified properties.
         * @function create
         * @memberof cortexpb.ScalarData
         * @static
         * @param {cortexpb.IScalarData=} [properties] Properties to set
         * @returns {cortexpb.ScalarData} ScalarData instance
         */
        ScalarData.create = function create(properties) {
            return new ScalarData(properties);
        };

        /**
         * Encodes the specified ScalarData message. Does not implicitly {@link cortexpb.ScalarData.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.ScalarData
         * @static
         * @param {cortexpb.IScalarData} message ScalarData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ScalarData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.value);
            if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestampMs);
            return writer;
        };

        /**
         * Encodes the specified ScalarData message, length delimited. Does not implicitly {@link cortexpb.ScalarData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.ScalarData
         * @static
         * @param {cortexpb.IScalarData} message ScalarData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ScalarData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ScalarData message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.ScalarData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.ScalarData} ScalarData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ScalarData.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.ScalarData();
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
                        message.timestampMs = reader.int64();
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
         * Decodes a ScalarData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.ScalarData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.ScalarData} ScalarData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ScalarData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ScalarData message.
         * @function verify
         * @memberof cortexpb.ScalarData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ScalarData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (typeof message.value !== "number")
                    return "value: number expected";
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (!$util.isInteger(message.timestampMs) && !(message.timestampMs && $util.isInteger(message.timestampMs.low) && $util.isInteger(message.timestampMs.high)))
                    return "timestampMs: integer|Long expected";
            return null;
        };

        /**
         * Creates a ScalarData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.ScalarData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.ScalarData} ScalarData
         */
        ScalarData.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.ScalarData)
                return object;
            var message = new $root.cortexpb.ScalarData();
            if (object.value != null)
                message.value = Number(object.value);
            if (object.timestampMs != null)
                if ($util.Long)
                    (message.timestampMs = $util.Long.fromValue(object.timestampMs)).unsigned = false;
                else if (typeof object.timestampMs === "string")
                    message.timestampMs = parseInt(object.timestampMs, 10);
                else if (typeof object.timestampMs === "number")
                    message.timestampMs = object.timestampMs;
                else if (typeof object.timestampMs === "object")
                    message.timestampMs = new $util.LongBits(object.timestampMs.low >>> 0, object.timestampMs.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a ScalarData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.ScalarData
         * @static
         * @param {cortexpb.ScalarData} message ScalarData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ScalarData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.value = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampMs = options.longs === String ? "0" : 0;
            }
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
            if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                if (typeof message.timestampMs === "number")
                    object.timestampMs = options.longs === String ? String(message.timestampMs) : message.timestampMs;
                else
                    object.timestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.timestampMs) : options.longs === Number ? new $util.LongBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0).toNumber() : message.timestampMs;
            return object;
        };

        /**
         * Converts this ScalarData to JSON.
         * @function toJSON
         * @memberof cortexpb.ScalarData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ScalarData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ScalarData
         * @function getTypeUrl
         * @memberof cortexpb.ScalarData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ScalarData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.ScalarData";
        };

        return ScalarData;
    })();

    cortexpb.MatrixData = (function() {

        /**
         * Properties of a MatrixData.
         * @memberof cortexpb
         * @interface IMatrixData
         * @property {Array.<cortexpb.IMatrixSeries>|null} [series] MatrixData series
         */

        /**
         * Constructs a new MatrixData.
         * @memberof cortexpb
         * @classdesc Represents a MatrixData.
         * @implements IMatrixData
         * @constructor
         * @param {cortexpb.IMatrixData=} [properties] Properties to set
         */
        function MatrixData(properties) {
            this.series = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MatrixData series.
         * @member {Array.<cortexpb.IMatrixSeries>} series
         * @memberof cortexpb.MatrixData
         * @instance
         */
        MatrixData.prototype.series = $util.emptyArray;

        /**
         * Creates a new MatrixData instance using the specified properties.
         * @function create
         * @memberof cortexpb.MatrixData
         * @static
         * @param {cortexpb.IMatrixData=} [properties] Properties to set
         * @returns {cortexpb.MatrixData} MatrixData instance
         */
        MatrixData.create = function create(properties) {
            return new MatrixData(properties);
        };

        /**
         * Encodes the specified MatrixData message. Does not implicitly {@link cortexpb.MatrixData.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.MatrixData
         * @static
         * @param {cortexpb.IMatrixData} message MatrixData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MatrixData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.series != null && message.series.length)
                for (var i = 0; i < message.series.length; ++i)
                    $root.cortexpb.MatrixSeries.encode(message.series[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MatrixData message, length delimited. Does not implicitly {@link cortexpb.MatrixData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.MatrixData
         * @static
         * @param {cortexpb.IMatrixData} message MatrixData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MatrixData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MatrixData message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.MatrixData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.MatrixData} MatrixData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MatrixData.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.MatrixData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.series && message.series.length))
                            message.series = [];
                        message.series.push($root.cortexpb.MatrixSeries.decode(reader, reader.uint32()));
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
         * Decodes a MatrixData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.MatrixData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.MatrixData} MatrixData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MatrixData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MatrixData message.
         * @function verify
         * @memberof cortexpb.MatrixData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MatrixData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.series != null && message.hasOwnProperty("series")) {
                if (!Array.isArray(message.series))
                    return "series: array expected";
                for (var i = 0; i < message.series.length; ++i) {
                    var error = $root.cortexpb.MatrixSeries.verify(message.series[i]);
                    if (error)
                        return "series." + error;
                }
            }
            return null;
        };

        /**
         * Creates a MatrixData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.MatrixData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.MatrixData} MatrixData
         */
        MatrixData.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.MatrixData)
                return object;
            var message = new $root.cortexpb.MatrixData();
            if (object.series) {
                if (!Array.isArray(object.series))
                    throw TypeError(".cortexpb.MatrixData.series: array expected");
                message.series = [];
                for (var i = 0; i < object.series.length; ++i) {
                    if (typeof object.series[i] !== "object")
                        throw TypeError(".cortexpb.MatrixData.series: object expected");
                    message.series[i] = $root.cortexpb.MatrixSeries.fromObject(object.series[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a MatrixData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.MatrixData
         * @static
         * @param {cortexpb.MatrixData} message MatrixData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MatrixData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.series = [];
            if (message.series && message.series.length) {
                object.series = [];
                for (var j = 0; j < message.series.length; ++j)
                    object.series[j] = $root.cortexpb.MatrixSeries.toObject(message.series[j], options);
            }
            return object;
        };

        /**
         * Converts this MatrixData to JSON.
         * @function toJSON
         * @memberof cortexpb.MatrixData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MatrixData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MatrixData
         * @function getTypeUrl
         * @memberof cortexpb.MatrixData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MatrixData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.MatrixData";
        };

        return MatrixData;
    })();

    cortexpb.MatrixSeries = (function() {

        /**
         * Properties of a MatrixSeries.
         * @memberof cortexpb
         * @interface IMatrixSeries
         * @property {Array.<string>|null} [metric] MatrixSeries metric
         * @property {Array.<cortexpb.ISample>|null} [samples] MatrixSeries samples
         * @property {Array.<cortexpb.IFloatHistogramPair>|null} [histograms] MatrixSeries histograms
         */

        /**
         * Constructs a new MatrixSeries.
         * @memberof cortexpb
         * @classdesc Represents a MatrixSeries.
         * @implements IMatrixSeries
         * @constructor
         * @param {cortexpb.IMatrixSeries=} [properties] Properties to set
         */
        function MatrixSeries(properties) {
            this.metric = [];
            this.samples = [];
            this.histograms = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MatrixSeries metric.
         * @member {Array.<string>} metric
         * @memberof cortexpb.MatrixSeries
         * @instance
         */
        MatrixSeries.prototype.metric = $util.emptyArray;

        /**
         * MatrixSeries samples.
         * @member {Array.<cortexpb.ISample>} samples
         * @memberof cortexpb.MatrixSeries
         * @instance
         */
        MatrixSeries.prototype.samples = $util.emptyArray;

        /**
         * MatrixSeries histograms.
         * @member {Array.<cortexpb.IFloatHistogramPair>} histograms
         * @memberof cortexpb.MatrixSeries
         * @instance
         */
        MatrixSeries.prototype.histograms = $util.emptyArray;

        /**
         * Creates a new MatrixSeries instance using the specified properties.
         * @function create
         * @memberof cortexpb.MatrixSeries
         * @static
         * @param {cortexpb.IMatrixSeries=} [properties] Properties to set
         * @returns {cortexpb.MatrixSeries} MatrixSeries instance
         */
        MatrixSeries.create = function create(properties) {
            return new MatrixSeries(properties);
        };

        /**
         * Encodes the specified MatrixSeries message. Does not implicitly {@link cortexpb.MatrixSeries.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.MatrixSeries
         * @static
         * @param {cortexpb.IMatrixSeries} message MatrixSeries message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MatrixSeries.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.metric != null && message.metric.length)
                for (var i = 0; i < message.metric.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.metric[i]);
            if (message.samples != null && message.samples.length)
                for (var i = 0; i < message.samples.length; ++i)
                    $root.cortexpb.Sample.encode(message.samples[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.histograms != null && message.histograms.length)
                for (var i = 0; i < message.histograms.length; ++i)
                    $root.cortexpb.FloatHistogramPair.encode(message.histograms[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MatrixSeries message, length delimited. Does not implicitly {@link cortexpb.MatrixSeries.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.MatrixSeries
         * @static
         * @param {cortexpb.IMatrixSeries} message MatrixSeries message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MatrixSeries.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MatrixSeries message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.MatrixSeries
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.MatrixSeries} MatrixSeries
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MatrixSeries.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.MatrixSeries();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.metric && message.metric.length))
                            message.metric = [];
                        message.metric.push(reader.string());
                        break;
                    }
                case 2: {
                        if (!(message.samples && message.samples.length))
                            message.samples = [];
                        message.samples.push($root.cortexpb.Sample.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        if (!(message.histograms && message.histograms.length))
                            message.histograms = [];
                        message.histograms.push($root.cortexpb.FloatHistogramPair.decode(reader, reader.uint32()));
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
         * Decodes a MatrixSeries message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.MatrixSeries
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.MatrixSeries} MatrixSeries
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MatrixSeries.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MatrixSeries message.
         * @function verify
         * @memberof cortexpb.MatrixSeries
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MatrixSeries.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.metric != null && message.hasOwnProperty("metric")) {
                if (!Array.isArray(message.metric))
                    return "metric: array expected";
                for (var i = 0; i < message.metric.length; ++i)
                    if (!$util.isString(message.metric[i]))
                        return "metric: string[] expected";
            }
            if (message.samples != null && message.hasOwnProperty("samples")) {
                if (!Array.isArray(message.samples))
                    return "samples: array expected";
                for (var i = 0; i < message.samples.length; ++i) {
                    var error = $root.cortexpb.Sample.verify(message.samples[i]);
                    if (error)
                        return "samples." + error;
                }
            }
            if (message.histograms != null && message.hasOwnProperty("histograms")) {
                if (!Array.isArray(message.histograms))
                    return "histograms: array expected";
                for (var i = 0; i < message.histograms.length; ++i) {
                    var error = $root.cortexpb.FloatHistogramPair.verify(message.histograms[i]);
                    if (error)
                        return "histograms." + error;
                }
            }
            return null;
        };

        /**
         * Creates a MatrixSeries message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.MatrixSeries
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.MatrixSeries} MatrixSeries
         */
        MatrixSeries.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.MatrixSeries)
                return object;
            var message = new $root.cortexpb.MatrixSeries();
            if (object.metric) {
                if (!Array.isArray(object.metric))
                    throw TypeError(".cortexpb.MatrixSeries.metric: array expected");
                message.metric = [];
                for (var i = 0; i < object.metric.length; ++i)
                    message.metric[i] = String(object.metric[i]);
            }
            if (object.samples) {
                if (!Array.isArray(object.samples))
                    throw TypeError(".cortexpb.MatrixSeries.samples: array expected");
                message.samples = [];
                for (var i = 0; i < object.samples.length; ++i) {
                    if (typeof object.samples[i] !== "object")
                        throw TypeError(".cortexpb.MatrixSeries.samples: object expected");
                    message.samples[i] = $root.cortexpb.Sample.fromObject(object.samples[i]);
                }
            }
            if (object.histograms) {
                if (!Array.isArray(object.histograms))
                    throw TypeError(".cortexpb.MatrixSeries.histograms: array expected");
                message.histograms = [];
                for (var i = 0; i < object.histograms.length; ++i) {
                    if (typeof object.histograms[i] !== "object")
                        throw TypeError(".cortexpb.MatrixSeries.histograms: object expected");
                    message.histograms[i] = $root.cortexpb.FloatHistogramPair.fromObject(object.histograms[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a MatrixSeries message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.MatrixSeries
         * @static
         * @param {cortexpb.MatrixSeries} message MatrixSeries
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MatrixSeries.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.metric = [];
                object.samples = [];
                object.histograms = [];
            }
            if (message.metric && message.metric.length) {
                object.metric = [];
                for (var j = 0; j < message.metric.length; ++j)
                    object.metric[j] = message.metric[j];
            }
            if (message.samples && message.samples.length) {
                object.samples = [];
                for (var j = 0; j < message.samples.length; ++j)
                    object.samples[j] = $root.cortexpb.Sample.toObject(message.samples[j], options);
            }
            if (message.histograms && message.histograms.length) {
                object.histograms = [];
                for (var j = 0; j < message.histograms.length; ++j)
                    object.histograms[j] = $root.cortexpb.FloatHistogramPair.toObject(message.histograms[j], options);
            }
            return object;
        };

        /**
         * Converts this MatrixSeries to JSON.
         * @function toJSON
         * @memberof cortexpb.MatrixSeries
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MatrixSeries.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MatrixSeries
         * @function getTypeUrl
         * @memberof cortexpb.MatrixSeries
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MatrixSeries.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.MatrixSeries";
        };

        return MatrixSeries;
    })();

    cortexpb.WriteRequestRW2 = (function() {

        /**
         * Properties of a WriteRequestRW2.
         * @memberof cortexpb
         * @interface IWriteRequestRW2
         * @property {Array.<string>|null} [symbols] WriteRequestRW2 symbols
         * @property {Array.<cortexpb.ITimeSeriesRW2>|null} [timeseries] WriteRequestRW2 timeseries
         */

        /**
         * Constructs a new WriteRequestRW2.
         * @memberof cortexpb
         * @classdesc Represents a WriteRequestRW2.
         * @implements IWriteRequestRW2
         * @constructor
         * @param {cortexpb.IWriteRequestRW2=} [properties] Properties to set
         */
        function WriteRequestRW2(properties) {
            this.symbols = [];
            this.timeseries = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WriteRequestRW2 symbols.
         * @member {Array.<string>} symbols
         * @memberof cortexpb.WriteRequestRW2
         * @instance
         */
        WriteRequestRW2.prototype.symbols = $util.emptyArray;

        /**
         * WriteRequestRW2 timeseries.
         * @member {Array.<cortexpb.ITimeSeriesRW2>} timeseries
         * @memberof cortexpb.WriteRequestRW2
         * @instance
         */
        WriteRequestRW2.prototype.timeseries = $util.emptyArray;

        /**
         * Creates a new WriteRequestRW2 instance using the specified properties.
         * @function create
         * @memberof cortexpb.WriteRequestRW2
         * @static
         * @param {cortexpb.IWriteRequestRW2=} [properties] Properties to set
         * @returns {cortexpb.WriteRequestRW2} WriteRequestRW2 instance
         */
        WriteRequestRW2.create = function create(properties) {
            return new WriteRequestRW2(properties);
        };

        /**
         * Encodes the specified WriteRequestRW2 message. Does not implicitly {@link cortexpb.WriteRequestRW2.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.WriteRequestRW2
         * @static
         * @param {cortexpb.IWriteRequestRW2} message WriteRequestRW2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WriteRequestRW2.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.symbols != null && message.symbols.length)
                for (var i = 0; i < message.symbols.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.symbols[i]);
            if (message.timeseries != null && message.timeseries.length)
                for (var i = 0; i < message.timeseries.length; ++i)
                    $root.cortexpb.TimeSeriesRW2.encode(message.timeseries[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified WriteRequestRW2 message, length delimited. Does not implicitly {@link cortexpb.WriteRequestRW2.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.WriteRequestRW2
         * @static
         * @param {cortexpb.IWriteRequestRW2} message WriteRequestRW2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WriteRequestRW2.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WriteRequestRW2 message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.WriteRequestRW2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.WriteRequestRW2} WriteRequestRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WriteRequestRW2.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.WriteRequestRW2();
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
                        message.timeseries.push($root.cortexpb.TimeSeriesRW2.decode(reader, reader.uint32()));
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
         * Decodes a WriteRequestRW2 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.WriteRequestRW2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.WriteRequestRW2} WriteRequestRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WriteRequestRW2.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WriteRequestRW2 message.
         * @function verify
         * @memberof cortexpb.WriteRequestRW2
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WriteRequestRW2.verify = function verify(message) {
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
                    var error = $root.cortexpb.TimeSeriesRW2.verify(message.timeseries[i]);
                    if (error)
                        return "timeseries." + error;
                }
            }
            return null;
        };

        /**
         * Creates a WriteRequestRW2 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.WriteRequestRW2
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.WriteRequestRW2} WriteRequestRW2
         */
        WriteRequestRW2.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.WriteRequestRW2)
                return object;
            var message = new $root.cortexpb.WriteRequestRW2();
            if (object.symbols) {
                if (!Array.isArray(object.symbols))
                    throw TypeError(".cortexpb.WriteRequestRW2.symbols: array expected");
                message.symbols = [];
                for (var i = 0; i < object.symbols.length; ++i)
                    message.symbols[i] = String(object.symbols[i]);
            }
            if (object.timeseries) {
                if (!Array.isArray(object.timeseries))
                    throw TypeError(".cortexpb.WriteRequestRW2.timeseries: array expected");
                message.timeseries = [];
                for (var i = 0; i < object.timeseries.length; ++i) {
                    if (typeof object.timeseries[i] !== "object")
                        throw TypeError(".cortexpb.WriteRequestRW2.timeseries: object expected");
                    message.timeseries[i] = $root.cortexpb.TimeSeriesRW2.fromObject(object.timeseries[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a WriteRequestRW2 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.WriteRequestRW2
         * @static
         * @param {cortexpb.WriteRequestRW2} message WriteRequestRW2
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WriteRequestRW2.toObject = function toObject(message, options) {
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
                    object.timeseries[j] = $root.cortexpb.TimeSeriesRW2.toObject(message.timeseries[j], options);
            }
            return object;
        };

        /**
         * Converts this WriteRequestRW2 to JSON.
         * @function toJSON
         * @memberof cortexpb.WriteRequestRW2
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WriteRequestRW2.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for WriteRequestRW2
         * @function getTypeUrl
         * @memberof cortexpb.WriteRequestRW2
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        WriteRequestRW2.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.WriteRequestRW2";
        };

        return WriteRequestRW2;
    })();

    cortexpb.TimeSeriesRW2 = (function() {

        /**
         * Properties of a TimeSeriesRW2.
         * @memberof cortexpb
         * @interface ITimeSeriesRW2
         * @property {Array.<number>|null} [labelsRefs] TimeSeriesRW2 labelsRefs
         * @property {Array.<cortexpb.ISample>|null} [samples] TimeSeriesRW2 samples
         * @property {Array.<cortexpb.IHistogram>|null} [histograms] TimeSeriesRW2 histograms
         * @property {Array.<cortexpb.IExemplarRW2>|null} [exemplars] TimeSeriesRW2 exemplars
         * @property {cortexpb.IMetadataRW2|null} [metadata] TimeSeriesRW2 metadata
         * @property {number|Long|null} [createdTimestamp] TimeSeriesRW2 createdTimestamp
         */

        /**
         * Constructs a new TimeSeriesRW2.
         * @memberof cortexpb
         * @classdesc Represents a TimeSeriesRW2.
         * @implements ITimeSeriesRW2
         * @constructor
         * @param {cortexpb.ITimeSeriesRW2=} [properties] Properties to set
         */
        function TimeSeriesRW2(properties) {
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
         * TimeSeriesRW2 labelsRefs.
         * @member {Array.<number>} labelsRefs
         * @memberof cortexpb.TimeSeriesRW2
         * @instance
         */
        TimeSeriesRW2.prototype.labelsRefs = $util.emptyArray;

        /**
         * TimeSeriesRW2 samples.
         * @member {Array.<cortexpb.ISample>} samples
         * @memberof cortexpb.TimeSeriesRW2
         * @instance
         */
        TimeSeriesRW2.prototype.samples = $util.emptyArray;

        /**
         * TimeSeriesRW2 histograms.
         * @member {Array.<cortexpb.IHistogram>} histograms
         * @memberof cortexpb.TimeSeriesRW2
         * @instance
         */
        TimeSeriesRW2.prototype.histograms = $util.emptyArray;

        /**
         * TimeSeriesRW2 exemplars.
         * @member {Array.<cortexpb.IExemplarRW2>} exemplars
         * @memberof cortexpb.TimeSeriesRW2
         * @instance
         */
        TimeSeriesRW2.prototype.exemplars = $util.emptyArray;

        /**
         * TimeSeriesRW2 metadata.
         * @member {cortexpb.IMetadataRW2|null|undefined} metadata
         * @memberof cortexpb.TimeSeriesRW2
         * @instance
         */
        TimeSeriesRW2.prototype.metadata = null;

        /**
         * TimeSeriesRW2 createdTimestamp.
         * @member {number|Long} createdTimestamp
         * @memberof cortexpb.TimeSeriesRW2
         * @instance
         */
        TimeSeriesRW2.prototype.createdTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new TimeSeriesRW2 instance using the specified properties.
         * @function create
         * @memberof cortexpb.TimeSeriesRW2
         * @static
         * @param {cortexpb.ITimeSeriesRW2=} [properties] Properties to set
         * @returns {cortexpb.TimeSeriesRW2} TimeSeriesRW2 instance
         */
        TimeSeriesRW2.create = function create(properties) {
            return new TimeSeriesRW2(properties);
        };

        /**
         * Encodes the specified TimeSeriesRW2 message. Does not implicitly {@link cortexpb.TimeSeriesRW2.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.TimeSeriesRW2
         * @static
         * @param {cortexpb.ITimeSeriesRW2} message TimeSeriesRW2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TimeSeriesRW2.encode = function encode(message, writer) {
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
                    $root.cortexpb.Sample.encode(message.samples[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.histograms != null && message.histograms.length)
                for (var i = 0; i < message.histograms.length; ++i)
                    $root.cortexpb.Histogram.encode(message.histograms[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.exemplars != null && message.exemplars.length)
                for (var i = 0; i < message.exemplars.length; ++i)
                    $root.cortexpb.ExemplarRW2.encode(message.exemplars[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                $root.cortexpb.MetadataRW2.encode(message.metadata, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.createdTimestamp != null && Object.hasOwnProperty.call(message, "createdTimestamp"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.createdTimestamp);
            return writer;
        };

        /**
         * Encodes the specified TimeSeriesRW2 message, length delimited. Does not implicitly {@link cortexpb.TimeSeriesRW2.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.TimeSeriesRW2
         * @static
         * @param {cortexpb.ITimeSeriesRW2} message TimeSeriesRW2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TimeSeriesRW2.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TimeSeriesRW2 message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.TimeSeriesRW2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.TimeSeriesRW2} TimeSeriesRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TimeSeriesRW2.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.TimeSeriesRW2();
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
                        message.samples.push($root.cortexpb.Sample.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        if (!(message.histograms && message.histograms.length))
                            message.histograms = [];
                        message.histograms.push($root.cortexpb.Histogram.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        if (!(message.exemplars && message.exemplars.length))
                            message.exemplars = [];
                        message.exemplars.push($root.cortexpb.ExemplarRW2.decode(reader, reader.uint32()));
                        break;
                    }
                case 5: {
                        message.metadata = $root.cortexpb.MetadataRW2.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.createdTimestamp = reader.int64();
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
         * Decodes a TimeSeriesRW2 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.TimeSeriesRW2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.TimeSeriesRW2} TimeSeriesRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TimeSeriesRW2.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TimeSeriesRW2 message.
         * @function verify
         * @memberof cortexpb.TimeSeriesRW2
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TimeSeriesRW2.verify = function verify(message) {
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
                    var error = $root.cortexpb.Sample.verify(message.samples[i]);
                    if (error)
                        return "samples." + error;
                }
            }
            if (message.histograms != null && message.hasOwnProperty("histograms")) {
                if (!Array.isArray(message.histograms))
                    return "histograms: array expected";
                for (var i = 0; i < message.histograms.length; ++i) {
                    var error = $root.cortexpb.Histogram.verify(message.histograms[i]);
                    if (error)
                        return "histograms." + error;
                }
            }
            if (message.exemplars != null && message.hasOwnProperty("exemplars")) {
                if (!Array.isArray(message.exemplars))
                    return "exemplars: array expected";
                for (var i = 0; i < message.exemplars.length; ++i) {
                    var error = $root.cortexpb.ExemplarRW2.verify(message.exemplars[i]);
                    if (error)
                        return "exemplars." + error;
                }
            }
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
                var error = $root.cortexpb.MetadataRW2.verify(message.metadata);
                if (error)
                    return "metadata." + error;
            }
            if (message.createdTimestamp != null && message.hasOwnProperty("createdTimestamp"))
                if (!$util.isInteger(message.createdTimestamp) && !(message.createdTimestamp && $util.isInteger(message.createdTimestamp.low) && $util.isInteger(message.createdTimestamp.high)))
                    return "createdTimestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a TimeSeriesRW2 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.TimeSeriesRW2
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.TimeSeriesRW2} TimeSeriesRW2
         */
        TimeSeriesRW2.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.TimeSeriesRW2)
                return object;
            var message = new $root.cortexpb.TimeSeriesRW2();
            if (object.labelsRefs) {
                if (!Array.isArray(object.labelsRefs))
                    throw TypeError(".cortexpb.TimeSeriesRW2.labelsRefs: array expected");
                message.labelsRefs = [];
                for (var i = 0; i < object.labelsRefs.length; ++i)
                    message.labelsRefs[i] = object.labelsRefs[i] >>> 0;
            }
            if (object.samples) {
                if (!Array.isArray(object.samples))
                    throw TypeError(".cortexpb.TimeSeriesRW2.samples: array expected");
                message.samples = [];
                for (var i = 0; i < object.samples.length; ++i) {
                    if (typeof object.samples[i] !== "object")
                        throw TypeError(".cortexpb.TimeSeriesRW2.samples: object expected");
                    message.samples[i] = $root.cortexpb.Sample.fromObject(object.samples[i]);
                }
            }
            if (object.histograms) {
                if (!Array.isArray(object.histograms))
                    throw TypeError(".cortexpb.TimeSeriesRW2.histograms: array expected");
                message.histograms = [];
                for (var i = 0; i < object.histograms.length; ++i) {
                    if (typeof object.histograms[i] !== "object")
                        throw TypeError(".cortexpb.TimeSeriesRW2.histograms: object expected");
                    message.histograms[i] = $root.cortexpb.Histogram.fromObject(object.histograms[i]);
                }
            }
            if (object.exemplars) {
                if (!Array.isArray(object.exemplars))
                    throw TypeError(".cortexpb.TimeSeriesRW2.exemplars: array expected");
                message.exemplars = [];
                for (var i = 0; i < object.exemplars.length; ++i) {
                    if (typeof object.exemplars[i] !== "object")
                        throw TypeError(".cortexpb.TimeSeriesRW2.exemplars: object expected");
                    message.exemplars[i] = $root.cortexpb.ExemplarRW2.fromObject(object.exemplars[i]);
                }
            }
            if (object.metadata != null) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".cortexpb.TimeSeriesRW2.metadata: object expected");
                message.metadata = $root.cortexpb.MetadataRW2.fromObject(object.metadata);
            }
            if (object.createdTimestamp != null)
                if ($util.Long)
                    (message.createdTimestamp = $util.Long.fromValue(object.createdTimestamp)).unsigned = false;
                else if (typeof object.createdTimestamp === "string")
                    message.createdTimestamp = parseInt(object.createdTimestamp, 10);
                else if (typeof object.createdTimestamp === "number")
                    message.createdTimestamp = object.createdTimestamp;
                else if (typeof object.createdTimestamp === "object")
                    message.createdTimestamp = new $util.LongBits(object.createdTimestamp.low >>> 0, object.createdTimestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a TimeSeriesRW2 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.TimeSeriesRW2
         * @static
         * @param {cortexpb.TimeSeriesRW2} message TimeSeriesRW2
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TimeSeriesRW2.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.labelsRefs = [];
                object.samples = [];
                object.histograms = [];
                object.exemplars = [];
            }
            if (options.defaults) {
                object.metadata = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.createdTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.createdTimestamp = options.longs === String ? "0" : 0;
            }
            if (message.labelsRefs && message.labelsRefs.length) {
                object.labelsRefs = [];
                for (var j = 0; j < message.labelsRefs.length; ++j)
                    object.labelsRefs[j] = message.labelsRefs[j];
            }
            if (message.samples && message.samples.length) {
                object.samples = [];
                for (var j = 0; j < message.samples.length; ++j)
                    object.samples[j] = $root.cortexpb.Sample.toObject(message.samples[j], options);
            }
            if (message.histograms && message.histograms.length) {
                object.histograms = [];
                for (var j = 0; j < message.histograms.length; ++j)
                    object.histograms[j] = $root.cortexpb.Histogram.toObject(message.histograms[j], options);
            }
            if (message.exemplars && message.exemplars.length) {
                object.exemplars = [];
                for (var j = 0; j < message.exemplars.length; ++j)
                    object.exemplars[j] = $root.cortexpb.ExemplarRW2.toObject(message.exemplars[j], options);
            }
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                object.metadata = $root.cortexpb.MetadataRW2.toObject(message.metadata, options);
            if (message.createdTimestamp != null && message.hasOwnProperty("createdTimestamp"))
                if (typeof message.createdTimestamp === "number")
                    object.createdTimestamp = options.longs === String ? String(message.createdTimestamp) : message.createdTimestamp;
                else
                    object.createdTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.createdTimestamp) : options.longs === Number ? new $util.LongBits(message.createdTimestamp.low >>> 0, message.createdTimestamp.high >>> 0).toNumber() : message.createdTimestamp;
            return object;
        };

        /**
         * Converts this TimeSeriesRW2 to JSON.
         * @function toJSON
         * @memberof cortexpb.TimeSeriesRW2
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TimeSeriesRW2.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TimeSeriesRW2
         * @function getTypeUrl
         * @memberof cortexpb.TimeSeriesRW2
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TimeSeriesRW2.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.TimeSeriesRW2";
        };

        return TimeSeriesRW2;
    })();

    cortexpb.ExemplarRW2 = (function() {

        /**
         * Properties of an ExemplarRW2.
         * @memberof cortexpb
         * @interface IExemplarRW2
         * @property {Array.<number>|null} [labelsRefs] ExemplarRW2 labelsRefs
         * @property {number|null} [value] ExemplarRW2 value
         * @property {number|Long|null} [timestamp] ExemplarRW2 timestamp
         */

        /**
         * Constructs a new ExemplarRW2.
         * @memberof cortexpb
         * @classdesc Represents an ExemplarRW2.
         * @implements IExemplarRW2
         * @constructor
         * @param {cortexpb.IExemplarRW2=} [properties] Properties to set
         */
        function ExemplarRW2(properties) {
            this.labelsRefs = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExemplarRW2 labelsRefs.
         * @member {Array.<number>} labelsRefs
         * @memberof cortexpb.ExemplarRW2
         * @instance
         */
        ExemplarRW2.prototype.labelsRefs = $util.emptyArray;

        /**
         * ExemplarRW2 value.
         * @member {number} value
         * @memberof cortexpb.ExemplarRW2
         * @instance
         */
        ExemplarRW2.prototype.value = 0;

        /**
         * ExemplarRW2 timestamp.
         * @member {number|Long} timestamp
         * @memberof cortexpb.ExemplarRW2
         * @instance
         */
        ExemplarRW2.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new ExemplarRW2 instance using the specified properties.
         * @function create
         * @memberof cortexpb.ExemplarRW2
         * @static
         * @param {cortexpb.IExemplarRW2=} [properties] Properties to set
         * @returns {cortexpb.ExemplarRW2} ExemplarRW2 instance
         */
        ExemplarRW2.create = function create(properties) {
            return new ExemplarRW2(properties);
        };

        /**
         * Encodes the specified ExemplarRW2 message. Does not implicitly {@link cortexpb.ExemplarRW2.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.ExemplarRW2
         * @static
         * @param {cortexpb.IExemplarRW2} message ExemplarRW2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExemplarRW2.encode = function encode(message, writer) {
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
         * Encodes the specified ExemplarRW2 message, length delimited. Does not implicitly {@link cortexpb.ExemplarRW2.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.ExemplarRW2
         * @static
         * @param {cortexpb.IExemplarRW2} message ExemplarRW2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExemplarRW2.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExemplarRW2 message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.ExemplarRW2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.ExemplarRW2} ExemplarRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExemplarRW2.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.ExemplarRW2();
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
         * Decodes an ExemplarRW2 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.ExemplarRW2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.ExemplarRW2} ExemplarRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExemplarRW2.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExemplarRW2 message.
         * @function verify
         * @memberof cortexpb.ExemplarRW2
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExemplarRW2.verify = function verify(message) {
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
         * Creates an ExemplarRW2 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.ExemplarRW2
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.ExemplarRW2} ExemplarRW2
         */
        ExemplarRW2.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.ExemplarRW2)
                return object;
            var message = new $root.cortexpb.ExemplarRW2();
            if (object.labelsRefs) {
                if (!Array.isArray(object.labelsRefs))
                    throw TypeError(".cortexpb.ExemplarRW2.labelsRefs: array expected");
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
         * Creates a plain object from an ExemplarRW2 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.ExemplarRW2
         * @static
         * @param {cortexpb.ExemplarRW2} message ExemplarRW2
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExemplarRW2.toObject = function toObject(message, options) {
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
         * Converts this ExemplarRW2 to JSON.
         * @function toJSON
         * @memberof cortexpb.ExemplarRW2
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExemplarRW2.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ExemplarRW2
         * @function getTypeUrl
         * @memberof cortexpb.ExemplarRW2
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ExemplarRW2.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.ExemplarRW2";
        };

        return ExemplarRW2;
    })();

    cortexpb.MetadataRW2 = (function() {

        /**
         * Properties of a MetadataRW2.
         * @memberof cortexpb
         * @interface IMetadataRW2
         * @property {cortexpb.MetadataRW2.MetricType|null} [type] MetadataRW2 type
         * @property {number|null} [helpRef] MetadataRW2 helpRef
         * @property {number|null} [unitRef] MetadataRW2 unitRef
         */

        /**
         * Constructs a new MetadataRW2.
         * @memberof cortexpb
         * @classdesc Represents a MetadataRW2.
         * @implements IMetadataRW2
         * @constructor
         * @param {cortexpb.IMetadataRW2=} [properties] Properties to set
         */
        function MetadataRW2(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MetadataRW2 type.
         * @member {cortexpb.MetadataRW2.MetricType} type
         * @memberof cortexpb.MetadataRW2
         * @instance
         */
        MetadataRW2.prototype.type = 0;

        /**
         * MetadataRW2 helpRef.
         * @member {number} helpRef
         * @memberof cortexpb.MetadataRW2
         * @instance
         */
        MetadataRW2.prototype.helpRef = 0;

        /**
         * MetadataRW2 unitRef.
         * @member {number} unitRef
         * @memberof cortexpb.MetadataRW2
         * @instance
         */
        MetadataRW2.prototype.unitRef = 0;

        /**
         * Creates a new MetadataRW2 instance using the specified properties.
         * @function create
         * @memberof cortexpb.MetadataRW2
         * @static
         * @param {cortexpb.IMetadataRW2=} [properties] Properties to set
         * @returns {cortexpb.MetadataRW2} MetadataRW2 instance
         */
        MetadataRW2.create = function create(properties) {
            return new MetadataRW2(properties);
        };

        /**
         * Encodes the specified MetadataRW2 message. Does not implicitly {@link cortexpb.MetadataRW2.verify|verify} messages.
         * @function encode
         * @memberof cortexpb.MetadataRW2
         * @static
         * @param {cortexpb.IMetadataRW2} message MetadataRW2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MetadataRW2.encode = function encode(message, writer) {
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
         * Encodes the specified MetadataRW2 message, length delimited. Does not implicitly {@link cortexpb.MetadataRW2.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cortexpb.MetadataRW2
         * @static
         * @param {cortexpb.IMetadataRW2} message MetadataRW2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MetadataRW2.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MetadataRW2 message from the specified reader or buffer.
         * @function decode
         * @memberof cortexpb.MetadataRW2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cortexpb.MetadataRW2} MetadataRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MetadataRW2.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cortexpb.MetadataRW2();
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
         * Decodes a MetadataRW2 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cortexpb.MetadataRW2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cortexpb.MetadataRW2} MetadataRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MetadataRW2.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MetadataRW2 message.
         * @function verify
         * @memberof cortexpb.MetadataRW2
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MetadataRW2.verify = function verify(message) {
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
         * Creates a MetadataRW2 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cortexpb.MetadataRW2
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cortexpb.MetadataRW2} MetadataRW2
         */
        MetadataRW2.fromObject = function fromObject(object) {
            if (object instanceof $root.cortexpb.MetadataRW2)
                return object;
            var message = new $root.cortexpb.MetadataRW2();
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
         * Creates a plain object from a MetadataRW2 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cortexpb.MetadataRW2
         * @static
         * @param {cortexpb.MetadataRW2} message MetadataRW2
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MetadataRW2.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "METRIC_TYPE_UNSPECIFIED" : 0;
                object.helpRef = 0;
                object.unitRef = 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.cortexpb.MetadataRW2.MetricType[message.type] === undefined ? message.type : $root.cortexpb.MetadataRW2.MetricType[message.type] : message.type;
            if (message.helpRef != null && message.hasOwnProperty("helpRef"))
                object.helpRef = message.helpRef;
            if (message.unitRef != null && message.hasOwnProperty("unitRef"))
                object.unitRef = message.unitRef;
            return object;
        };

        /**
         * Converts this MetadataRW2 to JSON.
         * @function toJSON
         * @memberof cortexpb.MetadataRW2
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MetadataRW2.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MetadataRW2
         * @function getTypeUrl
         * @memberof cortexpb.MetadataRW2
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MetadataRW2.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/cortexpb.MetadataRW2";
        };

        /**
         * MetricType enum.
         * @name cortexpb.MetadataRW2.MetricType
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
        MetadataRW2.MetricType = (function() {
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

        return MetadataRW2;
    })();

    return cortexpb;
})();

module.exports = $root;
