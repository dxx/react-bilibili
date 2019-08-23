## WebSocket

Bilibili 直播弹幕 WebSocket 协议

### 调用地址

* 普通未加密的 WebSocket 连接： `ws://broadcastlv.chat.bilibili.com:2244/sub`
* 使用 SSL 的 WebSocket 连接： `wss://broadcastlv.chat.bilibili.com/sub`

### 数据包格式

发送和接收的包都是这种格式。

| 偏移 | 长度 | 类型 | 字节序 | 名称 | 说明 |
| --- | --- | --- | --- | --- | --- |
| 0 | 4 | int | Big Endian | Packet Length | 数据包长度 |
| 4 | 2 | int | Big Endian | Header Length | 数据包头部长度（固定为 `16`） |
| 6 | 2 | int | Big Endian | Protocol Version | 协议版本（见下文） |
| 8 | 4 | int | Big Endian | Operation | 操作类型（见下文） |
| 12 | 4 | int | Big Endian | Sequence Id | 数据包头部长度（固定为 `1`） |
| 16 | - | byte[] | - | Body | 数据内容 |

同一个 `WebSocket Frame` 可能包含多个 `Bilibili 直播数据包`，每个 `Bilibili 直播数据包` 直接首尾相连，数据包长度只表示 `Bilibili 直播数据包` 的长度，并非 `WebSocket Frame` 的长度。

#### 协议版本

| 值 | Body 格式 | 说明 |
| --- | --- | --- |
| 0 | JSON | JSON纯文本，可以直接通过 `JSON.stringify` 解析 |
| 1 | Int 32 Big Endian | Body 内容为房间人气值 |
| 2 | Buffer | 压缩过的 Buffer，Body 内容需要用zlib.inflate解压出一个新的数据包，然后从数据包格式那一步重新操作一遍 |

#### 操作类型

| 值 | 发送者 | Body 格式 | 名称 | 说明 |
| --- | --- | --- | --- | --- |
| 2 | 客户端 | (空) | 心跳 | 不发送心跳包，70 秒之后会断开连接，通常每 30 秒发送 1 次 |
| 3 | 服务器 | Int 32 Big Endian | 心跳回应 | Body 内容为房间人气值 |
| 5 | 服务器 | JSON | 通知 | 弹幕、广播等全部信息 |
| 7 | 客户端 | JSON | 进房 | WebSocket 连接成功后的发送的第一个数据包，发送要进入房间 ID |
| 8 | 服务器 | (空) | 进房回应 | |

#### 进房 JSON 内容

```json
{
  "clientver": "1.6.3",
  "platform": "web",
  "protover": 2,
  "roomid": 23058,
  "uid": 0,
  "type": 2
}
```

| 字段 | 必选 | 类型 | 说明|
| --- | --- | --- | --- |
| clientver | false | string | 例如 `"1.5.10.1"` |
| platform | false | string | 例如 `"web"` |
| protover | false | number | 通常为 `2` |
| roomid | true | number | 房间长 ID，可以通过 `room_init` API 获取 |
| uid | false | number | uin，可以通过 `getUserInfo` API 获取 |
| type | false | number | 不知道啥，总之写 `2` |

#### 心跳回应

内容是一个 4 字节的 Big Endian 的 整数，表示房间人气

### 连接过程

这里以浏览器 JavaScript 自带的 `WebSocket` 说明

1. 连接 WebSocket

```javascript
const ws = new WebSocket('wss://broadcastlv.chat.bilibili.com:2245/sub');
```

2. 连接成功后发送进入房间请求

```javascript
ws.on('open', function () {
  ws.send(encode(JSON.stringify({
    roomid: 23058
  }), 7));
});
```

这个数据包必须为连接以后的第一个数据包，5 秒内不发送进房数据包，服务器主动断开连接，任何数据格式错误将直接导致服务器主动断开连接。

3. 每隔 30 秒发送一次心跳

```javascript
setInterval(function () {
  ws.send(encode('', 2));
}, 30000);
```

4. 接收

```javascript
ws.on('message', function (data) {
  const packets = decode(data);
  for (let i = 0; i < packets.length; ++i) {
    const packet = packets[i];
    switch (packet.op) {
      case 8:
        console.log('加入房间');
        break;
      case 3:
        const count = decodeInt(packet.data);
        console.log(`人气：${count}`);
        break;
      case 5:
        const body = decodeJson(packet.data);
        switch (body.cmd) {
          case 'DANMU_MSG':
            console.log(`${body.info[2][1]}: ${body.info[1]}`);
            break;
          case 'SEND_GIFT':
            console.log(`${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`);
            break;
          case 'WELCOME':
            console.log(`欢迎 ${body.data.uname}`);
            break;
          // 此处省略很多其他通知类型
          default:
            console.log(body);
        }
        break;
      default:
        console.log(packet);
    }
  }
});
```
