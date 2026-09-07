---
date: 2024-09-12
tags:
  - cs/web
updated: 2026-03-05T14:50:37-05:00
class:
  - note
source:
  - https://www.youtube.com/watch?v=D26sUZ6DHNQ
related:
author:
---

In layman terms, **Sockets** serve to enable communication between different **processes,** either on the same machine or over a network. For either of these example, each side(process) of that communication will create a socket

Sockets are **endpoints** in a two-way communication channel:

![[Screenshot 2025-04-25 at 1.23.03 PM.png]]

Think of a socket as a software construct that combines both the IP address of a computer and the port number of an application:

$$
\begin{align*}
&192.168.1.255 + 3389 = 192.168.1.255:3389 \\
& \quad \quad \quad \uparrow \quad \quad \quad \quad  \uparrow \quad\quad\quad\quad \quad\quad\uparrow \\
& \quad \text{IP Address} \quad \text{Port Number} \quad \text{Socket Adress}
\end{align*}
$$

Using a metaphor, think of the **Socket** as a telephone, and the IP address and port together are  like the phone number and extension.

The two parties must dial correctly in order to establish a connection.

---

To understand **Sockets** in context, we need define where they fit inside the **OSI Model**.

![[Pasted image 20250425155856.png]]

**Sockets** operate primarily at the **Transport** layer(layer 4 of the model).

The application layer(layer 7), something like your web browser or a backend server, calls down to the socket API, asking it to send or receive data.

The socket then wraps the data into TCP or UDP segments, adds some headers, then sends it to the network layer(layer 3) to deal with **IP Routing**. Sockets provide a nice and clean interface that abstracts away the complexity of the network stack.

---

## TCP/UDP Sockets

There are actually two main kinds of sockets, **TCP** and **UDP**. 

**TCP**(Transmission control protocol) sockets are *connection oriented*, and provide a reliable, ordered, and error checked transmission. Before data gets sent, a three way handshake is performed to establish a connection, involving an exchange of  SYN and ACK packets. This guarantees that both sides are ready for the transmission.

TCP guarantees that data will be ordered and have a non-duplicated delivery. This makes it ideal for applications like web browsing, database access, or file transfers.

![[Screenshot 2025-04-25 at 4.04.39 PM.png]]

**UDP**(user datagram protocol) on the other hand, is connectionless and unreliable. It goes straight to sending data between the sender and the client without any kind of handshake. There is no way to guarentee to deliver, order, or integrity. 

However, it is much faster than TCP, what it sacrifices in reliability it makes up for in speed. This makes it ideal for real-time applications like video streaming, where speed is a necessity.

![[Screenshot 2025-04-25 at 4.09.12 PM.png]]

---

## Server and Client Side

On the server side, sockets follow a very specific lifecycle.

It starts with the creation of a **listening socket**, which gets bound to a specific IP address and port. This socket doesnt communicate on its own, but instead waits for any incoming connections from clients. 

Once A client initiates a connection, the server accepts and creates a new socket instance dedicated to that client. The origional listening socket goes back to listening for requests.

![[Screenshot 2025-04-25 at 4.15.32 PM.png]] ^475fe5

The new socket on the other hand becomes the channel for all communication with that specific client. This enables the server to handle multiple different clients concurrently, each with its own socket. This can be accomplished with multithreading in **synchronous** setups, where each client is handled by a thread or process, however this does not scale well.

For high performance systems like **API**s or Game Servers, this limitation can be minimized by using techniques such as **Non-Blocking IO** or **even-driven architectures**. This allows a single thread or several to manage thousands of open sockets concurrently. Usually this is done with the system calls **Select, poll, or epoll(more performant)**.

Event notification mechanisms are much more performant and drastically reduce CPU usage and latency. This approach is used by NGinx, node, etc.

Returning to the [[Sockets#^475fe5|above]] diagram, the client connects to the server and iniates a connection to the servers IP and Port. If we are using the TCP method, it initiates the 3 way handshake, and once connected the client can read and write as if working with a file. In fact for Unix systems, sockets are treated as *file descriptors*, meaning they can be used with the most common syscalls like *read* and *write*. 

After the communication is completed, both the server and client are expected to close their connection. If not closed properly, it will unnecessarily expend computer resources.

Sockets are differentiated by a 5 tuple:

![[Screenshot 2025-04-28 at 3.34.03 PM.png]]

This complexity ensures no duplicate sockets, and allows for two machine to have multiple connections over the same port. (eg, multiple connections on one machine to example.com)

---

## Unix Domain Sockets (UDS)

These are not network sockets. They are solely used for inter-process communication and not exposed by an IP and PORT.

Instead, UDS utilizes a file path on the file system as the address (eg /tmp/app.sock as address).

They are much faster than network sockets as they lack the overhead associated with networking and ip routing. Many popular speed-oriented services like **Postgres** and **Redis** default to UDS if possible, where performance is critical.

---

Sockets are everywhere, and used in practically everything we know of.

While can be used for intra-machine communication, they are primarily used over the HTTP protocol.

This doesn't mean that this is the only way to use sockets to send data( you could just send the raw data over local network, depending on how safe you think it is ), but the http protocol is well established and easier to work with.
