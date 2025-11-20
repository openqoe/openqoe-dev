import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace io. */
export namespace io {

    /** Namespace prometheus. */
    namespace prometheus {

        /** Namespace write. */
        namespace write {

            /** Namespace v2. */
            namespace v2 {

                /** Properties of a Request. */
                interface IRequest {

                    /** Request symbols */
                    symbols?: (string[]|null);

                    /** Request timeseries */
                    timeseries?: (io.prometheus.write.v2.ITimeSeries[]|null);
                }

                /** Represents a Request. */
                class Request implements IRequest {

                    /**
                     * Constructs a new Request.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: io.prometheus.write.v2.IRequest);

                    /** Request symbols. */
                    public symbols: string[];

                    /** Request timeseries. */
                    public timeseries: io.prometheus.write.v2.ITimeSeries[];

                    /**
                     * Creates a new Request instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Request instance
                     */
                    public static create(properties?: io.prometheus.write.v2.IRequest): io.prometheus.write.v2.Request;

                    /**
                     * Encodes the specified Request message. Does not implicitly {@link io.prometheus.write.v2.Request.verify|verify} messages.
                     * @param message Request message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: io.prometheus.write.v2.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Request message, length delimited. Does not implicitly {@link io.prometheus.write.v2.Request.verify|verify} messages.
                     * @param message Request message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: io.prometheus.write.v2.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Request message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Request
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): io.prometheus.write.v2.Request;

                    /**
                     * Decodes a Request message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Request
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): io.prometheus.write.v2.Request;

                    /**
                     * Verifies a Request message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Request message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Request
                     */
                    public static fromObject(object: { [k: string]: any }): io.prometheus.write.v2.Request;

                    /**
                     * Creates a plain object from a Request message. Also converts values to other types if specified.
                     * @param message Request
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: io.prometheus.write.v2.Request, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Request to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Request
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TimeSeries. */
                interface ITimeSeries {

                    /** TimeSeries labelsRefs */
                    labelsRefs?: (number[]|null);

                    /** TimeSeries samples */
                    samples?: (io.prometheus.write.v2.ISample[]|null);

                    /** TimeSeries histograms */
                    histograms?: (io.prometheus.write.v2.IHistogram[]|null);

                    /** TimeSeries exemplars */
                    exemplars?: (io.prometheus.write.v2.IExemplar[]|null);

                    /** TimeSeries metadata */
                    metadata?: (io.prometheus.write.v2.IMetadata|null);
                }

                /** Represents a TimeSeries. */
                class TimeSeries implements ITimeSeries {

                    /**
                     * Constructs a new TimeSeries.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: io.prometheus.write.v2.ITimeSeries);

                    /** TimeSeries labelsRefs. */
                    public labelsRefs: number[];

                    /** TimeSeries samples. */
                    public samples: io.prometheus.write.v2.ISample[];

                    /** TimeSeries histograms. */
                    public histograms: io.prometheus.write.v2.IHistogram[];

                    /** TimeSeries exemplars. */
                    public exemplars: io.prometheus.write.v2.IExemplar[];

                    /** TimeSeries metadata. */
                    public metadata?: (io.prometheus.write.v2.IMetadata|null);

                    /**
                     * Creates a new TimeSeries instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TimeSeries instance
                     */
                    public static create(properties?: io.prometheus.write.v2.ITimeSeries): io.prometheus.write.v2.TimeSeries;

                    /**
                     * Encodes the specified TimeSeries message. Does not implicitly {@link io.prometheus.write.v2.TimeSeries.verify|verify} messages.
                     * @param message TimeSeries message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: io.prometheus.write.v2.ITimeSeries, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TimeSeries message, length delimited. Does not implicitly {@link io.prometheus.write.v2.TimeSeries.verify|verify} messages.
                     * @param message TimeSeries message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: io.prometheus.write.v2.ITimeSeries, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TimeSeries message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TimeSeries
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): io.prometheus.write.v2.TimeSeries;

                    /**
                     * Decodes a TimeSeries message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TimeSeries
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): io.prometheus.write.v2.TimeSeries;

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
                    public static fromObject(object: { [k: string]: any }): io.prometheus.write.v2.TimeSeries;

                    /**
                     * Creates a plain object from a TimeSeries message. Also converts values to other types if specified.
                     * @param message TimeSeries
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: io.prometheus.write.v2.TimeSeries, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

                /** Properties of an Exemplar. */
                interface IExemplar {

                    /** Exemplar labelsRefs */
                    labelsRefs?: (number[]|null);

                    /** Exemplar value */
                    value?: (number|null);

                    /** Exemplar timestamp */
                    timestamp?: (number|Long|null);
                }

                /** Represents an Exemplar. */
                class Exemplar implements IExemplar {

                    /**
                     * Constructs a new Exemplar.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: io.prometheus.write.v2.IExemplar);

                    /** Exemplar labelsRefs. */
                    public labelsRefs: number[];

