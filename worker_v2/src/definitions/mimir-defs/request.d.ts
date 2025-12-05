import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace cortexpb. */
export namespace cortexpb {

    /** Properties of a WriteRequest. */
    interface IWriteRequest {

        /** WriteRequest timeseries */
        timeseries?: (cortexpb.ITimeSeries[]|null);

        /** WriteRequest Source */
        Source?: (cortexpb.WriteRequest.SourceEnum|null);

        /** WriteRequest metadata */
        metadata?: (cortexpb.IMetricMetadata[]|null);

        /** WriteRequest symbolsRW2 */
        symbolsRW2?: (string[]|null);

        /** WriteRequest timeseriesRW2 */
        timeseriesRW2?: (cortexpb.ITimeSeriesRW2[]|null);

        /** WriteRequest skipLabelValidation */
        skipLabelValidation?: (boolean|null);

        /** WriteRequest skipLabelCountValidation */
        skipLabelCountValidation?: (boolean|null);
    }

    /** Represents a WriteRequest. */
    class WriteRequest implements IWriteRequest {

        /**
         * Constructs a new WriteRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IWriteRequest);

        /** WriteRequest timeseries. */
        public timeseries: cortexpb.ITimeSeries[];

        /** WriteRequest Source. */
        public Source: cortexpb.WriteRequest.SourceEnum;

        /** WriteRequest metadata. */
        public metadata: cortexpb.IMetricMetadata[];

        /** WriteRequest symbolsRW2. */
        public symbolsRW2: string[];

        /** WriteRequest timeseriesRW2. */
        public timeseriesRW2: cortexpb.ITimeSeriesRW2[];

        /** WriteRequest skipLabelValidation. */
        public skipLabelValidation: boolean;

        /** WriteRequest skipLabelCountValidation. */
        public skipLabelCountValidation: boolean;

        /**
         * Creates a new WriteRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WriteRequest instance
         */
        public static create(properties?: cortexpb.IWriteRequest): cortexpb.WriteRequest;

        /**
         * Encodes the specified WriteRequest message. Does not implicitly {@link cortexpb.WriteRequest.verify|verify} messages.
         * @param message WriteRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IWriteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WriteRequest message, length delimited. Does not implicitly {@link cortexpb.WriteRequest.verify|verify} messages.
         * @param message WriteRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IWriteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WriteRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WriteRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.WriteRequest;

        /**
         * Decodes a WriteRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WriteRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.WriteRequest;

        /**
         * Verifies a WriteRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WriteRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WriteRequest
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.WriteRequest;

        /**
         * Creates a plain object from a WriteRequest message. Also converts values to other types if specified.
         * @param message WriteRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.WriteRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WriteRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WriteRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace WriteRequest {

        /** SourceEnum enum. */
        enum SourceEnum {
            API = 0,
            RULE = 1,
            OTLP = 2
        }
    }

    /** Properties of a WriteResponse. */
    interface IWriteResponse {
    }

    /** Represents a WriteResponse. */
    class WriteResponse implements IWriteResponse {

        /**
         * Constructs a new WriteResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IWriteResponse);

        /**
         * Creates a new WriteResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WriteResponse instance
         */
        public static create(properties?: cortexpb.IWriteResponse): cortexpb.WriteResponse;

        /**
         * Encodes the specified WriteResponse message. Does not implicitly {@link cortexpb.WriteResponse.verify|verify} messages.
         * @param message WriteResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IWriteResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WriteResponse message, length delimited. Does not implicitly {@link cortexpb.WriteResponse.verify|verify} messages.
         * @param message WriteResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IWriteResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WriteResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WriteResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.WriteResponse;

        /**
         * Decodes a WriteResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WriteResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.WriteResponse;

        /**
         * Verifies a WriteResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WriteResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WriteResponse
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.WriteResponse;

        /**
         * Creates a plain object from a WriteResponse message. Also converts values to other types if specified.
         * @param message WriteResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.WriteResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WriteResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WriteResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** ErrorCause enum. */
    enum ErrorCause {
        ERROR_CAUSE_UNKNOWN = 0,
        ERROR_CAUSE_REPLICAS_DID_NOT_MATCH = 1,
        ERROR_CAUSE_TOO_MANY_CLUSTERS = 2,
        ERROR_CAUSE_BAD_DATA = 3,
        ERROR_CAUSE_INGESTION_RATE_LIMITED = 4,
        ERROR_CAUSE_REQUEST_RATE_LIMITED = 5,
        ERROR_CAUSE_INSTANCE_LIMIT = 6,
        ERROR_CAUSE_SERVICE_UNAVAILABLE = 7,
        ERROR_CAUSE_TSDB_UNAVAILABLE = 8,
        ERROR_CAUSE_TOO_BUSY = 9,
        ERROR_CAUSE_CIRCUIT_BREAKER_OPEN = 10,
        ERROR_CAUSE_METHOD_NOT_ALLOWED = 11,
        ERROR_CAUSE_TENANT_LIMIT = 12,
        ERROR_CAUSE_ACTIVE_SERIES_LIMITED = 13
    }

    /** Properties of an ErrorDetails. */
    interface IErrorDetails {

        /** ErrorDetails Cause */
        Cause?: (cortexpb.ErrorCause|null);

        /** ErrorDetails Soft */
        Soft?: (boolean|null);
    }

    /** Represents an ErrorDetails. */
    class ErrorDetails implements IErrorDetails {

        /**
         * Constructs a new ErrorDetails.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IErrorDetails);

        /** ErrorDetails Cause. */
        public Cause: cortexpb.ErrorCause;

        /** ErrorDetails Soft. */
        public Soft: boolean;

        /**
         * Creates a new ErrorDetails instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ErrorDetails instance
         */
        public static create(properties?: cortexpb.IErrorDetails): cortexpb.ErrorDetails;

        /**
         * Encodes the specified ErrorDetails message. Does not implicitly {@link cortexpb.ErrorDetails.verify|verify} messages.
         * @param message ErrorDetails message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IErrorDetails, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ErrorDetails message, length delimited. Does not implicitly {@link cortexpb.ErrorDetails.verify|verify} messages.
         * @param message ErrorDetails message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IErrorDetails, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ErrorDetails message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ErrorDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.ErrorDetails;

        /**
         * Decodes an ErrorDetails message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ErrorDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.ErrorDetails;

        /**
         * Verifies an ErrorDetails message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ErrorDetails message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ErrorDetails
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.ErrorDetails;

        /**
         * Creates a plain object from an ErrorDetails message. Also converts values to other types if specified.
         * @param message ErrorDetails
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.ErrorDetails, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ErrorDetails to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ErrorDetails
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TimeSeries. */
    interface ITimeSeries {

