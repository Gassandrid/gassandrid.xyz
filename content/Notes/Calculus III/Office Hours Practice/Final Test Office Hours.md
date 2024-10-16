## 1 polar coordinate practice

problem:

$$\int_{0}^2 \int_{0}^\sqrt{ 2x-x^2 }7\sqrt{ x^2 + y^2 }dydx$$

this tells us that y is running from 0 up to the curve $y=\sqrt{ 2x-x^2 }$

this is some circle of the form $y^2=2x-x^2$

which is this circle

$$x^2+y^2 = 2x$$
thisis also known as $r=2\cos \theta$

lets graph this

> [!Info] Desmos
> <iframe src="https://www.desmos.com/calculator/win3io2qrs" width=600 height="400" ></iframe>

we are looking to fin the top region

we can try to solve it, but it turns out to b a mess like

$$r^2 \sin^2 \theta + r^2 \cos^2 \theta = 2r\cos \theta$$

so lets do it the normal way


$$\int_{0}^ \frac{\pi}{2} \int_{0}^{2\cos \theta} 7r^2 dr d\theta$$

## 2 - vector function problem

we are given

$$r(t) = \langle 3t^2, \ln y, y\ln y \rangle \ \ k@(3,0,0)$$

lets use t=1

so k is

$$k = \frac{|\vec{r}'(t) \times \vec{r}''(t)|}{|\vec{r}'(t)|^3}$$

plugging this in

$$\vec{r}'= \left. \langle 6t, \frac{1}{t}, \ln t+1 \rangle \right|_{t=1} = \langle 6,1,1 \rangle$$

$$\vec{r}'' = \left. \langle 6, - \frac{1}{t^2}, \frac{1}{t} \rangle \right |_{t=1} = \langle 6,-1,1 \rangle$$

$$| \vec{r}' | = \sqrt{ 36 + 1 + 1  } = \sqrt{ 38 }$$

$$\vec{r}' \times \vec{r}'' = \begin{vmatrix}
i & j & k \\
6 & 1 & 1  \\
6 & -1 & 1
\end{vmatrix} = \langle 2,0,-12 \rangle$$

$$| \vec{r}' \times \vec{r}'' | = \sqrt{ 4+144 } = \sqrt{ 148 } = 2\sqrt{ 37 }$$

$$k = \frac{2\sqrt{ 37 }}{38\sqrt{ 38 }}$$

$$\begin{vmatrix}
1 & 2 & 3 \\
6 & 1 & 1 \\
6 & -1 & 1
\end{vmatrix} = 1$$


## chain order thing


$$\int_{0}^8 \int _{x^2}^{64} f(x,y)dydx$$

step 1: sketch $\mathcal{D}$


> [!Info] Desmos
> <iframe src="https://www.desmos.com/calculator/v3xpwaw3om" width=600 height="400" ></iframe>

we are trying to find the area above the x^2 curve and under the y=64 line

so,

$$\int_{0}^{64} \int_{0}^\sqrt{ y }f dxdy$$

$$\int_{0}^1 \int_{\arcsin y = x}^ \frac{\pi}{2} f(x,y) \ dx \ dy$$

so 

$$y = \sin x$$

> [!Info] Desmos
> <iframe src="https://www.desmos.com/calculator/pigfcalyyu" width=600 height="400" ></iframe>

now we are tying to find the area before the line x=pi/2, and under the curve of y = sinx


## another one - converting to a polar integral

$$\int_{0}^2 \int_{0}^{\sqrt{ 4-x^2 }=y}e^{-x^2 - y^2} dy dx$$
sketching $\mathcal{D}$

yields a circle centered at the origin, with a radius of 2. we are looking for the top right quadrant of the circle

thus yieilds

$$\int_{0}^ \frac{\pi}{2} \int_{0}^2 e^{-r^2} r \ dr \ d\theta$$

for I1:

$$\int_{0}^2 re^{-r^2} \ dr$$

$$u = r^2 \ \ \ du = 2r \ dr $$

$$\frac{1}{2} \int_{0}^4 e^{-u}du$$

$$= \left. - \frac{1}{2} e^{-u}\right| _{0}^4$$
$$= - \frac{1}{2} e^{-4} + \frac{1}{2}$$

I2


$$\int_{0}^ \frac{\pi}{2} \frac{1}{2} - \frac{1}{2}e^{-4} d \theta$$

$$\frac{\pi}{2} \left( \frac{1}{2 }-\frac{1}{2}e^{-4} \right)$$

$$\frac{\pi}{4}\left( 1- \frac{1}{e^4} \right) = \frac{\pi}{4} \left( \frac{e^4-1}{e^4} \right)$$

## another one for double integral

$$\int \int_{\mathcal{D}}x dA$$

$\mathcal{D}$ is the region between $x^2 +y^2 = 16$ and $x^2 + y^2 = 4x$

> [!Info] Desmos
> <iframe src="https://www.desmos.com/calculator/uv9eul3ghk" width=600 height="400" ></iframe>

method 1 to go about solving this:

1. $x^2 + y^2 - 4x = 0$
$$x^2 - 4x + y^2 = 0$$

$$(x-2)^2 - 4 +y^2 = 0$$

$$(x-2)^2 + y^2 =4 \ \ \ r = 4\cos \theta$$
2. $r^2 = 4r\cos \theta$

$r = 4\cos \theta$

