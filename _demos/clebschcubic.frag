---
layout: shadertoy
title: "Clebsch Cubic in S^3"
description: "An immersive view of the double cover of the clebsch cubic surface in the 3-sphere."
date: 2025-11-19
acknowledgement: "Thanks to [Steve Trettel](https://stevejtrettel.site){:target=\"_blank\"} and [Claudio Gómez-Gonzáles](https://claudiojacobo.com){:target=\"_blank\"} for inspiration."
image: "clebschcubic.png"

---

#define PI 3.14159
#define TWOPI 2.*PI

#define MAX_DISTANCE 2.*PI
#define MAX_STEPS 256
#define EPSILON 0.0000001

#define RGB(r,g,b) pow(vec3(r,g,b), vec3(2.22))
const vec4 ORIGIN = vec4(0,0,0,1);

#define Point vec4

struct Ray{
    vec4 o;//ray origin
    vec4 d;//ray direction
};

Ray geomNormalize(Ray r) {
    r.o = normalize(r.o);
    r.d = r.d - dot(r.d, r.o) * r.o;
    r.d = normalize(r.d);
    return r;
}

Ray applyIso(Ray r, mat4 iso) {
    return Ray(iso*r.o, iso*r.d);
}

struct Intersection{
    float t;//distance
    int id;//id of object intersected with
};

struct Material{
    bool isAmbient;
    bool isDiffuse;
    bool isSpecular;
    //bool isMirror;
    float shininess;
};

struct Light{
    vec4 pos;
    vec3 col;
    int id; //id of object emitting light
};


//returns translation sending ORIGIN to p
mat4 makeTranslation(vec4 p) {
    mat4 matrix = mat4(1.);
    vec3 u = p.xyz;
    float c1 = length(u);
    if (c1 == 0.) {
        return matrix;
    }

    float c2 = 1. - p.w;
    u = normalize(u);
    mat4 m = mat4(
    0, 0, 0, -u.x,
    0, 0, 0, -u.y,
    0, 0, 0, -u.z,
    u.x, u.y, u.z, 0
    );
    matrix = matrix + c1 * m + c2 * m * m;
    return matrix;
}

//returns point in space distance t along Ray r.
Point pointFlow(Ray r, float t) {
    vec4 pos = r.o * cos(t) + r.d * sin(t);
    return normalize(pos);
}

vec4 dirFlow(Ray r, float t) {
    return pointFlow(Ray(r.d,r.o),-t);
}

Ray flow(Ray r, float t) {
    return Ray(pointFlow(r,t),
               dirFlow(r,t));
}

//returns min distance between a and b.
float dist(vec4 a, vec4 b) {
    return acos(dot(a,b));
}

//light intensity as a function of distance
float lightIntensity(float len) {
    float s = sin(len);
    return 1./(s*s);
}

// sphere in local coords: centered at (0,0,0,1)
float sdfSphere(vec4 pos, float r) {
    return acos(pos.w)-r;
}

float sdfSphere(Point pos, Point center, float r) {
    return dist(pos,center)-r;
}

// pos in sphere-local coordinates
vec2 uvSphere(vec4 pos) {
    vec4 dir = normalize(pos-ORIGIN);
    float sinPhi = length(dir.xy);
    float cosPhi = dir.z;
    float u = atan(dir.x, dir.y)/(2.*PI) + 0.5;
    float v = atan(sinPhi, cosPhi)/PI + 0.;
    return vec2(u,v);
}

vec3 inverseHypersphericalCoordinates(vec4 pos) {
    vec3 phi;
    phi.x = atan(length(pos.xyz),pos.w);
    phi.y = atan(length(pos.xy),pos.z);
    phi.z = atan(abs(pos.x),pos.y);
    return phi;
}



//returns direction of closest geodesic from a to b, as a ray starting at a.
Ray direction(vec4 a, vec4 b) {
  return Ray(a,normalize(b - dot(a,b)*b));  
}

