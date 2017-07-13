var intersectSphere = `
float intersectSphere(Ray ray, Primitive sphere) {
    vec3 sphereCenter = sphere.v0;
    float sphereRadius = sphere.v1.x;

    vec3 oc = ray.o - sphereCenter;
    float a = dot(ray.d, ray.d);
    float b = 2.0 * dot(oc, ray.d);
    float c = dot(oc, oc) - sphereRadius * sphereRadius;

    float discriminant = b*b - 4.0*a*c;

    if(discriminant > 0.0) {
        float t = (-b - sqrt(discriminant)) / ( 2.0*a );
        if(t > 0.0000001) {
            return t;
        } else {
            return -1.0;
        }

        //t = (-b + sqrt(discriminant)) / ( 2.0*a );
        //if(t > 0.0000001) {
        //    IntersectionResult res;
        //    res.t = t; res.primitiveIndex = index;
        //    return res;
        //}
        // t = (-b + sqrt(discriminant)) / ( 2.0*a );
    } else {
        return -1.0;
    }
}`;