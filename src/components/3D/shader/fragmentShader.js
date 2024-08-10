const fragmentShader = `
uniform float u_time;
uniform float u_frequency;

uniform float u_red;
uniform float u_green;
uniform float u_blue;
uniform float u_intensity;

uniform float u_interactionRadius;
varying float vDist;

void main() {
    // Base color
    vec3 baseColor = vec3(u_red, u_green, u_blue) * u_intensity;

    // Compute the complementary color by inverting the base color
    vec3 complementaryColor = vec3(1.0) - (baseColor * 0.7);

    // Smooth interpolation factor based on the distance
    float influence = smoothstep(0.0, u_interactionRadius, vDist);

    // Interpolate between the base color and its complementary color
    vec3 color = mix(complementaryColor, baseColor, influence);

    // Handle point size and discard if outside bounds
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    // Set the final color
    gl_FragColor = vec4(color, 1.0);
}
`;

export default fragmentShader;
