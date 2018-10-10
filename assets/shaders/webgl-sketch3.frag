#extension GL_OES_standard_derivatives : enable
precision highp float;
varying vec4 screenPos;

uniform float time;
uniform float aspect;

#pragma glslify: noise = require('glsl-noise/simplex/3d');
#pragma glslify: aastep = require('glsl-aastep');
#pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

float noise05 (float freq, vec3 coord) {
  return noise(coord * freq) * 0.5 + 0.5;
}

float terrain (vec3 coord) {
  float factor = 20.0*exp(1.0 - time/10.0);
  float e = factor * noise05(factor, coord);
  e /= (factor);
  e = pow(e, 4.0); 
  e = clamp(e, 0.0, 1.0);
  return e;
}

vec4 isoline (vec2 uv) {
  float zoomSpeed = 0.0* 1.0* time;
  vec2 scroll = vec2(time * 0.001, 0.0);
  float zoom = mix(0.75, 1.0, zoomSpeed);
  float morph = time * 0.05;

  float y = terrain(vec3(scroll + uv * zoom, morph));

  // Choose color
  float saturation = 1.0;
  float hue = y * 4.0;
  float light = 0.7;
  return vec4(hsl2rgb(hue, saturation, light), 1);
}

void main () {
  float fade = 1.0 - exp(1.0 - time*100.0);
  vec2 vUv = screenPos.xy;
  vec2 uv = vUv;
  // fait en sorte d'avoir un aspect consistant avec la taille du quad
  if (aspect > 1.0) uv /= vec2(1.0, aspect);
  else uv *= vec2(aspect, 1.0);

  vec4 iso = isoline(uv);
  gl_FragColor = iso;
  gl_FragColor.a *= fade;
}