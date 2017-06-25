export const CUBE_LENGTH = 101;
export const GEOMETRY_POINTS = [
  -CUBE_LENGTH / 2, -CUBE_LENGTH / 2,  CUBE_LENGTH / 2,
  CUBE_LENGTH / 2, -CUBE_LENGTH / 2,  CUBE_LENGTH / 2,
  CUBE_LENGTH / 2,  CUBE_LENGTH / 2,  CUBE_LENGTH / 2,
  -CUBE_LENGTH / 2,  CUBE_LENGTH / 2,  CUBE_LENGTH / 2,

  // Back face
  -CUBE_LENGTH / 2, -CUBE_LENGTH / 2, -CUBE_LENGTH / 2,
  -CUBE_LENGTH / 2,  CUBE_LENGTH / 2, -CUBE_LENGTH / 2,
  CUBE_LENGTH / 2,  CUBE_LENGTH / 2, -CUBE_LENGTH / 2,
  CUBE_LENGTH / 2, -CUBE_LENGTH / 2, -CUBE_LENGTH / 2,

  // Top face
  -CUBE_LENGTH / 2,  CUBE_LENGTH / 2, -CUBE_LENGTH / 2,
  -CUBE_LENGTH / 2,  CUBE_LENGTH / 2,  CUBE_LENGTH / 2,
  CUBE_LENGTH / 2,  CUBE_LENGTH / 2,  CUBE_LENGTH / 2,
  CUBE_LENGTH / 2,  CUBE_LENGTH / 2, -CUBE_LENGTH / 2,

  // Bottom face
  -CUBE_LENGTH / 2, -CUBE_LENGTH / 2, -CUBE_LENGTH / 2,
  CUBE_LENGTH / 2, -CUBE_LENGTH / 2, -CUBE_LENGTH / 2,
  CUBE_LENGTH / 2, -CUBE_LENGTH / 2,  CUBE_LENGTH / 2,
  -CUBE_LENGTH / 2, -CUBE_LENGTH / 2,  CUBE_LENGTH / 2,

  // Right face
  CUBE_LENGTH / 2, -CUBE_LENGTH / 2, -CUBE_LENGTH / 2,
  CUBE_LENGTH / 2,  CUBE_LENGTH / 2, -CUBE_LENGTH / 2,
  CUBE_LENGTH / 2,  CUBE_LENGTH / 2,  CUBE_LENGTH / 2,
  CUBE_LENGTH / 2, -CUBE_LENGTH / 2,  CUBE_LENGTH / 2,

  // Left face
  -CUBE_LENGTH / 2, -CUBE_LENGTH / 2, -CUBE_LENGTH / 2,
  -CUBE_LENGTH / 2, -CUBE_LENGTH / 2,  CUBE_LENGTH / 2,
  -CUBE_LENGTH / 2,  CUBE_LENGTH / 2,  CUBE_LENGTH / 2,
  -CUBE_LENGTH / 2,  CUBE_LENGTH / 2, -CUBE_LENGTH / 2
];

export const TEXTURE_CORDS = [
  // Front face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Back face
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,
  // Top face
  0.0, 1.0,
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  // Bottom face
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,
  1.0, 0.0,
  // Right face
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,
  // Left face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0
];

export const CUBE_VERTEX_INDICES = [
  0, 1, 2,      0, 2, 3,    // Front face
  4, 5, 6,      4, 6, 7,    // Back face
  8, 9, 10,     8, 10, 11,  // Top face
  12, 13, 14,   12, 14, 15, // Bottom face
  16, 17, 18,   16, 18, 19, // Right face
  20, 21, 22,   20, 22, 23  // Left face
];
