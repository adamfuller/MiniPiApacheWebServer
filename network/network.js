class Network{

    constructor(){
        this.neurons = [];
        this.neuronOrder = [];
    }

    attachNeuron(neuron){
        this.neurons.push(neuron);
    }

    buildNeuronOrder(){
        this.neuronOrder = [];

        // Make a copy of the neurons
        let maxDepth = -1;
        this.neurons.forEach((n) => maxDepth = Math.max(n.depth, maxDepth));
        // Presize
        this.neuronOrder.length = maxDepth;
        this.neurons.forEach((n) => {
            if (this.neuronOrder[n.depth+1]){
                this.neuronOrder[n.depth+1].push(n);
            } else {
                this.neuronOrder[n.depth+1] = [n];
            }
        });
    }

    forwardProp(input){

        if (this.neuronOrder.length == 0){
            console.log("Neuron Order not build! call buildNeuronOrder()");
            return;
        }

        // Start the propagation with the input layer
        this.neuronOrder[0].forEach((n) => n.forwardProp(input));

        for (let i = 1; i<this.neuronOrder.length; i++){
            // They should fetch the output of their parent neurons
            this.neuronOrder[i].forEach((n) => n.forwardProp());
        }

        return this.neuronOrder[this.neuronOrder.length-1].map((n) => n.output); 
    }

    backwardProp(expectedOutput){
        let outputLayer = this.neuronOrder[this.neuronOrder.length-1];

        for (let i = 0; i<outputLayer.length; i++){
            outputLayer[i].backPropOutput(expectedOutput[i]);
        }

        for (let i = this.neuronOrder.length-2; i>=0; i--){
            this.neuronOrder[i].forEach((n) => n.backPropHidden());
        }

        // Apply all the adjustments
        this.neuronOrder.forEach((layer) => layer.forEach((n) => n.applyAdjustments()));
    }

}

class Neuron {
    sigmoid(x) {
        return 1.0 / (1.0 + Math.exp(-x));
    }
    sigmoidDerivative(x) {
        let s = this.sigmoid(x);
        return s * (1.0 - s);
    }
    relu(x) {
        if (x > 0.0)
            return x;

        return 0.0;
    }
    reluDerivative(x) {
        if (x > 0.0)
            return 1.0;

        return 0.0;
    }
    /**
     * @param {number} x - input to leakyReLU
     */
    leakyRelu(x) {
        if (x > 0.0)
            return x;

        return 0.1 * x;
    }
    leakyReluDerivative(x) {
        if (x > 0.0)
            return 1;

        return 0.1;
    }

    constructor(learningRate=0.033) {

        this.inputs = [];
        this.parents = [];
        this.children = [];
        this.nextLayerIndices = [];
        this.depth = -1;

        /**
         * Current output of the neuron
         */
        this.output = 0.0;
        this.delta = 0.0;
        this.error = 0.0;

        /**
         * Weights for inputs
         */
        this.weights = [];
        this.weightAdj = [];
        this.inputs = [];

        // for (let i = 0; i < inputCount; i++) {
        //     this.weights.push(2.0 * Math.random() - 1.0);
        //     this.weightAdj.push(0.0);
        // }

        this.learningRate = learningRate;
        this.activationFunction = this.leakyRelu;
        this.activationFunctionDerivative = this.leakyReluDerivative;

    }

    connectParent(parent){
        if (this.parents.includes(parent))
            return;

        this.weights.push(2.0 * Math.random() - 1.0);
        this.weightAdj.push(0.0);

        this.depth = Math.max(parent.depth + 1, this.depth);

        this.parents.push(parent);
        parent.connectChild(this, true);
    }

    connectChild(child, isCalledFromParent=false){
        if (this.children.includes(child))
            return;

        if (isCalledFromParent){
            this.nextLayerIndices.push(child.parents.length - 1);
        } else {
            this.nextLayerIndices.push(child.parents.length);
        }

        this.children.push(child);
        child.connectParent(this);
    }

    /**
     * Re-randomize the neuron's weights
     */
    reset() {
        for (let i = 0; i < this.weights.length; i++) {
            weights[i] = (2.0 * Math.random() - 1.0);
        }
    }