                    /** Exemplar value. */
                    public value: number;

                    /** Exemplar timestamp. */
                    public timestamp: (number|Long);

                    /**
                     * Creates a new Exemplar instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Exemplar instance
                     */
                    public static create(properties?: io.prometheus.write.v2.IExemplar): io.prometheus.write.v2.Exemplar;

                    /**
                     * Encodes the specified Exemplar message. Does not implicitly {@link io.prometheus.write.v2.Exemplar.verify|verify} messages.
                     * @param message Exemplar message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: io.prometheus.write.v2.IExemplar, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Exemplar message, length delimited. Does not implicitly {@link io.prometheus.write.v2.Exemplar.verify|verify} messages.
                     * @param message Exemplar message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: io.prometheus.write.v2.IExemplar, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an Exemplar message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Exemplar
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): io.prometheus.write.v2.Exemplar;

                    /**
                     * Decodes an Exemplar message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Exemplar
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): io.prometheus.write.v2.Exemplar;

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
                    public static fromObject(object: { [k: string]: any }): io.prometheus.write.v2.Exemplar;

                    /**
                     * Creates a plain object from an Exemplar message. Also converts values to other types if specified.
                     * @param message Exemplar
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: io.prometheus.write.v2.Exemplar, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

                /** Properties of a Sample. */
                interface ISample {

                    /** Sample value */
                    value?: (number|null);

                    /** Sample timestamp */
                    timestamp?: (number|Long|null);

                    /** Sample startTimestamp */
                    startTimestamp?: (number|Long|null);
                }

                /** Represents a Sample. */
                class Sample implements ISample {

                    /**
                     * Constructs a new Sample.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: io.prometheus.write.v2.ISample);

                    /** Sample value. */
                    public value: number;

                    /** Sample timestamp. */
                    public timestamp: (number|Long);

                    /** Sample startTimestamp. */
                    public startTimestamp: (number|Long);

                    /**
                     * Creates a new Sample instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Sample instance
                     */
                    public static create(properties?: io.prometheus.write.v2.ISample): io.prometheus.write.v2.Sample;

                    /**
                     * Encodes the specified Sample message. Does not implicitly {@link io.prometheus.write.v2.Sample.verify|verify} messages.
                     * @param message Sample message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: io.prometheus.write.v2.ISample, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Sample message, length delimited. Does not implicitly {@link io.prometheus.write.v2.Sample.verify|verify} messages.
                     * @param message Sample message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: io.prometheus.write.v2.ISample, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Sample message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Sample
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): io.prometheus.write.v2.Sample;

                    /**
                     * Decodes a Sample message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Sample
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): io.prometheus.write.v2.Sample;

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
                    public static fromObject(object: { [k: string]: any }): io.prometheus.write.v2.Sample;

                    /**
                     * Creates a plain object from a Sample message. Also converts values to other types if specified.
                     * @param message Sample
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: io.prometheus.write.v2.Sample, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

                /** Properties of a Metadata. */
                interface IMetadata {

                    /** Metadata type */
                    type?: (io.prometheus.write.v2.Metadata.MetricType|null);

                    /** Metadata helpRef */
                    helpRef?: (number|null);

                    /** Metadata unitRef */
                    unitRef?: (number|null);
                }

                /** Represents a Metadata. */
                class Metadata implements IMetadata {

                    /**
                     * Constructs a new Metadata.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: io.prometheus.write.v2.IMetadata);

                    /** Metadata type. */
                    public type: io.prometheus.write.v2.Metadata.MetricType;

                    /** Metadata helpRef. */
                    public helpRef: number;

                    /** Metadata unitRef. */
                    public unitRef: number;

                    /**
                     * Creates a new Metadata instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Metadata instance
                     */
                    public static create(properties?: io.prometheus.write.v2.IMetadata): io.prometheus.write.v2.Metadata;

                    /**
                     * Encodes the specified Metadata message. Does not implicitly {@link io.prometheus.write.v2.Metadata.verify|verify} messages.
                     * @param message Metadata message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: io.prometheus.write.v2.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Metadata message, length delimited. Does not implicitly {@link io.prometheus.write.v2.Metadata.verify|verify} messages.
                     * @param message Metadata message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: io.prometheus.write.v2.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Metadata message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): io.prometheus.write.v2.Metadata;

                    /**
                     * Decodes a Metadata message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Metadata
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): io.prometheus.write.v2.Metadata;

                    /**
                     * Verifies a Metadata message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Metadata
                     */
                    public static fromObject(object: { [k: string]: any }): io.prometheus.write.v2.Metadata;

                    /**
                     * Creates a plain object from a Metadata message. Also converts values to other types if specified.
                     * @param message Metadata
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: io.prometheus.write.v2.Metadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Metadata to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Metadata
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace Metadata {

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
                    negativeSpans?: (io.prometheus.write.v2.IBucketSpan[]|null);

                    /** Histogram negativeDeltas */
                    negativeDeltas?: ((number|Long)[]|null);

