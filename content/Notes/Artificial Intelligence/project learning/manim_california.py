from manim import *


# Custom class to define the neural network layers visually
class NeuralNetworkDiagram(Scene):
    def construct(self):
        # Title
        title = (
            Text("Neural Network Architecture for California Housing")
            .scale(0.7)
            .to_edge(UP)
        )
        self.play(Write(title))

        # Input layer (8 features)
        input_layer = self.create_layer(
            num_neurons=8, layer_label="Input Layer (8 features)", neuron_radius=0.2
        )
        input_layer.shift(LEFT * 4)

        # Hidden layer 1 (64 neurons abbreviated)
        hidden_layer_1 = self.create_layer(
            num_neurons=3, neuron_radius=0.2, abbreviation="...64"
        )
        hidden_layer_1.next_to(input_layer, RIGHT, buff=2)

        # Hidden layer 2 (32 neurons abbreviated)
        hidden_layer_2 = self.create_layer(
            num_neurons=3, neuron_radius=0.2, abbreviation="...32"
        )
        hidden_layer_2.next_to(hidden_layer_1, RIGHT, buff=2)

        # Output layer (1 neuron)
        output_layer = self.create_layer(
            num_neurons=1, layer_label="Output Layer (House Price)", neuron_radius=0.2
        )
        output_layer.next_to(hidden_layer_2, RIGHT, buff=2)

        # Connect layers with arrows
        self.connect_layers(input_layer, hidden_layer_1)
        self.connect_layers(hidden_layer_1, hidden_layer_2)
        self.connect_layers(hidden_layer_2, output_layer)

        # Add layers to the scene
        self.play(
            FadeIn(input_layer),
            FadeIn(hidden_layer_1),
            FadeIn(hidden_layer_2),
            FadeIn(output_layer),
        )

        # Hold the final view
        self.wait(3)

    def create_layer(
        self, num_neurons, layer_label=None, neuron_radius=0.3, abbreviation=None
    ):
        neurons = VGroup(
            *[Circle(radius=neuron_radius, color=BLUE) for _ in range(num_neurons)]
        )

        # Arrange neurons vertically
        neurons.arrange(DOWN, buff=0.5)

        # Add abbreviation label if specified
        if abbreviation:
            ellipsis_label = Text(abbreviation).scale(0.7)
            ellipsis_label.next_to(neurons, DOWN, buff=0.3)
            neurons.add(ellipsis_label)

        # Add a label for the layer if specified
        if layer_label:
            label = Text(layer_label).scale(0.5)
            label.next_to(neurons, UP)
            neurons.add(label)

        return neurons

    def connect_layers(self, layer1, layer2):
        for neuron1 in layer1[:3]:
            for neuron2 in layer2[:3]:
                self.play(
                    Create(Line(neuron1.get_right(), neuron2.get_left())), run_time=0.5
                )
