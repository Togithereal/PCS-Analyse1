const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const addNodeBtn = document.getElementById('addNodeBtn');
const deleteNodeBtn = document.getElementById('deleteNodeBtn');
const calculateBtn = document.getElementById('calculateBtn');
const result = document.getElementById('result');

let nodes = [];
let edges = [];
let selectedNode = null;
let isDragging = false; // For moving nodes
let dragNode = null; // The node currently being dragged

const NODE_RADIUS = 60; // Larger nodes for better visibility

// Add a node
addNodeBtn.addEventListener('click', () => {
    const id = nodes.length + 1;
    const x = Math.random() * (canvas.width - NODE_RADIUS * 2) + NODE_RADIUS;
    const y = Math.random() * (canvas.height - NODE_RADIUS * 2) + NODE_RADIUS;
    nodes.push({ id, x, y, text: `Task ${id}` });
    draw();
});

// Delete a node
deleteNodeBtn.addEventListener('click', () => {
    if (selectedNode) {
        nodes = nodes.filter(node => node !== selectedNode);
        edges = edges.filter(edge => edge.from !== selectedNode && edge.to !== selectedNode);
        selectedNode = null;
        draw();
    }
});

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(edge.from.x, edge.from.y);
        ctx.lineTo(edge.to.x, edge.to.y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
        ctx.strokeStyle = '#000'; // Transparent nodes (only border)
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0)'; // Fully transparent fill
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px Arial'; // Updated font size for better readability
        ctx.fillText(node.text, node.x, node.y);
    });
}

// Find a node by position
function findNode(x, y) {
    return nodes.find(node => Math.hypot(node.x - x, node.y - y) < NODE_RADIUS);
}

// Select and connect nodes
canvas.addEventListener('click', (e) => {
    if (isDragging) return; // Ignore clicks while dragging

    const { offsetX: x, offsetY: y } = e;
    const node = findNode(x, y);

    if (node) {
        if (selectedNode) {
            if (selectedNode !== node) {
                edges.push({ from: selectedNode, to: node });
                selectedNode = null;
            }
        } else {
            selectedNode = node;
        }
    } else {
        selectedNode = null;
    }

    draw();
});

// Add text to nodes
canvas.addEventListener('dblclick', (e) => {
    const { offsetX: x, offsetY: y } = e;
    const node = findNode(x, y);

    if (node) {
        const newText = prompt('Text für den Kreis eingeben:', node.text);
        if (newText) {
            node.text = newText;
        }
        draw();
    }
});

// Drag and move nodes
canvas.addEventListener('mousedown', (e) => {
    const { offsetX: x, offsetY: y } = e;
    const node = findNode(x, y);

    if (node) {
        isDragging = true;
        dragNode = node;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging && dragNode) {
        const { offsetX: x, offsetY: y } = e;
        dragNode.x = x;
        dragNode.y = y;
        draw();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    dragNode = null;
});

// Calculate optimal Durchlaufanzahl
calculateBtn.addEventListener('click', () => {
    const stepCount = nodes.length; // Placeholder logic
    result.textContent = `Minimale Durchlaufanzahl: ${stepCount}`;
});