        /** TimeSeries labels */
        labels?: (cortexpb.ILabelPair[]|null);

        /** TimeSeries samples */
        samples?: (cortexpb.ISample[]|null);

        /** TimeSeries exemplars */
        exemplars?: (cortexpb.IExemplar[]|null);

        /** TimeSeries histograms */
        histograms?: (cortexpb.IHistogram[]|null);

        /** TimeSeries createdTimestamp */
        createdTimestamp?: (number|Long|null);
    }

    /** Represents a TimeSeries. */
    class TimeSeries implements ITimeSeries {

        /**
         * Constructs a new TimeSeries.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.ITimeSeries);

        /** TimeSeries labels. */
        public labels: cortexpb.ILabelPair[];

        /** TimeSeries samples. */
        public samples: cortexpb.ISample[];

        /** TimeSeries exemplars. */
        public exemplars: cortexpb.IExemplar[];

        /** TimeSeries histograms. */
        public histograms: cortexpb.IHistogram[];

        /** TimeSeries createdTimestamp. */
        public createdTimestamp: (number|Long);

        /**
         * Creates a new TimeSeries instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TimeSeries instance
         */
        public static create(properties?: cortexpb.ITimeSeries): cortexpb.TimeSeries;

        /**
         * Encodes the specified TimeSeries message. Does not implicitly {@link cortexpb.TimeSeries.verify|verify} messages.
         * @param message TimeSeries message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.ITimeSeries, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TimeSeries message, length delimited. Does not implicitly {@link cortexpb.TimeSeries.verify|verify} messages.
         * @param message TimeSeries message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.ITimeSeries, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TimeSeries message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TimeSeries
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.TimeSeries;

        /**
         * Decodes a TimeSeries message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TimeSeries
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.TimeSeries;

        /**
         * Verifies a TimeSeries message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TimeSeries message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TimeSeries
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.TimeSeries;

        /**
         * Creates a plain object from a TimeSeries message. Also converts values to other types if specified.
         * @param message TimeSeries
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.TimeSeries, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TimeSeries to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TimeSeries
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LabelPair. */
    interface ILabelPair {

        /** LabelPair name */
        name?: (Uint8Array|null);

        /** LabelPair value */
        value?: (Uint8Array|null);
    }

    /** Represents a LabelPair. */
    class LabelPair implements ILabelPair {

        /**
         * Constructs a new LabelPair.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.ILabelPair);

        /** LabelPair name. */
        public name: Uint8Array;

        /** LabelPair value. */
        public value: Uint8Array;

        /**
         * Creates a new LabelPair instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LabelPair instance
         */
        public static create(properties?: cortexpb.ILabelPair): cortexpb.LabelPair;

        /**
         * Encodes the specified LabelPair message. Does not implicitly {@link cortexpb.LabelPair.verify|verify} messages.
         * @param message LabelPair message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.ILabelPair, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LabelPair message, length delimited. Does not implicitly {@link cortexpb.LabelPair.verify|verify} messages.
         * @param message LabelPair message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.ILabelPair, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LabelPair message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LabelPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.LabelPair;

        /**
         * Decodes a LabelPair message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LabelPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.LabelPair;

        /**
         * Verifies a LabelPair message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LabelPair message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LabelPair
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.LabelPair;

        /**
         * Creates a plain object from a LabelPair message. Also converts values to other types if specified.
         * @param message LabelPair
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.LabelPair, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LabelPair to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LabelPair
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Sample. */
    interface ISample {

        /** Sample timestampMs */
        timestampMs?: (number|Long|null);

        /** Sample value */
        value?: (number|null);
    }

    /** Represents a Sample. */
    class Sample implements ISample {

        /**
         * Constructs a new Sample.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.ISample);

        /** Sample timestampMs. */
        public timestampMs: (number|Long);

        /** Sample value. */
        public value: number;

        /**
         * Creates a new Sample instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Sample instance
         */
        public static create(properties?: cortexpb.ISample): cortexpb.Sample;

        /**
         * Encodes the specified Sample message. Does not implicitly {@link cortexpb.Sample.verify|verify} messages.
         * @param message Sample message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.ISample, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Sample message, length delimited. Does not implicitly {@link cortexpb.Sample.verify|verify} messages.
         * @param message Sample message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.ISample, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Sample message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Sample
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.Sample;

        /**
         * Decodes a Sample message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Sample
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.Sample;

        /**
         * Verifies a Sample message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Sample message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Sample
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.Sample;

        /**
         * Creates a plain object from a Sample message. Also converts values to other types if specified.
         * @param message Sample
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.Sample, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Sample to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Sample
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MetricMetadata. */
    interface IMetricMetadata {

        /** MetricMetadata type */
        type?: (cortexpb.MetricMetadata.MetricType|null);

        /** MetricMetadata metricFamilyName */
        metricFamilyName?: (string|null);

        /** MetricMetadata help */
        help?: (string|null);

        /** MetricMetadata unit */
        unit?: (string|null);
    }

    /** Represents a MetricMetadata. */
    class MetricMetadata implements IMetricMetadata {

        /**
         * Constructs a new MetricMetadata.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IMetricMetadata);

        /** MetricMetadata type. */
        public type: cortexpb.MetricMetadata.MetricType;

        /** MetricMetadata metricFamilyName. */
        public metricFamilyName: string;

        /** MetricMetadata help. */
        public help: string;

        /** MetricMetadata unit. */
        public unit: string;

        /**
         * Creates a new MetricMetadata instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MetricMetadata instance
         */
        public static create(properties?: cortexpb.IMetricMetadata): cortexpb.MetricMetadata;

        /**
         * Encodes the specified MetricMetadata message. Does not implicitly {@link cortexpb.MetricMetadata.verify|verify} messages.
         * @param message MetricMetadata message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IMetricMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MetricMetadata message, length delimited. Does not implicitly {@link cortexpb.MetricMetadata.verify|verify} messages.
         * @param message MetricMetadata message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IMetricMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MetricMetadata message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MetricMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.MetricMetadata;

        /**
         * Decodes a MetricMetadata message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MetricMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.MetricMetadata;

        /**
         * Verifies a MetricMetadata message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MetricMetadata message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MetricMetadata
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.MetricMetadata;

        /**
         * Creates a plain object from a MetricMetadata message. Also converts values to other types if specified.
         * @param message MetricMetadata
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.MetricMetadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MetricMetadata to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MetricMetadata
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MetricMetadata {

        /** MetricType enum. */
        enum MetricType {
            UNKNOWN = 0,
            COUNTER = 1,
            GAUGE = 2,
            HISTOGRAM = 3,
            GAUGEHISTOGRAM = 4,
            SUMMARY = 5,
            INFO = 6,
            STATESET = 7
        }
    }

    /** Properties of a Metric. */
    interface IMetric {

