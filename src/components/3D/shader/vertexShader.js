const vertexShader = `
uniform vec3 u_interactionPosA;
uniform vec3 u_interactionPosB;
uniform float u_interactionRadius;
uniform float u_perspectiveDiff;

varying float vDist;

void main() {
    vec3 lineVec = u_interactionPosB - u_interactionPosA;  // Vector representing the direction of the line
    vec3 pointToPos = position - u_interactionPosA; // Vector to the current vertex

    // Find the closest point on the line
    float t = dot(pointToPos, lineVec) / dot(lineVec, lineVec);
    
    // Clamp t to the range [0, 1] to ensure the closest point lies on the segment between u_interactionPosA and u_interactionPosB
    t = clamp(t, 0.0, 1.0);

    // Apply a perspective correction to the t value
    float perspectiveFactor = 1.0 + u_perspectiveDiff * (t - 0.5) * (t - 0.5);
    float adjustedT = mix(t, perspectiveFactor, u_perspectiveDiff);
    
    // Calculate the closest point on the line segment with adjustedT
    vec3 closestPointOnLine = u_interactionPosA + adjustedT * lineVec;
    
    // Calculate the distance from the vertex to the closest point on the line
    vec3 seg = position - closestPointOnLine;
    float dist = length(seg);

    // Calculate the repelling force based on the distance to the line
    float force = smoothstep(u_interactionRadius, 0.0, dist);
    
    // Modify the vertex position based on the repelling force
    vec3 newPosition = position + normalize(seg) * force;
    
    // Store the distance for use in the fragment shader
    vDist = dist;
    
    // Set the transformed position of the vertex
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    
    // Set the size of the point to 1.0 pixel
    gl_PointSize = 2.0;
}
`;

export default vertexShader;
