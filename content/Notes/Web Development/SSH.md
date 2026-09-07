---
date: 2024-09-12
updated: 2025-10-15
tags:
  - cs/web
  - cs/homelab
class:
  - note
source:
related:
  - "[[HTTP Requests]]"
author:
---
**SSH** is the primary method by which computers securely communicate over an insecure network. It is a protocol that provides a secure channel over an unsecured network by using encryption.

How is this any different from HTTPS? HTTPS is a protocol that is used to secure communication between a web browser and a web server. It is built on top of HTTP and uses SSL/TLS to encrypt the data being transmitted. SSH, on the other hand, is a protocol that is used to securely connect to a remote computer and execute commands on that computer. It is not built on top of any other protocol and does not use SSL/TLS.

---

## Use Cases

This is the go to tool if you are in to homelab like I am. It is used to securely connect to remote servers, transfer files, and manage network infrastructure. Some common use cases for SSH include:

Combining with [[Tailscale]] is probably the best way to use SSH securely from a distance.
