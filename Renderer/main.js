function getHeader() {
    var header = `#version 300 es
    precision highp float;  
    precision highp sampler3D;

    in vec2 vUV;    

    out vec4 Color; 

    uniform float uTime;
    uniform vec2  uRand;
    uniform float uScreenRatio;
    uniform sampler3D uPrimitives;` +
    camera.cameraUniforms +
    `
    #define BACKGROUND_COLOR 1
    #define PI 3.1415926535897932384626433832795    

    const float screenWidth  =` + innerWidth  + `.0;
    const float screenHeight =` + innerHeight + `.0;

    const int lightBounces = 25;

    const int nMaterials  = 6;
    ` +
    scene.sceneProperties +
    camera.cameraProperties;

    return header;
}

var structs = `
struct Ray {
    vec3 o;
    vec3 d;
};

struct Material {
    int type;
    vec3 color;
};

struct Primitive {
    /* IF TYPE == 0 - v0 represents the center of a sphere */
    vec3 v0;
    /* IF TYPE == 0 - v1.x represents the radius of a sphere */        
    vec3 v1;
    vec3 v2;
    /* IF TYPE == 0  type represents a sphere */        
    int type;
    int materialIndex;
};

struct Scene {
    Primitive primitives[6];
    Material  materials[nMaterials];
};

struct IntersectionResult {
    float t;
    int   primitiveIndex;
};
`;

var normalFunction = `
vec3 normalAt(vec3 hitPoint, Primitive primitive) {
    if(primitive.type == 0) {
        return normalize(hitPoint - primitive.v0);
    }
}`;

var scatterFunctions = `
Ray scatter(Ray ray, Scene scene, vec3 hitPoint, Primitive prim, int bounces) {
    // USE A SWITCH
    // USE A SWITCH
    // USE A SWITCH
    // USE A SWITCH
    // USE A SWITCH
    // USE A SWITCH
    Material  mat  = scene.materials[prim.materialIndex]; 

     if(mat.type == 0) {` +
        BRDF_Lambert_RTOW +
    `}
}`;

var integrator = `
vec3 compute(Ray ray, Scene scene) {

    vec3 results[lightBounces];
    int  bounces = 0;
    for(int l = 0; l < lightBounces; l++) {

        Primitive primRef;
        float mint = 9999999999.9;
        int   primitiveIndex = -1;
        
        for(int i = 0; i < nPrimitives; i++) {

            Primitive prim = getPrimitiveFromIndex(i);

            if(prim.type == 0) {
                float t = intersectSphere(ray, prim);
                if(t > 0.0 && t < mint) {
                    mint = t;
                    primitiveIndex = i;
                    primRef = prim;
                }
            }
        }

        if(  (mint > 0.00001) && (primitiveIndex != -1) && (l < (lightBounces - 1))   ) {
            int materialIndex = primRef.materialIndex; // scene.primitives[primitiveIndex].materialIndex;
            Material mat = scene.materials[materialIndex];
            results[l] = mat.color;

            if(mat.type == 1) {   // lightsource
                bounces++;
                results[l] = mat.color;     
                break;           
            }

            bounces++;
            vec3 hitpoint = ray.o + ray.d * mint;
            ray = scatter(ray, scene, hitpoint, primRef, bounces);
        } else {

            #if BACKGROUND_COLOR == 1 
                float ty = ray.d.y * 0.5 + 0.5;
                float tx = ray.d.x * 0.5 + 0.5;
                vec3 col = vec3(
                        (1.0 - tx) * 1.0  + tx * 0.0, // 0.5
                        (1.0 - ty) * 1.0  + tx * 0.0, // 0.7
                        (1.0 - ty) * 1.0  + tx * 0.2  // 1.0
                    );
                results[l] = col;
                // results[l] = vec3(1.0 * ty, 1.0 * ty, 1.0);
                bounces++;                
                break;
            #endif



            #if BACKGROUND_COLOR == 0
                results[l] = vec3(0.0, 0.0, 0.0);
                bounces++;
                break;                    
            #endif


            break;
        }
    }




    vec3 finalColor = vec3(1.0);
    // integrate colors 
    for(int i = bounces-1; i >= 0; i--) {
        finalColor = finalColor * results[i];
    }

    return finalColor;
}`;

var sceneFunctions = `
Scene buildScene() {

    /* building primitives */
    
    
    Scene scene;
    Primitive s1;
    s1.v0 = vec3(0,  0, 60);
    s1.v1 = vec3(15, 0, 0);
    s1.type = 0;
    s1.materialIndex = 0;
    scene.primitives[0] = s1;


    Primitive s2;
    s2.v0 = vec3(0,  -510, 50);
    s2.v1 = vec3(500, 0, 0);
    s2.type = 0;
    s2.materialIndex = 1;
    scene.primitives[1] = s2;

    
    Primitive s3;
    s3.v0 = vec3(-20,  0, 55);
    s3.v1 = vec3(5, 0, 0);
    s3.type = 0;
    s3.materialIndex = 2;
    scene.primitives[2] = s3;


    Primitive s4;
    s4.v0 = vec3(0, 20, 20);
    s4.v1 = vec3(10, 0, 0);
    s4.type = 0;
    s4.materialIndex = 3;
    scene.primitives[3] = s4;

    Primitive s5;
    s5.v0 = vec3(-20, 20, 50);
    s5.v1 = vec3(15, 0, 0);
    s5.type = 0;
    s5.materialIndex = 4;
    scene.primitives[4] = s5;

    Primitive s6;
    s6.v0 = vec3(40, 8, 50);
    s6.v1 = vec3(15, 0, 0);
    s6.type = 0;
    s6.materialIndex = 5;
    scene.primitives[5] = s6;




    /* building materials */

    Material m0;
    m0.color = vec3(0.9, 0.9, 0.9);
    m0.type  = 0;
    scene.materials[0] = m0;

    Material m1;
    m1.color = vec3(0.9, 0.7, 0.6);
    m1.type  = 0;
    scene.materials[1] = m1;

    Material m2;
    m2.color = vec3(0.75, 0.53, 0.25);
    m2.type  = 0;
    scene.materials[2] = m2;

    Material m3;
    m3.color = vec3(1, 0.3, 0.2);
    m3.type  = 0;   // lightsource
    scene.materials[3] = m3;

    Material m4;
    m4.color = vec3(0.4, 1, 0.4);
    m4.type  = 0;   // lightsource
    scene.materials[4] = m4;

    Material m5;
    m5.color = vec3(1.0, 0.2, 1.0);
    m5.type  = 0;   // lightsource
    scene.materials[5] = m5;
    



    return scene;
}`;

var entryPoint = `
void main() {
    Scene scene = buildScene();

    Ray ray = getCameraRay(vUV);
    // Color = vec4(getCameraRay(vUV).d, 1.0);
    // return;

    vec3 res = compute(ray, scene);
    Color = vec4(sqrt(res.xyz), 1.0);     
}`;

function buildRenderer() {
    window.Renderer = getHeader() +
                      structs +
                      utils +
                      intersectSphere +
                      normalFunction + 
                      scatterFunctions + 
                      integrator +
                      sceneFunctions +
                      camera.getCameraRay +
                      entryPoint;
}

function rebuildRenderer() {
    window.Renderer = getHeader() +
                      structs +
                      utils +
                      intersectSphere +
                      normalFunction + 
                      scatterFunctions + 
                      integrator +
                      sceneFunctions +
                      camera.getCameraRay +
                      entryPoint;
    
    clearRendererFBO();
    createRenderProgram();
}

function clearRendererFBO() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderFBO);
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    app.samples = 0;
}