void getGeodesics(vec4 a, vec4 b, out Ray[2] geodesics, out float[2] distances) {
    Ray dir = direction(a,b);
    float dist1 = dist(a,b);
    geodesics = Ray[](dir, Ray(dir.o,-dir.d));
    distances = float[](dist1, TWOPI - dist1);
}

mat2 rotation(float theta) {
    return mat2(cos(theta),-sin(theta),
                sin(theta),cos(theta));
}

//returns a transformation taking (origin,-z) to r
mat4 ray2Group(Ray r) {
    r = geomNormalize(r);
    mat4 m = mat4(vec4(1,0,0,0),vec4(0,1,0,0),-r.d,r.o);
    m[1] = m[1] - dot(m[1],m[2])*m[2] - dot(m[1],m[3])*m[3];
    m[1] = normalize(m[1]);
    m[0] = m[0] - dot(m[0],m[1])*m[1] - dot(m[0],m[2])*m[2] - dot(m[0],m[3])*m[3];
    m[0] = normalize(m[0]);
    return m;
}

mat4 ray2GroupInv(Ray r) {
    return transpose(ray2Group(r));
}

/**    Feel free to use your own textures   **/
/*
The current default texture doesn't easily convey
the stretching happening.

I used this shadertoy to learn how to add textures
https://www.shadertoy.com/view/lsGGDd
This shader is made to work well with those textures
so you can just copy and paste the commands written there
into the JS console on this page.

gShaderToy.SetTexture(0, {mSrc:'https://dl.dropboxusercontent.com/s/88u2uo8dxdmgzxo/world2.jpg?dl=0', mType:'texture', mID:1, mSampler:{ filter: 'linear', wrap: 'repeat', vflip:'false', srgb:'false', internal:'byte' }});
gShaderToy.SetTexture(1, {mSrc:'https://dl.dropboxusercontent.com/s/5rdhhnvnr5mochq/cloud2.jpg?dl=0', mType:'texture', mID:1, mSampler:{ filter: 'linear', wrap: 'repeat', vflip:'false', srgb:'false', internal:'byte' }});
gShaderToy.SetTexture(2, {mSrc:'https://dl.dropboxusercontent.com/s/ojl5zoxgbdn5w5s/light2.jpg?dl=0', mType:'texture', mID:1, mSampler:{ filter: 'linear', wrap: 'repeat', vflip:'false', srgb:'false', internal:'byte' }});

*/

/* TODO: FIX RAYMARCHING FOR SHADOWS. Currently self-occluding? */
// TODO: FIX CYLINDERS, they have artifacts

#define NO_INTERSECTION -1
#define WITHIN_VOLUME -2

/**         CUBIC SURFACE        **/
#define CUBIC_ID 1

float cubicForm(vec4 x) {
    float sum = dot(x,vec4(1));
    return x.x*x.x*x.x + x.y*x.y*x.y + x.z*x.z*x.z + x.w*x.w*x.w
          - sum*sum*sum;
}

vec4 gradCubic(vec4 x) {
    vec4 sum = vec4(dot(x,vec4(1)));
    return 3.*x*x - 3.*sum*sum ;
}

//approximate cubic sdf using gradient
float sdfCubic(vec4 x) {
    float dist = cubicForm(x)/length(gradCubic(x));
    return dist;
}

//infinite cylinder going along geodesic starting at r
float sdfInfCylinder(vec4 pos, Ray r) {
    const float radius = 0.003;
    vec2 aux = vec2(dot(pos,r.o),dot(pos,r.d));
    float pl = length(aux);
    pl = clamp(pl, 0.,1.);
    return acos(pl) - radius;
}

#define DIAG_LINE_ID 4
float sdfDiagLine(vec4 pos) {
    vec4 ro = vec4(1,-1,1,-1)/2.;
    vec4 rd = vec4(-1,1,1,-1)/2.;
    Ray cyl = Ray(ro,rd);
    cyl = geomNormalize(cyl);
    float mindist = MAX_DISTANCE;
    float sd;
    for(int i=0; i<5; i++) {
        sd = sdfInfCylinder(pos,cyl);
        mindist = (sd < mindist)? sd:mindist;
        sd = sdfInfCylinder(pos.wxyz,cyl);
        mindist = (sd < mindist)? sd:mindist;
        sd = sdfInfCylinder(pos.wyxz,cyl);
        mindist = (sd < mindist)? sd:mindist;
        
        cyl = Ray(ro,rd);
        cyl.o[i]=0.;
        cyl.d[i]=0.;
        cyl = geomNormalize(cyl);
    }
    
    return mindist;
}

