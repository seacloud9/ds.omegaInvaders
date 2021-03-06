/**
 * @author alteredq / http://alteredqualia.com/
 */

window.game.THREE.BloomPass = function ( strength, kernelSize, sigma, resolution ) {

	strength = ( strength !== undefined ) ? strength : 1;
	kernelSize = ( kernelSize !== undefined ) ? kernelSize : 25;
	sigma = ( sigma !== undefined ) ? sigma : 4.0;
	resolution = ( resolution !== undefined ) ? resolution : 256;

	// render targets

	var pars = { minFilter: window.game.THREE.LinearFilter, magFilter: window.game.THREE.LinearFilter, format: window.game.THREE.RGBFormat };

	this.renderTargetX = new window.game.THREE.WebGLRenderTarget( resolution, resolution, pars );
	this.renderTargetY = new window.game.THREE.WebGLRenderTarget( resolution, resolution, pars );

	// copy material

	if ( window.game.THREE.CopyShader === undefined )
		console.error( "THREE.BloomPass relies on THREE.CopyShader" );

	var copyShader = window.game.THREE.CopyShader;

	this.copyUniforms = window.game.THREE.UniformsUtils.clone( copyShader.uniforms );

	this.copyUniforms[ "opacity" ].value = strength;

	this.materialCopy = new window.game.THREE.ShaderMaterial( {

		uniforms: this.copyUniforms,
		vertexShader: copyShader.vertexShader,
		fragmentShader: copyShader.fragmentShader,
		blending: window.game.THREE.AdditiveBlending,
		transparent: true

	} );

	// convolution material

	if ( window.game.THREE.ConvolutionShader === undefined )
		console.error( "THREE.BloomPass relies on THREE.ConvolutionShader" );

	var convolutionShader = window.game.THREE.ConvolutionShader;

	this.convolutionUniforms = window.game.THREE.UniformsUtils.clone( convolutionShader.uniforms );

	this.convolutionUniforms[ "uImageIncrement" ].value = window.game.THREE.BloomPass.blurx;
	this.convolutionUniforms[ "cKernel" ].value = window.game.THREE.ConvolutionShader.buildKernel( sigma );

	this.materialConvolution = new window.game.THREE.ShaderMaterial( {

		uniforms: this.convolutionUniforms,
		vertexShader:  convolutionShader.vertexShader,
		fragmentShader: convolutionShader.fragmentShader,
		defines: {
			"KERNEL_SIZE_FLOAT": kernelSize.toFixed( 1 ),
			"KERNEL_SIZE_INT": kernelSize.toFixed( 0 )
		}

	} );

	this.enabled = true;
	this.needsSwap = false;
	this.clear = false;

};

window.game.THREE.BloomPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		if ( maskActive ) renderer.context.disable( renderer.context.STENCIL_TEST );

		// Render quad with blured scene into texture (convolution pass 1)

		postprocessor.EffectComposer.quad.material = this.materialConvolution;

		this.convolutionUniforms[ "tDiffuse" ].value = readBuffer;
		this.convolutionUniforms[ "uImageIncrement" ].value = window.game.THREE.BloomPass.blurX;

		renderer.render( postprocessor.EffectComposer.scene, postprocessor.EffectComposer.camera, this.renderTargetX, true );


		// Render quad with blured scene into texture (convolution pass 2)

		this.convolutionUniforms[ "tDiffuse" ].value = this.renderTargetX;
		this.convolutionUniforms[ "uImageIncrement" ].value = window.game.THREE.BloomPass.blurY;

		renderer.render( postprocessor.EffectComposer.scene, postprocessor.EffectComposer.camera, this.renderTargetY, true );

		// Render original scene with superimposed blur to texture

		postprocessor.EffectComposer.quad.material = this.materialCopy;

		this.copyUniforms[ "tDiffuse" ].value = this.renderTargetY;

		if ( maskActive ) renderer.context.enable( renderer.context.STENCIL_TEST );

		renderer.render( postprocessor.EffectComposer.scene, postprocessor.EffectComposer.camera, readBuffer, this.clear );

	}

};

window.game.THREE.BloomPass.blurX = new window.game.THREE.Vector2( 0.001953125, 0.0 );
window.game.THREE.BloomPass.blurY = new window.game.THREE.Vector2( 0.0, 0.001953125 );
