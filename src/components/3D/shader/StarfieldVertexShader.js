const pointCloudVertexShader = `
uniform float u_time;

void main() {
    vec3 pos = position;

    // Zufällige Bewegung der Sterne basierend auf der Zeit
    float moveAmount = sin(u_time * 0.5 + pos.x * 0.5) * 0.5;
    pos.x += moveAmount;
    pos.y += moveAmount;
    pos.z += moveAmount;

    // Punktegröße zufällig zwischen 1 und 3 festlegen
    gl_PointSize = 1.0 + 2.0 * fract(sin(dot(position.xy ,vec2(12.9898,78.233))) * 43758.5453);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export default pointCloudVertexShader;
