---
id: Local Server Hosting and Network Organization
aliases: 
tags: 
date: 2024-09-12
---

## Local Server Hosting

### Using Python (Simple HTTP Server)

To quickly host a local server, you can use Python's built-in HTTP server module.

#### Steps

1. **Open Terminal**.
2. **Navigate to the directory** you want to serve:

   ```bash
   cd /path/to/your/directory
   ```

3. **Start the server**:

- For Python 3.x:

```bash
python3 -m http.server 8000
```

4. **Access the server**: Open a browser and navigate to `http://<your-local-ip>:8000`.

### [[SSH]] into Your Local Server

#### Ensure SSH Server is Running

1. **Check if SSH is enabled**

```bash
sudo systemsetup -getremotelogin
```

2. **Enable if it is off**

```bash
sudo systemsetup -setremotelogin on
```

3. **Get your local ip adress(its usually en0**

```bash
ifconfig
```

4. **SSH into the machine**

```bash
ssh <username>@<your-local-ip>
```

## Network Structure/Organization

### Basics of Networking

- **IP Addresses**: Unique identifiers for devices on a network.
  - IPv4: `192.168.1.1`
  - IPv6: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- **Subnets and Subnet Masks**: Subdividing a network.
  - Example Subnet Mask: `255.255.255.0`
- **DNS (Domain Name System)**: Translates domain names to IP addresses.

### Common Networking Protocols

- **HTTP/HTTPS**: Web communication protocols. HTTPS is secure.
- **TCP/IP**: Fundamental protocol suite for the internet.
- **UDP**: Connectionless protocol for speed over reliability.
- **SSH (Secure Shell)**: Securely access remote machines.

### Tools and Commands

#### HTTP Requests

- **cURL**: Command-line tool for transferring data with URLs.

```bash
curl http://example.com
curl -X POST http://example.com -d "param1=value1&param2=value2"
```

#### Network Information

- **ifconfig/ip**: Displays network configuratio

```bash
ifconfig
ip addr show
```

- **ping**: Tests connectivity between devices.

```bash
ping 8.8.8.8
```

- **traceroute**: Traces the path packets take to a destination.

```bash
traceroute example.com
```

- **netstat**: Displays network connections, routing tables, interface statistics.

```bash
netstat -a
```

#### SSH

- **SSH Commands**: Connecting, copying files, running remote commands

```bash
ssh user@host
scp file user@host:/path/to/destination
ssh user@host 'command'
```

### Network Analysis

- **Wireshark**: GUI tool for network protocol analysis.
- **tcpdump**: Command-line packet analyzer.

```bash
sudo tcpdump -i eth0
```

## Network Organization

### Local Network Structure

- **Router**: Central device that connects devices within a local network.
- **Switch**: Device to expand the number of devices on a network.
- **Subnetting**: Dividing a network into smaller sub-networks.

### Internet Network Structure

- **ISP (Internet Service Provider)**: Provides internet access.
- **Backbone**: High-capacity data transmission lines that carry internet traffic.
- **DNS Servers**: Translate domain names to IP addresses.
- **CDNs (Content Delivery Networks)**: Distribute content to reduce latency.

### Advanced Topics

#### HTTP/2 and HTTP/3

- **HTTP/2**: Multiplexing, header compression, efficient use of resources.
- **HTTP/3**: Based on QUIC, reduced latency, improved security.

#### Firewalls and Security

- **iptables/nftables**: Tools for configuring Linux kernel firewall

```bash
sudo iptables -L
sudo nft list ruleset
```

- **SSL/TLS**: Secure communication protocols.

#### Programming and Network Code

- **Python**: Libraries like `requests` for HTTP, `socket` for low-level operations.

```python
import requests
response = requests.get('http://example.com')

import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('example.com', 80))
s.sendall(b'GET / HTTP/1.1\r\nHost: example.com\r\n\r\n')
response = s.recv(4096)
print(response)
```

## Resources

- **Books**:
  - "TCP/IP Illustrated" by W. Richard Stevens.
  - "Networking for Systems Administrators" by Michael W. Lucas.
- **Online Courses**:
  - Networking courses on Coursera and edX.
  - Tutorials on Codecademy and Udemy.
- **Documentation**:
  - Official docs for tools like cURL, Wireshark, tcpdump.
  - RFC documents for detailed protocol specifications.

