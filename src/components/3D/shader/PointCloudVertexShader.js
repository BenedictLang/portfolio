const pointCloudVertexShader = `
uniform float u_time;
uniform float u_gravity;
uniform float u_frequency;

uniform bool u_perspectiveCorrection;
uniform vec3 u_cameraPosition;
uniform vec3 u_targetPosition;
uniform vec3 u_objectPosition;
uniform float u_objectRadius;
uniform float u_interactionRadius;

out float vDist;
out float vColorFactor;
out float vBoostIntensity;

// Utility functions for Perlin noise
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 10.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float pnoise(vec3 P, vec3 rep) {
    vec3 Pi0 = mod(floor(P), rep);
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}

void main() {
    vec3 pos = position + u_time * 0.2;
    float dist = length(position);
    float timeFactor = u_time * (0.3 + dist * 0.03);

    // Calculate the noise-based displacement
    float noise1 = 10.0 * pnoise(pos * 0.2 + vec3(timeFactor), vec3(10.0));
    float noise2 = 5.0 * pnoise(pos * 0.6 + vec3(timeFactor), vec3(10.0));
    float noise3 = 2.5 * pnoise(pos * 1.2 + vec3(timeFactor), vec3(10.0));

    float smallNoise1 = 0.5 * pnoise(pos * 4.0 + vec3(u_time * 1.0), vec3(10.0));
    float smallNoise2 = 0.25 * pnoise(pos * 6.0 + vec3(u_time * 1.5), vec3(10.0));
    float smallNoise3 = 0.125 * pnoise(pos * 8.0 + vec3(u_time * 2.0), vec3(10.0));

    float displacement = (u_frequency / 30.0) * ((noise1 + noise2 + noise3) / 10.0 * (1.0 + dist * 0.5) + (smallNoise1 + smallNoise2 + smallNoise3) / 5.0);

    // New position after noise displacement
    vec3 noisePosition = position + normal * displacement;

    // Store the distance factor for color adjustment
    vColorFactor = length(noisePosition - position);

    // Line segment collision calculations using noise-displaced position
    vec3 lineVec = u_targetPosition - u_cameraPosition;
    vec3 pointToPos = noisePosition - u_cameraPosition;
    float perspectiveFactor;

    float t = dot(pointToPos, lineVec) / dot(lineVec, lineVec);
    t = clamp(t, 0.0, 1.0);
    
    if (u_perspectiveCorrection) {
        float z_entry = length(u_objectPosition - u_cameraPosition) - u_objectRadius;
        float z_exit = length(u_targetPosition - u_cameraPosition) + u_objectRadius;
        float z_vertex = length(noisePosition - u_cameraPosition);
        perspectiveFactor = z_entry / z_vertex;
    } else {
        perspectiveFactor = 1.0;
    }

    vec3 closestPointOnLine = u_cameraPosition + t * lineVec;
    vec3 seg = noisePosition - closestPointOnLine;
    float distToLine = length(seg) * perspectiveFactor;
    float force = smoothstep(u_interactionRadius, 0.0, distToLine);
    
    // Pass distance to the fragment shader for color adjustments
    vDist = distToLine;
    
    // Set a flag if the particle is influenced by the line segment
    vBoostIntensity = float(distToLine < u_interactionRadius);
    
    // Final position considering both noise and line segment influence
    vec3 finalPosition = noisePosition + normalize(seg) * force;

    // Output final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
    gl_PointSize = 2.0;
}
`;

export default pointCloudVertexShader;