#define PRINC_LINE_ID 5
float sdfPrincLine(vec4 pos) {
    Ray cyl;
    float k = 0.;
    cyl = Ray(vec4(-2.*sin(TWOPI*(k)/5.),
                       -2.*sin(TWOPI*(k+1.)/5.),
                       -2.*sin(TWOPI*(k+2.)/5.),
                       -2.*sin(TWOPI*(k+3.)/5.)),
                  vec4(2.*cos(TWOPI*(k)/5.),
                       2.*cos(TWOPI*(k+1.)/5.),
                       2.*cos(TWOPI*(k+2.)/5.),
                       2.*cos(TWOPI*(k+3.)/5.)));
    cyl = geomNormalize(cyl);
                       
    float mindist = MAX_DISTANCE, sd=mindist;
    for(int k = 0; k < 2; k++) {
        for(int i = 0; i< 4; i++) {
            sd = sdfInfCylinder(pos,cyl);
            mindist = (sd < mindist)? sd:mindist;
            pos = pos.wxyz;
        }
        pos.xy = pos.yx;
    }
    pos.yz = pos.zy;
    for(int i = 0; i< 4; i++) {
            sd = sdfInfCylinder(pos,cyl);
            mindist = (sd < mindist)? sd:mindist;
            pos = pos.wxyz;
        }
        
    return mindist;
}

/**          EARTH OBJECT          **/
#define EARTH_ID 2
// modeling isometry
mat4 mEarth() {
    float rot = iTime/4.;
    return makeTranslation(normalize(vec4(0,0,-1,0)))
          * mat4(mat3(1,0,0,
                      0,0,-1,
                      0,-1,0))
          * mat4(rotation(-iTime/4.));
          
    /*    * mat4(cos(rot), 0., -sin(rot), 0.,
               sin(rot), 0., cos(rot), 0.,
               0., 1., 0., 0.,
               0., 0., 0., 1.);*/
}
mat4 invMEarth() {
    return transpose(mEarth());
}

float sdfEarth(vec4 pos) {
    return sdfSphere(invMEarth()*pos,0.5);
}

Material earthMaterial = Material(true, true, false, 64.);//ambient, diffuse, not spectral

/**          SUN OBJECT           **/

#define SUN_ID 3
#define LIGHT_ID 3
const float d=0.2;
const Light light0 = Light(normalize(vec4(-d,-d,-d,1)),RGB(.5,.5,.5),-10-0);
const Light light1 = Light(light0.pos.wxyz,RGB(.6,.5,.5),-10-1);
const Light light2 = Light(light1.pos.wxyz,RGB(.5,.6,.5),-10-2);
const Light light3 = Light(light2.pos.wxyz,RGB(.5,.5,.6),-10-3);
Light lights[] = Light[](light0,light1,light2,light3);



float sdfLight(vec4 pos, Light light) {
    return sdfSphere(pos, light.pos, 0.03);
}
const vec4 sunPos = normalize(vec4(-d,-d,-d,1));

mat4 mSun() {
     return makeTranslation(sunPos);
}

mat4 invMSun() {
    return transpose(mSun());
}
float sdfSun(vec4 pos) {
    return sdfSphere(invMSun()*pos, 0.03);
}

const Light sunLight = Light(sunPos,vec3(1.),SUN_ID);
const Light sunLight2 = Light(sunPos.wxyz,vec3(1.),SUN_ID);

/*            SCENE OBJECT          */
//stores the minimum of d1 and d2 in d2
//returns true if changes made
bool opU(in float d1, inout float d2){
	if(d1 < d2) {
        d2 = d1;
        return true;//yes we updated d2
    }
    return false;//no we didn't update d2
}

