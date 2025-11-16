export interface WriteRequest {
  timeseries?: prometheus.TimeSeries[];
  2?: reserved;
  metadata?: prometheus.MetricMetadata[];
}

export function encodeWriteRequest(message: WriteRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeWriteRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeWriteRequest(message: WriteRequest, bb: ByteBuffer): void {
  // repeated prometheus.TimeSeries timeseries = 1;
  let array$timeseries = message.timeseries;
  if (array$timeseries !== undefined) {
    for (let value of array$timeseries) {
      writeVarint32(bb, 10);
      let nested = popByteBuffer();
      _encodeprometheus.TimeSeries(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional reserved 2 = 0;
  let $2 = message.2;
  if ($2 !== undefined) {
    writeVarint32(bb, 2);
    let nested = popByteBuffer();
    _encodereserved($2, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated prometheus.MetricMetadata metadata = 3;
  let array$metadata = message.metadata;
  if (array$metadata !== undefined) {
    for (let value of array$metadata) {
      writeVarint32(bb, 26);
      let nested = popByteBuffer();
      _encodeprometheus.MetricMetadata(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeWriteRequest(binary: Uint8Array): WriteRequest {
  return _decodeWriteRequest(wrapByteBuffer(binary));
}

function _decodeWriteRequest(bb: ByteBuffer): WriteRequest {
  let message: WriteRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated prometheus.TimeSeries timeseries = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        let values = message.timeseries || (message.timeseries = []);
        values.push(_decodeprometheus.TimeSeries(bb));
        bb.limit = limit;
        break;
      }

      // optional reserved 2 = 0;
      case 0: {
        let limit = pushTemporaryLength(bb);
        message.2 = _decodereserved(bb);
        bb.limit = limit;
        break;
      }

      // repeated prometheus.MetricMetadata metadata = 3;
      case 3: {
        let limit = pushTemporaryLength(bb);
        let values = message.metadata || (message.metadata = []);
        values.push(_decodeprometheus.MetricMetadata(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ReadRequest {
  queries?: Query[];
  accepted_response_types?: ResponseType[];
}

export function encodeReadRequest(message: ReadRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeReadRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeReadRequest(message: ReadRequest, bb: ByteBuffer): void {
  // repeated Query queries = 1;
  let array$queries = message.queries;
  if (array$queries !== undefined) {
    for (let value of array$queries) {
      writeVarint32(bb, 10);
      let nested = popByteBuffer();
      _encodeQuery(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated ResponseType accepted_response_types = 2;
  let array$accepted_response_types = message.accepted_response_types;
  if (array$accepted_response_types !== undefined) {
    for (let value of array$accepted_response_types) {
      writeVarint32(bb, 18);
      let nested = popByteBuffer();
      _encodeResponseType(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeReadRequest(binary: Uint8Array): ReadRequest {
  return _decodeReadRequest(wrapByteBuffer(binary));
}

function _decodeReadRequest(bb: ByteBuffer): ReadRequest {
  let message: ReadRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated Query queries = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        let values = message.queries || (message.queries = []);
        values.push(_decodeQuery(bb));
        bb.limit = limit;
        break;
      }

      // repeated ResponseType accepted_response_types = 2;
      case 2: {
        let limit = pushTemporaryLength(bb);
        let values = message.accepted_response_types || (message.accepted_response_types = []);
        values.push(_decodeResponseType(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ReadResponse {
  results?: QueryResult[];
}

export function encodeReadResponse(message: ReadResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeReadResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeReadResponse(message: ReadResponse, bb: ByteBuffer): void {
  // repeated QueryResult results = 1;
  let array$results = message.results;
  if (array$results !== undefined) {
    for (let value of array$results) {
      writeVarint32(bb, 10);
      let nested = popByteBuffer();
      _encodeQueryResult(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeReadResponse(binary: Uint8Array): ReadResponse {
  return _decodeReadResponse(wrapByteBuffer(binary));
}

function _decodeReadResponse(bb: ByteBuffer): ReadResponse {
  let message: ReadResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated QueryResult results = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        let values = message.results || (message.results = []);
        values.push(_decodeQueryResult(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface Query {
  start_timestamp_ms?: Long;
  end_timestamp_ms?: Long;
  matchers?: prometheus.LabelMatcher[];
  hints?: prometheus.ReadHints;
}

export function encodeQuery(message: Query): Uint8Array {
  let bb = popByteBuffer();
  _encodeQuery(message, bb);
  return toUint8Array(bb);
}

function _encodeQuery(message: Query, bb: ByteBuffer): void {
  // optional int64 start_timestamp_ms = 1;
  let $start_timestamp_ms = message.start_timestamp_ms;
  if ($start_timestamp_ms !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, $start_timestamp_ms);
  }

  // optional int64 end_timestamp_ms = 2;
  let $end_timestamp_ms = message.end_timestamp_ms;
  if ($end_timestamp_ms !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, $end_timestamp_ms);
  }

  // repeated prometheus.LabelMatcher matchers = 3;
  let array$matchers = message.matchers;
  if (array$matchers !== undefined) {
    for (let value of array$matchers) {
      writeVarint32(bb, 26);
      let nested = popByteBuffer();
      _encodeprometheus.LabelMatcher(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional prometheus.ReadHints hints = 4;
  let $hints = message.hints;
  if ($hints !== undefined) {
    writeVarint32(bb, 34);
    let nested = popByteBuffer();
    _encodeprometheus.ReadHints($hints, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

export function decodeQuery(binary: Uint8Array): Query {
  return _decodeQuery(wrapByteBuffer(binary));
}

function _decodeQuery(bb: ByteBuffer): Query {
  let message: Query = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int64 start_timestamp_ms = 1;
      case 1: {
        message.start_timestamp_ms = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional int64 end_timestamp_ms = 2;
      case 2: {
        message.end_timestamp_ms = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // repeated prometheus.LabelMatcher matchers = 3;
      case 3: {
        let limit = pushTemporaryLength(bb);
        let values = message.matchers || (message.matchers = []);
        values.push(_decodeprometheus.LabelMatcher(bb));
        bb.limit = limit;
        break;
      }

      // optional prometheus.ReadHints hints = 4;
      case 4: {
        let limit = pushTemporaryLength(bb);
        message.hints = _decodeprometheus.ReadHints(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface QueryResult {
  timeseries?: prometheus.TimeSeries[];
}

export function encodeQueryResult(message: QueryResult): Uint8Array {
  let bb = popByteBuffer();
  _encodeQueryResult(message, bb);
  return toUint8Array(bb);
}

function _encodeQueryResult(message: QueryResult, bb: ByteBuffer): void {
  // repeated prometheus.TimeSeries timeseries = 1;
  let array$timeseries = message.timeseries;
  if (array$timeseries !== undefined) {
    for (let value of array$timeseries) {
      writeVarint32(bb, 10);
      let nested = popByteBuffer();
      _encodeprometheus.TimeSeries(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeQueryResult(binary: Uint8Array): QueryResult {
  return _decodeQueryResult(wrapByteBuffer(binary));
}

function _decodeQueryResult(bb: ByteBuffer): QueryResult {
  let message: QueryResult = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated prometheus.TimeSeries timeseries = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        let values = message.timeseries || (message.timeseries = []);
        values.push(_decodeprometheus.TimeSeries(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface ChunkedReadResponse {
  chunked_series?: prometheus.ChunkedSeries[];
  query_index?: Long;
}

export function encodeChunkedReadResponse(message: ChunkedReadResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeChunkedReadResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeChunkedReadResponse(message: ChunkedReadResponse, bb: ByteBuffer): void {
  // repeated prometheus.ChunkedSeries chunked_series = 1;
  let array$chunked_series = message.chunked_series;
  if (array$chunked_series !== undefined) {
    for (let value of array$chunked_series) {
      writeVarint32(bb, 10);
      let nested = popByteBuffer();
      _encodeprometheus.ChunkedSeries(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional int64 query_index = 2;
  let $query_index = message.query_index;
  if ($query_index !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, $query_index);
  }
}

export function decodeChunkedReadResponse(binary: Uint8Array): ChunkedReadResponse {
  return _decodeChunkedReadResponse(wrapByteBuffer(binary));
}

function _decodeChunkedReadResponse(bb: ByteBuffer): ChunkedReadResponse {
  let message: ChunkedReadResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated prometheus.ChunkedSeries chunked_series = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        let values = message.chunked_series || (message.chunked_series = []);
        values.push(_decodeprometheus.ChunkedSeries(bb));
        bb.limit = limit;
        break;
      }

      // optional int64 query_index = 2;
      case 2: {
        message.query_index = readVarint64(bb, /* unsigned */ false);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface Long {
  low: number;
  high: number;
  unsigned: boolean;
}

interface ByteBuffer {
  bytes: Uint8Array;
  offset: number;
  limit: number;
}

function pushTemporaryLength(bb: ByteBuffer): number {
  let length = readVarint32(bb);
  let limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb: ByteBuffer, type: number): void {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function stringToLong(value: string): Long {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value: Long): string {
  let low = value.low;
  let high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let f32 = new Float32Array(1);
let f32_u8 = new Uint8Array(f32.buffer);

let f64 = new Float64Array(1);
let f64_u8 = new Uint8Array(f64.buffer);

function intToLong(value: number): Long {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

let bbStack: ByteBuffer[] = [];

function popByteBuffer(): ByteBuffer {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb: ByteBuffer): void {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes: Uint8Array): ByteBuffer {
  return { bytes, offset: 0, limit: bytes.length };
}

function toUint8Array(bb: ByteBuffer): Uint8Array {
  let bytes = bb.bytes;
  let limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb: ByteBuffer, offset: number): void {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb: ByteBuffer): boolean {
  return bb.offset >= bb.limit;
}

function grow(bb: ByteBuffer, count: number): number {
  let bytes = bb.bytes;
  let offset = bb.offset;
  let limit = bb.limit;
  let finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb: ByteBuffer, count: number): number {
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb: ByteBuffer, count: number): Uint8Array {
  let offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb: ByteBuffer, buffer: Uint8Array): void {
  let offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readString(bb: ByteBuffer, count: number): string {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count);
  let fromCharCode = String.fromCharCode;
  let bytes = bb.bytes;
  let invalid = '\uFFFD';
  let text = '';

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset], c2: number, c3: number, c4: number, c: number;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function writeString(bb: ByteBuffer, text: string): void {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  let n = text.length;
  let byteCount = 0;

  // Write the byte count first
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  let offset = grow(bb, byteCount);
  let bytes = bb.bytes;

  // Then write the bytes
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
      }
      bytes[offset++] = (c & 0x3F) | 0x80;
    }
  }
}

function writeByteBuffer(bb: ByteBuffer, buffer: ByteBuffer): void {
  let offset = grow(bb, buffer.limit);
  let from = bb.bytes;
  let to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (let i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
}

function readByte(bb: ByteBuffer): number {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb: ByteBuffer): number {
  let offset = advance(bb, 8);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 8);
  let bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
}

function readInt32(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb: ByteBuffer, unsigned: boolean): Long {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb: ByteBuffer, value: Long): void {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb: ByteBuffer): number {
  let c = 0;
  let value = 0;
  let b: number;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb: ByteBuffer, value: number): void {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb: ByteBuffer, unsigned: boolean): Long {
  let part0 = 0;
  let part1 = 0;
  let part2 = 0;
  let b: number;

  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                    b = readByte(bb); part2 |= (b & 0x7F) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb: ByteBuffer, value: Long): void {
  let part0 = value.low >>> 0;
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  let part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  let offset = grow(bb, size);
  let bytes = bb.bytes;

  switch (size) {
    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
  }
}

function readVarint32ZigZag(bb: ByteBuffer): number {
  let value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb: ByteBuffer, value: number): void {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb: ByteBuffer): Long {
  let value = readVarint64(bb, /* unsigned */ false);
  let low = value.low;
  let high = value.high;
  let flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb: ByteBuffer, value: Long): void {
  let low = value.low;
  let high = value.high;
  let flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
