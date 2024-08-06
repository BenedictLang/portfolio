const fragmentShader = `
uniform float u_red;
uniform float u_green;
uniform float u_blue;
uniform float u_intensity;

void main() {
    vec3 color = vec3(u_red, u_green, u_blue) * u_intensity;

    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    gl_FragColor = vec4(color, 1.0);
}
`;

export default fragmentShader;
