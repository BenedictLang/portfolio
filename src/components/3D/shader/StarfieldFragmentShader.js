const pointCloudFragmentShader = `
void main() {
    // Leuchtender Punkt
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard; // Weiche Kanten für den Punkt
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0 - dist * 2.0);
}
`;

export default pointCloudFragmentShader;
