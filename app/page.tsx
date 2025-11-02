'use client';

import type { CSSProperties, MouseEvent } from 'react';
import { useMemo, useState } from 'react';

type PatternType = 'stripes' | 'grid' | 'dots' | 'weave' | 'chevron';

type PatternConfig = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  angle: number;
  density: number;
  thickness: number;
  softness: number;
  scale: number;
};

type PatternPreset = {
  name: string;
  description: string;
  type: PatternType;
  config: PatternConfig;
};

const presets: PatternPreset[] = [
  {
    name: 'Neon Strata',
    description: 'Vivid diagonal stripes with a luminous accent layer.',
    type: 'stripes',
    config: {
      primaryColor: '#5b8dff',
      secondaryColor: '#0c111f',
      accentColor: '#9b6cff',
      angle: 128,
      density: 46,
      thickness: 18,
      softness: 32,
      scale: 100
    }
  },
  {
    name: 'Circuit Grid',
    description: 'Precise orthogonal grid with subtle depth blending.',
    type: 'grid',
    config: {
      primaryColor: '#73a3ff',
      secondaryColor: '#11182b',
      accentColor: '#10d7e2',
      angle: 0,
      density: 58,
      thickness: 10,
      softness: 44,
      scale: 120
    }
  },
  {
    name: 'Orbital Dots',
    description: 'Soft radial nodes with a layered cosmic glow.',
    type: 'dots',
    config: {
      primaryColor: '#93b4ff',
      secondaryColor: '#0a0f1d',
      accentColor: '#734bff',
      angle: 0,
      density: 70,
      thickness: 16,
      softness: 68,
      scale: 140
    }
  },
  {
    name: 'Textile Weave',
    description: 'Cross-woven bands with tonal interference.',
    type: 'weave',
    config: {
      primaryColor: '#6fa4ff',
      secondaryColor: '#0f1628',
      accentColor: '#ff8bcf',
      angle: 45,
      density: 52,
      thickness: 14,
      softness: 36,
      scale: 110
    }
  },
  {
    name: 'Precision Chevron',
    description: 'Offset chevron energy with highlight ridges.',
    type: 'chevron',
    config: {
      primaryColor: '#8aa6ff',
      secondaryColor: '#0f1425',
      accentColor: '#54f2c5',
      angle: 135,
      density: 60,
      thickness: 14,
      softness: 30,
      scale: 105
    }
  }
];

const defaultConfig: PatternConfig = {
  primaryColor: '#5b8dff',
  secondaryColor: '#0c111f',
  accentColor: '#9b6cff',
  angle: 45,
  density: 48,
  thickness: 14,
  softness: 48,
  scale: 100
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function useCopy() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error('Unable to copy', error);
    }
  };

  return { copied, copy };
}