    /**
     * Adjust the size of the weights for a given input
     * @param {number[]} input - input to be accomodated
     */
    adjustForInput(input) {
        this.inputs = [1.0].concat(input);

        if (this.weights.length == this.inputs.length) return;

        // Increase the size of weights
        if (this.inputs.length >= this.weights.length) {
            for (let i = this.weights.length; i < this.inputs.length; i++) {
                this.weights.push(2.0 * Math.random() - 1.0);
                this.weightAdj.push(0.0);
            }
            // Don't go further
            return;
        }


        // Reduce the size of weights
        if (this.inputs.length < this.weights.length) {
            this.weights = this.weights.slice(0, inputs.length);
            this.weightAdj = this.weightAdj.slice(0, inputs.length);
        }
    }

    /**
     * Returns a number representing this neurons output for a given input
     * @param {number[]} input - input to the neuron
     */
    forwardProp(input=null) {
        // The input to this neuron is the output of the parents
        if (!input){
            input = this.parents.map((n) => n.output);
        }
        this.output = 0;

        // Adjust the current weights based on the given input
        this.adjustForInput(input);

        // Calculate the output
        for (let i = 0; i < this.inputs.length; i++) {
            this.output += this.inputs[i] * this.weights[i];
        }

        // Apply the activation function and output the result
        return this.activationFunction(this.output);
    }

    /**
     * Computes adjustments to the weights based on an expected output
     * @param {number} expectedOutput 
     */
    backPropOutput(expectedOutput) {
        // Difference between expected and calculated output
        this.error = expectedOutput - this.output;

        // Adjust for input based on error * gradient of output
        this.delta = this.error * this.activationFunctionDerivative(this.output);

        if (!!!this.delta) {
            console.log("BAD DELTA!!");
        }

        // For each input calculate the new corresponding weight
        this.weightAdj = this.inputs.map((i) => i * this.delta);
    }

    /**
     * Performs back propagation after getting the next layers weights and deltas
     */
    backPropHidden() {
        let nextLayerDeltas = [];
        let nextLayerWeights = [];
        for (let i = 0; i<this.children.length; i++){
            nextLayerDeltas[i] = this.children[i].delta;
            nextLayerWeights[i] = this.children[i].weights[this.nextLayerIndices[i]];
        }

        this.delta = 0.0;

        // Adjust based on each neuron that pulls from this one
        for (let i = 0; i < nextLayerDeltas.length; i++) {
            this.delta += nextLayerDeltas[i] * nextLayerWeights[i];
        }
        this.delta *= this.activationFunctionDerivative(this.output);

        // Assign the adjustments
        for (let i = 0; i < this.inputs.length; i++) {
            this.weightAdj[i] = this.delta * this.inputs[i];
        }
    }

    applyAdjustments() {
        // let maxWeight = 0.0;
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += this.weightAdj[i] * this.learningRate;
            // if (Math.abs(this.weights[i]) > maxWeight) maxWeight = Math.abs(this.weights[i]);
            // this.weightAdj[i] = 0.0;
        }
        // Normalize the weights
        // this.weights = this.weights.map((w) => w / maxWeight);
    }

}

let n1 = new Neuron(0.1);
let n2 = new Neuron(0.1);
let n3 = new Neuron(0.1);
let n4 = new Neuron(0.1);
let n5 = new Neuron(0.1);

n1.connectChild(n2);
n1.connectChild(n3);

n4.connectParent(n2);
n4.connectParent(n3);
n5.connectParent(n3);

let net = new Network();

net.attachNeuron(n1);
net.attachNeuron(n2);
net.attachNeuron(n3);
net.attachNeuron(n4);
net.attachNeuron(n5);

net.buildNeuronOrder();

console.log("Before Training:");
console.log("Going to (0,1): " , net.forwardProp([1]));
console.log("Going to (1,0): " , net.forwardProp([0]));

for (let i = 0; i<1000; i++){
    net.forwardProp([1]);
    net.backwardProp([0.0,1.0]);
    net.forwardProp([0]);
    net.backwardProp([1.0,0.0]);
    // console.log(net.forwardProp([0.5]));
}

console.log("\nAfter Training:");
console.log("Going to (0,1): " , net.forwardProp([1]));
console.log("Going to (1,0): " , net.forwardProp([0]));