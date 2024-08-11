const pointCloudFragmentShader = `
uniform float u_time;

uniform float u_red;
uniform float u_green;
uniform float u_blue;
uniform float u_intensity;

uniform float u_interactionRadius;
in float vDist;
in float vColorFactor;
in float vBoostIntensity;

void main() {    
    // Calculate pulsating factor using a sine wave, based on time and frequency
    float pulsatingIntensity = u_intensity + 0.25 * sin(u_time * 3.0);

    // Base color, modulated by the pulsating intensity
    vec3 baseColor = vec3(u_red, u_green, u_blue) * pulsatingIntensity;

    // Compute the complementary color by inverting the base color
    vec3 complementaryColor = vec3(1.0) - (baseColor * 0.7);

    // Adjust the color based on the distance to the original position
    vec3 color = mix(baseColor, vec3(1.5), vColorFactor);

    // Interpolate to complementary color if influenced by the line segment
    if (vBoostIntensity > 0.0) {
        float influence = smoothstep(0.9, 0.0, vDist * 0.3);
        color = mix(color, complementaryColor, influence);
    }

    // Handle point size and discard if outside bounds
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    // Set the final color with full opacity
    gl_FragColor = vec4(color, 1.0);
}
`;

export default pointCloudFragmentShader;
