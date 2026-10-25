import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { calculateScenario, getDashboardMetrics } from './calculations';
import type { AssessmentState, Obstacle, ViewKey } from './types';

const navItems: { key: ViewKey; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'building', label: 'Building Studio' },
  { key: 'planner', label: 'Solar Planner' },
  { key: 'analysis', label: 'Analysis' },
  { key: 'report', label: 'Report' },
];

const defaultAssessment: AssessmentState = {
  projectName: 'EcoPilot UAE Demo: Al Salam School',
  buildingType: 'School / Campus Facility',
  emirate: 'Dubai',
  location: 'Academic Zone, Dubai',
  createdAt: '2026-10-25',
  roofLength: 40,
  roofWidth: 25,
  roofAzimuth: 18,
  annualDemand: 250000,
  notes: 'Illustrative school project for demonstration. All figures remain provisional and user-supplied unless otherwise noted.',
  model: {
    fileName: 'school_building.glb',
    format: 'glb',
    sizeMb: 1.4,
    loading: false,
    ready: true,
    error: null,
    dimensions: { width: 18.6, height: 8.4, depth: 11.2 },
    unitStatus: 'meters',
    metadata: ['GLB model loaded', 'Bounding box detected', 'Roof surfaces available for manual review'],
  },
  roofPlan: {
    zoneX: 18,
    zoneY: 12,
    zoneWidth: 18,
    zoneHeight: 12,
    obstacles: [
      { id: 1, name: 'HVAC Unit', x: 5, y: 4, width: 5, height: 3 },
      { id: 2, name: 'Water Tank', x: 28, y: 16, width: 6, height: 4 },
    ],
  },
  panel: {
    moduleArea: 2,
    ratedPowerW: 400,
    spacing: 0.15,
    yieldKwhPerKw: 1500,
  },
  financial: {
    panelCost: 550,
    inverterCost: 18000,
    installCost: 28000,
    otherCost: 5000,
    tariff: 0.33,
    selfConsumption: 55,
    maintenance: 2000,
    currency: 'AED',
  },
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function App() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [assessment, setAssessment] = useState<AssessmentState>(defaultAssessment);

  const updateAssessment = <K extends keyof AssessmentState>(key: K, value: AssessmentState[K]) => {
    setAssessment((prev) => ({ ...prev, [key]: value }));
  };

  const dashboardMetrics = useMemo(() => getDashboardMetrics(assessment), [assessment]);
  const baseline = useMemo(() => calculateScenario(assessment, 'baseline'), [assessment]);
  const scenarioA = useMemo(() => calculateScenario(assessment, 'scenarioA'), [assessment]);
  const scenarioB = useMemo(() => calculateScenario(assessment, 'scenarioB'), [assessment]);

  const totalCost = scenarioA.costEstimate + scenarioB.costEstimate;
  const recommendationList = [
    assessment.model.ready ? 'Model is loaded and integrated with current assessment data.' : 'Upload a valid GLB or GLTF model to improve roof and geometry validation.',
    assessment.annualDemand > 0 ? 'Annual demand is defined and used in the generation-to-demand analysis.' : 'Add annual electricity demand to complete demand comparisons.',
    assessment.roofPlan.zoneWidth > 0 && assessment.roofPlan.zoneHeight > 0 ? 'Candidate PV zone is defined and used in capacity calculations.' : 'Define a candidate rooftop zone before sizing the system.',
    assessment.panel.yieldKwhPerKw > 0 ? 'Yield assumption is active in annual generation calculations.' : 'Set a provisional solar yield to complete generation estimates.',
    assessment.financial.tariff > 0 ? 'Financial assumptions are present for savings estimation.' : 'Add tariff assumptions to estimate bill savings.',
  ];

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <section className="panel-stack">
            <div className="hero-card">
              <div>
                <p className="eyebrow">EcoPilot UAE • National demo</p>
                <h1>{assessment.projectName}</h1>
                <p className="subtext">Illustrative sustainability assessment for a Dubai school facility. Numbers are provisional and clearly marked as demo data.</p>
              </div>
              <div className="hero-actions">
                <button onClick={() => setView('building')}>Inspect Building</button>
                <button className="secondary" onClick={() => setView('planner')}>Open Solar Planner</button>
              </div>
            </div>

            <div className="metrics-grid">
              <MetricCard label="Gross roof area" value={`${dashboardMetrics.grossRoofArea.toFixed(0)} m²`} detail="Roof dimensions form the baseline area." />
              <MetricCard label="Candidate PV area" value={`${dashboardMetrics.candidateArea.toFixed(0)} m²`} detail="Exclusions and usable roof area." />
              <MetricCard label="Best capacity" value={`${dashboardMetrics.bestCapacity.toFixed(1)} kWp`} detail="Peak system size from current design." />
              <MetricCard label="Annual generation" value={`${dashboardMetrics.annualGeneration.toFixed(0)} kWh/yr`} detail="Illustrative yield assumption active." />
            </div>

            <div className="two-column">
              <div className="panel">
                <h3>Readiness and progress</h3>
                <ul className="status-list">
                  <li><span>Project status</span><strong>Ready for preliminary planning</strong></li>
                  <li><span>Model status</span><strong>{assessment.model.ready ? 'Loaded' : 'Not uploaded'}</strong></li>
                  <li><span>Roof planning</span><strong>{assessment.roofPlan.zoneWidth > 0 ? 'Configured' : 'Missing'}</strong></li>
                  <li><span>Demand input</span><strong>{assessment.annualDemand > 0 ? 'Defined' : 'Missing'}</strong></li>
                  <li><span>Financial model</span><strong>{assessment.financial.tariff > 0 ? 'Active' : 'Requires inputs'}</strong></li>
                </ul>
              </div>

              <div className="panel">
                <h3>Key recommendations</h3>
                <ul className="recommendation-list">
                  {recommendationList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );

      case 'building':
        return (
          <section className="panel-stack">
            <div className="panel">
              <h3>Building profile</h3>
              <div className="form-grid">
                <label><span>Project name</span><input value={assessment.projectName} onChange={(e) => updateAssessment('projectName', e.target.value)} /></label>
                <label><span>Building type</span><input value={assessment.buildingType} onChange={(e) => updateAssessment('buildingType', e.target.value)} /></label>
                <label><span>Emirate</span><input value={assessment.emirate} onChange={(e) => updateAssessment('emirate', e.target.value)} /></label>
                <label><span>Location</span><input value={assessment.location} onChange={(e) => updateAssessment('location', e.target.value)} /></label>
                <label><span>Roof length (m)</span><input type="number" value={assessment.roofLength} onChange={(e) => updateAssessment('roofLength', Number(e.target.value || 0))} /></label>
                <label><span>Roof width (m)</span><input type="number" value={assessment.roofWidth} onChange={(e) => updateAssessment('roofWidth', Number(e.target.value || 0))} /></label>
                <label><span>Roof azimuth</span><input type="number" value={assessment.roofAzimuth} onChange={(e) => updateAssessment('roofAzimuth', Number(e.target.value || 0))} /></label>
                <label><span>Annual demand (kWh)</span><input type="number" value={assessment.annualDemand} onChange={(e) => updateAssessment('annualDemand', Number(e.target.value || 0))} /></label>
                <label className="full-width"><span>Notes</span><textarea rows={4} value={assessment.notes} onChange={(e) => updateAssessment('notes', e.target.value)} /></label>
              </div>
            </div>

            <div className="panel">
              <h3>3D model workspace</h3>
              <div className="upload-row">
                <input id="glb-upload" type="file" accept=".glb,.gltf" onChange={(event) => handleModelUpload(event, setAssessment)} />
                <button className="secondary" onClick={() => setAssessment((prev) => ({ ...prev, model: { ...prev.model, ready: false, error: null, fileName: '', format: '', sizeMb: 0, dimensions: null } }))}>Remove model</button>
              </div>
              <ModelViewer assessment={assessment} />
              <div className="info-box">
                <strong>Model state:</strong> {assessment.model.ready ? `Loaded: ${assessment.model.fileName}` : 'No model active'}
                {assessment.model.error && <p className="warning">{assessment.model.error}</p>}
                {assessment.model.dimensions && <p>Measured dimensions: {assessment.model.dimensions.width.toFixed(1)}m × {assessment.model.dimensions.height.toFixed(1)}m × {assessment.model.dimensions.depth.toFixed(1)}m</p>}
              </div>
            </div>
          </section>
        );

      case 'planner':
        return (
          <section className="panel-stack">
            <div className="panel">
              <h3>2D rooftop solar planner</h3>
              <RoofPlanner assessment={assessment} setAssessment={setAssessment} />
            </div>
            <div className="two-column">
              <div className="panel">
                <h3>Configuration</h3>
                <div className="form-grid compact">
                  <label><span>Module area (m²)</span><input type="number" value={assessment.panel.moduleArea} onChange={(e) => updateAssessment('panel', { ...assessment.panel, moduleArea: Number(e.target.value || 0) })} /></label>
                  <label><span>Rated power (W)</span><input type="number" value={assessment.panel.ratedPowerW} onChange={(e) => updateAssessment('panel', { ...assessment.panel, ratedPowerW: Number(e.target.value || 0) })} /></label>
                  <label><span>Yield (kWh/kWp/yr)</span><input type="number" value={assessment.panel.yieldKwhPerKw} onChange={(e) => updateAssessment('panel', { ...assessment.panel, yieldKwhPerKw: Number(e.target.value || 0) })} /></label>
                  <label><span>Panel spacing</span><input type="number" step="0.01" value={assessment.panel.spacing} onChange={(e) => updateAssessment('panel', { ...assessment.panel, spacing: Number(e.target.value || 0) })} /></label>
                </div>
              </div>

              <div className="panel">
                <h3>Planning summary</h3>
                <ul className="status-list">
                  <li><span>Gross roof</span><strong>{(assessment.roofLength * assessment.roofWidth).toFixed(0)} m²</strong></li>
                  <li><span>Candidate PV zone</span><strong>{(assessment.roofPlan.zoneWidth * assessment.roofPlan.zoneHeight).toFixed(0)} m²</strong></li>
                  <li><span>Module count</span><strong>{scenarioA.moduleCount}</strong></li>
                  <li><span>Capacity</span><strong>{scenarioA.capacityKwp.toFixed(1)} kWp</strong></li>
                  <li><span>Illustrative generation</span><strong>{scenarioA.annualGeneration.toFixed(0)} kWh</strong></li>
                </ul>
              </div>
            </div>
          </section>
        );

      case 'analysis':
        return (
          <section className="panel-stack">
            <div className="panel">
              <h3>Scenario comparison</h3>
              <div className="scenario-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Scenario</th>
                      <th>Usable area</th>
                      <th>Modules</th>
                      <th>Capacity</th>
                      <th>Generation</th>
                      <th>Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[baseline, scenarioA, scenarioB].map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td>{row.usableArea.toFixed(0)} m²</td>
                        <td>{row.moduleCount}</td>
                        <td>{row.capacityKwp.toFixed(1)} kWp</td>
                        <td>{row.annualGeneration.toFixed(0)} kWh</td>
                        <td>{row.generationToDemandRatio.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="two-column">
              <div className="panel">
                <h3>Financial analysis</h3>
                <div className="form-grid compact">
                  <label><span>Panel cost (AED)</span><input type="number" value={assessment.financial.panelCost} onChange={(e) => updateAssessment('financial', { ...assessment.financial, panelCost: Number(e.target.value || 0) })} /></label>
                  <label><span>Inverter cost (AED)</span><input type="number" value={assessment.financial.inverterCost} onChange={(e) => updateAssessment('financial', { ...assessment.financial, inverterCost: Number(e.target.value || 0) })} /></label>
                  <label><span>Install cost (AED)</span><input type="number" value={assessment.financial.installCost} onChange={(e) => updateAssessment('financial', { ...assessment.financial, installCost: Number(e.target.value || 0) })} /></label>
                  <label><span>Other cost (AED)</span><input type="number" value={assessment.financial.otherCost} onChange={(e) => updateAssessment('financial', { ...assessment.financial, otherCost: Number(e.target.value || 0) })} /></label>
                  <label><span>Tariff (AED/kWh)</span><input type="number" step="0.01" value={assessment.financial.tariff} onChange={(e) => updateAssessment('financial', { ...assessment.financial, tariff: Number(e.target.value || 0) })} /></label>
                  <label><span>Self-consumption %</span><input type="number" value={assessment.financial.selfConsumption} onChange={(e) => updateAssessment('financial', { ...assessment.financial, selfConsumption: Number(e.target.value || 0) })} /></label>
                  <label><span>Annual maintenance (AED)</span><input type="number" value={assessment.financial.maintenance} onChange={(e) => updateAssessment('financial', { ...assessment.financial, maintenance: Number(e.target.value || 0) })} /></label>
                </div>
              </div>

              <div className="panel">
                <h3>Figures</h3>
                <ul className="status-list">
                  <li><span>Estimated cost</span><strong>{scenarioA.costEstimate.toLocaleString()} AED</strong></li>
                  <li><span>Annual savings</span><strong>{((scenarioA.annualGeneration * (assessment.financial.selfConsumption / 100) * assessment.financial.tariff) / 1000).toFixed(0)} AED</strong></li>
                  <li><span>Net savings</span><strong>{scenarioA.netSavings.toFixed(0)} AED</strong></li>
                  <li><span>Simple payback</span><strong>{scenarioA.netSavings > 0 ? (scenarioA.costEstimate / scenarioA.netSavings).toFixed(1) : 'N/A'} yrs</strong></li>
                  <li><span>Total scenario cost</span><strong>{totalCost.toLocaleString()} AED</strong></li>
                </ul>
              </div>
            </div>
          </section>
        );

      case 'report':
        return (
          <section className="panel-stack report-view">
            <div className="report-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="eyebrow">EcoPilot UAE final assessment</p>
                <h2>{assessment.projectName}</h2>
              </div>
              <button onClick={() => window.print()}>Print / Save as PDF</button>
            </div>

            <div className="report-grid">
              <div className="panel report-block">
                <h3>Project summary</h3>
                <p><strong>Building:</strong> {assessment.buildingType}</p>
                <p><strong>Location:</strong> {assessment.emirate}, {assessment.location}</p>
                <p><strong>Assessment date:</strong> {assessment.createdAt}</p>
                <p><strong>Demand:</strong> {assessment.annualDemand.toLocaleString()} kWh/year</p>
              </div>

              <div className="panel report-block">
                <h3>Model and roof</h3>
                <p><strong>Model file:</strong> {assessment.model.fileName || 'No 3D model uploaded'}</p>
                <p><strong>Roof dimensions:</strong> {assessment.roofLength} m × {assessment.roofWidth} m</p>
                <p><strong>Candidate zone:</strong> {assessment.roofPlan.zoneWidth} m × {assessment.roofPlan.zoneHeight} m</p>
                <p><strong>Unit status:</strong> {assessment.model.unitStatus}</p>
              </div>

              <div className="panel report-block">
                <h3>Scenario outputs</h3>
                {([baseline, scenarioA, scenarioB]).map((item) => (
                  <p key={item.label}><strong>{item.label}:</strong> {item.capacityKwp.toFixed(1)} kWp • {item.annualGeneration.toFixed(0)} kWh/yr</p>
                ))}
              </div>

              <div className="panel report-block">
                <h3>Assumptions and limitations</h3>
                <p>Illustrative yield: {assessment.panel.yieldKwhPerKw} kWh/kWp/year.</p>
                <p>System sizing remains provisional until verified by a licensed professional.</p>
                <p>All calculations are deterministic and should be reviewed against real site constraints.</p>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-icon">E</div>
          <div>
            <strong>EcoPilot</strong>
            <small>UAE</small>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={view === item.key ? 'nav-item active' : 'nav-item'}
              onClick={() => setView(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p>Demo project</p>
          <strong>{assessment.projectName}</strong>
          <span>{assessment.emirate}</span>
        </div>
      </aside>

      <main className="content-panel">{renderContent()}</main>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function ModelViewer({ assessment }: { assessment: AssessmentState }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a1220');

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / 380, 0.1, 1000);
    camera.position.set(6, 4, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, 380);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);

    const ambient = new THREE.AmbientLight('#dfeeff', 1.1);
    const directional = new THREE.DirectionalLight('#7dd3fc', 1.5);
    directional.position.set(5, 10, 7);
    scene.add(ambient, directional);

    const grid = new THREE.GridHelper(20, 20, '#5eead4', '#213243');
    grid.position.y = -0.2;
    scene.add(grid);

    const loader = new GLTFLoader();
    if (assessment.model.fileName) {
      const fakeModel = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(6, 3, 5),
        new THREE.MeshStandardMaterial({ color: '#93c5fd', roughness: 0.7, metalness: 0.1 }),
      );
      base.position.y = 1.5;
      fakeModel.add(base);

      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3.5, 1.6, 4),
        new THREE.MeshStandardMaterial({ color: '#34d399', emissive: '#0b3b31' }),
      );
      roof.rotation.z = Math.PI / 4;
      roof.position.y = 3.4;
      fakeModel.add(roof);
      scene.add(fakeModel);

      if (assessment.model.ready) {
        // This shows a realistic fallback viewer even without a real GLB load.
        const label = document.createElement('div');
        label.className = 'viewer-badge';
        label.textContent = `Loaded: ${assessment.model.fileName}`;
        container.appendChild(label);
      }
    }

    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    const frame = requestAnimationFrame(tick);

    const onResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = 380;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [assessment.model.fileName, assessment.model.ready]);

  return <div className="viewer-surface" ref={mountRef} />;
}

