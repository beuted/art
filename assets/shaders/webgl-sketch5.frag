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
  float e = (time / 10.0)*1.0 * noise05(1.0, coord) + 
      (time / 10.0)*0.5 * noise05(2.0, coord) +
      (time / 10.0)*0.25 * noise05(4.0, coord) +
      (time / 10.0)*0.13 * noise05(8.0, coord) +
      (time / 10.0)*0.06 * noise05(16.0, coord) +
      (time / 10.0)*0.03 * noise05(32.0, coord);
  e /= (1.0 + 0.5 + 0.25 + 0.13 + 0.06 + 0.03);
  e = pow(e, 4.0);
  e = clamp(e, 0.0, 1.0);
  return e;
}

vec4 isoline (vec2 uv) {
  float zoomSpeed = 0.0*(time / 10.0);
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