/* ==========================================================================
   AL-BADAR HOSIERY - Interactive Production ERP Console Simulator
   Knitting floor metrics, stitching line output, and yarn stock ledger
   ========================================================================== */

(function () {
  // Tab Switching
  const tabs = document.querySelectorAll('.console-tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panes.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      const targetPane = document.getElementById(target);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // ERP State variables
  let state = {
    dailyKgKnit: 1420.5,
    dailyDozensStitched: 894,
    activeLooms: 14,
    totalLooms: 16,
    yarnBagsStock: 342,
    yarnConesStock: 8208,
    efficiencyRate: 96.8,
    simSpeed: 1,
    isPaused: false
  };

  // Live counter updater
  function tickMetrics() {
    if (state.isPaused) return;

    // Increment realistic values
    const kgIncrement = (Math.random() * 0.4 + 0.2) * state.simSpeed;
    state.dailyKgKnit += kgIncrement;

    if (Math.random() > 0.6) {
      state.dailyDozensStitched += 1 * state.simSpeed;
    }

    // Update DOM counters
    const kgElem = document.getElementById('erp-kg-knit');
    const dozensElem = document.getElementById('erp-dozens-stitched');
    const effElem = document.getElementById('erp-efficiency');
    const stockElem = document.getElementById('erp-yarn-stock');

    if (kgElem) kgElem.textContent = state.dailyKgKnit.toFixed(1);
    if (dozensElem) dozensElem.textContent = state.dailyDozensStitched.toLocaleString();
    if (effElem) effElem.textContent = (state.efficiencyRate + (Math.sin(Date.now() / 5000) * 0.4)).toFixed(1) + '%';
    if (stockElem) stockElem.textContent = state.yarnBagsStock.toLocaleString();

    // Subtle loom progress bar progression
    const fills = document.querySelectorAll('.loom-progress-fill');
    fills.forEach((fill, index) => {
      let currentWidth = parseFloat(fill.style.width) || (65 + index * 8);
      currentWidth = (currentWidth + 0.15 * state.simSpeed);
      if (currentWidth >= 100) {
        currentWidth = 15; // roll finished and unloaded!
        triggerRollCompleted(index + 1);
      }
      fill.style.width = currentWidth + '%';
    });
  }

  function triggerRollCompleted(loomId) {
    if (window.showToastNotification) {
      window.showToastNotification(`Loom #${loomId} fabric roll (50kg Combed Rib) completed & queued for Stitching floor!`, 'success');
    }
  }

  setInterval(tickMetrics, 1200);

  // Simulation interactive actions
  const btnScanBatch = document.getElementById('btn-sim-scan');
  const btnIssueYarn = document.getElementById('btn-sim-issue-yarn');
  const btnToggleFloor = document.getElementById('btn-sim-toggle');

  if (btnScanBatch) {
    btnScanBatch.addEventListener('click', () => {
      state.dailyDozensStitched += 5;
      const dozensElem = document.getElementById('erp-dozens-stitched');
      if (dozensElem) dozensElem.textContent = state.dailyDozensStitched.toLocaleString();

      // update table row
      const line2Count = document.getElementById('stitching-line2-count');
      if (line2Count) {
        let current = parseInt(line2Count.textContent) || 280;
        line2Count.textContent = (current + 5) + ' Dz';
      }

      if (window.showToastNotification) {
        window.showToastNotification('📱 QR Barcode Scanned: Bundle #ABH-9042 validated. +5 Dozen Vests credited to Line 2 (Master Aslam line)', 'info');
      }
    });
  }

  if (btnIssueYarn) {
    btnIssueYarn.addEventListener('click', () => {
      if (state.yarnBagsStock > 2) {
        state.yarnBagsStock -= 2;
        state.yarnConesStock -= 48;
        const stockElem = document.getElementById('erp-yarn-stock');
        if (stockElem) stockElem.textContent = state.yarnBagsStock.toLocaleString();

        const count30sElem = document.getElementById('yarn-count-30s-bags');
        if (count30sElem) {
          let cur = parseInt(count30sElem.textContent) || 165;
          count30sElem.textContent = (cur - 2) + ' Bags';
        }

        if (window.showToastNotification) {
          window.showToastNotification('🧵 Yarn Challan Issued: 2 Bags (48 Cones) 30/1 Combed Cotton dispatched to Circular Knitting Floor', 'success');
        }
      }
    });
  }

  if (btnToggleFloor) {
    btnToggleFloor.addEventListener('click', () => {
      state.isPaused = !state.isPaused;
      btnToggleFloor.innerHTML = state.isPaused
        ? '<i data-lucide="play"></i> Resume Production Floor'
        : '<i data-lucide="pause"></i> Pause Floor Sim';
      if (window.lucide) window.lucide.createIcons();

      if (window.showToastNotification) {
        window.showToastNotification(state.isPaused ? 'Floor simulation paused' : 'Floor simulation resumed live', 'warning');
      }
    });
  }
})();
