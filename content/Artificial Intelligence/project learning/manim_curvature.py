from manim import *


class CurvatureVisualization(Scene):
    def construct(self):
        # Define the parametric curve
        curve = ParametricFunction(
            lambda t: np.array([t, np.sin(t), 0]),  # 2D curve: y = sin(t)
            t_range=np.array([-PI, PI]),  # Set the range of t
            color=BLUE,
        )

        # Parametric point and its velocity and acceleration
        dot = Dot(color=YELLOW)
        velocity_arrow = always_redraw(
            lambda: Arrow(
                dot.get_center(),
                dot.get_center() + self.velocity(curve, dot),
                buff=0,
                color=GREEN,
            )
        )

        acceleration_arrow = always_redraw(
            lambda: Arrow(
                dot.get_center(),
                dot.get_center() + self.acceleration(curve, dot),
                buff=0,
                color=RED,
            )
        )

        # Path for dot to follow on the curve
        path = ValueTracker(-PI)
        dot.add_updater(
            lambda mob: mob.move_to(
                curve.point_from_proportion((path.get_value() + PI) / (2 * PI))
            )
        )

        # Show the curve and moving dot with velocity and acceleration arrows
        self.play(Create(curve))
        self.add(dot, velocity_arrow, acceleration_arrow)
        self.play(path.animate.set_value(PI), run_time=5, rate_func=linear)

        # Pause before ending
        self.wait()

    def velocity(self, curve, dot):
        """Calculate the velocity (derivative of the curve) at the current point."""
        t_value = self.find_t_value(dot, curve)
        delta_t = 0.01
        point_a = curve.function(t_value)
        point_b = curve.function(t_value + delta_t)
        return (point_b - point_a) / delta_t

    def acceleration(self, curve, dot):
        """Calculate the acceleration (second derivative of the curve) at the current point."""
        t_value = self.find_t_value(dot, curve)
        delta_t = 0.01
        vel_a = self.velocity(curve, dot)
        dot_temp = Dot().move_to(
            curve.function(t_value + delta_t)
        )  # Temporary dot for velocity calculation
        vel_b = self.velocity(curve, dot_temp)
        return (vel_b - vel_a) / delta_t

    def find_t_value(self, dot, curve):
        """Find the corresponding t-value on the curve from the dot's position."""
        dot_pos = dot.get_center()
        return np.arcsin(dot_pos[1])