function createPatternStyle(
  type: PatternType,
  config: PatternConfig
): { styles: CSSProperties; descriptor: string; layering: string[] } {
  const { primaryColor, secondaryColor, accentColor, angle, density, thickness, softness, scale } = config;
  const normalizedDensity = clamp(density, 10, 180);
  const normalizedThickness = clamp(thickness, 2, normalizedDensity);
  const blurStrength = clamp(softness, 0, 100);
  const scaleFactor = clamp(scale, 40, 200) / 100;

  const baseStyles: CSSProperties = {
    backgroundColor: secondaryColor,
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'repeat',
    filter: `drop-shadow(0 18px 32px rgba(12, 17, 31, ${0.28 + blurStrength / 420}))`
  };

  switch (type) {
    case 'stripes': {
      const gradient = `repeating-linear-gradient(${angle}deg, ${primaryColor} 0 ${normalizedThickness}px, ${secondaryColor} ${normalizedThickness}px ${normalizedDensity}px)`;
      const highlight = `linear-gradient(${angle + 90}deg, rgba(255, 255, 255, ${0.08 + blurStrength / 900}) 0%, transparent 60%)`;
      return {
        styles: {
          ...baseStyles,
          backgroundImage: `${gradient}, ${highlight}`,
          backgroundBlendMode: 'screen',
          backgroundSize: `${normalizedDensity * scaleFactor}px`
        },
        descriptor: `Precise ${normalizedThickness}px stripe cadence at ${angle.toFixed(0)}°. ${Math.round(
          (normalizedThickness / normalizedDensity) * 100
        )}% coverage with luminance overlay.`,
        layering: [
          `Layer 1 (Structure): repeating-linear-gradient → cadence ${normalizedDensity}px`,
          `Layer 2 (Glow): linear-gradient → softened highlight at ${(
            angle + 90
          ).toFixed(0)}°`
        ]
      };
    }
    case 'grid': {
      const horizontal = `repeating-linear-gradient(0deg, ${primaryColor} 0 ${normalizedThickness}px, transparent ${normalizedThickness}px ${normalizedDensity}px)`;
      const vertical = `repeating-linear-gradient(90deg, ${primaryColor} 0 ${normalizedThickness}px, transparent ${normalizedThickness}px ${normalizedDensity}px)`;
      const circuitry = `linear-gradient(135deg, transparent 30%, rgba(16, 215, 226, ${0.22 + blurStrength / 500}) 100%)`;
      return {
        styles: {
          ...baseStyles,
          backgroundImage: `${horizontal}, ${vertical}, ${circuitry}`,
          backgroundBlendMode: 'screen, lighten, normal',
          backgroundSize: `${normalizedDensity * scaleFactor}px ${normalizedDensity * scaleFactor}px`
        },
        descriptor: `Orthogonal grid with ${normalizedThickness}px conductors and ${normalizedDensity}px spacing. Neon highlight bias.`,
        layering: [
          'Layer 1 (Horizontal bus): repeating-linear-gradient 0°',
          'Layer 2 (Vertical bus): repeating-linear-gradient 90°',
          'Layer 3 (Charge wash): linear-gradient 135°'
        ]
      };
    }
    case 'dots': {
      const dotRadius = clamp(normalizedThickness, 4, normalizedDensity / 1.6);
      const dot = `radial-gradient(circle, ${primaryColor} 0 ${dotRadius}px, rgba(255, 255, 255, ${
        0.05 + blurStrength / 1000
      }) ${dotRadius + 1}px, transparent ${dotRadius + 2}px)`;
      const grid = `radial-gradient(circle at 25% 25%, rgba(255,255,255,${
        0.04 + blurStrength / 1200
      }) 0 18%, transparent 52%)`;
      return {
        styles: {
          ...baseStyles,
          backgroundColor: secondaryColor,
          backgroundImage: `${dot}, ${grid}`,
          backgroundSize: `${normalizedDensity * scaleFactor}px ${normalizedDensity * scaleFactor}px`,
          backgroundPosition: '0 0, calc(50% / 3) calc(50% / 3)'
        },
        descriptor: `Radial nodes radius ${dotRadius}px with ${normalizedDensity}px grid pitch. Diffused halo ${(
          blurStrength / 100
        ).toFixed(2)}.`,
        layering: ['Layer 1 (Core nodes): radial-gradient circle', 'Layer 2 (Halo mesh): offset radial-gradient']
      };
    }
    case 'weave': {
      const warp = `repeating-linear-gradient(90deg, ${primaryColor} 0 ${normalizedThickness}px, rgba(255,255,255,${
        0.04 + blurStrength / 900
      }) ${normalizedThickness}px ${normalizedDensity}px)`;
      const weft = `repeating-linear-gradient(0deg, ${accentColor} 0 ${normalizedThickness}px, transparent ${normalizedThickness}px ${normalizedDensity}px)`;
      const tailoring = `linear-gradient(${angle}deg, rgba(0,0,0,0) 40%, rgba(255,255,255,${
        0.18 + blurStrength / 650
      }) 100%)`;
      return {
        styles: {
          ...baseStyles,
          backgroundImage: `${weft}, ${warp}, ${tailoring}`,
          backgroundBlendMode: 'soft-light, lighten, normal',
          backgroundSize: `${normalizedDensity * scaleFactor}px ${normalizedDensity * scaleFactor}px`
        },
        descriptor: `Dual-axis weave with ${normalizedThickness}px filament width. Angle-modulated sheen at ${angle}°.`,
        layering: [
          'Layer 1 (Weft): repeating-linear-gradient 0°',
          'Layer 2 (Warp): repeating-linear-gradient 90°',
          'Layer 3 (Sheen): directional linear-gradient'
        ]
      };
    }
    case 'chevron': {
      const baseSize = normalizedDensity * scaleFactor;
      const chevron = `repeating-linear-gradient(${angle}deg, ${primaryColor} 0 ${normalizedThickness}px, transparent ${normalizedThickness}px ${
        normalizedThickness * 2
      }px)`;
      const mirrored = `repeating-linear-gradient(${angle - 90}deg, ${accentColor} 0 ${
        normalizedThickness / 1.3
      }px, transparent ${normalizedThickness / 1.3}px ${normalizedThickness * 2}px)`;
      const emboss = `linear-gradient(${angle}deg, rgba(0,0,0,0) 55%, rgba(255,255,255,${
        0.16 + blurStrength / 720
      }) 100%)`;
      return {
        styles: {
          ...baseStyles,
          backgroundImage: `${chevron}, ${mirrored}, ${emboss}`,
          backgroundBlendMode: 'screen, lighten, soft-light',
          backgroundSize: `${baseSize}px ${baseSize}px`,
          backgroundPosition: '0 0, 12px 12px, center'
        },
        descriptor: `Chevron motif anchored at ${angle}°. ${normalizedThickness}px crest depth with mirrored accent interference.`,
        layering: [
          'Layer 1 (Primary ridges): repeating-linear-gradient main angle',
          'Layer 2 (Counter ridges): repeating-linear-gradient inverse',
          'Layer 3 (Emboss): directional linear-gradient'
        ]
      };
    }
    default:
      return { styles: baseStyles, descriptor: 'Custom pattern', layering: [] };
  }
}