        /** Metric labels */
        labels?: (cortexpb.ILabelPair[]|null);
    }

    /** Represents a Metric. */
    class Metric implements IMetric {

        /**
         * Constructs a new Metric.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IMetric);

        /** Metric labels. */
        public labels: cortexpb.ILabelPair[];

        /**
         * Creates a new Metric instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Metric instance
         */
        public static create(properties?: cortexpb.IMetric): cortexpb.Metric;

        /**
         * Encodes the specified Metric message. Does not implicitly {@link cortexpb.Metric.verify|verify} messages.
         * @param message Metric message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IMetric, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Metric message, length delimited. Does not implicitly {@link cortexpb.Metric.verify|verify} messages.
         * @param message Metric message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IMetric, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Metric message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Metric
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.Metric;

        /**
         * Decodes a Metric message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Metric
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.Metric;

        /**
         * Verifies a Metric message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Metric message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Metric
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.Metric;

        /**
         * Creates a plain object from a Metric message. Also converts values to other types if specified.
         * @param message Metric
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.Metric, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Metric to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Metric
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Exemplar. */
    interface IExemplar {

        /** Exemplar labels */
        labels?: (cortexpb.ILabelPair[]|null);

        /** Exemplar value */
        value?: (number|null);

        /** Exemplar timestampMs */
        timestampMs?: (number|Long|null);
    }

    /** Represents an Exemplar. */
    class Exemplar implements IExemplar {

        /**
         * Constructs a new Exemplar.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IExemplar);

        /** Exemplar labels. */
        public labels: cortexpb.ILabelPair[];

        /** Exemplar value. */
        public value: number;

        /** Exemplar timestampMs. */
        public timestampMs: (number|Long);

        /**
         * Creates a new Exemplar instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Exemplar instance
         */
        public static create(properties?: cortexpb.IExemplar): cortexpb.Exemplar;

        /**
         * Encodes the specified Exemplar message. Does not implicitly {@link cortexpb.Exemplar.verify|verify} messages.
         * @param message Exemplar message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IExemplar, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Exemplar message, length delimited. Does not implicitly {@link cortexpb.Exemplar.verify|verify} messages.
         * @param message Exemplar message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IExemplar, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Exemplar message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Exemplar
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.Exemplar;

        /**
         * Decodes an Exemplar message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Exemplar
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.Exemplar;

        /**
         * Verifies an Exemplar message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Exemplar message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Exemplar
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.Exemplar;

        /**
         * Creates a plain object from an Exemplar message. Also converts values to other types if specified.
         * @param message Exemplar
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.Exemplar, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Exemplar to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Exemplar
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Histogram. */
    interface IHistogram {

        /** Histogram countInt */
        countInt?: (number|Long|null);

        /** Histogram countFloat */
        countFloat?: (number|null);

        /** Histogram sum */
        sum?: (number|null);

        /** Histogram schema */
        schema?: (number|null);

        /** Histogram zeroThreshold */
        zeroThreshold?: (number|null);

        /** Histogram zeroCountInt */
        zeroCountInt?: (number|Long|null);

        /** Histogram zeroCountFloat */
        zeroCountFloat?: (number|null);

        /** Histogram negativeSpans */
        negativeSpans?: (cortexpb.IBucketSpan[]|null);

        /** Histogram negativeDeltas */
        negativeDeltas?: ((number|Long)[]|null);

        /** Histogram negativeCounts */
        negativeCounts?: (number[]|null);

        /** Histogram positiveSpans */
        positiveSpans?: (cortexpb.IBucketSpan[]|null);

        /** Histogram positiveDeltas */
        positiveDeltas?: ((number|Long)[]|null);

        /** Histogram positiveCounts */
        positiveCounts?: (number[]|null);

        /** Histogram resetHint */
        resetHint?: (cortexpb.Histogram.ResetHint|null);

        /** Histogram timestamp */
        timestamp?: (number|Long|null);

        /** Histogram customValues */
        customValues?: (number[]|null);
    }

    /** Represents a Histogram. */
    class Histogram implements IHistogram {

        /**
         * Constructs a new Histogram.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IHistogram);

        /** Histogram countInt. */
        public countInt?: (number|Long|null);

        /** Histogram countFloat. */
        public countFloat?: (number|null);

        /** Histogram sum. */
        public sum: number;

        /** Histogram schema. */
        public schema: number;

        /** Histogram zeroThreshold. */
        public zeroThreshold: number;

        /** Histogram zeroCountInt. */
        public zeroCountInt?: (number|Long|null);

        /** Histogram zeroCountFloat. */
        public zeroCountFloat?: (number|null);

        /** Histogram negativeSpans. */
        public negativeSpans: cortexpb.IBucketSpan[];

        /** Histogram negativeDeltas. */
        public negativeDeltas: (number|Long)[];

        /** Histogram negativeCounts. */
        public negativeCounts: number[];

        /** Histogram positiveSpans. */
        public positiveSpans: cortexpb.IBucketSpan[];

        /** Histogram positiveDeltas. */
        public positiveDeltas: (number|Long)[];

        /** Histogram positiveCounts. */
        public positiveCounts: number[];

        /** Histogram resetHint. */
        public resetHint: cortexpb.Histogram.ResetHint;

        /** Histogram timestamp. */
        public timestamp: (number|Long);

        /** Histogram customValues. */
        public customValues: number[];

        /** Histogram count. */
        public count?: ("countInt"|"countFloat");

        /** Histogram zeroCount. */
        public zeroCount?: ("zeroCountInt"|"zeroCountFloat");

        /**
         * Creates a new Histogram instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Histogram instance
         */
        public static create(properties?: cortexpb.IHistogram): cortexpb.Histogram;

        /**
         * Encodes the specified Histogram message. Does not implicitly {@link cortexpb.Histogram.verify|verify} messages.
         * @param message Histogram message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IHistogram, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Histogram message, length delimited. Does not implicitly {@link cortexpb.Histogram.verify|verify} messages.
         * @param message Histogram message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IHistogram, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Histogram message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Histogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.Histogram;

        /**
         * Decodes a Histogram message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Histogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.Histogram;

        /**
         * Verifies a Histogram message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Histogram message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Histogram
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.Histogram;

        /**
         * Creates a plain object from a Histogram message. Also converts values to other types if specified.
         * @param message Histogram
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.Histogram, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Histogram to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Histogram
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Histogram {

        /** ResetHint enum. */
        enum ResetHint {
            UNKNOWN = 0,
            YES = 1,
            NO = 2,
            GAUGE = 3
        }
    }

    /** Properties of a FloatHistogram. */
    interface IFloatHistogram {

        /** FloatHistogram counterResetHint */
        counterResetHint?: (number|null);

        /** FloatHistogram schema */
        schema?: (number|null);

        /** FloatHistogram zeroThreshold */
        zeroThreshold?: (number|null);

