# Q1 Lab 02 - Building a Web Server

> [!abstract] Student Information
> Ewan Pedersen
> CS2210
> 10 • 09 • 2024

---

## 6.  Add a yellow LED that is ON while the red LED is OFF (alternating LEDs). **Take a picture** of your completed circuit on the breadboard, connected to your pi.

>[!Info] Screenshot
> ![[Screenshot 2024-10-10 at 7.17.05 PM.png]]

---

## 7. What is the current in milliamps?

**Ohm's Law:**
   $$
   I = \frac{V_{supply} - V_{forward, red}}{R}
   Substituting the values:
   $$

**Red LED**:
   - $V_{supply} = 3.3V$
   - $V_{forward, red} = 2.0V$
   - $R = 220 ohms$

Plugging in values:

   $$
   I_{red} = \frac{3.3V - 2.0V}{220 \, \Omega} = \frac{1.3V}{220 \, \Omega} = 0.00591 \, \text{A} = 5.91 \, \text{mA}
   $$

**Yellow LED**:
   - $V_{supply} = 3.3V$
   - $V_{forward, yellow} = 2.1V$
   - $R = 220 ohms$

Plugging in values:

$$
   I_{yellow} = \frac{3.3V - 2.1V}{220 \, \Omega} = \frac{1.2V}{220 \, \Omega} = 0.00545 \, \text{A} = 5.45 \, \text{mA}
$$

**Results:**

$RED = 5.91 mA$
$YELLOW = 5.45 mA$

---

## 8. Use [https://www.lucidchart.com](https://www.lucidchart.com/) (free account with a .edu email address), or [https://www.draw.io](https://www.draw.io/) to create a circuit diagram of your final circuit (with both LEDs). **Take a screenshot** of your diagram.

You can't see it from the screenshot, but the glow follows your cursor as you hover over the card.

>[!Info] Screenshot
> ![[Screenshot 2024-10-10 at 7.29.55 PM.png]]

---

## Completed Code from Steps 5 and 6

Since I am on a Raspberry Pi 5 and not 4, the code had to be changed a bit during troubleshooting, so might be a bit unconventional.

**Step 5:**

>[!Info] Screenshot
> ![[Screenshot 2024-10-10 at 6.50.23 PM.png]]

**Step 6:**

>[!Info] Screenshot
> ![[Screenshot 2024-10-10 at 7.18.04 PM.png]]

