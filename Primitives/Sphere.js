// should 'extend' shape
class Sphere extends Primitive {
    constructor( center, radius, material ) {
        var vecradius = new Vec3(radius, 0, 0);
        super(center, vecradius, new Vec3(0,0,0), 0, undefined);

        this.center = center;
        this.radius = radius;
    }

    getAABB() {
        var c0 = new Vec3(this.center.x - this.radius,
                          this.center.y - this.radius,
                          this.center.z - this.radius);

        var c1 = new Vec3(this.center.x + this.radius,
                          this.center.y + this.radius,
                          this.center.z + this.radius);

        return new AABB(c0, c1);
    }
}