        /** FloatHistogram zeroCount */
        zeroCount?: (number|null);

        /** FloatHistogram count */
        count?: (number|null);

        /** FloatHistogram sum */
        sum?: (number|null);

        /** FloatHistogram positiveSpans */
        positiveSpans?: (cortexpb.IBucketSpan[]|null);

        /** FloatHistogram negativeSpans */
        negativeSpans?: (cortexpb.IBucketSpan[]|null);

        /** FloatHistogram positiveBuckets */
        positiveBuckets?: (number[]|null);

        /** FloatHistogram negativeBuckets */
        negativeBuckets?: (number[]|null);

        /** FloatHistogram customValues */
        customValues?: (number[]|null);
    }

    /** Represents a FloatHistogram. */
    class FloatHistogram implements IFloatHistogram {

        /**
         * Constructs a new FloatHistogram.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IFloatHistogram);

        /** FloatHistogram counterResetHint. */
        public counterResetHint: number;

        /** FloatHistogram schema. */
        public schema: number;

        /** FloatHistogram zeroThreshold. */
        public zeroThreshold: number;

        /** FloatHistogram zeroCount. */
        public zeroCount: number;

        /** FloatHistogram count. */
        public count: number;

        /** FloatHistogram sum. */
        public sum: number;

        /** FloatHistogram positiveSpans. */
        public positiveSpans: cortexpb.IBucketSpan[];

        /** FloatHistogram negativeSpans. */
        public negativeSpans: cortexpb.IBucketSpan[];

        /** FloatHistogram positiveBuckets. */
        public positiveBuckets: number[];

        /** FloatHistogram negativeBuckets. */
        public negativeBuckets: number[];

        /** FloatHistogram customValues. */
        public customValues: number[];

        /**
         * Creates a new FloatHistogram instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FloatHistogram instance
         */
        public static create(properties?: cortexpb.IFloatHistogram): cortexpb.FloatHistogram;

        /**
         * Encodes the specified FloatHistogram message. Does not implicitly {@link cortexpb.FloatHistogram.verify|verify} messages.
         * @param message FloatHistogram message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IFloatHistogram, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FloatHistogram message, length delimited. Does not implicitly {@link cortexpb.FloatHistogram.verify|verify} messages.
         * @param message FloatHistogram message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IFloatHistogram, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FloatHistogram message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FloatHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.FloatHistogram;

        /**
         * Decodes a FloatHistogram message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FloatHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.FloatHistogram;

        /**
         * Verifies a FloatHistogram message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FloatHistogram message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FloatHistogram
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.FloatHistogram;

        /**
         * Creates a plain object from a FloatHistogram message. Also converts values to other types if specified.
         * @param message FloatHistogram
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.FloatHistogram, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FloatHistogram to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FloatHistogram
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a BucketSpan. */
    interface IBucketSpan {

        /** BucketSpan offset */
        offset?: (number|null);

        /** BucketSpan length */
        length?: (number|null);
    }

    /** Represents a BucketSpan. */
    class BucketSpan implements IBucketSpan {

        /**
         * Constructs a new BucketSpan.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IBucketSpan);

        /** BucketSpan offset. */
        public offset: number;

        /** BucketSpan length. */
        public length: number;

        /**
         * Creates a new BucketSpan instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BucketSpan instance
         */
        public static create(properties?: cortexpb.IBucketSpan): cortexpb.BucketSpan;

        /**
         * Encodes the specified BucketSpan message. Does not implicitly {@link cortexpb.BucketSpan.verify|verify} messages.
         * @param message BucketSpan message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IBucketSpan, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BucketSpan message, length delimited. Does not implicitly {@link cortexpb.BucketSpan.verify|verify} messages.
         * @param message BucketSpan message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IBucketSpan, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BucketSpan message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BucketSpan
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.BucketSpan;

        /**
         * Decodes a BucketSpan message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BucketSpan
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.BucketSpan;

        /**
         * Verifies a BucketSpan message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BucketSpan message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BucketSpan
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.BucketSpan;

        /**
         * Creates a plain object from a BucketSpan message. Also converts values to other types if specified.
         * @param message BucketSpan
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.BucketSpan, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BucketSpan to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for BucketSpan
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FloatHistogramPair. */
    interface IFloatHistogramPair {

        /** FloatHistogramPair timestampMs */
        timestampMs?: (number|Long|null);

        /** FloatHistogramPair histogram */
        histogram?: (cortexpb.IFloatHistogram|null);
    }

    /** Represents a FloatHistogramPair. */
    class FloatHistogramPair implements IFloatHistogramPair {

        /**
         * Constructs a new FloatHistogramPair.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IFloatHistogramPair);

        /** FloatHistogramPair timestampMs. */
        public timestampMs: (number|Long);

        /** FloatHistogramPair histogram. */
        public histogram?: (cortexpb.IFloatHistogram|null);

        /**
         * Creates a new FloatHistogramPair instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FloatHistogramPair instance
         */
        public static create(properties?: cortexpb.IFloatHistogramPair): cortexpb.FloatHistogramPair;

        /**
         * Encodes the specified FloatHistogramPair message. Does not implicitly {@link cortexpb.FloatHistogramPair.verify|verify} messages.
         * @param message FloatHistogramPair message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IFloatHistogramPair, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FloatHistogramPair message, length delimited. Does not implicitly {@link cortexpb.FloatHistogramPair.verify|verify} messages.
         * @param message FloatHistogramPair message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IFloatHistogramPair, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FloatHistogramPair message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FloatHistogramPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.FloatHistogramPair;

        /**
         * Decodes a FloatHistogramPair message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FloatHistogramPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.FloatHistogramPair;

        /**
         * Verifies a FloatHistogramPair message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FloatHistogramPair message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FloatHistogramPair
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.FloatHistogramPair;

        /**
         * Creates a plain object from a FloatHistogramPair message. Also converts values to other types if specified.
         * @param message FloatHistogramPair
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.FloatHistogramPair, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FloatHistogramPair to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FloatHistogramPair
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SampleHistogram. */
    interface ISampleHistogram {

        /** SampleHistogram count */
        count?: (number|null);

        /** SampleHistogram sum */
        sum?: (number|null);

        /** SampleHistogram buckets */
        buckets?: (cortexpb.IHistogramBucket[]|null);
    }

    /** Represents a SampleHistogram. */
    class SampleHistogram implements ISampleHistogram {

        /**
         * Constructs a new SampleHistogram.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.ISampleHistogram);

        /** SampleHistogram count. */
        public count: number;

        /** SampleHistogram sum. */
        public sum: number;

        /** SampleHistogram buckets. */
        public buckets: cortexpb.IHistogramBucket[];

