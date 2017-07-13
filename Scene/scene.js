function buildScene() {
    /* should not be part of buildScene */
    window.scene = new Scene();
    /* should not be part of buildScene */










    window.camera = new Camera();
    camera.cameraEye    = [0,0,0];
    camera.cameraLookAt = [0,0,60];


    var prim1 = new Sphere(new Vec3(0, 0,  60), 15, 0);
    var prim2 = new Sphere(new Vec3(0, -510,  60), 500, 0);
    var prim3 = new Sphere(new Vec3(15, 5, 45), 5, 0);
    var prim4 = new Sphere(new Vec3(35, 5, 55), 10, 0);
    // var prim2 = new Sphere(new Vec3(0,0,0), 15, 0);

    scene.addPrimitive(prim1);
    scene.addPrimitive(prim2);
    scene.addPrimitive(prim3);
    scene.addPrimitive(prim4);









    /* should not be part of buildScene */
    scene.uploadPrimitives();
    /* should not be part of buildScene */
}

class Scene {
    constructor() {
        this.primitives = [];
        this.textureDataBlock = null;
        this.textureDataBlockSize = 3;

        this.initTextureDataBlock();
    }

    addPrimitive(prim) {
        this.primitives.push(prim);
    }

    add() {

    }

    setUniforms() {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_3D, this.textureDataBlock);
        gl.uniform1i(renderProgram.uPrimitives, 0);
    }

    get sceneProperties() {
        var sceneProperties = `
            const int  nPrimitives = ` + this.primitives.length + `; 
            const int  primitivesTextureDimension = ` + this.textureDataBlockSize + `; 
            const float primitivesTextureOffset   = ` + (1 / this.textureDataBlockSize) + `;
            const int primitiveTextureComponents  = ` + 3 + `;
        `;

        return sceneProperties;
    }

    uploadPrimitives() {
        var data = new Float32Array(this.textureDataBlockSize * this.textureDataBlockSize * this.textureDataBlockSize * 4);

        for(var i = 0, l = this.primitives.length; i < l; i++) {
            data[i * 12 + 0]  = this.primitives[i].v0.x;
            data[i * 12 + 1]  = this.primitives[i].v0.y;
            data[i * 12 + 2]  = this.primitives[i].v0.z;
            data[i * 12 + 3]  = 0;                          // Type

            data[i * 12 + 4]  = this.primitives[i].v1.x;
            data[i * 12 + 5]  = this.primitives[i].v1.y;
            data[i * 12 + 6]  = this.primitives[i].v1.z;
            data[i * 12 + 7]  = 0;                          // Material Index

            data[i * 12 + 8]  = this.primitives[i].v2.x;
            data[i * 12 + 9]  = this.primitives[i].v2.y;
            data[i * 12 + 10] = this.primitives[i].v2.z;
            data[i * 12 + 11] = 1;
        }
        

        gl.bindTexture(gl.TEXTURE_3D, this.textureDataBlock);
        gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA32F, this.textureDataBlockSize, 
                                                    this.textureDataBlockSize, 
                                                    this.textureDataBlockSize, 0, gl.RGBA, gl.FLOAT, data);
    }



    /**
     * Each primitive will need 3 texels to represent v0 v1 and v2
     */
    initTextureDataBlock() {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_3D, texture);
        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA32F, this.textureDataBlockSize, 
                                                    this.textureDataBlockSize, 
                                                    this.textureDataBlockSize, 0, gl.RGBA, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        this.textureDataBlock = texture;
    }
} 
