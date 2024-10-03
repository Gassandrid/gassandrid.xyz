# WebSockets

WebSockets provide a full-duplex communication channel over a single TCP connection, allowing real-time interaction between a client and a server.

## JavaScript
Using the WebSocket API:
```javascript
let socket = new WebSocket("ws://example.com/socket");

socket.onmessage = function(event) {
  console.log(event.data);
};
```

## Python

Using the `websockets` library:

```python
import asyncio
import websockets

async def hello():
    async with websockets.connect("ws://example.com/socket") as websocket:
        await websocket.send("Hello world!")
        response = await websocket.recv()
        print(response)

asyncio.run(hello())
```

## Go

Using the `gorilla/websocket` package:

```go
package main

import (
  "log"
  "net/url"
  "github.com/gorilla/websocket"
)

func main() {
  u := url.URL{Scheme: "ws", Host: "example.com", Path: "/socket"}
  c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
  if err != nil {
    log.Fatal("dial:", err)
  }
  defer c.Close()

  err = c.WriteMessage(websocket.TextMessage, []byte("Hello world!"))
  if err != nil {
    log.Fatal("write:", err)
  }

  _, message, err := c.ReadMessage()
  if err != nil {
    log.Fatal("read:", err)
  }
  log.Printf("recv: %s", message)
}
```