        /**
         * Creates a new SampleHistogram instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SampleHistogram instance
         */
        public static create(properties?: cortexpb.ISampleHistogram): cortexpb.SampleHistogram;

        /**
         * Encodes the specified SampleHistogram message. Does not implicitly {@link cortexpb.SampleHistogram.verify|verify} messages.
         * @param message SampleHistogram message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.ISampleHistogram, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SampleHistogram message, length delimited. Does not implicitly {@link cortexpb.SampleHistogram.verify|verify} messages.
         * @param message SampleHistogram message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.ISampleHistogram, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SampleHistogram message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SampleHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.SampleHistogram;

        /**
         * Decodes a SampleHistogram message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SampleHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.SampleHistogram;

        /**
         * Verifies a SampleHistogram message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SampleHistogram message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SampleHistogram
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.SampleHistogram;

        /**
         * Creates a plain object from a SampleHistogram message. Also converts values to other types if specified.
         * @param message SampleHistogram
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.SampleHistogram, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SampleHistogram to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SampleHistogram
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a HistogramBucket. */
    interface IHistogramBucket {

        /** HistogramBucket boundaries */
        boundaries?: (number|null);

        /** HistogramBucket lower */
        lower?: (number|null);

        /** HistogramBucket upper */
        upper?: (number|null);

        /** HistogramBucket count */
        count?: (number|null);
    }

    /** Represents a HistogramBucket. */
    class HistogramBucket implements IHistogramBucket {

        /**
         * Constructs a new HistogramBucket.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IHistogramBucket);

        /** HistogramBucket boundaries. */
        public boundaries: number;

        /** HistogramBucket lower. */
        public lower: number;

        /** HistogramBucket upper. */
        public upper: number;

        /** HistogramBucket count. */
        public count: number;

        /**
         * Creates a new HistogramBucket instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HistogramBucket instance
         */
        public static create(properties?: cortexpb.IHistogramBucket): cortexpb.HistogramBucket;

        /**
         * Encodes the specified HistogramBucket message. Does not implicitly {@link cortexpb.HistogramBucket.verify|verify} messages.
         * @param message HistogramBucket message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IHistogramBucket, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HistogramBucket message, length delimited. Does not implicitly {@link cortexpb.HistogramBucket.verify|verify} messages.
         * @param message HistogramBucket message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IHistogramBucket, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HistogramBucket message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HistogramBucket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.HistogramBucket;

        /**
         * Decodes a HistogramBucket message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HistogramBucket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.HistogramBucket;

        /**
         * Verifies a HistogramBucket message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HistogramBucket message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HistogramBucket
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.HistogramBucket;

        /**
         * Creates a plain object from a HistogramBucket message. Also converts values to other types if specified.
         * @param message HistogramBucket
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.HistogramBucket, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HistogramBucket to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HistogramBucket
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SampleHistogramPair. */
    interface ISampleHistogramPair {

        /** SampleHistogramPair timestamp */
        timestamp?: (number|Long|null);

        /** SampleHistogramPair histogram */
        histogram?: (cortexpb.ISampleHistogram|null);
    }

    /** Represents a SampleHistogramPair. */
    class SampleHistogramPair implements ISampleHistogramPair {

        /**
         * Constructs a new SampleHistogramPair.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.ISampleHistogramPair);

        /** SampleHistogramPair timestamp. */
        public timestamp: (number|Long);

        /** SampleHistogramPair histogram. */
        public histogram?: (cortexpb.ISampleHistogram|null);

        /**
         * Creates a new SampleHistogramPair instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SampleHistogramPair instance
         */
        public static create(properties?: cortexpb.ISampleHistogramPair): cortexpb.SampleHistogramPair;

        /**
         * Encodes the specified SampleHistogramPair message. Does not implicitly {@link cortexpb.SampleHistogramPair.verify|verify} messages.
         * @param message SampleHistogramPair message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.ISampleHistogramPair, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SampleHistogramPair message, length delimited. Does not implicitly {@link cortexpb.SampleHistogramPair.verify|verify} messages.
         * @param message SampleHistogramPair message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.ISampleHistogramPair, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SampleHistogramPair message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SampleHistogramPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.SampleHistogramPair;

        /**
         * Decodes a SampleHistogramPair message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SampleHistogramPair
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.SampleHistogramPair;

        /**
         * Verifies a SampleHistogramPair message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SampleHistogramPair message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SampleHistogramPair
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.SampleHistogramPair;

        /**
         * Creates a plain object from a SampleHistogramPair message. Also converts values to other types if specified.
         * @param message SampleHistogramPair
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.SampleHistogramPair, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SampleHistogramPair to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SampleHistogramPair
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** QueryStatus enum. */
    enum QueryStatus {
        QUERY_STATUS_ERROR = 0,
        QUERY_STATUS_SUCCESS = 1
    }

    /** QueryErrorType enum. */
    enum QueryErrorType {
        QUERY_ERROR_TYPE_NONE = 0,
        QUERY_ERROR_TYPE_TIMEOUT = 1,
        QUERY_ERROR_TYPE_CANCELED = 2,
        QUERY_ERROR_TYPE_EXECUTION = 3,
        QUERY_ERROR_TYPE_BAD_DATA = 4,
        QUERY_ERROR_TYPE_INTERNAL = 5,
        QUERY_ERROR_TYPE_UNAVAILABLE = 6,
        QUERY_ERROR_TYPE_NOT_FOUND = 7,
        QUERY_ERROR_TYPE_NOT_ACCEPTABLE = 8,
        QUERY_ERROR_TYPE_TOO_MANY_REQUESTS = 9,
        QUERY_ERROR_TYPE_TOO_LARGE_ENTRY = 10
    }

    /** Properties of a QueryResponse. */
    interface IQueryResponse {

        /** QueryResponse status */
        status?: (cortexpb.QueryStatus|null);

        /** QueryResponse errorType */
        errorType?: (cortexpb.QueryErrorType|null);

        /** QueryResponse error */
        error?: (string|null);

        /** QueryResponse string */
        string?: (cortexpb.IStringData|null);

        /** QueryResponse vector */
        vector?: (cortexpb.IVectorData|null);

        /** QueryResponse scalar */
        scalar?: (cortexpb.IScalarData|null);

        /** QueryResponse matrix */
        matrix?: (cortexpb.IMatrixData|null);

        /** QueryResponse warnings */
        warnings?: (string[]|null);

        /** QueryResponse infos */
        infos?: (string[]|null);
    }

    /** Represents a QueryResponse. */
    class QueryResponse implements IQueryResponse {

        /**
         * Constructs a new QueryResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IQueryResponse);

        /** QueryResponse status. */
        public status: cortexpb.QueryStatus;

        /** QueryResponse errorType. */
        public errorType: cortexpb.QueryErrorType;

        /** QueryResponse error. */
        public error: string;

