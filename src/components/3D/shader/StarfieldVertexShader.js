const pointCloudVertexShader = `
uniform float u_time;

void main() {
    vec3 pos = position;

    float moveAmount = sin(u_time * 0.5 + pos.x * 0.5) * 0.5;
    pos.x += moveAmount;
    pos.y += moveAmount;
    pos.z += moveAmount;

    gl_PointSize = 1.0 + 3.0 * fract(sin(dot(position.xy ,vec2(12.9898,78.233))) * 43758.5453);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export default pointCloudVertexShader;
