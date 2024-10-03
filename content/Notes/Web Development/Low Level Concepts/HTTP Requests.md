# HTTP Requests

HTTP (Hypertext Transfer Protocol) is essential for data communication on the web. Below are examples of making HTTP requests in various programming languages.

## Python
Using the `requests` library:
```python
import requests

response = requests.get('https://api.example.com/data')
print(response.text)
```

## JavaScript

Using the `fetch` API:
```js
fetch('https://api.example.com/data') .then(response => response.text()) .then(data => console.log(data));
```

Using the `axios` library:
```
const axios = require('axios');

axios.get('https://api.example.com/data')
  .then(response => console.log(response.data));

```

## Go

Using the `net/http` package:

```go
package main

import (
  "fmt"
  "io/ioutil"
  "net/http"
)

func main() {
  response, err := http.Get("https://api.example.com/data")
  if err != nil {
    fmt.Println(err)
  }
  defer response.Body.Close()
  body, err := ioutil.ReadAll(response.Body)
  if err != nil {
    fmt.Println(err)
  }
  fmt.Println(string(body))
}

```

## C/C++

Using the `libcurl` library:

```cpp
#include <stdio.h>
#include <curl/curl.h>

int main() {
  CURL *curl;
  CURLcode res;

  curl = curl_easy_init();
  if(curl) {
    curl_easy_setopt(curl, CURLOPT_URL, "https://api.example.com/data");
    res = curl_easy_perform(curl);
    if(res != CURLE_OK)
      fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
    curl_easy_cleanup(curl);
  }
  return 0;
}
```