        /** QueryResponse string. */
        public string?: (cortexpb.IStringData|null);

        /** QueryResponse vector. */
        public vector?: (cortexpb.IVectorData|null);

        /** QueryResponse scalar. */
        public scalar?: (cortexpb.IScalarData|null);

        /** QueryResponse matrix. */
        public matrix?: (cortexpb.IMatrixData|null);

        /** QueryResponse warnings. */
        public warnings: string[];

        /** QueryResponse infos. */
        public infos: string[];

        /** QueryResponse data. */
        public data?: ("string"|"vector"|"scalar"|"matrix");

        /**
         * Creates a new QueryResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QueryResponse instance
         */
        public static create(properties?: cortexpb.IQueryResponse): cortexpb.QueryResponse;

        /**
         * Encodes the specified QueryResponse message. Does not implicitly {@link cortexpb.QueryResponse.verify|verify} messages.
         * @param message QueryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IQueryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QueryResponse message, length delimited. Does not implicitly {@link cortexpb.QueryResponse.verify|verify} messages.
         * @param message QueryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IQueryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QueryResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QueryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.QueryResponse;

        /**
         * Decodes a QueryResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QueryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.QueryResponse;

        /**
         * Verifies a QueryResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QueryResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QueryResponse
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.QueryResponse;

        /**
         * Creates a plain object from a QueryResponse message. Also converts values to other types if specified.
         * @param message QueryResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.QueryResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QueryResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for QueryResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a StringData. */
    interface IStringData {

        /** StringData value */
        value?: (string|null);

        /** StringData timestampMs */
        timestampMs?: (number|Long|null);
    }

    /** Represents a StringData. */
    class StringData implements IStringData {

        /**
         * Constructs a new StringData.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IStringData);

        /** StringData value. */
        public value: string;

        /** StringData timestampMs. */
        public timestampMs: (number|Long);

        /**
         * Creates a new StringData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StringData instance
         */
        public static create(properties?: cortexpb.IStringData): cortexpb.StringData;

        /**
         * Encodes the specified StringData message. Does not implicitly {@link cortexpb.StringData.verify|verify} messages.
         * @param message StringData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IStringData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StringData message, length delimited. Does not implicitly {@link cortexpb.StringData.verify|verify} messages.
         * @param message StringData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IStringData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StringData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StringData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.StringData;

        /**
         * Decodes a StringData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StringData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.StringData;

        /**
         * Verifies a StringData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StringData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StringData
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.StringData;

        /**
         * Creates a plain object from a StringData message. Also converts values to other types if specified.
         * @param message StringData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.StringData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StringData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for StringData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a VectorData. */
    interface IVectorData {

        /** VectorData samples */
        samples?: (cortexpb.IVectorSample[]|null);

        /** VectorData histograms */
        histograms?: (cortexpb.IVectorHistogram[]|null);
    }

    /** Represents a VectorData. */
    class VectorData implements IVectorData {

        /**
         * Constructs a new VectorData.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IVectorData);

        /** VectorData samples. */
        public samples: cortexpb.IVectorSample[];

        /** VectorData histograms. */
        public histograms: cortexpb.IVectorHistogram[];

        /**
         * Creates a new VectorData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VectorData instance
         */
        public static create(properties?: cortexpb.IVectorData): cortexpb.VectorData;

        /**
         * Encodes the specified VectorData message. Does not implicitly {@link cortexpb.VectorData.verify|verify} messages.
         * @param message VectorData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IVectorData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VectorData message, length delimited. Does not implicitly {@link cortexpb.VectorData.verify|verify} messages.
         * @param message VectorData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IVectorData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VectorData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VectorData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.VectorData;

        /**
         * Decodes a VectorData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VectorData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.VectorData;

        /**
         * Verifies a VectorData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VectorData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VectorData
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.VectorData;

        /**
         * Creates a plain object from a VectorData message. Also converts values to other types if specified.
         * @param message VectorData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.VectorData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VectorData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for VectorData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a VectorSample. */
    interface IVectorSample {

        /** VectorSample metric */
        metric?: (string[]|null);

        /** VectorSample value */
        value?: (number|null);

        /** VectorSample timestampMs */
        timestampMs?: (number|Long|null);
    }

    /** Represents a VectorSample. */
    class VectorSample implements IVectorSample {

        /**
         * Constructs a new VectorSample.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IVectorSample);

        /** VectorSample metric. */
        public metric: string[];

        /** VectorSample value. */
        public value: number;

        /** VectorSample timestampMs. */
        public timestampMs: (number|Long);

        /**
         * Creates a new VectorSample instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VectorSample instance
         */
        public static create(properties?: cortexpb.IVectorSample): cortexpb.VectorSample;

        /**
         * Encodes the specified VectorSample message. Does not implicitly {@link cortexpb.VectorSample.verify|verify} messages.
         * @param message VectorSample message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IVectorSample, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VectorSample message, length delimited. Does not implicitly {@link cortexpb.VectorSample.verify|verify} messages.
         * @param message VectorSample message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IVectorSample, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VectorSample message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VectorSample
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.VectorSample;

        /**
         * Decodes a VectorSample message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VectorSample
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.VectorSample;

        /**
         * Verifies a VectorSample message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VectorSample message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VectorSample
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.VectorSample;

        /**
         * Creates a plain object from a VectorSample message. Also converts values to other types if specified.
         * @param message VectorSample
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.VectorSample, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VectorSample to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for VectorSample
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a VectorHistogram. */
    interface IVectorHistogram {

        /** VectorHistogram metric */
        metric?: (string[]|null);

        /** VectorHistogram histogram */
        histogram?: (cortexpb.IFloatHistogram|null);

        /** VectorHistogram timestampMs */
        timestampMs?: (number|Long|null);
    }

    /** Represents a VectorHistogram. */
    class VectorHistogram implements IVectorHistogram {

        /**
         * Constructs a new VectorHistogram.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IVectorHistogram);

        /** VectorHistogram metric. */
        public metric: string[];

        /** VectorHistogram histogram. */
        public histogram?: (cortexpb.IFloatHistogram|null);

        /** VectorHistogram timestampMs. */
        public timestampMs: (number|Long);

        /**
         * Creates a new VectorHistogram instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VectorHistogram instance
         */
        public static create(properties?: cortexpb.IVectorHistogram): cortexpb.VectorHistogram;

        /**
         * Encodes the specified VectorHistogram message. Does not implicitly {@link cortexpb.VectorHistogram.verify|verify} messages.
         * @param message VectorHistogram message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IVectorHistogram, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VectorHistogram message, length delimited. Does not implicitly {@link cortexpb.VectorHistogram.verify|verify} messages.
         * @param message VectorHistogram message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IVectorHistogram, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VectorHistogram message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VectorHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.VectorHistogram;

        /**
         * Decodes a VectorHistogram message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VectorHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.VectorHistogram;

        /**
         * Verifies a VectorHistogram message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VectorHistogram message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VectorHistogram
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.VectorHistogram;

        /**
         * Creates a plain object from a VectorHistogram message. Also converts values to other types if specified.
         * @param message VectorHistogram
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.VectorHistogram, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VectorHistogram to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for VectorHistogram
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ScalarData. */
    interface IScalarData {

