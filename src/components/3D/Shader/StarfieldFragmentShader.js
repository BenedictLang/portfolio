const pointCloudFragmentShader = `
uniform float u_time;

void main() {
    float dist = length(gl_PointCoord - vec2(0.5));

    vec3 starColor = vec3(0.2, 0.2, 0.2);

    // Adjust alpha for smoother transition and dimmer stars
    float alpha = 0.5 * (1.0 - smoothstep(0.1, 0.3, dist));
    
    if (dist > 0.5) {
        discard;
    }
    gl_FragColor = vec4(starColor, alpha);
}
`;

export default pointCloudFragmentShader;
