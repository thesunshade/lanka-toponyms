/* ==========================================================================
   Lanka Toponyms — Interactive Sri Lankan Place-Name Atlas
   100% Real GeoNames Data + OpenStreetMap District Cartography
   ========================================================================== */

(() => {
  'use strict';

  // ---- Reference Major Cities for Map Orientation ----
  const REFERENCE_CITIES = [
    { name: 'Colombo', lat: 6.9319, lon: 79.8478, align: 'left' },
    { name: 'Kandy', lat: 7.2906, lon: 80.6336, align: 'right' },
    { name: 'Galle', lat: 6.0367, lon: 80.2170, align: 'left' },
    { name: 'Jaffna', lat: 9.6684, lon: 80.0074, align: 'left' },
    { name: 'Trincomalee', lat: 8.5711, lon: 81.2335, align: 'right' },
    { name: 'Batticaloa', lat: 7.7102, lon: 81.6924, align: 'right' },
    { name: 'Anuradhapura', lat: 8.3122, lon: 80.4131, align: 'left' },
    { name: 'Ratnapura', lat: 6.6828, lon: 80.3992, align: 'left' },
    { name: 'Badulla', lat: 6.9895, lon: 81.0550, align: 'right' },
    { name: 'Matara', lat: 5.9485, lon: 80.5353, align: 'right' },
    { name: 'Kurunegala', lat: 7.4863, lon: 80.3623, align: 'left' },
    { name: 'Nuwara Eliya', lat: 6.9708, lon: 80.7829, align: 'right' },
  ];

  // ---- Secondary Morpheme Lexicon for Automatic Compound Dissection ----
  const QUALIFIER_LEXICON = [
    { re: /^ratna/i, tok: 'Ratna', script: 'රත්න', gloss: 'gem, jewel (Skt.)', rootId: 'rat' },
    { re: /^rathna/i, tok: 'Rathna', script: 'රත්න', gloss: 'gem, jewel (Skt.)', rootId: 'rat' },
    { re: /^ratmal/i, tok: 'Ratmal', script: 'රත්මල්', gloss: 'red ixora flower', rootId: 'rat' },
    { re: /^rathmal/i, tok: 'Rathmal', script: 'රත්මල්', gloss: 'red ixora flower', rootId: 'rat' },
    { re: /^rathu/i, tok: 'Rathu', script: 'රතු', gloss: 'red, crimson', rootId: 'rat' },
    { re: /^ratu/i, tok: 'Ratu', script: 'රතු', gloss: 'red, crimson', rootId: 'rat' },
    { re: /^rate\b/i, tok: 'Rate', script: 'රටේ', gloss: 'country / royal district', rootId: 'rat' },
    { re: /^rath/i, tok: 'Rath', script: 'රත්', gloss: 'red, crimson', rootId: 'rat' },
    { re: /^rat/i, tok: 'Rat', script: 'රත්', gloss: 'red, crimson', rootId: 'rat' },
    { re: /^ambalan|^ambalam/i, tok: 'Ambalan', script: 'අම්බලම්', gloss: 'wayside rest-house' },
    { re: /^bandara/i, tok: 'Bandara', script: 'බණ්ඩාර', gloss: 'chieftain, noble' },
    { re: /^aluth?/i, tok: 'Aluth', script: 'අලුත්', gloss: 'new', rootId: 'alut' },
    { re: /^maha/i, tok: 'Maha', script: 'මහා', gloss: 'great, large', rootId: 'maha' },
    { re: /^kuda/i, tok: 'Kuda', script: 'කුඩා', gloss: 'small, little', rootId: 'kuda' },
    { re: /^periya/i, tok: 'Periya', script: 'பெரிய', gloss: 'big, great (Tamil)', rootId: 'periya' },
    { re: /^chinna|^sinna/i, tok: 'Sinna', script: 'சின்ன', gloss: 'small (Tamil)' },
    { re: /^puthu|^pudu/i, tok: 'Puthu', script: 'புது', gloss: 'new (Tamil)' },
    { re: /^ihala/i, tok: 'Ihala', script: 'ඉහළ', gloss: 'upper', rootId: 'uda' },
    { re: /^pahala/i, tok: 'Pahala', script: 'පහළ', gloss: 'lower', rootId: 'palle' },
    { re: /^palle/i, tok: 'Palle', script: 'පල්ලෙ', gloss: 'lower, valley', rootId: 'palle' },
    { re: /^uda/i, tok: 'Uda', script: 'උඩ', gloss: 'upper, highland', rootId: 'uda' },
    { re: /^meda/i, tok: 'Meda', script: 'මැද', gloss: 'middle, central' },
    { re: /^weli|^wali/i, tok: 'Weli', script: 'වැලි', gloss: 'sand, sandy', rootId: 'weli' },
    { re: /^kalu/i, tok: 'Kalu', script: 'කළු', gloss: 'black, dark', rootId: 'kalu' },
    { re: /^sudu/i, tok: 'Sudu', script: 'සුදු', gloss: 'white' },
    { re: /^kaha/i, tok: 'Kaha', script: 'කහ', gloss: 'yellow / turmeric' },
    { re: /^nila?/i, tok: 'Nil', script: 'නිල්', gloss: 'blue / deep green' },
    { re: /^ran/i, tok: 'Ran', script: 'රන්', gloss: 'gold, golden', rootId: 'ran' },
    { re: /^kiri/i, tok: 'Kiri', script: 'කිරි', gloss: 'milk, milky-white', rootId: 'kiri' },
    { re: /^pol/i, tok: 'Pol', script: 'පොල්', gloss: 'coconut palm', rootId: 'pol' },
    { re: /^amba/i, tok: 'Amba', script: 'අඹ', gloss: 'mango tree', rootId: 'amba' },
    { re: /^nug[ae]/i, tok: 'Nuga', script: 'නුග', gloss: 'banyan tree', rootId: 'nuga' },
    { re: /^kos/i, tok: 'Kos', script: 'කොස්', gloss: 'jakfruit tree', rootId: 'nuga' },
    { re: /^kitul/i, tok: 'Kitul', script: 'කිතුල්', gloss: 'fishtail toddy palm' },
    { re: /^dehi/i, tok: 'Dehi', script: 'දෙහි', gloss: 'lime citrus tree' },
    { re: /^damba/i, tok: 'Damba', script: 'දඹ', gloss: 'java plum / rock' },
    { re: /^kumbuk/i, tok: 'Kumbuk', script: 'කුඹුක්', gloss: 'arjuna riverside tree' },
    { re: /^beli/i, tok: 'Beli', script: 'බෙලි', gloss: 'bael fruit tree' },
    { re: /^bogaha|^bo(?=gaha|wela|goda|gama|mal)/i, tok: 'Bo', script: 'බෝ', gloss: 'sacred Bodhi fig tree' },
    { re: /^gale?/i, tok: 'Gal', script: 'ගල්', gloss: 'stone, rocky', rootId: 'gal' },
    { re: /^monara/i, tok: 'Monara', script: 'මොනර', gloss: 'peacock' },
    { re: /^sinha/i, tok: 'Sinha', script: 'සිංහ', gloss: 'lion' },
    { re: /^walas/i, tok: 'Walas', script: 'වලස්', gloss: 'sloth bear' },
    { re: /^koti/i, tok: 'Koti', script: 'කොටි', gloss: 'leopard' },
    { re: /^bambara/i, tok: 'Bambara', script: 'බඹර', gloss: 'giant honeybee' },
    { re: /^gona/i, tok: 'Gona', script: 'ගෝන', gloss: 'sambar deer' },
    { re: /^dik/i, tok: 'Dik', script: 'දික්', gloss: 'long' },
    { re: /^kota/i, tok: 'Kota', script: 'කොට', gloss: 'short / fort' },
    { re: /^diya/i, tok: 'Diya', script: 'දිය', gloss: 'water, spring' },
    { re: /^hunu/i, tok: 'Hunu', script: 'හුණු', gloss: 'lime / limestone' },
    { re: /^wehera|^vihara/i, tok: 'Wehera', script: 'වෙහෙර', gloss: 'Buddhist stupa / monastery' },
    { re: /^dewala/i, tok: 'Dewala', script: 'දේවාල', gloss: 'deity shrine' },
    { re: /^puli/i, tok: 'Puli', script: 'புலி / புளி', gloss: 'tamarind / tiger (Tamil)' },
    { re: /^anai/i, tok: 'Anai', script: 'ஆனை', gloss: 'elephant (Tamil)' },
    { re: /^karai/i, tok: 'Karai', script: 'கரை', gloss: 'coast, shore (Tamil)' },
    { re: /^manal/i, tok: 'Manal', script: 'மணல்', gloss: 'sand (Tamil)' },
    { re: /^panai/i, tok: 'Panai', script: 'பனை', gloss: 'palmyra palm (Tamil)' },
    { re: /^kal(?!u)/i, tok: 'Kal', script: 'கல்', gloss: 'stone, rock (Tamil)' },
    { re: /^nal/i, tok: 'Nal', script: 'நல்', gloss: 'good, fair (Tamil)' },
    { re: /^mal/i, tok: 'Mal', script: 'මල්', gloss: 'flower, blossom' },
    { re: /^nawa|^nava/i, tok: 'Nawa', script: 'නව', gloss: 'new / nine' },
    { re: /^hal/i, tok: 'Hal', script: 'හල්', gloss: 'Vateria resin tree' },
    { re: /^bulu/i, tok: 'Bulu', script: 'බුළු', gloss: 'myrobalan tree' },
    { re: /^mora/i, tok: 'Mora', script: 'මොර', gloss: 'Ceylon longan tree' },
    { re: /^nelli/i, tok: 'Nelli', script: 'නෙල්ලි', gloss: 'Indian gooseberry' },
    { re: /^tala|^thala/i, tok: 'Tala', script: 'තල', gloss: 'sesame / talipot palm' },
    { re: /^pan/i, tok: 'Pan', script: 'පන්', gloss: 'sedge reed' },
    { re: /^katu/i, tok: 'Katu', script: 'කටු', gloss: 'thorny scrub' },
    { re: /^ganga/i, tok: 'Ganga', script: 'ගඟ', gloss: 'river' },
  ];

  const MIDDLE_LEXICON = [
    { re: /^gaha/i, tok: 'gaha', script: 'ගහ', gloss: 'tree' },
    { re: /^gas/i, tok: 'gas', script: 'ගස්', gloss: 'trees' },
    { re: /^mal/i, tok: 'mal', script: 'මල්', gloss: 'flower' },
    { re: /^bath/i, tok: 'bath', script: 'බත්', gloss: 'rice' },
    { re: /^pas/i, tok: 'pas', script: 'පස්', gloss: 'earth, soil' },
    { re: /^gedara/i, tok: 'gedara', script: 'ගෙදර', gloss: 'house, homestead' },
    { re: /^pokuna/i, tok: 'pokuna', script: 'පොකුණ', gloss: 'pond, pool' },
    { re: /^danda/i, tok: 'danda', script: 'දණ්ඩ', gloss: 'ridge / log-bridge' },
    { re: /^yaya/i, tok: 'yaya', script: 'යාය', gloss: 'tract, expanse' },
    { re: /^goda/i, tok: 'goda', script: 'ගොඩ', gloss: 'high ground' },
    { re: /^gala/i, tok: 'gala', script: 'ගල', gloss: 'rock' },
  ];

  // ---- Application State ----
  const state = {
    districts: [],
    roots: [],
    rootsById: {},
    places: [],      // raw compact rows: [id, name, lat, lon, distIdx, pop, elev, roots[], si, ta, famous]
    placesById: {},
    famous: {},

    activeRootA: 'wela',   // Start right on '-wela' as the user requested!
    activeRootB: null,     // Set when compareMode is active
    compareMode: false,

    category: 'all',
    tab: 'roots',
    vizMode: 'points',     // 'points' | 'density' | 'both'
    showDistricts: true,
    showCities: true,

    districtFilter: null,  // null or district idx (0..24)
    sortBy: 'notable',
    placesLimit: 120,

    selectedPlaceId: null,
    hoveredPlaceId: null,
    hoveredDistrictIdx: null,
  };

  // ---- DOM References ----
  const dom = {
    canvas: document.getElementById('map-canvas'),
    mapStage: document.getElementById('map-stage'),
    rootsList: document.getElementById('roots-list'),
    placesList: document.getElementById('places-list'),
    placesSummary: document.getElementById('places-summary'),
    districtFilter: document.getElementById('district-filter'),
    sortPlaces: document.getElementById('sort-places'),
    activeBanner: document.getElementById('active-banner'),
    inspectorCard: document.getElementById('inspector-card'),
    inspectorBody: document.getElementById('inspector-body'),
    inspectorCollapse: document.getElementById('inspector-collapse'),
    tooltip: document.getElementById('map-tooltip'),
    legendItems: document.getElementById('legend-items'),
    scaleBar: document.getElementById('scale-bar'),
    scaleLabel: document.getElementById('scale-label'),
    searchInput: document.getElementById('search-input'),
    searchClear: document.getElementById('search-clear'),
    searchResults: document.getElementById('search-results'),
    compareToggle: document.getElementById('btn-compare-toggle'),
    compareToggleLabel: document.getElementById('compare-toggle-label'),
    tabPlacesCount: document.getElementById('tab-places-count'),
    tabRootsCount: document.getElementById('tab-roots-count'),
    totalPlacesBadge: document.getElementById('total-places-badge'),
    chkDistricts: document.getElementById('chk-districts'),
    chkCities: document.getElementById('chk-cities'),
    btnSurprise: document.getElementById('btn-surprise'),
  };

  // ========================================================================
  // CARTOGRAPHIC MAP ENGINE (HiDPI Canvas with True Sri Lanka Projection)
  // ========================================================================
  class LankaMap {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Geographic bounds of Sri Lanka
      this.cosLat = Math.cos((7.85 * Math.PI) / 180);
      this.centerLon = 80.70;
      this.centerLat = 7.87;
      this.zoom = 1.0;       // 1.0 = full island nicely framed
      this.minZoom = 0.85;
      this.maxZoom = 18;

      this.width = 800;
      this.height = 600;
      this.baseScale = 100;  // pixels per degree lat at zoom=1

      this.isDragging = false;
      this.dragStart = null;
      this.dragMoved = false;

      this.animFrame = null;
      this.screenPoints = []; // Cached projected active points for fast hit-testing
      this.needsRender = true;

      this.bindEvents();
      this.resize();
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.width = Math.max(200, rect.width);
      this.height = Math.max(200, rect.height);
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      // Fit 4.45° lat × 2.85° lon comfortably with room for HUD & inspector
      const usableH = this.height - 96;
      const usableW = this.width - (this.width > 980 ? 220 : 40);
      const scaleH = usableH / 4.35;
      const scaleW = usableW / (2.65 * this.cosLat);
      this.baseScale = Math.max(55, Math.min(scaleH, scaleW));
      this.render();
    }

    getCenterOffsetX() {
      // Gently shift island slightly left on wide screens so the bottom-right inspector doesn't cover the East coast
      return this.width > 1050 ? -75 : 0;
    }

    project(lon, lat) {
      const scale = this.baseScale * this.zoom;
      const x = this.width / 2 + this.getCenterOffsetX() + (lon - this.centerLon) * this.cosLat * scale;
      const y = this.height / 2 - (lat - this.centerLat) * scale;
      return [x, y];
    }

    unproject(x, y) {
      const scale = this.baseScale * this.zoom;
      const lon = this.centerLon + (x - this.width / 2 - this.getCenterOffsetX()) / (this.cosLat * scale);
      const lat = this.centerLat - (y - this.height / 2) / scale;
      return [lon, lat];
    }

    flyTo(lon, lat, targetZoom) {
      if (this.animFrame) cancelAnimationFrame(this.animFrame);
      const startLon = this.centerLon;
      const startLat = this.centerLat;
      const startZoom = this.zoom;
      const endZoom = Math.max(this.minZoom, Math.min(this.maxZoom, targetZoom));
      const t0 = performance.now();
      const dur = 480;

      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const ease = 1 - Math.pow(1 - p, 3);
        this.centerLon = startLon + (lon - startLon) * ease;
        this.centerLat = startLat + (lat - startLat) * ease;
        this.zoom = startZoom + (endZoom - startZoom) * ease;
        this.render();
        if (p < 1) {
          this.animFrame = requestAnimationFrame(step);
        } else {
          this.animFrame = null;
        }
      };
      this.animFrame = requestAnimationFrame(step);
    }

    resetView() {
      this.flyTo(80.70, 7.87, 1.0);
    }

    zoomBy(factor, anchorX = this.width / 2 + this.getCenterOffsetX(), anchorY = this.height / 2) {
      const [lonBefore, latBefore] = this.unproject(anchorX, anchorY);
      const nextZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * factor));
      this.zoom = nextZoom;
      const scale = this.baseScale * this.zoom;
      this.centerLon = lonBefore - (anchorX - this.width / 2 - this.getCenterOffsetX()) / (this.cosLat * scale);
      this.centerLat = latBefore + (anchorY - this.height / 2) / scale;
      this.render();
    }

    bindEvents() {
      window.addEventListener('resize', () => this.resize());

      this.canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
        this.zoomBy(factor, x, y);
      }, { passive: false });

      this.canvas.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        this.isDragging = true;
        this.dragMoved = false;
        this.dragStart = { x: e.clientX, y: e.clientY, lon: this.centerLon, lat: this.centerLat };
        this.canvas.classList.add('dragging');
      });

      window.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (this.isDragging && this.dragStart) {
          const dx = e.clientX - this.dragStart.x;
          const dy = e.clientY - this.dragStart.y;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.dragMoved = true;
          const scale = this.baseScale * this.zoom;
          this.centerLon = this.dragStart.lon - dx / (this.cosLat * scale);
          this.centerLat = this.dragStart.lat + dy / scale;
          this.render();
          hideTooltip();
          return;
        }

        if (mx >= 0 && mx <= this.width && my >= 0 && my <= this.height) {
          this.handleHover(mx, my);
        }
      });

      window.addEventListener('mouseup', () => {
        if (this.isDragging) {
          this.isDragging = false;
          this.canvas.classList.remove('dragging');
        }
      });

      this.canvas.addEventListener('mouseleave', () => {
        if (state.hoveredPlaceId !== null || state.hoveredDistrictIdx !== null) {
          state.hoveredPlaceId = null;
          state.hoveredDistrictIdx = null;
          hideTooltip();
          this.render();
        }
      });

      this.canvas.addEventListener('click', (e) => {
        if (this.dragMoved) return;
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const hit = this.hitTestPoint(mx, my);
        if (hit) {
          selectPlace(hit.place[0], false);
          return;
        }

        // Check if clicked a district in density mode
        if (state.vizMode === 'density') {
          const dIdx = this.hitTestDistrict(mx, my);
          if (dIdx !== null) {
            toggleDistrictFilter(dIdx);
          }
        }
      });

      this.canvas.addEventListener('dblclick', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.zoomBy(1.75, e.clientX - rect.left, e.clientY - rect.top);
      });

      // Touch drag support
      let lastTouch = null;
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          const t = e.touches[0];
          lastTouch = { x: t.clientX, y: t.clientY, lon: this.centerLon, lat: this.centerLat, moved: false };
        }
      }, { passive: true });

      this.canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && lastTouch) {
          const t = e.touches[0];
          const dx = t.clientX - lastTouch.x;
          const dy = t.clientY - lastTouch.y;
          if (Math.abs(dx) > 4 || Math.abs(dy) > 4) lastTouch.moved = true;
          const scale = this.baseScale * this.zoom;
          this.centerLon = lastTouch.lon - dx / (this.cosLat * scale);
          this.centerLat = lastTouch.lat + dy / scale;
          this.render();
        }
      }, { passive: true });

      this.canvas.addEventListener('touchend', (e) => {
        if (lastTouch && !lastTouch.moved && e.changedTouches.length === 1) {
          const t = e.changedTouches[0];
          const rect = this.canvas.getBoundingClientRect();
          const hit = this.hitTestPoint(t.clientX - rect.left, t.clientY - rect.top, 16);
          if (hit) selectPlace(hit.place[0], false);
        }
        lastTouch = null;
      });
    }

    hitTestPoint(mx, my, maxRadius = 11) {
      if (state.vizMode === 'density') return null;
      let best = null;
      let bestDistSq = maxRadius * maxRadius;
      // Search backwards so top-drawn (famous / selected) points win
      for (let i = this.screenPoints.length - 1; i >= 0; i--) {
        const sp = this.screenPoints[i];
        const dx = sp.x - mx;
        const dy = sp.y - my;
        const d2 = dx * dx + dy * dy;
        const r = sp.r + 5;
        if (d2 <= Math.max(bestDistSq, r * r) && d2 < bestDistSq + (sp.famous ? 18 : 0)) {
          bestDistSq = d2;
          best = sp;
        }
      }
      return best;
    }

    hitTestDistrict(mx, my) {
      const [lon, lat] = this.unproject(mx, my);
      for (const d of state.districts) {
        if (pointInGeometry(lon, lat, d.geometry)) {
          return d.id;
        }
      }
      return null;
    }

    handleHover(mx, my) {
      const hit = this.hitTestPoint(mx, my);
      if (hit) {
        this.canvas.classList.add('pointer');
        const pid = hit.place[0];
        if (state.hoveredPlaceId !== pid) {
          state.hoveredPlaceId = pid;
          state.hoveredDistrictIdx = null;
          this.render();
        }
        showPlaceTooltip(hit.place, mx, my);
        return;
      }

      if (state.vizMode === 'density') {
        const dIdx = this.hitTestDistrict(mx, my);
        if (dIdx !== null) {
          this.canvas.classList.add('pointer');
          if (state.hoveredDistrictIdx !== dIdx || state.hoveredPlaceId !== null) {
            state.hoveredDistrictIdx = dIdx;
            state.hoveredPlaceId = null;
            this.render();
          }
          showDistrictTooltip(state.districts[dIdx], mx, my);
          return;
        }
      }

      this.canvas.classList.remove('pointer');
      if (state.hoveredPlaceId !== null || state.hoveredDistrictIdx !== null) {
        state.hoveredPlaceId = null;
        state.hoveredDistrictIdx = null;
        hideTooltip();
        this.render();
      }
    }

    updateScaleBar() {
      // 1 deg lat = 111.132 km
      const pxPerKm = (this.baseScale * this.zoom) / 111.132;
      const niceKms = [1, 2, 5, 10, 20, 25, 50, 100];
      let chosen = 50;
      for (const km of niceKms) {
        const px = km * pxPerKm;
        if (px >= 42 && px <= 115) {
          chosen = km;
          break;
        }
      }
      const barPx = Math.round(chosen * pxPerKm);
      dom.scaleBar.style.width = `${Math.max(30, Math.min(130, barPx))}px`;
      dom.scaleLabel.textContent = `${chosen} km`;
    }

    render() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      ctx.save();
      ctx.scale(this.dpr, this.dpr);

      // 1. Ocean background
      ctx.fillStyle = '#E5E0D3';
      ctx.fillRect(0, 0, w, h);

      // 2. Subtle Cartographic Graticule
      this.drawGraticule(ctx, w, h);

      // 3. District polygons (with coastal halo + choropleth shading)
      this.drawDistricts(ctx);

      // 4. District name labels
      if (state.showDistricts) {
        this.drawDistrictLabels(ctx);
      }

      // 5. Major reference cities
      if (state.showCities) {
        this.drawReferenceCities(ctx);
      }

      // 6. Active place points
      this.screenPoints = [];
      if (state.vizMode === 'points' || state.vizMode === 'both') {
        this.drawPlacePoints(ctx, w, h);
      }

      // 7. Selected place highlight (always visible even in density mode)
      if (state.selectedPlaceId !== null) {
        const sel = state.placesById[state.selectedPlaceId];
        if (sel) this.drawSelectedPin(ctx, sel);
      }

      // 8. Minimalist Compass Rose (top-right under zoom)
      this.drawCompass(ctx, w - 31, 162);

      ctx.restore();
      this.updateScaleBar();
    }

    drawGraticule(ctx, w, h) {
      ctx.save();
      ctx.strokeStyle = 'rgba(110, 102, 86, 0.13)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(95, 88, 74, 0.55)';

      for (let lat = 6; lat <= 10; lat += 1) {
        const [, y] = this.project(80.7, lat);
        if (y < -20 || y > h + 20) continue;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
        ctx.fillText(`${lat}°N`, 10, y - 4);
      }

      for (let lon = 79; lon <= 82; lon += 1) {
        const [x] = this.project(lon, 7.8);
        if (x < -20 || x > w + 20) continue;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
        ctx.fillText(`${lon}°E`, x + 4, h - 10);
      }
      ctx.restore();
    }

    traceGeometry(ctx, geom) {
      const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
      for (const poly of polys) {
        for (const ring of poly) {
          for (let i = 0; i < ring.length; i++) {
            const [x, y] = this.project(ring[i][0], ring[i][1]);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        }
      }
    }

    getDistrictFill(dIdx) {
      const rootA = state.rootsById[state.activeRootA];
      const rootB = state.compareMode && state.activeRootB ? state.rootsById[state.activeRootB] : null;
      const showDensity = state.vizMode === 'density' || state.vizMode === 'both';

      if (state.districtFilter !== null && state.districtFilter !== dIdx) {
        return '#F1ECE0';
      }

      if (!showDensity || !rootA) {
        if (state.districtFilter === dIdx) return '#FFFDF7';
        return '#FAF6EC';
      }

      if (rootB) {
        const ca = rootA.districtCounts[dIdx] || 0;
        const cb = rootB.districtCounts[dIdx] || 0;
        const total = ca + cb;
        if (total === 0) return '#F7F3E9';
        const maxTot = Math.max(1, ...state.districts.map((_, i) => (rootA.districtCounts[i] || 0) + (rootB.districtCounts[i] || 0)));
        const intensity = Math.min(0.75, 0.14 + 0.61 * Math.sqrt(total / maxTot));
        if (ca > cb * 1.15) {
          return `rgba(181, 70, 36, ${intensity.toFixed(2)})`;
        } else if (cb > ca * 1.15) {
          return `rgba(27, 107, 88, ${intensity.toFixed(2)})`;
        } else {
          return `rgba(196, 137, 20, ${intensity.toFixed(2)})`;
        }
      } else {
        const c = rootA.districtCounts[dIdx] || 0;
        if (c === 0) return '#F8F4EA';
        const maxC = Math.max(1, ...rootA.districtCounts);
        const alpha = 0.11 + 0.64 * Math.sqrt(c / maxC);
        return `rgba(181, 70, 36, ${alpha.toFixed(2)})`;
      }
    }

    drawDistricts(ctx) {
      // Soft ocean coastal shelf glow first
      ctx.save();
      ctx.shadowColor = 'rgba(72, 92, 98, 0.22)';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#FAF6EC';
      ctx.beginPath();
      for (const d of state.districts) {
        this.traceGeometry(ctx, d.geometry);
      }
      ctx.fill();
      ctx.restore();

      // Individual district fills & borders
      for (const d of state.districts) {
        ctx.beginPath();
        this.traceGeometry(ctx, d.geometry);
        ctx.fillStyle = this.getDistrictFill(d.id);
        ctx.fill();

        const isHovered = state.hoveredDistrictIdx === d.id;
        const isFiltered = state.districtFilter === d.id;
        ctx.strokeStyle = isFiltered
          ? '#2B4E7C'
          : isHovered
            ? '#1D221F'
            : 'rgba(145, 134, 112, 0.55)';
        ctx.lineWidth = isFiltered ? 1.8 : isHovered ? 1.5 : 0.85;
        ctx.stroke();
      }
    }

    drawDistrictLabels(ctx) {
      ctx.save();
      const fontSize = Math.max(8.5, Math.min(12.5, 9 + this.zoom * 0.7));
      ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (const d of state.districts) {
        const [x, y] = this.project(d.centroid[0], d.centroid[1]);
        if (x < -40 || x > this.width + 40 || y < -20 || y > this.height + 20) continue;
        // Skip tiny dense districts when zoomed far out unless filtered
        if (this.zoom < 1.1 && ['Colombo', 'Gampaha', 'Kegalle'].includes(d.name) && state.districtFilter !== d.id) {
          continue;
        }
        const label = d.name.toUpperCase();
        ctx.lineWidth = 2.6;
        ctx.strokeStyle = 'rgba(250, 246, 236, 0.88)';
        ctx.strokeText(label, x, y);
        ctx.fillStyle = state.districtFilter === d.id ? '#2B4E7C' : 'rgba(84, 78, 66, 0.62)';
        ctx.fillText(label, x, y);
      }
      ctx.restore();
    }

    drawReferenceCities(ctx) {
      ctx.save();
      ctx.font = '600 10.5px "Plus Jakarta Sans", sans-serif';
      ctx.textBaseline = 'middle';

      for (const c of REFERENCE_CITIES) {
        const [x, y] = this.project(c.lon, c.lat);
        if (x < -20 || x > this.width + 20 || y < -20 || y > this.height + 20) continue;

        ctx.beginPath();
        ctx.arc(x, y, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = '#3B423D';
        ctx.fill();
        ctx.strokeStyle = '#FAF6EC';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const tx = c.align === 'left' ? x - 6 : x + 6;
        ctx.textAlign = c.align === 'left' ? 'right' : 'left';
        ctx.lineWidth = 2.8;
        ctx.strokeStyle = 'rgba(250, 246, 236, 0.9)';
        ctx.strokeText(c.name, tx, y);
        ctx.fillStyle = 'rgba(38, 44, 40, 0.78)';
        ctx.fillText(c.name, tx, y);
      }
      ctx.restore();
    }

    drawPlacePoints(ctx, w, h) {
      const matched = getActivePlaces();
      const rootA = state.rootsById[state.activeRootA];
      const rootB = state.compareMode && state.activeRootB ? state.rootsById[state.activeRootB] : null;
      const idxA = rootA ? rootA.idx : -1;
      const idxB = rootB ? rootB.idx : -1;

      const dense = matched.length > 600;
      const baseR = dense
        ? Math.min(5.2, 2.3 + this.zoom * 0.55)
        : Math.min(6.4, 3.3 + this.zoom * 0.65);

      // Draw regular villages first, then famous/prominent towns on top
      const regular = [];
      const prominent = [];
      for (const p of matched) {
        const [x, y] = this.project(p[3], p[2]);
        if (x < -15 || x > w + 15 || y < -15 || y > h + 15) continue;
        const hasA = p[7].includes(idxA);
        const hasB = idxB >= 0 && p[7].includes(idxB);
        const kind = hasA && hasB ? 'both' : hasB ? 'b' : 'a';
        const isFamous = p[10] === 1 || p[5] >= 15000;
        const item = { place: p, x, y, kind, famous: isFamous, r: isFamous ? baseR + 1.8 : baseR };
        if (isFamous) prominent.push(item);
        else regular.push(item);
      }

      const drawList = (arr, isTop) => {
        for (const item of arr) {
          const isHov = state.hoveredPlaceId === item.place[0];
          const r = isHov ? item.r + 2.5 : item.r;
          ctx.beginPath();
          ctx.arc(item.x, item.y, r, 0, Math.PI * 2);

          if (item.kind === 'both') {
            ctx.fillStyle = '#C48914';
          } else if (item.kind === 'b') {
            ctx.fillStyle = isTop ? '#1B6B58' : 'rgba(27, 107, 88, 0.80)';
          } else {
            ctx.fillStyle = isTop ? '#B54624' : 'rgba(181, 70, 36, 0.78)';
          }
          ctx.fill();

          if (isTop || isHov || !dense || this.zoom >= 2.2) {
            ctx.strokeStyle = isHov ? '#1D221F' : 'rgba(255, 255, 255, 0.92)';
            ctx.lineWidth = isHov ? 2 : isTop ? 1.5 : 0.9;
            ctx.stroke();
          }

          // Show labels on prominent places when zoomed in or sparse
          if ((isTop && (matched.length < 180 || this.zoom >= 1.6)) || (this.zoom >= 4.2 && matched.length < 700)) {
            ctx.font = `${isTop ? '700' : '500'} 10.5px "Plus Jakarta Sans", sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(250, 246, 236, 0.92)';
            ctx.strokeText(item.place[1], item.x + r + 4, item.y);
            ctx.fillStyle = item.kind === 'b' ? '#134E40' : '#6A230D';
            ctx.fillText(item.place[1], item.x + r + 4, item.y);
          }

          this.screenPoints.push(item);
        }
      };

      drawList(regular, false);
      drawList(prominent, true);
    }

    drawSelectedPin(ctx, place) {
      const [x, y] = this.project(place[3], place[2]);
      ctx.save();
      // Outer pulse ring
      ctx.beginPath();
      ctx.arc(x, y, 13, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(43, 78, 124, 0.18)';
      ctx.fill();
      ctx.strokeStyle = '#2B4E7C';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Core pin
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#2B4E7C';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Name pill above pin
      const label = place[1];
      ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
      const tw = ctx.measureText(label).width;
      const pw = tw + 16;
      const ph = 24;
      const px = x - pw / 2;
      const py = y - 38;

      ctx.fillStyle = '#1D221F';
      roundRect(ctx, px, py, pw, ph, 7);
      ctx.fill();

      ctx.fillStyle = '#FAF6EC';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, py + ph / 2 + 0.5);
      ctx.restore();
    }

    drawCompass(ctx, cx, cy) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(46, 42, 34, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // North arrow
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(3.5, 1);
      ctx.lineTo(0, -1.5);
      ctx.lineTo(-3.5, 1);
      ctx.closePath();
      ctx.fillStyle = '#B54624';
      ctx.fill();

      // South arrow
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(3.5, -1);
      ctx.lineTo(0, 1.5);
      ctx.lineTo(-3.5, -1);
      ctx.closePath();
      ctx.fillStyle = 'rgba(84, 78, 66, 0.4)';
      ctx.fill();

      ctx.font = '700 8px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#1D221F';
      ctx.textAlign = 'center';
      ctx.fillText('N', 0, -16.5);
      ctx.restore();
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function pointInRing(lon, lat, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      const intersect = (yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-15) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function pointInGeometry(lon, lat, geom) {
    const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
    for (const poly of polys) {
      if (pointInRing(lon, lat, poly[0])) {
        let inHole = false;
        for (let k = 1; k < poly.length; k++) {
          if (pointInRing(lon, lat, poly[k])) { inHole = true; break; }
        }
        if (!inHole) return true;
      }
    }
    return false;
  }

  // ========================================================================
  // MORPHEME DECONSTRUCTOR ENGINE
  // ========================================================================
  function getRatSubBranch(name) {
    const l = name.toLowerCase();
    if (/^rath?na/.test(l)) {
      return { branch: 'රත්න · Gem / Jewel (Sanskrit ratna)', short: 'Gem / Jewel' };
    }
    if (/^rat[ae]\s|^ratekitul|^ratala/.test(l)) {
      return { branch: 'රට · Country / Royal District (rata)', short: 'Country / District' };
    }
    if (/^rath?mal/.test(l)) {
      return { branch: 'රත්මල් · Red Ixora Flower (rat + mal)', short: 'Red Flower' };
    }
    if (/^rath?ran|^rattaran/.test(l)) {
      return { branch: 'රත්තරන් · Gold (rat-ran)', short: 'Gold' };
    }
    return { branch: 'රත් / රතු · Red / Crimson (rat)', short: 'Red / Crimson' };
  }

  function deconstructPlace(place) {
    const gid = String(place[0]);
    const name = place[1];
    const famous = state.famous[gid];
    const matchedRootIds = place[7].map((idx) => state.roots[idx]?.id).filter(Boolean);

    if (famous) {
      return {
        verified: true,
        meaning: famous.meaning,
        note: famous.note,
        parts: famous.parts.map(([tok, script, gloss]) => {
          const linkedRoot = findLinkedRoot(tok, matchedRootIds);
          return { tok, script, gloss, rootId: linkedRoot, kind: linkedRoot ? 'root' : 'qual' };
        }),
      };
    }

    // Automatic compositional breakdown for all 10,000+ real GeoNames villages
    const primaryWord = name.split(/\s+(?:north|south|east|west|ihala|pahala|colony|town|estate|new\s+town)/i)[0].trim();
    const parts = [];
    let rest = primaryWord;

    // 1. Check trailing suffix root from matched roots
    let suffixPart = null;
    const suffixRoots = place[7]
      .map((idx) => state.roots[idx])
      .filter((r) => r && r.position === 'suffix')
      .sort((a, b) => b.id.length - a.id.length);

    for (const sr of suffixRoots) {
      const variants = sr.variants
        .map((v) => v.replace(/^-/, ''))
        .sort((a, b) => b.length - a.length);
      for (const v of variants) {
        const re = new RegExp(`(${v})$`, 'i');
        const m = rest.match(re);
        if (m && rest.length > m[1].length + 1) {
          suffixPart = {
            tok: m[1],
            script: sr.script.split('/')[0].trim(),
            gloss: sr.gloss.split(',')[0].trim().toLowerCase(),
            rootId: sr.id,
            kind: 'root',
          };
          rest = rest.slice(0, rest.length - m[1].length).replace(/[-\s]+$/, '');
          break;
        }
      }
      if (suffixPart) break;
    }

    // 2. Check leading qualifier / prefix
    for (const q of QUALIFIER_LEXICON) {
      const m = rest.match(q.re);
      if (m && m[0].length >= 2) {
        const matchedText = rest.slice(0, m[0].length);
        parts.push({
          tok: matchedText,
          script: q.script,
          gloss: q.gloss,
          rootId: q.rootId || null,
          kind: q.rootId ? 'root' : 'qual',
        });
        rest = rest.slice(m[0].length).replace(/^[-\s]+/, '');
        break;
      }
    }

    // 3. Check optional middle modifier (e.g., Pol + gaha + wela)
    if (rest.length >= 3) {
      for (const mid of MIDDLE_LEXICON) {
        const m = rest.match(mid.re);
        if (m) {
          parts.push({
            tok: rest.slice(0, m[0].length),
            script: mid.script,
            gloss: mid.gloss,
            rootId: null,
            kind: 'qual',
          });
          rest = rest.slice(m[0].length).replace(/^[-\s]+/, '');
          break;
        }
      }
    }

    // 4. Remaining unparsed local stem
    if (rest.length > 0) {
      parts.push({
        tok: rest,
        script: '',
        gloss: 'local qualifier / stem',
        rootId: null,
        kind: 'stem',
      });
    }

    if (suffixPart) parts.push(suffixPart);

    // Construct honest compositional summary
    const knownGlosses = parts.filter((p) => p.kind !== 'stem').map((p) => p.gloss);
    const meaning = knownGlosses.length
      ? knownGlosses.join(' · ')
      : 'Recorded Sri Lankan settlement';

    return {
      verified: false,
      meaning,
      note: null,
      parts,
    };
  }

  function findLinkedRoot(token, matchedRootIds) {
    const t = token.toLowerCase().replace(/[^a-z]/g, '');
    for (const rid of matchedRootIds) {
      const r = state.rootsById[rid];
      if (!r) continue;
      for (const v of r.variants) {
        const clean = v.replace(/[^a-z]/g, '');
        if (t === clean || t.startsWith(clean) || clean.startsWith(t)) {
          return rid;
        }
      }
    }
    return null;
  }

  // ========================================================================
  // DATA FILTERING & QUERYING
  // ========================================================================
  function getActivePlaces() {
    const rootA = state.rootsById[state.activeRootA];
    const rootB = state.compareMode && state.activeRootB ? state.rootsById[state.activeRootB] : null;
    if (!rootA) return [];

    const idxA = rootA.idx;
    const idxB = rootB ? rootB.idx : -1;
    const dFilter = state.districtFilter;

    const out = [];
    for (const p of state.places) {
      if (dFilter !== null && p[4] !== dFilter) continue;
      const hasA = p[7].includes(idxA);
      const hasB = idxB >= 0 && p[7].includes(idxB);
      if (hasA || hasB) out.push(p);
    }
    return out;
  }

  function getSortedActivePlaces() {
    const list = getActivePlaces().slice();
    if (state.sortBy === 'alpha') {
      list.sort((a, b) => a[1].localeCompare(b[1]));
    } else if (state.sortBy === 'district') {
      list.sort((a, b) => {
        const da = state.districts[a[4]].name;
        const db = state.districts[b[4]].name;
        return da.localeCompare(db) || a[1].localeCompare(b[1]);
      });
    } else if (state.sortBy === 'elev') {
      list.sort((a, b) => b[6] - a[6] || a[1].localeCompare(b[1]));
    } else {
      // Notable first: famous, then pop, then A-Z
      list.sort((a, b) => b[10] - a[10] || b[5] - a[5] || a[1].localeCompare(b[1]));
    }
    return list;
  }

  // ========================================================================
  // UI RENDERING
  // ========================================================================
  let map = null;

  function renderAll() {
    renderRootsList();
    renderPlacesList();
    renderActiveBanner();
    renderLegend();
    renderInspector();
    updatePresetStates();
    if (map) map.render();
  }

  function renderRootsList() {
    const cat = state.category;
    const filtered = state.roots.filter((r) => {
      if (cat === 'all') return true;
      if (cat === 'featured') return r.featured;
      return r.category === cat;
    });

    dom.rootsList.innerHTML = filtered
      .map((r) => {
        const isA = state.activeRootA === r.id;
        const isB = state.compareMode && state.activeRootB === r.id;
        const cls = isA ? 'active-a' : isB ? 'active-b' : '';
        const slotPill = state.compareMode
          ? isA
            ? '<span class="root-slot-pill slot-a">A</span>'
            : isB
              ? '<span class="root-slot-pill slot-b">B</span>'
              : ''
          : '';
        return `
          <button class="root-card ${cls}" data-root="${r.id}">
            <div class="root-card-top">
              <div class="root-name-wrap">
                <span class="root-label">${escapeHtml(r.label)}</span>
                <span class="root-script">${escapeHtml(r.script)}</span>
              </div>
              <span class="root-count-badge">${slotPill}${r.count.toLocaleString()}</span>
            </div>
            <div class="root-gloss">${escapeHtml(r.gloss)}</div>
            <div class="root-meta-row">
              <span class="root-lang">${escapeHtml(r.lang)}</span>
              <span class="root-pos-tag">${r.position}</span>
            </div>
          </button>
        `;
      })
      .join('');
  }

  function highlightRootInName(name, rootA, rootB) {
    const marks = [];
    const findSpan = (root, cls) => {
      if (!root) return;
      const vars = root.variants
        .map((v) => v.replace(/^-|-$/g, ''))
        .sort((a, b) => b.length - a.length);
      for (const v of vars) {
        const re = root.position === 'prefix'
          ? new RegExp(`^(${v})`, 'i')
          : new RegExp(`(${v})(?=$|\\s+(?:north|south|east|west|ihala|pahala|town|colony))`, 'i');
        const m = re.exec(name);
        if (m) {
          marks.push({ start: m.index, end: m.index + m[1].length, cls });
          return;
        }
      }
    };
    findSpan(rootA, 'mark-a');
    if (rootB) findSpan(rootB, 'mark-b');
    if (!marks.length) return escapeHtml(name);

    marks.sort((a, b) => a.start - b.start);
    let out = '';
    let pos = 0;
    for (const mk of marks) {
      if (mk.start < pos) continue;
      if (mk.start > pos) out += escapeHtml(name.slice(pos, mk.start));
      out += `<mark class="${mk.cls}">${escapeHtml(name.slice(mk.start, mk.end))}</mark>`;
      pos = mk.end;
    }
    if (pos < name.length) out += escapeHtml(name.slice(pos));
    return out;
  }

  function renderPlacesList() {
    const list = getSortedActivePlaces();
    dom.tabPlacesCount.textContent = list.length.toLocaleString();

    const rootA = state.rootsById[state.activeRootA];
    const rootB = state.compareMode && state.activeRootB ? state.rootsById[state.activeRootB] : null;
    const idxA = rootA ? rootA.idx : -1;
    const idxB = rootB ? rootB.idx : -1;

    const dName = state.districtFilter !== null ? ` in ${state.districts[state.districtFilter].name}` : ' across Sri Lanka';
    dom.placesSummary.innerHTML = `<span>Showing <strong>${Math.min(list.length, state.placesLimit).toLocaleString()}</strong> of <strong>${list.length.toLocaleString()}</strong> real places${escapeHtml(dName)}</span>`;

    const slice = list.slice(0, state.placesLimit);
    if (!slice.length) {
      dom.placesList.innerHTML = `<div style="padding:24px 12px;text-align:center;color:var(--ink-muted);font-size:13px;">No matching places in this district. Try clearing the district filter.</div>`;
      return;
    }

    let html = slice
      .map((p) => {
        const dist = state.districts[p[4]];
        const isSel = state.selectedPlaceId === p[0];
        const hasA = p[7].includes(idxA);
        const hasB = idxB >= 0 && p[7].includes(idxB);
        const dotColor = hasA && hasB ? 'var(--both)' : hasB ? 'var(--compare)' : 'var(--accent)';
        const nameHtml = highlightRootInName(p[1], hasA ? rootA : null, hasB ? rootB : null);
        const scriptSnippet = p[8] || p[9] || '';
        return `
          <button class="place-row ${isSel ? 'selected' : ''}" data-pid="${p[0]}">
            <div style="display:flex;align-items:center;gap:9px;min-width:0;">
              <span class="place-dot-indicator" style="background:${dotColor}"></span>
              <div class="place-row-left">
                <span class="place-row-name">${nameHtml}</span>
                <span class="place-row-meta">
                  <span>${escapeHtml(dist.name)}</span>
                  ${scriptSnippet ? `<span>· ${escapeHtml(scriptSnippet)}</span>` : ''}
                  ${p[6] >= 0 ? `<span>· ${p[6]}m</span>` : ''}
                </span>
              </div>
            </div>
            ${p[10] === 1 ? '<span class="place-row-famous">Notable</span>' : ''}
          </button>
        `;
      })
      .join('');

    if (list.length > state.placesLimit) {
      html += `<button class="load-more-btn" id="btn-load-more">Show more (${(list.length - state.placesLimit).toLocaleString()} remaining)</button>`;
    }

    dom.placesList.innerHTML = html;
  }

  function renderActiveBanner() {
    const rootA = state.rootsById[state.activeRootA];
    const rootB = state.compareMode && state.activeRootB ? state.rootsById[state.activeRootB] : null;
    if (!rootA) return;

    const countA = state.districtFilter !== null
      ? rootA.districtCounts[state.districtFilter]
      : rootA.count;

    let html = `
      <span class="banner-root-pill">
        <span class="banner-dot a"></span>
        <span>${escapeHtml(rootA.label)}</span>
        <span class="banner-count">${countA.toLocaleString()}</span>
      </span>
    `;

    if (rootB) {
      const countB = state.districtFilter !== null
        ? rootB.districtCounts[state.districtFilter]
        : rootB.count;
      html += `
        <span class="banner-vs">vs</span>
        <span class="banner-root-pill">
          <span class="banner-dot b"></span>
          <span>${escapeHtml(rootB.label)}</span>
          <span class="banner-count">${countB.toLocaleString()}</span>
        </span>
      `;
    }

    if (state.districtFilter !== null) {
      const dn = state.districts[state.districtFilter].name;
      html += `<button class="banner-district-chip" id="btn-clear-dist" title="Clear district filter">${escapeHtml(dn)} &times;</button>`;
    }

    dom.activeBanner.innerHTML = html;
  }

  function renderLegend() {
    const rootA = state.rootsById[state.activeRootA];
    const rootB = state.compareMode && state.activeRootB ? state.rootsById[state.activeRootB] : null;
    if (!rootA) return;

    let html = `<span class="leg-item"><span class="leg-swatch" style="background:var(--accent)"></span>${escapeHtml(rootA.label)}</span>`;
    if (rootB) {
      html += `<span class="leg-item"><span class="leg-swatch" style="background:var(--compare)"></span>${escapeHtml(rootB.label)}</span>`;
      html += `<span class="leg-item"><span class="leg-swatch" style="background:var(--both)"></span>Both</span>`;
    }
    dom.legendItems.innerHTML = html;
  }

  function renderInspector() {
    if (state.selectedPlaceId !== null) {
      const place = state.placesById[state.selectedPlaceId];
      if (place) {
        renderPlaceInspector(place);
        return;
      }
    }

    if (state.compareMode && state.activeRootB) {
      renderCompareInspector();
    } else {
      renderRootInspector();
    }
  }

  function renderRootInspector() {
    const r = state.rootsById[state.activeRootA];
    if (!r) return;

    const maxD = Math.max(1, ...r.topDistricts.map((d) => d[1]));
    const barsHtml = r.topDistricts
      .map(([dname, cnt]) => {
        const dObj = state.districts.find((d) => d.name === dname);
        const pct = Math.round((cnt / maxD) * 100);
        return `
          <div class="dbar-row" data-didx="${dObj ? dObj.id : ''}" title="Filter & zoom to ${escapeHtml(dname)}">
            <span class="dbar-name">${escapeHtml(dname)}</span>
            <span class="dbar-track"><span class="dbar-fill" style="width:${pct}%"></span></span>
            <span class="dbar-val">${cnt}</span>
          </div>
        `;
      })
      .join('');

    // Pick up to 6 notable real examples for this root
    const examples = state.places
      .filter((p) => p[7].includes(r.idx))
      .slice(0, 6);

    const examplesHtml = examples
      .map((p) => `<button class="example-chip" data-pid="${p[0]}">${escapeHtml(p[1])}</button>`)
      .join('');

    // Special breakdown pills if viewing rat-
    let extraNote = '';
    if (r.id === 'rat') {
      extraNote = `
        <div class="subbranch-pill">3 branches: රත් (red) · රත්න (gem) · රට (country)</div>
      `;
    }

    dom.inspectorBody.innerHTML = `
      <p class="insp-kicker">${escapeHtml(r.lang)} · ${r.position} · ${r.count.toLocaleString()} real places</p>
      <div class="insp-title-row">
        <h2 class="insp-title">${escapeHtml(r.label)}</h2>
        <span class="insp-script">${escapeHtml(r.script)}</span>
      </div>
      <div class="insp-gloss">“${escapeHtml(r.gloss)}”</div>
      ${extraNote}
      <p class="insp-detail">${escapeHtml(r.detail)}</p>

      <div class="insp-section-label">Highest concentration by district</div>
      <div class="district-bars">${barsHtml}</div>

      <div class="insp-section-label">Notable real places to inspect</div>
      <div class="example-chips">${examplesHtml}</div>
    `;
  }

  function renderCompareInspector() {
    const a = state.rootsById[state.activeRootA];
    const b = state.rootsById[state.activeRootB];
    if (!a || !b) return;

    // Count overlap
    let overlap = 0;
    const overlapExamples = [];
    for (const p of state.places) {
      if (p[7].includes(a.idx) && p[7].includes(b.idx)) {
        overlap++;
        if (overlapExamples.length < 5) overlapExamples.push(p);
      }
    }

    const topA = a.topDistricts.slice(0, 3).map((d) => `${d[0]} (${d[1]})`).join(', ');
    const topB = b.topDistricts.slice(0, 3).map((d) => `${d[0]} (${d[1]})`).join(', ');

    dom.inspectorBody.innerHTML = `
      <p class="insp-kicker">Side-by-Side Comparison</p>
      <div class="compare-cards">
        <div class="cmp-box a">
          <div class="cmp-box-title">${escapeHtml(a.label)}</div>
          <div class="cmp-box-num">${a.count.toLocaleString()} places · ${escapeHtml(a.script)}</div>
          <div class="cmp-box-gloss">${escapeHtml(a.gloss)}</div>
        </div>
        <div class="cmp-box b">
          <div class="cmp-box-title">${escapeHtml(b.label)}</div>
          <div class="cmp-box-num">${b.count.toLocaleString()} places · ${escapeHtml(b.script)}</div>
          <div class="cmp-box-gloss">${escapeHtml(b.gloss)}</div>
        </div>
      </div>

      <p class="insp-detail" style="margin-bottom:8px;">
        <strong>${escapeHtml(a.label)}</strong> peaks in ${escapeHtml(topA)}.<br/>
        <strong>${escapeHtml(b.label)}</strong> peaks in ${escapeHtml(topB)}.
        ${overlap > 0 ? `<br/><strong>${overlap}</strong> real places combine both elements (shown in gold).` : ''}
      </p>

      ${overlapExamples.length ? `
        <div class="insp-section-label">Places containing both</div>
        <div class="example-chips">
          ${overlapExamples.map((p) => `<button class="example-chip" data-pid="${p[0]}">${escapeHtml(p[1])}</button>`).join('')}
        </div>
      ` : ''}

      <div class="insp-actions">
        <button class="btn-back" id="btn-exit-compare">Exit Compare Mode</button>
        <span style="font-size:11px;color:var(--ink-muted);">Tip: Try “Districts” map view</span>
      </div>
    `;
  }

  function renderPlaceInspector(place) {
    const dist = state.districts[place[4]];
    const decomp = deconstructPlace(place);
    const hasRat = place[7].includes(state.rootsById['rat']?.idx);
    const ratBranch = hasRat ? getRatSubBranch(place[1]) : null;

    const nativeScripts = [place[8], place[9]].filter(Boolean).join(' · ');

    const blocksHtml = decomp.parts
      .map((part, i) => {
        const cls = part.rootId
          ? (state.compareMode && part.rootId === state.activeRootB ? 'kind-root-b clickable' : 'kind-root-a clickable')
          : part.kind === 'qual'
            ? 'kind-qual'
            : 'kind-stem';
        const attr = part.rootId ? `data-jump-root="${part.rootId}" title="Explore all '${part.rootId}' places"` : '';
        const plus = i > 0 ? '<span class="morpheme-plus">+</span>' : '';
        return `
          ${plus}
          <div class="morpheme-block ${cls}" ${attr}>
            <span class="mb-token">${escapeHtml(part.tok)} ${part.script ? `<span class="mb-script">${escapeHtml(part.script)}</span>` : ''}</span>
            <span class="mb-meaning">${escapeHtml(part.gloss)}</span>
          </div>
        `;
      })
      .join('');

    const osmUrl = `https://www.openstreetmap.org/?mlat=${place[2]}&mlon=${place[3]}#map=13/${place[2]}/${place[3]}`;

    dom.inspectorBody.innerHTML = `
      <p class="insp-kicker ${decomp.verified ? 'verified' : ''}">
        ${decomp.verified ? '✓ Verified Etymology' : 'GeoNames Component Breakdown'} · #${place[0]}
      </p>
      <div class="insp-title-row">
        <h2 class="insp-title">${escapeHtml(place[1])}</h2>
        ${nativeScripts ? `<span class="insp-script">${escapeHtml(nativeScripts)}</span>` : ''}
      </div>
      <div class="insp-gloss">${decomp.verified ? `“${escapeHtml(decomp.meaning)}”` : escapeHtml(decomp.meaning)}</div>
      ${ratBranch ? `<div class="subbranch-pill">${escapeHtml(ratBranch.branch)}</div>` : ''}

      <div class="morpheme-strip">${blocksHtml}</div>

      ${decomp.note ? `<p class="insp-detail">${escapeHtml(decomp.note)}</p>` : `<p class="insp-detail">Click any highlighted name-part tile above to map every real Sri Lankan town sharing that root.</p>`}

      <div class="meta-grid">
        <div class="meta-cell">
          <div class="meta-cell-k">District</div>
          <div class="meta-cell-v">${escapeHtml(dist.name)}</div>
        </div>
        <div class="meta-cell">
          <div class="meta-cell-k">Province</div>
          <div class="meta-cell-v">${escapeHtml(dist.province)}</div>
        </div>
        <div class="meta-cell">
          <div class="meta-cell-k">Coordinates</div>
          <div class="meta-cell-v mono">${place[2].toFixed(4)}°N, ${place[3].toFixed(4)}°E</div>
        </div>
        <div class="meta-cell">
          <div class="meta-cell-k">Elevation</div>
          <div class="meta-cell-v mono">${place[6] >= 0 ? `${place[6]} m` : 'Coastal / N/A'}</div>
        </div>
      </div>

      <div class="insp-actions">
        <button class="btn-back" id="btn-back-root">&larr; Back to root</button>
        <a class="ext-link" href="${osmUrl}" target="_blank" rel="noopener">Open in OSM &nearr;</a>
      </div>
    `;
  }

  function showPlaceTooltip(place, mx, my) {
    const dist = state.districts[place[4]];
    const famous = state.famous[String(place[0])];
    dom.tooltip.innerHTML = `
      <div class="tt-title">${escapeHtml(place[1])}</div>
      <div class="tt-sub">${escapeHtml(dist.name)} District · ${escapeHtml(dist.province)}</div>
      ${famous ? `<div class="tt-meaning">“${escapeHtml(famous.meaning)}”</div>` : ''}
    `;
    positionTooltip(mx, my);
  }

  function showDistrictTooltip(dist, mx, my) {
    const a = state.rootsById[state.activeRootA];
    const b = state.compareMode && state.activeRootB ? state.rootsById[state.activeRootB] : null;
    const ca = a ? a.districtCounts[dist.id] : 0;
    const cb = b ? b.districtCounts[dist.id] : 0;
    dom.tooltip.innerHTML = `
      <div class="tt-title">${escapeHtml(dist.name)} District</div>
      <div class="tt-sub">${escapeHtml(dist.province)} Province</div>
      <div class="tt-meaning">${escapeHtml(a.label)}: ${ca}${b ? ` · ${escapeHtml(b.label)}: ${cb}` : ''}</div>
    `;
    positionTooltip(mx, my);
  }

  function positionTooltip(mx, my) {
    dom.tooltip.classList.remove('hidden');
    const flipX = mx > map.width - 260;
    dom.tooltip.style.left = `${mx}px`;
    dom.tooltip.style.top = `${my}px`;
    dom.tooltip.style.transform = flipX ? 'translate(calc(-100% - 14px), -50%)' : 'translate(14px, -50%)';
  }

  function hideTooltip() {
    dom.tooltip.classList.add('hidden');
  }

  // ========================================================================
  // USER ACTIONS
  // ========================================================================
  function selectRoot(rootId) {
    if (!state.rootsById[rootId]) return;
    state.selectedPlaceId = null;
    state.placesLimit = 120;

    if (state.compareMode) {
      if (state.activeRootA === rootId && state.activeRootB) {
        // Clicking A swaps A and B
        const tmp = state.activeRootA;
        state.activeRootA = state.activeRootB;
        state.activeRootB = tmp;
      } else if (state.activeRootB === rootId) {
        // Clicking B again swaps it into A
        const tmp = state.activeRootA;
        state.activeRootA = state.activeRootB;
        state.activeRootB = tmp;
      } else {
        state.activeRootB = rootId;
      }
    } else {
      state.activeRootA = rootId;
    }
    dom.inspectorCard.classList.remove('collapsed');
    renderAll();
  }

  function applyComparePreset(idA, idB) {
    state.compareMode = true;
    state.activeRootA = idA;
    state.activeRootB = idB;
    state.selectedPlaceId = null;
    state.placesLimit = 120;
    updateCompareToggleUI();
    dom.inspectorCard.classList.remove('collapsed');
    renderAll();
  }

  function toggleCompareMode(forceOff = false) {
    if (forceOff || state.compareMode) {
      state.compareMode = false;
      state.activeRootB = null;
    } else {
      state.compareMode = true;
      // Pick a smart default partner for activeRootA
      const defaultPartners = {
        wewa: 'kulam',
        kulam: 'wewa',
        wela: 'wella',
        wella: 'wela',
        gama: 'ur',
        ur: 'gama',
        uda: 'palle',
        palle: 'uda',
        tota: 'turai',
        turai: 'tota',
        duwa: 'tivu',
        tivu: 'duwa',
        kanda: 'malai',
        malai: 'kanda',
        maha: 'kuda',
        kuda: 'maha',
        rat: 'kalu',
      };
      state.activeRootB = defaultPartners[state.activeRootA] || (state.activeRootA === 'kulam' ? 'wewa' : 'kulam');
    }
    updateCompareToggleUI();
    renderAll();
  }

  function updateCompareToggleUI() {
    dom.compareToggle.classList.toggle('active', state.compareMode);
    dom.compareToggleLabel.textContent = state.compareMode ? 'Compare: On' : 'Compare: Off';
  }

  function updatePresetStates() {
    document.querySelectorAll('.preset-pill').forEach((btn) => {
      const isMatch =
        state.compareMode &&
        ((btn.dataset.a === state.activeRootA && btn.dataset.b === state.activeRootB) ||
          (btn.dataset.b === state.activeRootA && btn.dataset.a === state.activeRootB));
      btn.classList.toggle('active', isMatch);
    });
  }

  function selectPlace(pid, shouldFly = true) {
    const place = state.placesById[pid];
    if (!place) return;
    state.selectedPlaceId = pid;
    dom.inspectorCard.classList.remove('collapsed');

    // If the selected place isn't part of the current active root, switch activeRootA to its primary root so the map shows its family!
    const rootA = state.rootsById[state.activeRootA];
    const rootB = state.compareMode && state.activeRootB ? state.rootsById[state.activeRootB] : null;
    const inCurrent =
      (rootA && place[7].includes(rootA.idx)) ||
      (rootB && place[7].includes(rootB.idx));

    if (!inCurrent && place[7].length > 0) {
      state.compareMode = false;
      state.activeRootB = null;
      state.activeRootA = state.roots[place[7][0]].id;
      updateCompareToggleUI();
    }

    if (shouldFly && map) {
      map.flyTo(place[3], place[2], Math.max(map.zoom, 3.6));
    }
    renderAll();
  }

  function toggleDistrictFilter(dIdx) {
    if (state.districtFilter === dIdx) {
      state.districtFilter = null;
      dom.districtFilter.value = '';
      map.resetView();
    } else {
      state.districtFilter = dIdx;
      dom.districtFilter.value = String(dIdx);
      const d = state.districts[dIdx];
      map.flyTo(d.centroid[0], d.centroid[1], 2.5);
    }
    state.placesLimit = 120;
    renderAll();
  }

  function surpriseMe() {
    const famousIds = Object.keys(state.famous);
    const pick = Number(famousIds[Math.floor(Math.random() * famousIds.length)]);
    selectPlace(pick, true);
  }

  // ---- Search Engine ----
  function handleSearchInput() {
    const q = dom.searchInput.value.trim().toLowerCase();
    dom.searchClear.classList.toggle('hidden', q.length === 0);

    if (q.length < 1) {
      dom.searchResults.classList.add('hidden');
      return;
    }

    const qClean = q.replace(/^-|-$/g, '');

    // Match roots
    const rootHits = state.roots
      .filter((r) =>
        r.id.includes(qClean) ||
        r.label.toLowerCase().includes(q) ||
        r.gloss.toLowerCase().includes(q) ||
        r.script.includes(q) ||
        r.variants.some((v) => v.toLowerCase().includes(qClean))
      )
      .slice(0, 5);

    // Match places (startsWith prioritized over includes)
    const starts = [];
    const contains = [];
    for (const p of state.places) {
      const ln = p[1].toLowerCase();
      if (ln.startsWith(q)) {
        starts.push(p);
      } else if (ln.includes(q) || (p[8] && p[8].includes(q)) || (p[9] && p[9].includes(q))) {
        contains.push(p);
      }
      if (starts.length >= 12 && contains.length >= 12) break;
    }
    starts.sort((a, b) => b[10] - a[10] || b[5] - a[5] || a[1].localeCompare(b[1]));
    contains.sort((a, b) => b[10] - a[10] || b[5] - a[5] || a[1].localeCompare(b[1]));
    const placeHits = [...starts, ...contains].slice(0, 9);

    if (!rootHits.length && !placeHits.length) {
      dom.searchResults.innerHTML = `<div style="padding:14px;text-align:center;font-size:12.5px;color:var(--ink-muted);">No matching Sri Lankan places or name parts for “${escapeHtml(q)}”.</div>`;
      dom.searchResults.classList.remove('hidden');
      return;
    }

    let html = '';
    if (rootHits.length) {
      html += `<div class="search-group-label">Name Parts</div>`;
      html += rootHits
        .map((r) => `
          <button class="search-item" data-search-root="${r.id}">
            <div class="search-item-main">
              <span class="search-item-title">${escapeHtml(r.label)} <span style="font-weight:400;color:var(--ink-muted)">${escapeHtml(r.script)}</span></span>
              <span class="search-item-sub">${escapeHtml(r.gloss)}</span>
            </div>
            <span class="search-badge root-badge">${r.count} places</span>
          </button>
        `)
        .join('');
    }

    if (placeHits.length) {
      html += `<div class="search-group-label">Real Places in Sri Lanka</div>`;
      html += placeHits
        .map((p) => {
          const dist = state.districts[p[4]];
          const fam = state.famous[String(p[0])];
          return `
            <button class="search-item" data-search-pid="${p[0]}">
              <div class="search-item-main">
                <span class="search-item-title">${escapeHtml(p[1])}</span>
                <span class="search-item-sub">${escapeHtml(dist.name)} District${fam ? ` · “${escapeHtml(fam.meaning)}”` : ''}</span>
              </div>
              <span class="search-badge">${fam ? 'Notable' : 'GeoNames'}</span>
            </button>
          `;
        })
        .join('');
    }

    dom.searchResults.innerHTML = html;
    dom.searchResults.classList.remove('hidden');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ========================================================================
  // EVENT WIRING
  // ========================================================================
  function bindUIEvents() {
    // Tabs
    document.querySelectorAll('.tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.tab = btn.dataset.tab;
        document.querySelectorAll('.tab').forEach((t) => {
          const active = t.dataset.tab === state.tab;
          t.classList.toggle('active', active);
          t.setAttribute('aria-selected', String(active));
        });
        document.querySelectorAll('.panel').forEach((p) => {
          p.classList.toggle('active', p.id === `panel-${state.tab}`);
        });
      });
    });

    // Category Chips
    document.getElementById('cat-filters').addEventListener('click', (e) => {
      const chip = e.target.closest('.cat-chip');
      if (!chip) return;
      state.category = chip.dataset.cat;
      document.querySelectorAll('.cat-chip').forEach((c) => c.classList.toggle('active', c === chip));
      renderRootsList();
    });

    // Root Card Clicks
    dom.rootsList.addEventListener('click', (e) => {
      const card = e.target.closest('.root-card');
      if (!card) return;
      selectRoot(card.dataset.root);
    });

    // Compare Toggle & Presets
    dom.compareToggle.addEventListener('click', () => toggleCompareMode());
    document.getElementById('preset-pills').addEventListener('click', (e) => {
      const btn = e.target.closest('.preset-pill');
      if (!btn) return;
      applyComparePreset(btn.dataset.a, btn.dataset.b);
    });

    // Places List Clicks
    dom.placesList.addEventListener('click', (e) => {
      if (e.target.id === 'btn-load-more') {
        state.placesLimit += 150;
        renderPlacesList();
        return;
      }
      const row = e.target.closest('.place-row');
      if (!row) return;
      selectPlace(Number(row.dataset.pid), true);
    });

    // District Filter & Sort
    dom.districtFilter.addEventListener('change', () => {
      const v = dom.districtFilter.value;
      state.districtFilter = v === '' ? null : Number(v);
      state.placesLimit = 120;
      if (state.districtFilter !== null) {
        const d = state.districts[state.districtFilter];
        map.flyTo(d.centroid[0], d.centroid[1], 2.5);
      } else {
        map.resetView();
      }
      renderAll();
    });

    dom.sortPlaces.addEventListener('change', () => {
      state.sortBy = dom.sortPlaces.value;
      renderPlacesList();
    });

    // Active Banner clear district chip
    dom.activeBanner.addEventListener('click', (e) => {
      if (e.target.id === 'btn-clear-dist') {
        state.districtFilter = null;
        dom.districtFilter.value = '';
        map.resetView();
        renderAll();
      }
    });

    // Map Display Mode Segmented Control
    document.getElementById('viz-mode').addEventListener('click', (e) => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      state.vizMode = btn.dataset.mode;
      document.querySelectorAll('.seg-btn').forEach((b) => b.classList.toggle('active', b === btn));
      map.render();
    });

    dom.chkDistricts.addEventListener('change', () => {
      state.showDistricts = dom.chkDistricts.checked;
      map.render();
    });

    dom.chkCities.addEventListener('change', () => {
      state.showCities = dom.chkCities.checked;
      map.render();
    });

    // Zoom Buttons
    document.getElementById('zoom-in').addEventListener('click', () => map.zoomBy(1.45));
    document.getElementById('zoom-out').addEventListener('click', () => map.zoomBy(1 / 1.45));
    document.getElementById('zoom-reset').addEventListener('click', () => map.resetView());

    // Inspector Interactions
    dom.inspectorCollapse.addEventListener('click', () => {
      dom.inspectorCard.classList.toggle('collapsed');
    });

    dom.inspectorBody.addEventListener('click', (e) => {
      const dbar = e.target.closest('.dbar-row');
      if (dbar && dbar.dataset.didx !== '') {
        toggleDistrictFilter(Number(dbar.dataset.didx));
        return;
      }

      const exChip = e.target.closest('.example-chip');
      if (exChip) {
        selectPlace(Number(exChip.dataset.pid), true);
        return;
      }

      const morph = e.target.closest('[data-jump-root]');
      if (morph) {
        state.compareMode = false;
        state.activeRootB = null;
        updateCompareToggleUI();
        selectRoot(morph.dataset.jumpRoot);
        map.resetView();
        return;
      }

      if (e.target.id === 'btn-back-root') {
        state.selectedPlaceId = null;
        renderInspector();
        renderPlacesList();
        map.render();
        return;
      }

      if (e.target.id === 'btn-exit-compare') {
        toggleCompareMode(true);
      }
    });

    // Search
    dom.searchInput.addEventListener('input', handleSearchInput);
    dom.searchInput.addEventListener('focus', () => {
      if (dom.searchInput.value.trim()) handleSearchInput();
    });

    dom.searchClear.addEventListener('click', () => {
      dom.searchInput.value = '';
      dom.searchClear.classList.add('hidden');
      dom.searchResults.classList.add('hidden');
      dom.searchInput.focus();
    });

    dom.searchResults.addEventListener('click', (e) => {
      const rBtn = e.target.closest('[data-search-root]');
      if (rBtn) {
        state.compareMode = false;
        state.activeRootB = null;
        updateCompareToggleUI();
        selectRoot(rBtn.dataset.searchRoot);
        dom.searchResults.classList.add('hidden');
        dom.searchInput.value = '';
        dom.searchClear.classList.add('hidden');
        return;
      }

      const pBtn = e.target.closest('[data-search-pid]');
      if (pBtn) {
        selectPlace(Number(pBtn.dataset.searchPid), true);
        dom.searchResults.classList.add('hidden');
        dom.searchInput.value = '';
        dom.searchClear.classList.add('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrap')) {
        dom.searchResults.classList.add('hidden');
      }
    });

    // Surprise Me
    dom.btnSurprise.addEventListener('click', surpriseMe);
  }

  // ========================================================================
  // BOOTSTRAP
  // ========================================================================
  async function init() {
    try {
      const [districts, roots, placesData] = await Promise.all([
        fetch('data/districts.json').then((r) => r.json()),
        fetch('data/roots.json').then((r) => r.json()),
        fetch('data/places.json').then((r) => r.json()),
      ]);

      state.districts = districts;
      state.roots = roots;
      roots.forEach((r) => { state.rootsById[r.id] = r; });

      state.places = placesData.places;
      state.famous = placesData.famous;
      state.places.forEach((p) => { state.placesById[p[0]] = p; });

      dom.totalPlacesBadge.textContent = state.places.length.toLocaleString();
      dom.tabRootsCount.textContent = String(state.roots.length);

      // Populate District Select
      state.districts.forEach((d) => {
        const opt = document.createElement('option');
        opt.value = String(d.id);
        opt.textContent = `${d.name} (${d.province})`;
        dom.districtFilter.appendChild(opt);
      });

      map = new LankaMap(dom.canvas);
      bindUIEvents();
      renderAll();
    } catch (err) {
      console.error('Failed to load Lanka Toponyms data:', err);
      dom.inspectorBody.innerHTML = `<p style="color:#B54624;font-weight:600;">Could not load map datasets. Please reload.</p>`;
    }
  }

  init();
})();
