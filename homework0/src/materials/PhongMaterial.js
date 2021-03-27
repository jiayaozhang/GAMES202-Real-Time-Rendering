class PhongMaterial extends Material {
    
     /**
     * Creates an instance of PhongMaterial.
    5 * @param {vec3f} color The material color
    6 * @param {Texture} colorMap The texture object of the material
    7 * @param {vec3f} specular The material specular coefficient
    8 * @param {float} intensity The light intensity
    9 * @memberof PhongMaterial
    10 */
    constructor(color , colorMap , specular , intensity) {
    let textureSample = 0;
    
    if (colorMap != null) {
       textureSample = 1;
       super({
       'uTextureSample': { type: '1i', value: textureSample },
       'uSampler': { type: 'texture', value: colorMap },
       'uKd': { type: '3fv', value: color },
       'uKs': { type: '3fv', value: specular },
       'uLightIntensity': { type: '1f', value: intensity }
     }, [], PhongVertexShader , PhongFragmentShader);
     } else {
     //console.log(color);
        super({
     'uTextureSample': { type: '1i', value: textureSample },
     'uKd': { type: '3fv', value: color },
     'uKs': { type: '3fv', value: specular },
     'uLightIntensity': { type: '1f', value: intensity }
            }, [], PhongVertexShader , PhongFragmentShader);
        }  

     }
 }