//returns sdf, modifies id to closest object
float sdfScene(vec4 pos, out int id) {
    float sd = MAX_DISTANCE;
    id = NO_INTERSECTION; 
   
    //if(opU(sdfEarth(pos), sd)) id = EARTH_ID;//if earth is closest thing
    //if(opU(sdfSun(pos), sd)) id = SUN_ID;
    for(int l = 0; l < lights.length(); l++) {
        if(opU(sdfLight(pos, lights[l]), sd)) id = lights[l].id;
    }
    if(opU(sdfCubic(pos), sd)) id = CUBIC_ID;
    //if(opU(sdfDiagLine(pos),sd)) id = DIAG_LINE_ID;
    //if(opU(sdfPrincLine(pos),sd)) id = PRINC_LINE_ID;

    return sd;
}
/*              END OBJECTS          */
const float mindist = 100.*EPSILON;
float marchRay(Ray r, out int id) {
    float t=mindist;
    float sd = sdfScene(pointFlow(r,t), id);
    float s = sign(sd);//are we already within the object?
    
    for(int i = 0; i<MAX_STEPS; i++) {
        sd = s*sdfScene(pointFlow(r,t), id);
        if(abs(sd) < EPSILON) break;
        if(t > MAX_DISTANCE) {
            id = NO_INTERSECTION;
            break;
        }
        
        t+=sd;
    }
    return t;
}

// TODO: get this improved soft shadows working
// credit to iq and "nurof3n"
// https://iquilezles.org/articles/rmshadows/
float softshadow(in Ray r, float w, float maxt, int lightId, out int id)
{
    float res = 1.0;
    float t = mindist;
    float s = sign(sdfScene(pointFlow(r,t),id));//are we already within the object?
    for( int i=0; i<256 && t<maxt; i++ )
    {
        float h = s*sdfScene(pointFlow(r,t),id);
        if(id != lightId) res = min( res, h/(w*t) );
        t += clamp(h, 0.005, 0.50);
        if( res<-1.0 || t>maxt ) break;
    }
    res = max(res,-1.0);
    return 0.25*(1.0+res)*(1.0+res)*(2.0-res);
}

float shadow(Ray r, out int id, out float res, int lightId, float k) {
    float t=mindist;
    float sd = sdfScene(pointFlow(r,t), id);
    float s = sign(sd);//are we already within the object?
    res = 1.0;
    for(int i = 0; i<MAX_STEPS; i++) {
        sd = s*sdfScene(pointFlow(r,t), id);
        if(id != lightId) {
            res = min(res, k*sd/t);
        }
        if(abs(sd) < EPSILON) break;
        t+=sd;
    }
    return t;
}

vec3 shadeFragment(vec4 pos, Ray r, Intersection inter,
                    vec4 normal, Material mater, vec3 objectCol) {
    vec3 col = vec3(0.);
    for(int l=0; l< lights.length(); l++) {
    Light light = lights[l];
    Ray[2] geodesics;
    float[2] distances;      
    getGeodesics(pos, light.pos, geodesics,distances);

    int id;
    for(int i = 0; i < 1; i++) {
        //float res = softshadow(geodesics[i], 0.1, distances[i], light.id, id);
        float res;
        float t = shadow(geodesics[i],id, res, light.id, 24.);
        if(id == light.id) {
            vec3 incident = res*light.col*lightIntensity(distances[i]);
            if(mater.isDiffuse) {
            float diff = max(0.,dot(normal, geodesics[i].d));
            col += diff*objectCol*incident;   
            }
            if(mater.isSpecular) {
                vec4 view = dirFlow(r,inter.t);
                vec4 refl = reflect(geodesics[i].d,normal);
                float spec = pow(max(0.,-dot(view,refl)),mater.shininess);
                col += spec*objectCol;
            }
        }
    }
    }
    if(mater.isAmbient) {
        col += 0.03*objectCol;
    }
    return col;
}