        /** ScalarData value */
        value?: (number|null);

        /** ScalarData timestampMs */
        timestampMs?: (number|Long|null);
    }

    /** Represents a ScalarData. */
    class ScalarData implements IScalarData {

        /**
         * Constructs a new ScalarData.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IScalarData);

        /** ScalarData value. */
        public value: number;

        /** ScalarData timestampMs. */
        public timestampMs: (number|Long);

        /**
         * Creates a new ScalarData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ScalarData instance
         */
        public static create(properties?: cortexpb.IScalarData): cortexpb.ScalarData;

        /**
         * Encodes the specified ScalarData message. Does not implicitly {@link cortexpb.ScalarData.verify|verify} messages.
         * @param message ScalarData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IScalarData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ScalarData message, length delimited. Does not implicitly {@link cortexpb.ScalarData.verify|verify} messages.
         * @param message ScalarData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IScalarData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ScalarData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ScalarData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.ScalarData;

        /**
         * Decodes a ScalarData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ScalarData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.ScalarData;

        /**
         * Verifies a ScalarData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ScalarData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ScalarData
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.ScalarData;

        /**
         * Creates a plain object from a ScalarData message. Also converts values to other types if specified.
         * @param message ScalarData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.ScalarData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ScalarData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ScalarData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MatrixData. */
    interface IMatrixData {

        /** MatrixData series */
        series?: (cortexpb.IMatrixSeries[]|null);
    }

    /** Represents a MatrixData. */
    class MatrixData implements IMatrixData {

        /**
         * Constructs a new MatrixData.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IMatrixData);

        /** MatrixData series. */
        public series: cortexpb.IMatrixSeries[];

        /**
         * Creates a new MatrixData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MatrixData instance
         */
        public static create(properties?: cortexpb.IMatrixData): cortexpb.MatrixData;

        /**
         * Encodes the specified MatrixData message. Does not implicitly {@link cortexpb.MatrixData.verify|verify} messages.
         * @param message MatrixData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IMatrixData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MatrixData message, length delimited. Does not implicitly {@link cortexpb.MatrixData.verify|verify} messages.
         * @param message MatrixData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IMatrixData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MatrixData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MatrixData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.MatrixData;

        /**
         * Decodes a MatrixData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MatrixData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.MatrixData;

        /**
         * Verifies a MatrixData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MatrixData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MatrixData
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.MatrixData;

        /**
         * Creates a plain object from a MatrixData message. Also converts values to other types if specified.
         * @param message MatrixData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.MatrixData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MatrixData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MatrixData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MatrixSeries. */
    interface IMatrixSeries {

        /** MatrixSeries metric */
        metric?: (string[]|null);

        /** MatrixSeries samples */
        samples?: (cortexpb.ISample[]|null);

        /** MatrixSeries histograms */
        histograms?: (cortexpb.IFloatHistogramPair[]|null);
    }

    /** Represents a MatrixSeries. */
    class MatrixSeries implements IMatrixSeries {

        /**
         * Constructs a new MatrixSeries.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IMatrixSeries);

        /** MatrixSeries metric. */
        public metric: string[];

        /** MatrixSeries samples. */
        public samples: cortexpb.ISample[];

        /** MatrixSeries histograms. */
        public histograms: cortexpb.IFloatHistogramPair[];

        /**
         * Creates a new MatrixSeries instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MatrixSeries instance
         */
        public static create(properties?: cortexpb.IMatrixSeries): cortexpb.MatrixSeries;

        /**
         * Encodes the specified MatrixSeries message. Does not implicitly {@link cortexpb.MatrixSeries.verify|verify} messages.
         * @param message MatrixSeries message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IMatrixSeries, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MatrixSeries message, length delimited. Does not implicitly {@link cortexpb.MatrixSeries.verify|verify} messages.
         * @param message MatrixSeries message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IMatrixSeries, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MatrixSeries message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MatrixSeries
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.MatrixSeries;

        /**
         * Decodes a MatrixSeries message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MatrixSeries
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.MatrixSeries;

        /**
         * Verifies a MatrixSeries message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MatrixSeries message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MatrixSeries
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.MatrixSeries;

        /**
         * Creates a plain object from a MatrixSeries message. Also converts values to other types if specified.
         * @param message MatrixSeries
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.MatrixSeries, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MatrixSeries to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MatrixSeries
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a WriteRequestRW2. */
    interface IWriteRequestRW2 {

        /** WriteRequestRW2 symbols */
        symbols?: (string[]|null);

        /** WriteRequestRW2 timeseries */
        timeseries?: (cortexpb.ITimeSeriesRW2[]|null);
    }

    /** Represents a WriteRequestRW2. */
    class WriteRequestRW2 implements IWriteRequestRW2 {

        /**
         * Constructs a new WriteRequestRW2.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IWriteRequestRW2);

        /** WriteRequestRW2 symbols. */
        public symbols: string[];

        /** WriteRequestRW2 timeseries. */
        public timeseries: cortexpb.ITimeSeriesRW2[];

        /**
         * Creates a new WriteRequestRW2 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WriteRequestRW2 instance
         */
        public static create(properties?: cortexpb.IWriteRequestRW2): cortexpb.WriteRequestRW2;

        /**
         * Encodes the specified WriteRequestRW2 message. Does not implicitly {@link cortexpb.WriteRequestRW2.verify|verify} messages.
         * @param message WriteRequestRW2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IWriteRequestRW2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WriteRequestRW2 message, length delimited. Does not implicitly {@link cortexpb.WriteRequestRW2.verify|verify} messages.
         * @param message WriteRequestRW2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IWriteRequestRW2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WriteRequestRW2 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WriteRequestRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.WriteRequestRW2;

        /**
         * Decodes a WriteRequestRW2 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WriteRequestRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.WriteRequestRW2;

        /**
         * Verifies a WriteRequestRW2 message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WriteRequestRW2 message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WriteRequestRW2
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.WriteRequestRW2;

        /**
         * Creates a plain object from a WriteRequestRW2 message. Also converts values to other types if specified.
         * @param message WriteRequestRW2
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.WriteRequestRW2, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WriteRequestRW2 to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WriteRequestRW2
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TimeSeriesRW2. */
    interface ITimeSeriesRW2 {

        /** TimeSeriesRW2 labelsRefs */
        labelsRefs?: (number[]|null);

