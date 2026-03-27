"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

// ===================== CONFIGURABLE PARAMETERS =====================
const PARAMS = {
   text: "Spotlight",
   fontName: "Verdana",
   fontFamily: "Verdana, sans-serif",
   fontSize: 80,
   fontSizeMobile: 24,
   isBold: false,
   textBlur: 3,
   color: { r: 1.0, g: 0.0, b: 0.0 },
   dissipation: 0.96,
   textDissipationBoost: 0.04,
   divergenceScale: 0.6,
   pressureIterations: 10,
   pressureTextInfluence: 0.2,
   splatTextInfluence: 0.2,
   splatTextBase: 0.7,
   mouseSensitivity: 5,
   fboScale: 0.5,
   fboScaleMobile: 0.5,
   idleTimeout: 3000,
   chromaticAberration: 0.14,
};
// ===================================================================

const VERT_SHADER = `
   precision highp float;
   varying vec2 vUv;
   attribute vec2 a_position;
   varying vec2 vL;
   varying vec2 vR;
   varying vec2 vT;
   varying vec2 vB;
   uniform vec2 u_texel;
   void main () {
      vUv = .5 * (a_position + 1.);
      vL = vUv - vec2(u_texel.x, 0.);
      vR = vUv + vec2(u_texel.x, 0.);
      vT = vUv + vec2(0., u_texel.y);
      vB = vUv - vec2(0., u_texel.y);
      gl_Position = vec4(a_position, 0., 1.);
   }
`;

const FRAG_ADVECTION = `
   precision highp float;
   precision highp sampler2D;
   varying vec2 vUv;
   uniform sampler2D u_velocity_texture;
   uniform sampler2D u_input_texture;
   uniform vec2 u_texel;
   uniform float u_dt;
   uniform float u_use_text;
   uniform sampler2D u_text_texture;
   vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
      vec2 st = uv / tsize - 0.5;
      vec2 iuv = floor(st);
      vec2 fuv = fract(st);
      vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
      vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
      vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
      vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
      return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
   }
   void main () {
      vec2 coord = vUv - u_dt * bilerp(u_velocity_texture, vUv, u_texel).xy * u_texel;
      float text = texture2D(u_text_texture, vec2(vUv.x, 1. - vUv.y)).r;
      float dissipation = (${PARAMS.dissipation} + text * ${PARAMS.textDissipationBoost} * u_use_text);
      gl_FragColor = dissipation * bilerp(u_input_texture, coord, u_texel);
      gl_FragColor.a = 1.;
   }
`;

const FRAG_DIVERGENCE = `
   precision highp float;
   precision highp sampler2D;
   varying highp vec2 vUv;
   varying highp vec2 vL;
   varying highp vec2 vR;
   varying highp vec2 vT;
   varying highp vec2 vB;
   uniform sampler2D u_velocity_texture;
   void main () {
      float L = texture2D(u_velocity_texture, vL).x;
      float R = texture2D(u_velocity_texture, vR).x;
      float T = texture2D(u_velocity_texture, vT).y;
      float B = texture2D(u_velocity_texture, vB).y;
      float div = ${PARAMS.divergenceScale} * (R - L + T - B);
      gl_FragColor = vec4(div, 0., 0., 1.);
   }
`;

const FRAG_PRESSURE = `
   precision highp float;
   precision highp sampler2D;
   varying highp vec2 vUv;
   varying highp vec2 vL;
   varying highp vec2 vR;
   varying highp vec2 vT;
   varying highp vec2 vB;
   uniform sampler2D u_pressure_texture;
   uniform sampler2D u_divergence_texture;
   uniform sampler2D u_text_texture;
   void main () {
      float text = texture2D(u_text_texture, vec2(vUv.x, 1. - vUv.y)).r;
      float L = texture2D(u_pressure_texture, vL).x;
      float R = texture2D(u_pressure_texture, vR).x;
      float T = texture2D(u_pressure_texture, vT).x;
      float B = texture2D(u_pressure_texture, vB).x;
      float divergence = texture2D(u_divergence_texture, vUv).x;
      float pressure = (L + R + B + T - divergence) * 0.25;
      pressure += (${PARAMS.pressureTextInfluence} * text);
      gl_FragColor = vec4(pressure, 0., 0., 1.);
   }
`;

