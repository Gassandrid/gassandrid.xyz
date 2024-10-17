---
date: 2024-09-18
tags:
  - embedded
---

> [!abstract] Student Information
> Ewan Pedersen
> CS2210
> 9 • 18 • 2024

I am going to skip labeling the steps that don't require any submission, so the answers will only include terminal screenshots and answers to questions.

---

## 2.  If you successfully join a wireless network, typing `iwgetid` in the terminal should display the network name as follows. 

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 7.54.45 PM.png]]


**Some Caveats:**
My Pi did not support **md4** hashing due to its age, so I opted to use **Sha256** instead.

---

## 4. Create a new folder inside the `Desktop` folder inyour home directory called `CS2210`

>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 7.56.54 PM.png]] 

---

## 5.  Hostname of the Pi, displaying it via the `hostname` command.

>[!Info] Screenshot
>![[Screenshot 2024-09-19 at 9.04.04 PM.png]]


---

## 6. IP address of the Pi, displaying it via the `hostname -I` command.

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.04.56 PM.png]]


---

## 7. Output of the command: `df -T`

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.06.12 PM.png]]

---

## 8. What is the file system type listed for the root partition?

From the following screenshot, we can determine that the file system type for the root partition is `ext4`


>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 9.07.51 PM.png]]

---

## 9. Confirmation message that appears after expanding the file system to use the entire microSD card

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.11.09 PM.png]]


---

## 10. Use the `ping` command to ping the IP address of UVM's home page

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.14.15 PM.png]]

---

## 11. What was the average packet round trip time?

Given the following packet times:
- 1.60 ms
- 16.0 ms
- 47.1 ms
- 4.63 ms

We can use the average formula to find this(duh)

$$
\text{Average} = \frac{x_1 + x_2 + x_3 + \dots + x_n}{n}
$$
$$ \text{Average} = \frac{1.60 + 16.0 + 47.1 + 4.63}{4} = \frac{69.33}{4} = 17.33 \, \text{ms} $$

Therefore, the average was **17.33**ms

---

## 12. Create a Python file using `nano` called `hello1.py`. Write a line of code that displays "Hello, this is [your name] using Nano on my Raspberry Pi".

Unfortunately my terminal emulator didn't support **nano** through ssh, so I was forced to use apple terminal! Oh No!

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.25.23 PM.png]]

---

## 13. Run `hello1.py` from the command line.

>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 9.27.11 PM.png]]

---

## 14. Create the following new users and a **take a screenshot** demonstrating how they were created.

There were other ways to achieve this in the documentation, but I always prefer short bash one liners.

- `your_name`, with sudo privileges

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.30.21 PM.png]]

- `user1`, without sudo privileges

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.31.55 PM.png]]

---

## 16. Create a Python file using Vim called `hello2.py`. Write a line of code that displays "Hello, this is [your name] using Vim on my Raspberry Pi".

Since I already daily drive Vim on my own setup, I went ahead and installed my Vim Dotfile Configuration onto my Pi.

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.39.20 PM.png]]

---

## 17. Create a directory called `lab01` using the `mkdir` command, and use the `mv` command to move `hello2.py` into it.

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.41.07 PM.png]]

---

## 18. Execute `hello2.py` via the command line

>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 9.41.59 PM.png]]

---

## 19. Install any recent updates to your Raspberry Pi OS distribution via `sudo apt update` and then `sudo apt upgrade`

>[!Info] 
> Screenshot![[Screenshot 2024-09-19 at 9.43.08 PM.png]]
