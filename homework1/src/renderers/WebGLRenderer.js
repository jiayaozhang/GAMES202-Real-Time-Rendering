class WebGLRenderer {
    meshes = [];
    shadowMeshes = [];
    lights = [];

    constructor(gl, camera) {
        this.gl = gl;
        this.camera = camera;
    }

    addLight(light) {
        this.lights.push({
            entity: light,
            meshRender: new MeshRender(this.gl, light.mesh, light.mat)
        });
    }
    addMeshRender(mesh) { this.meshes.push(mesh); }
    addShadowMeshRender(mesh) { this.shadowMeshes.push(mesh); }

    render() {
        const gl = this.gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        console.assert(this.lights.length != 0, "No light");
 //       console.assert(this.lights.length == 1, "Multiple lights");

        for (let l = 0; l < this.lights.length; l++) {
            // Draw light
            // TODO: Support all kinds of transform
            this.lights[l].meshRender.mesh.transform.translate = this.lights[l].entity.lightPos;
            this.lights[l].meshRender.draw(this.camera);

            // Shadow pass
            if (this.lights[l].entity.hasShadowMap == true) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.lights[l].entity.fbo);
                gl.clearColor(1.0, 1.0, 1.0, 1.0);
                gl.clearDepth(1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.enable(gl.DEPTH_TEST);

                for (let i = 0; i < this.shadowMeshes.length; i++) {
                    let transform = this.shadowMeshes[i].mesh.transform;
                    let lightMVP = this.lights[l].entity.CalcLightMVP(transform.translate, transform.scale);
                    this.shadowMeshes[i].material.uniforms.uLightMVP.value = lightMVP;
                    this.shadowMeshes[i].material.frameBuffer = this.lights[l].entity.fbo;
                    this.shadowMeshes[i].draw(this.camera);
                }
            }
        } 
            // Camera pass
        for (let i = 0; i < this.meshes.length; i++) {
                this.gl.useProgram(this.meshes[i].shader.program.glShaderProgram);
                this.gl.uniform3fv(this.meshes[i].shader.program.uniforms.uLightPos, this.lights[0].entity.lightPos);
                this.gl.uniform3fv(this.meshes[i].shader.program.uniforms.uLightPos1, this.lights[1].entity.lightPos);

                this.gl.uniform3fv(this.meshes[i].shader.program.uniforms.uLightIntensity, this.lights[0].entity.mat.GetIntensity());
                this.gl.uniform3fv(this.meshes[i].shader.program.uniforms.uLightIntensity1, this.lights[1].entity.mat.GetIntensity());

                let transform = this.meshes[i].mesh.transform;
                let lightMVP = this.lights[0].entity.CalcLightMVP(transform.translate, transform.scale);
                this.meshes[i].material.uniforms.uLightMVP.value = lightMVP;
                this.meshes[i].material.uniforms.uShadowMap.value = this.lights[0].entity.fbo;

                let lightMVP1 = this.lights[1].entity.CalcLightMVP(transform.translate, transform.scale);
                this.meshes[i].material.uniforms.uLightMVP1.value = lightMVP1;
                this.meshes[i].material.uniforms.uShadowMap1.value = this.lights[1].entity.fbo;

                this.meshes[i].draw(this.camera);
            }
            
    }
}