const FRAG_GRADIENT_SUBTRACT = `
   precision highp float;
   precision highp sampler2D;
   varying highp vec2 vUv;
   varying highp vec2 vL;
   varying highp vec2 vR;
   varying highp vec2 vT;
   varying highp vec2 vB;
   uniform sampler2D u_pressure_texture;
   uniform sampler2D u_velocity_texture;
   uniform sampler2D u_text_texture;
   void main () {
      float L = texture2D(u_pressure_texture, vL).x;
      float R = texture2D(u_pressure_texture, vR).x;
      float T = texture2D(u_pressure_texture, vT).x;
      float B = texture2D(u_pressure_texture, vB).x;
      vec2 velocity = texture2D(u_velocity_texture, vUv).xy;
      velocity.xy -= vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0., 1.);
   }
`;

const FRAG_SPLAT = `
   precision highp float;
   precision highp sampler2D;
   varying vec2 vUv;
   uniform sampler2D u_input_texture;
   uniform float u_ratio;
   uniform vec3 u_point_value;
   uniform vec2 u_point;
   uniform float u_point_size;
   uniform sampler2D u_text_texture;
   void main () {
      vec2 p = vUv - u_point.xy;
      p.x *= u_ratio;
      vec3 splat = pow(2., -dot(p, p) / u_point_size) * u_point_value;
      float text = texture2D(u_text_texture, vec2(vUv.x, 1. - vUv.y)).r;
      splat *= (${PARAMS.splatTextBase} + ${PARAMS.splatTextInfluence} * text);
      vec3 base = texture2D(u_input_texture, vUv).xyz;
      gl_FragColor = vec4(base + splat, 1.);
   }
`;

const FRAG_OUTPUT = `
   precision highp float;
   precision highp sampler2D;
   varying vec2 vUv;
   uniform sampler2D u_output_texture;
   uniform sampler2D u_text_texture;
   uniform float u_invert;
   void main () {
      vec2 dir = vUv - vec2(0.5);
      float dist = length(dir);
      vec2 off = dir * dist * ${PARAMS.chromaticAberration};

      vec3 raw1 = texture2D(u_output_texture, vUv - off * 1.5).rgb;
      vec3 raw2 = texture2D(u_output_texture, vUv - off * 0.5).rgb;
      vec3 raw3 = texture2D(u_output_texture, vUv + off * 0.5).rgb;
      vec3 raw4 = texture2D(u_output_texture, vUv + off * 1.5).rgb;

      float s1 = max(raw1.r, max(raw1.g, raw1.b));
      float s2 = max(raw2.r, max(raw2.g, raw2.b));
      float s3 = max(raw3.r, max(raw3.g, raw3.b));
      float s4 = max(raw4.r, max(raw4.g, raw4.b));

      vec3 cOrange = vec3(1.0, 0.3, 0.0);
      vec3 cYellow = vec3(1.0, 0.9, 0.0);
      vec3 cCyan   = vec3(0.0, 0.85, 1.0);
      vec3 cBlue   = vec3(0.0, 0.2, 1.0);

      vec3 C = s1 * cOrange + s2 * cYellow + s3 * cCyan + s4 * cBlue;
      C = clamp(C * 0.4, 0.0, 1.0);
      vec3 result = mix(C, vec3(1.0) - C, u_invert);
      gl_FragColor = vec4(result, 1.);
   }
`;

type FBO = {
   fbo: WebGLFramebuffer;
   width: number;
   height: number;
   attach: (id: number) => number;
};

type DoubleFBO = {
   width: number;
   height: number;
   texelSizeX: number;
   texelSizeY: number;
   read: () => FBO;
   write: () => FBO;
   swap: () => void;
};

type GLProgram = {
   program: WebGLProgram;
   uniforms: Record<string, WebGLUniformLocation | null>;
};

