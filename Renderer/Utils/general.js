var random = `
float random(vec3 scale, float seed) {
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 hash3( vec2 p ) {
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
    			   dot(p,vec2(269.5,183.3)), 
    			   dot(p,vec2(419.2,371.9)) );

    return fract(sin(q)*43758.5453);
}

float hash( float v ) {
    return fract(sin(v)*43758.5453);
} 

highp float rand2(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}`;


var mod = `
int mod(int m) {
    return 
}
`;

/**
 * will convert from an integer index to a vec3 offset which can be used to index the uPrimitive 3D texture
 * 
 * KEEP IN MIND: at the end of the function we offset the vec3 values with       primitivesTextureOffset / 2.0  t
 * his ensures we're aiming for the center point of the texel, doing otherwise caused imprecision issues when retrieving the texel
 */
var primitiveIndexToTextureOffset = `
vec3 primitiveIndexToTextureOffset(int index) {
    float x = float(index % primitivesTextureDimension); 
    float y = float((index / primitivesTextureDimension) % (primitivesTextureDimension * primitivesTextureDimension)); 
    float z = float(index  / (primitivesTextureDimension * primitivesTextureDimension));

    return vec3(x * primitivesTextureOffset, y * primitivesTextureOffset, z * primitivesTextureOffset) + primitivesTextureOffset / 2.0; 
}
`;


var getPrimitiveFromIndex = `
Primitive getPrimitiveFromIndex(int index) {

    vec4 v0 = texture(uPrimitives, primitiveIndexToTextureOffset(index * primitiveTextureComponents + 0));
    vec4 v1 = texture(uPrimitives, primitiveIndexToTextureOffset(index * primitiveTextureComponents + 1));
    vec4 v2 = texture(uPrimitives, primitiveIndexToTextureOffset(index * primitiveTextureComponents + 2));

    Primitive prim;
    prim.v0 = v0.xyz;
    prim.v1 = v1.xyz;
    prim.v2 = v2.xyz;
    prim.type          = 0; 
    prim.materialIndex = 0; 
    
    return prim;
}
`;
var utils = random +
            primitiveIndexToTextureOffset + 
            getPrimitiveFromIndex;