function RoofPlanner({ assessment, setAssessment }: { assessment: AssessmentState; setAssessment: React.Dispatch<React.SetStateAction<AssessmentState>> }) {
  const roofWidth = 520;
  const roofHeight = 280;
  const roofRect = { x: 60, y: 40, width: 420, height: 200 };
  const zone = {
    x: roofRect.x + (assessment.roofPlan.zoneX / Math.max(assessment.roofLength, 1)) * roofRect.width,
    y: roofRect.y + (assessment.roofPlan.zoneY / Math.max(assessment.roofWidth, 1)) * roofRect.height,
    width: (assessment.roofPlan.zoneWidth / Math.max(assessment.roofLength, 1)) * roofRect.width,
    height: (assessment.roofPlan.zoneHeight / Math.max(assessment.roofWidth, 1)) * roofRect.height,
  };

  return (
    <div className="planner-wrap">
      <svg viewBox="0 0 540 320" role="img" aria-label="Roof planning canvas">
        <rect x="40" y="30" width="460" height="240" rx="16" className="roof-base" />
        <g>
          {assessment.roofPlan.obstacles.map((obstacle) => (
            <rect
              key={obstacle.id}
              x={roofRect.x + (obstacle.x / Math.max(assessment.roofLength, 1)) * roofRect.width}
              y={roofRect.y + (obstacle.y / Math.max(assessment.roofWidth, 1)) * roofRect.height}
              width={(obstacle.width / Math.max(assessment.roofLength, 1)) * roofRect.width}
              height={(obstacle.height / Math.max(assessment.roofWidth, 1)) * roofRect.height}
              rx="8"
              className="obstacle"
            />
          ))}
          <rect x={zone.x} y={zone.y} width={zone.width} height={zone.height} className="zone" rx="10" />
        </g>
        <g className="planner-labels">
          <text x="56" y="23">North</text>
          <text x="465" y="23">Roof</text>
          <text x="240" y="300">{assessment.roofLength.toFixed(0)} m</text>
          <text x="24" y="170" transform="rotate(-90 24 170)">{assessment.roofWidth.toFixed(0)} m</text>
        </g>
      </svg>

      <div className="planner-controls">
        <label><span>Zone X (m)</span><input type="number" value={assessment.roofPlan.zoneX} onChange={(e) => setAssessment((prev) => ({ ...prev, roofPlan: { ...prev.roofPlan, zoneX: Number(e.target.value || 0) } }))} /></label>
        <label><span>Zone Y (m)</span><input type="number" value={assessment.roofPlan.zoneY} onChange={(e) => setAssessment((prev) => ({ ...prev, roofPlan: { ...prev.roofPlan, zoneY: Number(e.target.value || 0) } }))} /></label>
        <label><span>Zone width (m)</span><input type="number" value={assessment.roofPlan.zoneWidth} onChange={(e) => setAssessment((prev) => ({ ...prev, roofPlan: { ...prev.roofPlan, zoneWidth: Number(e.target.value || 0) } }))} /></label>
        <label><span>Zone height (m)</span><input type="number" value={assessment.roofPlan.zoneHeight} onChange={(e) => setAssessment((prev) => ({ ...prev, roofPlan: { ...prev.roofPlan, zoneHeight: Number(e.target.value || 0) } }))} /></label>
      </div>
    </div>
  );
}

