#define SHADER_NAME quad.frag

precision highp float;

varying vec3 vPosition;

uniform vec3 uSunPos;

#pragma glslify: atmosphere = require(../index)

void main() {
    vec3 scatter = atmosphere(
        normalize(vPosition),           // normalized ray direction
        vec3(0,6371e3,0),               // ray origin

        // sun pos
        vec3(0, +0.0, -1),                        // position of the sun

        6371e3,                         // radius of the planet in meters
        6471e3,                         // radius of the atmosphere in meters

        // in frostbite:
        // ray: vec3(5.8e-6, 13.5e-6, 33.1e-6)
        // mie: >= 3e-6 (pollution, water, dust)

        vec3(5.5e-6, 13.0e-6, 22.4e-6), // Rayleigh scattering coefficient
        21e-6,                          // Mie scattering coefficient

        // ozone in frostbite:
        // (3.426, 8.298, 0.356) m-1 x 6e-5%

        8e3,                            // Rayleigh scale height
        1.2e3,                          // Mie scale height
        0.758                           // Mie preferred scattering direction
    );

    // Apply sun/moon/whatever intensity.
    vec3 color = scatter * 250.0;        // intensity of the sun

    // Apply exposure.
    //*
    // color *= 0.10;
    color = 1.0 - exp(-1.0 * color);
    // color = pow(color, vec3(2.2));
    /*/
    color *= 0.10;
    // color = color / (1.0 + color);
    // color = pow(color, vec3(1.0 / 2.2));
    color = max(vec3(0.0), color - 0.004);
    color = (color*(6.2*color+0.5)) / (color*(6.2*color+1.7)+0.06);
    color = pow(color, vec3(2.2));
    //*/

    gl_FragColor = vec4(color, 1);
}
