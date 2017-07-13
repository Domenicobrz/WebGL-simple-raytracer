// should 'extend' shape
class Primitive {
    /**
     * @param {Number} i0  type of the primitive.   0 for spheres, 1 for AABB, 2 for triangles  
     */
    constructor( v0, v1, v2, i0, i1 ) {
        // every primitive MAY have a different material
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
        this.i0 = i0;
        this.i1 = i1;
    }

    getAABB() {

    }
}


function PrimitiveException(message) {
    this.message = message;
    this.name = 'Primitive Exception';
}