function initFluid(
   canvasEl: HTMLCanvasElement,
   bgColorRef: { current: number },
) {
   const textureEl = document.createElement("canvas");
   const textCtx = textureEl.getContext("2d");
   if (!textCtx) return null;
   const textureCtx: CanvasRenderingContext2D = textCtx;

   const glCtx = canvasEl.getContext("webgl");
   if (!glCtx) return null;
   const gl: WebGLRenderingContext = glCtx;
   const setProgram = gl.useProgram.bind(gl);

   gl.getExtension("OES_texture_float");

   let outputColor: DoubleFBO;
   let velocity: DoubleFBO;
   let divergenceFBO: FBO;
   let pressure: DoubleFBO;
   let canvasTexture: WebGLTexture | null = null;
   let animationId: number;
   let isIdle = true;
   let idleTimer: ReturnType<typeof setTimeout> | null = null;
   let isMobile = window.innerWidth <= 768;
   let pointerSize = (isMobile ? 0.8 : 2.5) / window.innerHeight;

   const pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false };

   function compileShader(source: string, type: number) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
         console.error(gl.getShaderInfoLog(shader));
         gl.deleteShader(shader);
         return null;
      }
      return shader;
   }

   function createShaderProgram(vert: WebGLShader, frag: WebGLShader) {
      const prog = gl.createProgram();
      if (!prog) return null;
      gl.attachShader(prog, vert);
      gl.attachShader(prog, frag);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
         console.error(gl.getProgramInfoLog(prog));
         return null;
      }
      return prog;
   }

   function getUniforms(program: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = gl.getProgramParameter(
         program,
         gl.ACTIVE_UNIFORMS,
      ) as number;
      for (let i = 0; i < count; i++) {
         const info = gl.getActiveUniform(program, i);
         if (info) {
            uniforms[info.name] = gl.getUniformLocation(program, info.name);
         }
      }
      return uniforms;
   }

   function makeProgram(fragSource: string): GLProgram | null {
      const frag = compileShader(fragSource, gl.FRAGMENT_SHADER);
      if (!frag || !vertexShader) return null;
      const prog = createShaderProgram(vertexShader, frag);
      if (!prog) return null;
      return { program: prog, uniforms: getUniforms(prog) };
   }

   const vertexShader = compileShader(VERT_SHADER, gl.VERTEX_SHADER);
   const splatProg = makeProgram(FRAG_SPLAT);
   const divergenceProg = makeProgram(FRAG_DIVERGENCE);
   const pressureProg = makeProgram(FRAG_PRESSURE);
   const gradSubProg = makeProgram(FRAG_GRADIENT_SUBTRACT);
   const advectionProg = makeProgram(FRAG_ADVECTION);
   const outputProg = makeProgram(FRAG_OUTPUT);

   if (
      !splatProg ||
      !divergenceProg ||
      !pressureProg ||
      !gradSubProg ||
      !advectionProg ||
      !outputProg
   ) {
      return null;
   }

   // Narrowed non-null references
   const splat: GLProgram = splatProg;
   const divergence: GLProgram = divergenceProg;
   const pressurePg: GLProgram = pressureProg;
   const gradSub: GLProgram = gradSubProg;
   const advection: GLProgram = advectionProg;
   const output: GLProgram = outputProg;

   gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
   gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
   );
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
   gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW,
   );
   gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(0);

   function createFBO(w: number, h: number, type?: number): FBO {
      const fmt = type ?? gl.RGBA;
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, fmt, w, h, 0, fmt, gl.FLOAT, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
         gl.FRAMEBUFFER,
         gl.COLOR_ATTACHMENT0,
         gl.TEXTURE_2D,
         texture,
         0,
      );
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
         fbo: fbo as WebGLFramebuffer,
         width: w,
         height: h,
         attach(id: number) {
            gl.activeTexture(gl.TEXTURE0 + id);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            return id;
         },
      };
   }

   function createDoubleFBO(w: number, h: number, type?: number): DoubleFBO {
      let fbo1 = createFBO(w, h, type);
      let fbo2 = createFBO(w, h, type);
      return {
         width: w,
         height: h,
         texelSizeX: 1 / w,
         texelSizeY: 1 / h,
         read: () => fbo1,
         write: () => fbo2,
         swap() {
            const temp = fbo1;
            fbo1 = fbo2;
            fbo2 = temp;
         },
      };
   }

   function blit(target: FBO | null) {
      if (target == null) {
         gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
         gl.viewport(0, 0, target.width, target.height);
         gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
   }

   function createTextCanvasTexture() {
      canvasTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   }

   function updateTextCanvas() {
      textureCtx.fillStyle = "black";
      textureCtx.fillRect(0, 0, textureEl.width, textureEl.height);
      const fontSize = isMobile ? PARAMS.fontSizeMobile : PARAMS.fontSize;
      textureCtx.font = `${PARAMS.isBold ? "bold" : "normal"} ${fontSize * devicePixelRatio}px ${PARAMS.fontFamily}`;
      textureCtx.fillStyle = "#ffffff";
      textureCtx.textAlign = "center";
      textureCtx.filter = `blur(${PARAMS.textBlur}px)`;
      const textBox = textureCtx.measureText(PARAMS.text);
      textureCtx.fillText(
         PARAMS.text,
         0.5 * textureEl.width,
         0.5 * textureEl.height + 0.5 * textBox.actualBoundingBoxAscent,
      );
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
      gl.texImage2D(
         gl.TEXTURE_2D,
         0,
         gl.RGBA,
         gl.RGBA,
         gl.UNSIGNED_BYTE,
         textureEl,
      );
   }

   function initFBOs() {
      const scale = isMobile ? PARAMS.fboScaleMobile : PARAMS.fboScale;
      const w = Math.floor(scale * window.innerWidth);
      const h = Math.floor(scale * window.innerHeight);
      outputColor = createDoubleFBO(w, h);
      velocity = createDoubleFBO(w, h);
      divergenceFBO = createFBO(w, h, gl.RGB);
      pressure = createDoubleFBO(w, h, gl.RGB);
   }

   function resizeCanvas() {
      isMobile = window.innerWidth <= 768;
      pointerSize = (isMobile ? 0.8 : 2.5) / window.innerHeight;
      canvasEl.width = textureEl.width = window.innerWidth;
      canvasEl.height = textureEl.height = window.innerHeight;
      initFBOs();
      updateTextCanvas();
   }

   function resetIdleTimer() {
      isIdle = false;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
         isIdle = true;
      }, PARAMS.idleTimeout);
   }

   function updateMousePosition(eX: number, eY: number) {
      pointer.moved = true;
      pointer.dx = PARAMS.mouseSensitivity * (eX - pointer.x);
      pointer.dy = PARAMS.mouseSensitivity * (eY - pointer.y);
      pointer.x = eX;
      pointer.y = eY;
   }

   function onMouseMove(e: MouseEvent) {
      resetIdleTimer();
      updateMousePosition(e.pageX, e.pageY);
   }

   function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      resetIdleTimer();
      updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
   }

   function render(t?: number) {
      const dt = 1 / 60;

      if (t && isIdle) {
         const s = t * 0.001;
         const x =
            0.5 +
            0.18 * Math.sin(s * 1.3) +
            0.12 * Math.sin(s * 2.7 + 1.4) +
            0.08 * Math.cos(s * 4.1 + 3.7) +
            0.15 * Math.sin(s * 0.4 + 0.8) +
            0.07 * Math.cos(s * 6.3 + 2.1);
         const y =
            0.5 +
            0.15 * Math.cos(s * 1.1 + 2.0) +
            0.1 * Math.sin(s * 3.3 + 0.5) +
            0.08 * Math.sin(s * 5.2 + 4.2) +
            0.12 * Math.cos(s * 0.5 + 1.7) +
            0.06 * Math.sin(s * 7.1 + 3.0);
         updateMousePosition(x * window.innerWidth, y * window.innerHeight);
      }

      if (pointer.moved) {
         if (!isIdle) pointer.moved = false;

         setProgram(splat.program);
         gl.uniform1i(
            splat.uniforms.u_input_texture,
            velocity.read().attach(1),
         );
         gl.uniform1f(splat.uniforms.u_ratio, canvasEl.width / canvasEl.height);
         gl.uniform2f(
            splat.uniforms.u_point,
            pointer.x / canvasEl.width,
            1 - pointer.y / canvasEl.height,
         );
         gl.uniform3f(splat.uniforms.u_point_value, pointer.dx, -pointer.dy, 1);
         gl.uniform1f(splat.uniforms.u_point_size, pointerSize);
         blit(velocity.write());
         velocity.swap();

         gl.uniform1i(
            splat.uniforms.u_input_texture,
            outputColor.read().attach(1),
         );
         const invert = bgColorRef.current;
         gl.uniform3f(
            splat.uniforms.u_point_value,
            invert ? 1 - PARAMS.color.r : PARAMS.color.r,
            invert ? 1 - PARAMS.color.g : PARAMS.color.g,
            invert ? 1 - PARAMS.color.b : PARAMS.color.b,
         );
         blit(outputColor.write());
         outputColor.swap();
      }

      setProgram(divergence.program);
      gl.uniform2f(
         divergence.uniforms.u_texel,
         velocity.texelSizeX,
         velocity.texelSizeY,
      );
      gl.uniform1i(
         divergence.uniforms.u_velocity_texture,
         velocity.read().attach(1),
      );
      blit(divergenceFBO);

      setProgram(pressurePg.program);
      gl.uniform2f(
         pressurePg.uniforms.u_texel,
         velocity.texelSizeX,
         velocity.texelSizeY,
      );
      gl.uniform1i(
         pressurePg.uniforms.u_divergence_texture,
         divergenceFBO.attach(1),
      );
      for (let i = 0; i < PARAMS.pressureIterations; i++) {
         gl.uniform1i(
            pressurePg.uniforms.u_pressure_texture,
            pressure.read().attach(2),
         );
         blit(pressure.write());
         pressure.swap();
      }

      setProgram(gradSub.program);
      gl.uniform2f(
         gradSub.uniforms.u_texel,
         velocity.texelSizeX,
         velocity.texelSizeY,
      );
      gl.uniform1i(
         gradSub.uniforms.u_pressure_texture,
         pressure.read().attach(1),
      );
      gl.uniform1i(
         gradSub.uniforms.u_velocity_texture,
         velocity.read().attach(2),
      );
      blit(velocity.write());
      velocity.swap();

      setProgram(advection.program);
      gl.uniform1f(advection.uniforms.u_use_text, 0);
      gl.uniform2f(
         advection.uniforms.u_texel,
         velocity.texelSizeX,
         velocity.texelSizeY,
      );
      gl.uniform1i(
         advection.uniforms.u_velocity_texture,
         velocity.read().attach(1),
      );
      gl.uniform1i(
         advection.uniforms.u_input_texture,
         velocity.read().attach(1),
      );
      gl.uniform1f(advection.uniforms.u_dt, dt);
      blit(velocity.write());
      velocity.swap();

      setProgram(advection.program);
      gl.uniform1f(advection.uniforms.u_use_text, 1);
      gl.uniform2f(
         advection.uniforms.u_texel,
         outputColor.texelSizeX,
         outputColor.texelSizeY,
      );
      gl.uniform1i(
         advection.uniforms.u_input_texture,
         outputColor.read().attach(2),
      );
      blit(outputColor.write());
      outputColor.swap();

      setProgram(output.program);
      gl.uniform1i(
         output.uniforms.u_output_texture,
         outputColor.read().attach(1),
      );
      gl.uniform1f(output.uniforms.u_invert, bgColorRef.current);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      animationId = requestAnimationFrame(render);
   }

   createTextCanvasTexture();
   initFBOs();
   resizeCanvas();

   canvasEl.addEventListener("mousemove", onMouseMove);
   canvasEl.addEventListener("touchmove", onTouchMove);
   window.addEventListener("resize", resizeCanvas);

   render();

   return () => {
      cancelAnimationFrame(animationId);
      if (idleTimer) clearTimeout(idleTimer);
      canvasEl.removeEventListener("mousemove", onMouseMove);
      canvasEl.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", resizeCanvas);
   };
}

export default function SpotlightPage() {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const { resolvedTheme } = useTheme();
   const bgColorRef = useRef(1);

   useEffect(() => {
      bgColorRef.current = resolvedTheme === "dark" ? 0 : 1;
   }, [resolvedTheme]);

   useEffect(() => {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const cleanup = initFluid(canvasEl, bgColorRef);
      return cleanup ?? undefined;
   }, []);

   return (
      <canvas
         ref={canvasRef}
         style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
         }}
      />
   );
}
