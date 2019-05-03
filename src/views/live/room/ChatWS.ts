import pako from "pako";

declare global {
  interface Window {
    escape: (str: string) => string;
  }
}

class resObj {
  public packetLen?: number;
  public headerLen?: number;
  public ver?: number;
  public op?: number;
  public seq?: number;
  public body: any;
}

const wsConstant = {
  WS_OP_HEARTBEAT: 2,  // 心跳
  WS_OP_HEARTBEAT_REPLY: 3,  // 心跳回应
  WS_OP_MESSAGE: 5,  // 弹幕，通知等
  WS_OP_USER_AUTHENTICATION: 7,  // 进房
  WS_OP_CONNECT_SUCCESS: 8,  // 进房回应
  WS_PACKAGE_HEADER_TOTAL_LENGTH: 16,
  WS_PACKAGE_OFFSET: 0,
  WS_HEADER_OFFSET: 4,
  WS_VERSION_OFFSET: 6,
  WS_OPERATION_OFFSET: 8,
  WS_SEQUENCE_OFFSET: 12,
  WS_BODY_PROTOCOL_VERSION_NORMAL: 0,  // 协议：内容为JSON
  WS_BODY_PROTOCOL_VERSION_DEFLATE: 2, // 协议：内容为压缩后的buffer
  WS_HEADER_DEFAULT_VERSION: 1,
  WS_HEADER_DEFAULT_OPERATION: 1,
  WS_HEADER_DEFAULT_SEQUENCE: 1
};

// 数据包头
const wsHeaderList = [
{
  name: "Packet Length",
  key: "packetLen",
  bytes: 4,  // 长度
  offset: wsConstant.WS_PACKAGE_OFFSET,  // 偏移量
  value: 0
},
{
  name: "Header Length",
  key: "headerLen",
  bytes: 2,
  offset: wsConstant.WS_HEADER_OFFSET,
  value: wsConstant.WS_PACKAGE_HEADER_TOTAL_LENGTH
},
{
  name: "Protocol Version",
  key: "ver",
  bytes: 2,
  offset: wsConstant.WS_VERSION_OFFSET,
  value: wsConstant.WS_BODY_PROTOCOL_VERSION_NORMAL
},
{
  name: "Operation",
  key: "op",
  bytes: 4,
  offset: wsConstant.WS_OPERATION_OFFSET,
  value: wsConstant.WS_OP_USER_AUTHENTICATION
},
{
  name: "Sequence Id",
  key: "seq",
  bytes: 4,
  offset: wsConstant.WS_SEQUENCE_OFFSET,
  value: wsConstant.WS_HEADER_DEFAULT_SEQUENCE
}];

export enum Events {
  HEARTBEAT_REPLY = "HEARTBEAT_REPLY",
  MESSAGE_RECEIVE = "MESSAGE_RECEIVE"
}

