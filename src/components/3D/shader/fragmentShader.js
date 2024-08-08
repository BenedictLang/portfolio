const fragmentShader = `
uniform float u_time;
uniform float u_frequency;
uniform float u_intensity;
uniform float u_red;
uniform float u_green;
uniform float u_blue;

varying vec3 v_position;

void main() {
    float brightness = sin(u_frequency * length(v_position) - u_time) * 0.2 + 0.9;
    vec3 color = vec3(u_red, u_green, u_blue) * brightness * u_intensity;
    
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    gl_FragColor = vec4(color, 1.0);
}
`;

export default fragmentShader;
