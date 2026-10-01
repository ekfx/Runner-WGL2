#version 300 es
precision highp float;

uniform vec3 lightPos;
uniform vec3 lightColor;

uniform vec3 objectColor;

in vec3 Normal;
in vec3 FragPos;
out vec4 FragColor;

void main() {
  float distance = clamp(length(lightPos - FragPos), 0.0, 15.0) * 0.055;
  vec3 normal = normalize(Normal);
  vec3 lightDir = normalize(lightPos - FragPos);
  float diff = max(dot(normal, lightDir), 0.0) * 0.2;

  vec3 finalLight = objectColor * (0.25 + diff) - (distance);
  FragColor = vec4(finalLight, 1.0);
}
