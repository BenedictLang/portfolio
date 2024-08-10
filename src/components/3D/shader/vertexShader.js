const vertexShader = `
uniform float u_time;
uniform float u_gravity;
uniform float u_frequency;

uniform bool u_perspectiveCorrection;
uniform vec3 u_cameraPosition;
uniform vec3 u_targetPosition;
uniform vec3 u_objectPosition;
uniform float u_objectRadius;
uniform float u_interactionRadius;

varying float vDist;
varying vec3 vPosition;

void main() {
    vec3 lineVec = u_targetPosition - u_cameraPosition;  // Vector representing the direction of the line
    vec3 pointToPos = position - u_cameraPosition; // Vector to the current vertex
    float perspectiveFactor;

    // Find the closest point on the line
    float t = dot(pointToPos, lineVec) / dot(lineVec, lineVec);
    
    // Clamp t to the range [0, 1] to ensure the closest point lies on the segment between u_cameraPosition and u_targetPosition
    t = clamp(t, 0.0, 1.0);
    
    if (u_perspectiveCorrection) {
        // Calculate the depth of the object and entry/exit points
        float z_entry = length(u_objectPosition - u_cameraPosition) - u_objectRadius;
        float z_exit = length(u_targetPosition - u_cameraPosition) + u_objectRadius;
    
        // Calculate the depth of the current vertex
        float z_vertex = length(position - u_cameraPosition);
        
        // Calculate the perspective factor (a ratio of entry to vertex depth)
        perspectiveFactor = z_entry / z_vertex;
    } else {
        perspectiveFactor = 1.0;
    }    

    // Apply the perspective factor to scale the distance
    vec3 closestPointOnLine = u_cameraPosition + t * lineVec;
    
    // Calculate the distance from the vertex to the closest point on the line
    vec3 seg = position - closestPointOnLine;
    float dist = length(seg) * perspectiveFactor; // Adjust distance by perspective factor

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