//generates ray in world space from given pixel
Ray pixelToRay(in vec2 fragCoord){
    //construct camera at (0,0,0,1) looking in the -z
    vec2 uv = fragCoord/iResolution.xy;
    float left=-2., right=2., bottom=-1., top=1.;
    vec3 pview = vec3(uv*vec2(right-left,top-bottom)
                        + vec2(left,bottom),-1.);
    Ray r;
    r.d = vec4(normalize(pview),0);//ray direction
    r.o = vec4(vec3(0),1);
    
    return r;
}

// moves viewing ray r into desired pose
void pose(inout Ray r) {
    r.d.yz *= rotation(PI*iMouse.y/iResolution.y + PI/2.);
    r.d.xz *= rotation(-2.*PI*iMouse.x/iResolution.x + PI);
    
    float d = 0.4;
    r.o *= makeTranslation(normalize(vec4(d,d,d,1)));
    r.d *= makeTranslation(normalize(vec4(d,d,d,1)));

    r.o.xw *= rotation(iTime/8.);
    r.d.xw *= rotation(iTime/8.);
}

//gets intersection point given ray
Intersection intersectScene(Ray r) {
    Intersection inter = Intersection(MAX_DISTANCE, NO_INTERSECTION);
    
    // get raymarched intersection
    inter.t = marchRay(r, inter.id);
    
    return inter;
}

vec3 getInterColor(Ray r, Intersection inter) {
    vec3 col = vec3(0,1,0);//green of gone-wrong
    vec4 pos = pointFlow(r,inter.t);
    pos = normalize(pos);//fix floating point errors
    if(inter.id <= -10) {//we hit a light
        return lights[-inter.id-10].col;
    }
    switch(inter.id) {
        case NO_INTERSECTION:
        col = RGB(10,10,20);
        break;
        case WITHIN_VOLUME:
        col = vec3(1,0,0);//red of within volume
        break;
        
        
        case CUBIC_ID:
        vec3 objectColor = vec3(1);//by default color white            
        objectColor = mix(RGB(.9,.1,.1), objectColor, clamp(sdfDiagLine(pos)*200.,0.,1.));
        objectColor = mix(RGB(.1,.1,.9), objectColor, clamp(sdfPrincLine(pos)*200.,0.,1.));
        vec4 normal = normalize(gradCubic(pos));
        normal = faceforward(normal, dirFlow(r,inter.t), normal);
        col=shadeFragment(pos, r, inter,
                           normal,
                           earthMaterial, objectColor);
        break;
        
        case DIAG_LINE_ID:
        col = RGB(.5,.1,.1);
        break;
        case PRINC_LINE_ID:
        col = RGB(.1,.1,.5);
        break;
        
        case SUN_ID:
        col = RGB(0.9,0.9,0.8);
        break;
        
        case EARTH_ID://earth
        //compute intersection point in local coords
        vec4 localPos = invMEarth()*pos;
        vec2 uv = uvSphere(localPos);
        vec3 earth = pow(texture(iChannel0, uv).rgb,vec3(2.2));
        vec3 clouds = pow(texture(iChannel1, uv).rgb,vec3(2.2));
        
        col = earth+clouds;
        
        normal = mEarth()*normalize(localPos-ORIGIN);
        col=shadeFragment(pos, r, inter, normal, earthMaterial, col);
    }
    
    
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    const int aa = 1;//what level of antialiasing
    vec3 col;
    vec3[aa*aa] cols;
    for(int i=0; i < aa; i++) {
        for(int j=0; j < aa; j++) {
            Ray r = pixelToRay(fragCoord+vec2(i,j)/float(aa));
            pose(r);
            Intersection inter = intersectScene(r);
            col = getInterColor(r, inter);
            cols[aa*i + j] = col;
        }
    }
    
    col = vec3(0);
    for(int i=0; i < aa*aa; i++) {
        col+=cols[i];
    }
    col/=float(aa)*float(aa);
    
    col = pow(col, vec3(1.0/2.2));//gamma correction
    fragColor = vec4(col,1.0);
}