                    /** Histogram negativeCounts */
                    negativeCounts?: (number[]|null);

                    /** Histogram positiveSpans */
                    positiveSpans?: (io.prometheus.write.v2.IBucketSpan[]|null);

                    /** Histogram positiveDeltas */
                    positiveDeltas?: ((number|Long)[]|null);

                    /** Histogram positiveCounts */
                    positiveCounts?: (number[]|null);

                    /** Histogram resetHint */
                    resetHint?: (io.prometheus.write.v2.Histogram.ResetHint|null);

                    /** Histogram timestamp */
                    timestamp?: (number|Long|null);

                    /** Histogram customValues */
                    customValues?: (number[]|null);

                    /** Histogram startTimestamp */
                    startTimestamp?: (number|Long|null);
                }

                /** Represents a Histogram. */
                class Histogram implements IHistogram {

                    /**
                     * Constructs a new Histogram.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: io.prometheus.write.v2.IHistogram);

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
                    public negativeSpans: io.prometheus.write.v2.IBucketSpan[];

                    /** Histogram negativeDeltas. */
                    public negativeDeltas: (number|Long)[];

                    /** Histogram negativeCounts. */
                    public negativeCounts: number[];

                    /** Histogram positiveSpans. */
                    public positiveSpans: io.prometheus.write.v2.IBucketSpan[];

                    /** Histogram positiveDeltas. */
                    public positiveDeltas: (number|Long)[];

                    /** Histogram positiveCounts. */
                    public positiveCounts: number[];

                    /** Histogram resetHint. */
                    public resetHint: io.prometheus.write.v2.Histogram.ResetHint;

                    /** Histogram timestamp. */
                    public timestamp: (number|Long);

                    /** Histogram customValues. */
                    public customValues: number[];

                    /** Histogram startTimestamp. */
                    public startTimestamp: (number|Long);

                    /** Histogram count. */
                    public count?: ("countInt"|"countFloat");

                    /** Histogram zeroCount. */
                    public zeroCount?: ("zeroCountInt"|"zeroCountFloat");

                    /**
                     * Creates a new Histogram instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Histogram instance
                     */
                    public static create(properties?: io.prometheus.write.v2.IHistogram): io.prometheus.write.v2.Histogram;

                    /**
                     * Encodes the specified Histogram message. Does not implicitly {@link io.prometheus.write.v2.Histogram.verify|verify} messages.
                     * @param message Histogram message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: io.prometheus.write.v2.IHistogram, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Histogram message, length delimited. Does not implicitly {@link io.prometheus.write.v2.Histogram.verify|verify} messages.
                     * @param message Histogram message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: io.prometheus.write.v2.IHistogram, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Histogram message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Histogram
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): io.prometheus.write.v2.Histogram;

                    /**
                     * Decodes a Histogram message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Histogram
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): io.prometheus.write.v2.Histogram;

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
                    public static fromObject(object: { [k: string]: any }): io.prometheus.write.v2.Histogram;

                    /**
                     * Creates a plain object from a Histogram message. Also converts values to other types if specified.
                     * @param message Histogram
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: io.prometheus.write.v2.Histogram, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                        RESET_HINT_UNSPECIFIED = 0,
                        RESET_HINT_YES = 1,
                        RESET_HINT_NO = 2,
                        RESET_HINT_GAUGE = 3
                    }
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
                    constructor(properties?: io.prometheus.write.v2.IBucketSpan);

                    /** BucketSpan offset. */
                    public offset: number;

                    /** BucketSpan length. */
                    public length: number;

                    /**
                     * Creates a new BucketSpan instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BucketSpan instance
                     */
                    public static create(properties?: io.prometheus.write.v2.IBucketSpan): io.prometheus.write.v2.BucketSpan;

                    /**
                     * Encodes the specified BucketSpan message. Does not implicitly {@link io.prometheus.write.v2.BucketSpan.verify|verify} messages.
                     * @param message BucketSpan message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: io.prometheus.write.v2.IBucketSpan, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BucketSpan message, length delimited. Does not implicitly {@link io.prometheus.write.v2.BucketSpan.verify|verify} messages.
                     * @param message BucketSpan message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: io.prometheus.write.v2.IBucketSpan, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BucketSpan message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BucketSpan
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): io.prometheus.write.v2.BucketSpan;

                    /**
                     * Decodes a BucketSpan message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BucketSpan
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): io.prometheus.write.v2.BucketSpan;

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
                    public static fromObject(object: { [k: string]: any }): io.prometheus.write.v2.BucketSpan;

                    /**
                     * Creates a plain object from a BucketSpan message. Also converts values to other types if specified.
                     * @param message BucketSpan
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: io.prometheus.write.v2.BucketSpan, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            }
        }
    }
}