function buildCssSnippet(styles: CSSProperties) {
  const declarations: string[] = [];

  if (styles.backgroundColor) declarations.push(`background-color: ${styles.backgroundColor};`);
  if (styles.backgroundImage) declarations.push(`background-image: ${styles.backgroundImage};`);
  if (styles.backgroundSize) declarations.push(`background-size: ${styles.backgroundSize};`);
  if (styles.backgroundAttachment) declarations.push(`background-attachment: ${styles.backgroundAttachment};`);
  if (styles.backgroundPosition) declarations.push(`background-position: ${styles.backgroundPosition};`);
  if (styles.backgroundBlendMode) declarations.push(`background-blend-mode: ${styles.backgroundBlendMode};`);
  if (styles.filter) declarations.push(`filter: ${styles.filter};`);

  return `.pattern-surface {\n  ${declarations.join('\n  ')}\n}`;
}

function calculateComplexity(config: PatternConfig) {
  const filamentDensity = config.thickness / config.density;
  const softnessInfluence = config.softness / 100;
  const scaleFactor = config.scale / 100;
  const normalized = clamp(filamentDensity * 60 + softnessInfluence * 28 + scaleFactor * 12, 6, 98);
  return Math.round(normalized);
}

export default function Home() {
  const [patternType, setPatternType] = useState<PatternType>('stripes');
  const [config, setConfig] = useState<PatternConfig>(defaultConfig);
  const { copied, copy } = useCopy();

  const { styles, descriptor, layering } = useMemo(
    () => createPatternStyle(patternType, config),
    [patternType, config]
  );

  const cssSnippet = useMemo(() => buildCssSnippet(styles), [styles]);
  const complexityScore = useMemo(() => calculateComplexity(config), [config]);

  const applyPreset = (preset: PatternPreset) => {
    setPatternType(preset.type);
    setConfig(preset.config);
  };

  const resetConfig = () => {
    setPatternType('stripes');
    setConfig(defaultConfig);
  };

  return (
    <main>
      <div className="container">
        <div className="header">
          <div className="badge-row">
            <span className="pill">Agentic Pattern Studio</span>
            <span className="pill">Realtime CSS Backgrounds</span>
            <span className="pill">Precision Controls</span>
          </div>
          <h1>Pattern Maker Agent</h1>
          <p>
            Design precise, layered surface systems with procedural accuracy. Tune the cadence, thickness, density,
            and luminance of each layer, then export production-ready CSS in a single click.
          </p>
        </div>

        <section className="grid grid-two" style={{ gap: '2rem', marginBottom: '2.75rem' }}>
          <div className="card preview-card">
            <div className="panel-heading">
              <h2>Pattern Preview</h2>
              <span className="pill">Complexity {complexityScore}/100</span>
            </div>
            <div className="preview-surface" style={styles} />
            <div className="preview-meta">
              <span>{descriptor}</span>
              <button className="btn secondary" type="button" onClick={resetConfig}>
                Reset
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div className="panel-heading">
              <h2>Control Board</h2>
              <select
                value={patternType}
                onChange={(event) => setPatternType(event.target.value as PatternType)}
                className="pill"
                style={{ cursor: 'pointer', padding: '0.4rem 0.75rem', background: 'transparent', border: 'none' }}
              >
                <option value="stripes">Stripes</option>
                <option value="grid">Grid</option>
                <option value="dots">Dots</option>
                <option value="weave">Weave</option>
                <option value="chevron">Chevron</option>
              </select>
            </div>

            <div className="controls">
              <div className="control">
                <label htmlFor="primary">Primary Color</label>
                <input
                  id="primary"
                  type="color"
                  value={config.primaryColor}
                  onChange={(event) => setConfig((prev) => ({ ...prev, primaryColor: event.target.value }))}
                />
              </div>

              <div className="control">
                <label htmlFor="secondary">Secondary Color</label>
                <input
                  id="secondary"
                  type="color"
                  value={config.secondaryColor}
                  onChange={(event) => setConfig((prev) => ({ ...prev, secondaryColor: event.target.value }))}
                />
              </div>

              <div className="control">
                <label htmlFor="accent">Accent Layer</label>
                <input
                  id="accent"
                  type="color"
                  value={config.accentColor}
                  onChange={(event) => setConfig((prev) => ({ ...prev, accentColor: event.target.value }))}
                />
              </div>

              <div className="control">
                <label htmlFor="angle">Angle ({config.angle}°)</label>
                <input
                  id="angle"
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={config.angle}
                  onChange={(event) => setConfig((prev) => ({ ...prev, angle: Number(event.target.value) }))}
                />
              </div>

              <div className="control">
                <label htmlFor="density">Density ({config.density}px)</label>
                <input
                  id="density"
                  type="range"
                  min={12}
                  max={180}
                  step={2}
                  value={config.density}
                  onChange={(event) => setConfig((prev) => ({ ...prev, density: Number(event.target.value) }))}
                />
              </div>

              <div className="control">
                <label htmlFor="thickness">Thickness ({config.thickness}px)</label>
                <input
                  id="thickness"
                  type="range"
                  min={2}
                  max={80}
                  step={1}
                  value={config.thickness}
                  onChange={(event) => setConfig((prev) => ({ ...prev, thickness: Number(event.target.value) }))}
                />
              </div>

              <div className="control">
                <label htmlFor="softness">Softness ({config.softness}%)</label>
                <input
                  id="softness"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={config.softness}
                  onChange={(event) => setConfig((prev) => ({ ...prev, softness: Number(event.target.value) }))}
                />
              </div>

              <div className="control">
                <label htmlFor="scale">Scale ({config.scale}%)</label>
                <input
                  id="scale"
                  type="range"
                  min={40}
                  max={200}
                  step={5}
                  value={config.scale}
                  onChange={(event) => setConfig((prev) => ({ ...prev, scale: Number(event.target.value) }))}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid" style={{ gap: '1.75rem', marginBottom: '2.75rem' }}>
          <div className="card" style={{ padding: '1.8rem' }}>
            <div className="panel-heading">
              <h2>Layer Stack</h2>
              <span className="pill muted">{layering.length} layers</span>
            </div>
            <div className="grid" style={{ gap: '0.95rem' }}>
              {layering.map((layer, index) => (
                <div
                  key={index}
                  className="card"
                  style={{
                    padding: '0.95rem 1.1rem',
                    background: 'rgba(17, 24, 43, 0.9)',
                    borderRadius: '16px',
                    border: '1px solid rgba(128, 146, 200, 0.25)'
                  }}
                >
                  <span className="muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>
                    Layer {index + 1}
                  </span>
                  <span style={{ fontWeight: 500 }}>{layer}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.8rem' }}>
            <div className="panel-heading">
              <h2>CSS Output</h2>
              <button className="btn" type="button" onClick={() => copy(cssSnippet)}>
                {copied ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>
            <pre className="code-block">{cssSnippet}</pre>
          </div>
        </section>

        <section className="card" style={{ padding: '1.9rem' }}>
          <div className="panel-heading">
            <h2>Intelligent Presets</h2>
            <span className="pill muted">Instant starting points</span>
          </div>
          <div className="grid grid-two" style={{ gap: '1.35rem' }}>
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                className="card"
                style={{
                  textAlign: 'left',
                  padding: '1.2rem 1.35rem',
                  background: 'rgba(12, 17, 31, 0.8)',
                  border: '1px solid rgba(132, 150, 200, 0.22)',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border 0.2s ease'
                }}
                onClick={() => applyPreset(preset)}
                onMouseEnter={(event: MouseEvent<HTMLButtonElement>) => {
                  event.currentTarget.style.transform = 'translateY(-4px)';
                  event.currentTarget.style.border = '1px solid rgba(115, 163, 255, 0.45)';
                }}
                onMouseLeave={(event: MouseEvent<HTMLButtonElement>) => {
                  event.currentTarget.style.transform = 'translateY(0)';
                  event.currentTarget.style.border = '1px solid rgba(132, 150, 200, 0.22)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{preset.name}</span>
                  <span className="pill muted" style={{ fontSize: '0.75rem' }}>
                    {preset.type.toUpperCase()}
                  </span>
                </div>
                <p className="muted" style={{ marginTop: '0.55rem', lineHeight: 1.5 }}>
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>
      <footer className="footer">
        Built with gradient mathematics and agentic precision. Export, iterate, deploy.
      </footer>
    </main>
  );
}
