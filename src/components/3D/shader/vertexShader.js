const vertexShader = `
uniform vec3 u_interactionPos;
  varying float vDist;

  void main() {
    vec3 seg = position - u_interactionPos;
    float dist = length(seg);
    float force = clamp(1.0 / (dist * dist), 0.0, 1.0);
    vec3 newPosition = position + normalize(seg) * force;
    vDist = dist;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    gl_PointSize = 1.0;
  }
`;

export default vertexShader;