export default class ChatWebSocket {
  private webSocket: WebSocket;
  private heartBeatInterval: number;
  private eventHandle: Map<Events, (body: any) => void>;
  public constructor(url: string, public roomId: number) {
    this.webSocket = new WebSocket(url);
    this.webSocket.binaryType="arraybuffer";

    this.eventHandle = new Map();

    this.init();
  }
  public on(event: Events, callback) {
    this.eventHandle.set(event, callback);
  }
  private init() {
    this.webSocket.addEventListener("open", () => {
      const json = JSON.stringify({
        uid: 0,
        roomid: this.roomId,
        protover: 2
      });
      // 发送进房信号
      const arrayBuffer = this.convertToArrayBuffer(json, wsConstant.WS_OP_USER_AUTHENTICATION);
      this.webSocket.send(arrayBuffer);
      
    });

    this.webSocket.addEventListener("message", (event) => {
      const res = this.convertToObject(event.data);
      let callback: (body: any) => void;

      switch(res.op) {
        case wsConstant.WS_OP_HEARTBEAT_REPLY:
          callback = this.eventHandle.get(Events.HEARTBEAT_REPLY);
          break;
        case wsConstant.WS_OP_MESSAGE:
          callback = this.eventHandle.get(Events.MESSAGE_RECEIVE);
          break;
        case wsConstant.WS_OP_CONNECT_SUCCESS:
          if (!this.heartBeatInterval) {
            // 发送心跳
            const arrayBuffer = this.convertToArrayBuffer("", wsConstant.WS_OP_HEARTBEAT);
            this.webSocket.send(arrayBuffer);

            // 每隔30秒发送一次心跳
            this.heartBeatInterval = setInterval(() => {
              const arrayBuffer = this.convertToArrayBuffer("", wsConstant.WS_OP_HEARTBEAT);
              this.webSocket.send(arrayBuffer);
            }, 30000);
          }
          break;
      }
      if (callback) {
        callback(res.body);
      }
    });

    this.webSocket.addEventListener("close", () => {
      clearInterval(this.heartBeatInterval);
    });

    this.webSocket.addEventListener("error", () => {
      this.webSocket.close();
    });
  }
  /**
   * ArrayBuffer转字符串
   */
  private decodeArrayBuffer(arrayBuffer: ArrayBuffer | Array<any>): string | null {
    if (arrayBuffer) {
      return decodeURIComponent(window.escape(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))));
    }
    return null;
  }
  /**
   * 字符串转ArrayBuffer
   */
  private encodeArrayBuffer(json: string): ArrayBuffer {
    if (json) {
      const uint8Array = new Uint8Array(json.length);
      for (let i = 0; i < json.length; i++) {
        uint8Array[i] = json.charCodeAt(i);
      }
      return uint8Array.buffer;
    }
    return null;
  }
  private convertToArrayBuffer(json: string, opt: number) {
    json = json || "";
    const len = wsConstant.WS_PACKAGE_HEADER_TOTAL_LENGTH + json.length;
    wsHeaderList[0].value = len;
    wsHeaderList[3].value = opt;

    const headerArrayBuffer = new ArrayBuffer(wsConstant.WS_PACKAGE_HEADER_TOTAL_LENGTH);
    const dataView = new DataView(headerArrayBuffer);
    wsHeaderList.forEach(function(item) {
      item.bytes === 2 ? dataView.setInt16(item.offset, item.value) :
      item.bytes === 4 && dataView.setInt32(item.offset, item.value);
    });

    const head = new Uint8Array(headerArrayBuffer);
    const body = new Uint8Array(this.encodeArrayBuffer(json));

    const unit8Array = new Uint8Array(head.byteLength + body.byteLength);
    unit8Array.set(head, 0);
    unit8Array.set(body, head.byteLength);
    return unit8Array.buffer;
  }
  private convertToObject(arrayBuffer: ArrayBuffer) : resObj {
    const dataView = new DataView(arrayBuffer);
    const res: resObj = { body: [] };
    // 包头内容
    wsHeaderList.forEach(function(item) {
      item.bytes === 2 ? res[item.key] = dataView.getInt16(item.offset) :
      item.bytes === 4 && (res[item.key] = dataView.getInt32(item.offset));
    });
    
    if (res.op === wsConstant.WS_OP_HEARTBEAT_REPLY) {
      // 心跳回应，返回的内容为32位整型
      res.body = { onlineNum: dataView.getInt32(res.headerLen) };
    } else if (res.op === wsConstant.WS_OP_MESSAGE) {
      // buffer内容
      if (res.ver === wsConstant.WS_BODY_PROTOCOL_VERSION_DEFLATE) {
        const bodyArrayBuffer = arrayBuffer.slice(res.headerLen);
        // 解压流内容
        const bodyUint8Array = pako.inflate(new Uint8Array(bodyArrayBuffer));
        // 内容由一小块二进制包组成，递归读取包内容
        const body = this.getBody(bodyUint8Array.buffer, []);
        res.body = body;
      } else {
        const bodyLength = dataView.byteLength - res.headerLen;
        const array = [];
        for (let i = 0; i < bodyLength; i++) {
          array.push(dataView.getUint8(res.headerLen + i));
        }
        res.body = [JSON.parse(this.decodeArrayBuffer(array))];
      }
    }

    return res;
  }
  private getBody(arrayBuffer: ArrayBuffer, body: Array<any>) {
    const dataView = new DataView(arrayBuffer);
    const packetLen = dataView.getInt32(wsConstant.WS_PACKAGE_OFFSET);
    const headerLen = dataView.getInt16(wsConstant.WS_HEADER_OFFSET);
    body.push(JSON.parse(this.decodeArrayBuffer(arrayBuffer.slice(headerLen, packetLen))));
    if (packetLen < arrayBuffer.byteLength) {
      this.getBody(arrayBuffer.slice(packetLen), body);
    }
    return body;
  }
}