        /** TimeSeriesRW2 samples */
        samples?: (cortexpb.ISample[]|null);

        /** TimeSeriesRW2 histograms */
        histograms?: (cortexpb.IHistogram[]|null);

        /** TimeSeriesRW2 exemplars */
        exemplars?: (cortexpb.IExemplarRW2[]|null);

        /** TimeSeriesRW2 metadata */
        metadata?: (cortexpb.IMetadataRW2|null);

        /** TimeSeriesRW2 createdTimestamp */
        createdTimestamp?: (number|Long|null);
    }

    /** Represents a TimeSeriesRW2. */
    class TimeSeriesRW2 implements ITimeSeriesRW2 {

        /**
         * Constructs a new TimeSeriesRW2.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.ITimeSeriesRW2);

        /** TimeSeriesRW2 labelsRefs. */
        public labelsRefs: number[];

        /** TimeSeriesRW2 samples. */
        public samples: cortexpb.ISample[];

        /** TimeSeriesRW2 histograms. */
        public histograms: cortexpb.IHistogram[];

        /** TimeSeriesRW2 exemplars. */
        public exemplars: cortexpb.IExemplarRW2[];

        /** TimeSeriesRW2 metadata. */
        public metadata?: (cortexpb.IMetadataRW2|null);

        /** TimeSeriesRW2 createdTimestamp. */
        public createdTimestamp: (number|Long);

        /**
         * Creates a new TimeSeriesRW2 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TimeSeriesRW2 instance
         */
        public static create(properties?: cortexpb.ITimeSeriesRW2): cortexpb.TimeSeriesRW2;

        /**
         * Encodes the specified TimeSeriesRW2 message. Does not implicitly {@link cortexpb.TimeSeriesRW2.verify|verify} messages.
         * @param message TimeSeriesRW2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.ITimeSeriesRW2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TimeSeriesRW2 message, length delimited. Does not implicitly {@link cortexpb.TimeSeriesRW2.verify|verify} messages.
         * @param message TimeSeriesRW2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.ITimeSeriesRW2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TimeSeriesRW2 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TimeSeriesRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.TimeSeriesRW2;

        /**
         * Decodes a TimeSeriesRW2 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TimeSeriesRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.TimeSeriesRW2;

        /**
         * Verifies a TimeSeriesRW2 message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TimeSeriesRW2 message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TimeSeriesRW2
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.TimeSeriesRW2;

        /**
         * Creates a plain object from a TimeSeriesRW2 message. Also converts values to other types if specified.
         * @param message TimeSeriesRW2
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.TimeSeriesRW2, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TimeSeriesRW2 to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TimeSeriesRW2
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ExemplarRW2. */
    interface IExemplarRW2 {

        /** ExemplarRW2 labelsRefs */
        labelsRefs?: (number[]|null);

        /** ExemplarRW2 value */
        value?: (number|null);

        /** ExemplarRW2 timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents an ExemplarRW2. */
    class ExemplarRW2 implements IExemplarRW2 {

        /**
         * Constructs a new ExemplarRW2.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IExemplarRW2);

        /** ExemplarRW2 labelsRefs. */
        public labelsRefs: number[];

        /** ExemplarRW2 value. */
        public value: number;

        /** ExemplarRW2 timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new ExemplarRW2 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExemplarRW2 instance
         */
        public static create(properties?: cortexpb.IExemplarRW2): cortexpb.ExemplarRW2;

        /**
         * Encodes the specified ExemplarRW2 message. Does not implicitly {@link cortexpb.ExemplarRW2.verify|verify} messages.
         * @param message ExemplarRW2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IExemplarRW2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExemplarRW2 message, length delimited. Does not implicitly {@link cortexpb.ExemplarRW2.verify|verify} messages.
         * @param message ExemplarRW2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IExemplarRW2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExemplarRW2 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExemplarRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.ExemplarRW2;

        /**
         * Decodes an ExemplarRW2 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExemplarRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.ExemplarRW2;

        /**
         * Verifies an ExemplarRW2 message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExemplarRW2 message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExemplarRW2
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.ExemplarRW2;

        /**
         * Creates a plain object from an ExemplarRW2 message. Also converts values to other types if specified.
         * @param message ExemplarRW2
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.ExemplarRW2, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExemplarRW2 to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ExemplarRW2
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MetadataRW2. */
    interface IMetadataRW2 {

        /** MetadataRW2 type */
        type?: (cortexpb.MetadataRW2.MetricType|null);

        /** MetadataRW2 helpRef */
        helpRef?: (number|null);

        /** MetadataRW2 unitRef */
        unitRef?: (number|null);
    }

    /** Represents a MetadataRW2. */
    class MetadataRW2 implements IMetadataRW2 {

        /**
         * Constructs a new MetadataRW2.
         * @param [properties] Properties to set
         */
        constructor(properties?: cortexpb.IMetadataRW2);

        /** MetadataRW2 type. */
        public type: cortexpb.MetadataRW2.MetricType;

        /** MetadataRW2 helpRef. */
        public helpRef: number;

        /** MetadataRW2 unitRef. */
        public unitRef: number;

        /**
         * Creates a new MetadataRW2 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MetadataRW2 instance
         */
        public static create(properties?: cortexpb.IMetadataRW2): cortexpb.MetadataRW2;

        /**
         * Encodes the specified MetadataRW2 message. Does not implicitly {@link cortexpb.MetadataRW2.verify|verify} messages.
         * @param message MetadataRW2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cortexpb.IMetadataRW2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MetadataRW2 message, length delimited. Does not implicitly {@link cortexpb.MetadataRW2.verify|verify} messages.
         * @param message MetadataRW2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cortexpb.IMetadataRW2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MetadataRW2 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MetadataRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cortexpb.MetadataRW2;

        /**
         * Decodes a MetadataRW2 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MetadataRW2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cortexpb.MetadataRW2;

        /**
         * Verifies a MetadataRW2 message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MetadataRW2 message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MetadataRW2
         */
        public static fromObject(object: { [k: string]: any }): cortexpb.MetadataRW2;

        /**
         * Creates a plain object from a MetadataRW2 message. Also converts values to other types if specified.
         * @param message MetadataRW2
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cortexpb.MetadataRW2, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MetadataRW2 to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MetadataRW2
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MetadataRW2 {

        /** MetricType enum. */
        enum MetricType {
            METRIC_TYPE_UNSPECIFIED = 0,
            METRIC_TYPE_COUNTER = 1,
            METRIC_TYPE_GAUGE = 2,
            METRIC_TYPE_HISTOGRAM = 3,
            METRIC_TYPE_GAUGEHISTOGRAM = 4,
            METRIC_TYPE_SUMMARY = 5,
            METRIC_TYPE_INFO = 6,
            METRIC_TYPE_STATESET = 7
        }
    }
}