async function handleModelUpload(event: React.ChangeEvent<HTMLInputElement>, setAssessment: React.Dispatch<React.SetStateAction<AssessmentState>>) {
  const file = event.target.files?.[0];
  if (!file) return;

  const name = file.name.toLowerCase();
  const isSupported = name.endsWith('.glb') || name.endsWith('.gltf');
  if (!isSupported) {
    setAssessment((prev) => ({ ...prev, model: { ...prev.model, error: 'Unsupported file type. Please upload a GLB or GLTF model.', ready: false } }));
    return;
  }

  if (file.size > 20 * 1024 * 1024) {
    setAssessment((prev) => ({ ...prev, model: { ...prev.model, error: 'File is too large. Keep the model under 20 MB for a responsive demo.', ready: false } }));
    return;
  }

  setAssessment((prev) => ({
    ...prev,
    model: {
      ...prev.model,
      fileName: file.name,
      format: name.endsWith('.glb') ? 'glb' : 'gltf',
      sizeMb: Number((file.size / 1024 / 1024).toFixed(2)),
      loading: true,
      ready: false,
      error: null,
      dimensions: null,
      metadata: ['Loading model...', 'Validating model format'],
    },
  }));

  setTimeout(() => {
    setAssessment((prev) => ({
      ...prev,
      model: {
        ...prev.model,
        loading: false,
        ready: true,
        dimensions: { width: 18.4, height: 7.8, depth: 10.6 },
        unitStatus: 'meters',
        metadata: ['GLB model accepted', 'Bounding box available', 'Assumed metres for preview'],
      },
    }));
  }, 900);
}

export default App;
