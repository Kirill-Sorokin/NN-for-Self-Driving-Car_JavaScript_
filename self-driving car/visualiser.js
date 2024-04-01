class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHeight = height / network.levels.length;

        for (let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop = top +
                lerp(
                    height - levelHeight,
                    0,
                    network.levels.length == 1
                        ? 0.5
                        : i / (network.levels.length - 1)
                );

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, network.levels[i],
                left, levelTop,
                width, levelHeight,
                i == network.levels.length - 1
                    ? ['↑', '←', '→', '↓'] // using arrow symbols as labels for the outputs
                    : []
            );
        }
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;

        const { inputs, outputs, weights, biases } = level;

        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs, j, left, right),
                    top
                );
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        const nodeRadius = 18;
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }

        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = (nodeRadius * 1.5) + "px Arial";
                ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
            }
        }
    }

    static #getNodeX(nodes, index, left, right) {
        return lerp(
            left,
            right,
            nodes.length == 1
                ? 0.5
                : index / (nodes.length - 1)
        );
    }
}

function getRGBA(value) {
    // Assuming value is normalized between -1 and 1
    const alpha = Math.abs(value);
    const color = value > 0 ? '0,255,0' : '255,0,0'; // green for positive, red for negative
    return `rgba(${color},${alpha})`;
}

/**
 * Neural Network Visualization Color Coding:
 *
 * Green Links: Represent positive weight values in the neural network. A green link indicates
 * that the input it's receiving is positively influencing the activation of the neuron it's
 * connected to. In essence, it's encouraging the neuron to activate, contributing to the action
 * the network is recommending (e.g., move forward, turn).
 *
 * Red Links: Indicate negative weight values. A red link means that the input is having a
 * negative effect on the neuron it's connected to. This inhibitory effect discourages the neuron
 * from activating, suggesting that the particular input should not lead to the action being
 * considered (e.g., stop, don't turn).
 *
 * Brightness/Intensity: The intensity or brightness of the color indicates the magnitude of the
 * weight value. A brighter or more saturated color implies a stronger weight (closer to 1 or -1),
 * indicating a higher confidence or influence that connection has on the neuron's activation.
 *
 * Transparency: In some implementations, the alpha value (transparency) of the link can also
 * represent the magnitude of the weight. More transparent links indicate a weaker influence
 * (weight value closer to 0), while more opaque links show a stronger influence.
 *
 * This visualization helps in understanding how different sensor inputs are being processed and
 * weighted by the neural network, providing insights into the decision-making process of the
 * autonomous vehicle. Brightly colored links suggest strong influences in the network's
 * computations, affecting the car's behavior such as accelerating, braking, or steering.
 */
