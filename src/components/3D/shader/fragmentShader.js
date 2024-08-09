const fragmentShader = `
varying float vDist; // Erhalt der Distanz aus dem Vertex-Shader
varying vec3 v_position; // Erhalt der Position aus dem Vertex-Shader

void main() {
    vec3 color;
    float alpha;
    
    // Beispiel für Farbänderung basierend auf der Distanz
    if (vDist < 2.0) {
        color = vec3(1.0, 0.0, 1.0); // Magenta für beeinflusste Partikel
        alpha = 1.0;
    } else {
        color = vec3(0.0, 1.0, 1.0); // Cyan für nicht beeinflusste Partikel
        alpha = 1.0;
    }
    
    gl_FragColor = vec4(color, alpha);
}

`;

export default fragmentShader;
