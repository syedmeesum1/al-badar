/* ==========================================================================
   AL-BADAR HOSIERY - Interactive Yarn Yield & Wholesale Cost Calculator
   Calculates exact yarn bags, cones, lead time, and PKR wholesale quotes
   ========================================================================== */

(function () {
  // Specs database
  const garmentSpecs = {
    'rib-vest': {
      name: "Men's Premium Ribbed Vest (Baniyan)",
      kgPerDozen: 1.45,
      baseStitchingCostPerDozen: 480,
      baseKnittingCostPerKg: 120,
      dyeingFinishingPerKg: 140,
      defaultGSM: '175-180 GSM'
    },
    'cotton-brief': {
      name: "Combed Cotton Elastic Briefs",
      kgPerDozen: 0.95,
      baseStitchingCostPerDozen: 520,
      baseKnittingCostPerKg: 130,
      dyeingFinishingPerKg: 150,
      defaultGSM: '160-170 GSM'
    },
    'boxer-short': {
      name: "Comfort Fit Knit Boxer Shorts",
      kgPerDozen: 1.65,
      baseStitchingCostPerDozen: 650,
      baseKnittingCostPerKg: 125,
      dyeingFinishingPerKg: 140,
      defaultGSM: '180 GSM Single Jersey'
    },
    'thermal-set': {
      name: "Winter Thermal Top & Bottom Suit",
      kgPerDozen: 4.80,
      baseStitchingCostPerDozen: 1250,
      baseKnittingCostPerKg: 140,
      dyeingFinishingPerKg: 160,
      defaultGSM: '240 GSM Brushed Interlock'
    },
    'polo-shirt': {
      name: "Combed Cotton Pique Polo Shirt",
      kgPerDozen: 3.20,
      baseStitchingCostPerDozen: 1100,
      baseKnittingCostPerKg: 135,
      dyeingFinishingPerKg: 170,
      defaultGSM: '210-220 GSM Pique'
    }
  };

  const yarnCountRates = {
    '20s-carded': { name: '20/1 Carded Cotton', ratePerKg: 820 },
    '30s-combed': { name: '30/1 Combed Cotton', ratePerKg: 940 },
    '40s-compact': { name: '40/1 Compact Super Combed', ratePerKg: 1120 }
  };

  const packagingRates = {
    'bulk-carton': { name: 'Wholesale Master Carton (10 Dozen Pack)', costPerDozen: 60 },
    'luxury-box': { name: 'Individual Al-Badar Gold-Foil Gift Box', costPerDozen: 240 },
    'export-poly': { name: 'Export Polybag with Barcode Hanger', costPerDozen: 110 }
  };

  // DOM elements
  const garmentSelect = document.getElementById('calc-garment');
  const yarnSelect = document.getElementById('calc-yarn');
  const qtyInput = document.getElementById('calc-qty');
  const qtyDisplay = document.getElementById('calc-qty-display');
  const packagingSelect = document.getElementById('calc-packaging');

  // Outputs
  const outTotalKg = document.getElementById('out-yarn-kg');
  const outYarnBags = document.getElementById('out-yarn-bags');
  const outYarnCones = document.getElementById('out-yarn-cones');
  const outLeadTime = document.getElementById('out-lead-time');
  const outPerDozenPKR = document.getElementById('out-per-dozen-pkr');
  const outTotalPKR = document.getElementById('out-total-pkr');
  const btnWhatsAppCalc = document.getElementById('btn-whatsapp-calc');

  function calculate() {
    if (!garmentSelect || !yarnSelect || !qtyInput) return;

    const gKey = garmentSelect.value;
    const yKey = yarnSelect.value;
    const pKey = packagingSelect.value;
    const dozens = parseInt(qtyInput.value) || 200;

    const gInfo = garmentSpecs[gKey] || garmentSpecs['rib-vest'];
    const yInfo = yarnCountRates[yKey] || yarnCountRates['30s-combed'];
    const pInfo = packagingRates[pKey] || packagingRates['bulk-carton'];

    // Update quantity display
    if (qtyDisplay) {
      qtyDisplay.textContent = dozens.toLocaleString() + ' Dozen (' + (dozens * 12).toLocaleString() + ' Pieces)';
    }

    // Calculations
    const fabricWasteMultiplier = 1.07; // 7% yarn to knitting/cutting wastage
    const netFabricKg = dozens * gInfo.kgPerDozen;
    const grossYarnKg = netFabricKg * fabricWasteMultiplier;

    // 1 Cotton Bag in Pakistan standard = 100 lbs = 45.359 kg (contains 24 cones of ~1.89 kg each)
    const bagsRequired = Math.ceil(grossYarnKg / 45.36);
    const conesRequired = bagsRequired * 24;

    // Production lead time: capacity approx 150 dozen / day on standard line
    const knittingDays = Math.ceil(grossYarnKg / 400); // 400kg per loom day
    const stitchingDays = Math.ceil(dozens / 120);
    const totalLeadDays = Math.max(knittingDays + stitchingDays + 2, 4);

    // Costing per dozen
    const yarnCostPerDozen = (gInfo.kgPerDozen * fabricWasteMultiplier) * yInfo.ratePerKg;
    const knittingCostPerDozen = gInfo.kgPerDozen * gInfo.baseKnittingCostPerKg;
    const dyeingCostPerDozen = gInfo.kgPerDozen * gInfo.dyeingFinishingPerKg;
    const stitchingCostPerDozen = gInfo.baseStitchingCostPerDozen;
    const packCostPerDozen = pInfo.costPerDozen;

    const factoryCostPerDozen = yarnCostPerDozen + knittingCostPerDozen + dyeingCostPerDozen + stitchingCostPerDozen + packCostPerDozen;
    const wholesaleMargin = 1.15; // 15% wholesale margin
    const pricePerDozen = Math.round(factoryCostPerDozen * wholesaleMargin / 10) * 10;
    const totalQuotationPKR = pricePerDozen * dozens;

    // Render outputs
    if (outTotalKg) outTotalKg.textContent = Math.round(grossYarnKg).toLocaleString() + ' kg';
    if (outYarnBags) outYarnBags.textContent = bagsRequired + ' Bags';
    if (outYarnCones) outYarnCones.textContent = conesRequired.toLocaleString() + ' Cones';
    if (outLeadTime) outLeadTime.textContent = totalLeadDays + ' Working Days';
    if (outPerDozenPKR) outPerDozenPKR.textContent = 'Rs. ' + pricePerDozen.toLocaleString() + ' / Dozen';
    if (outTotalPKR) outTotalPKR.textContent = 'Rs. ' + totalQuotationPKR.toLocaleString();

    // Prepare direct WhatsApp inquiry link
    if (btnWhatsAppCalc) {
      const message = encodeURIComponent(
        `Assalam-o-Alaikum Al-Badar Hosiery Team,\n\n` +
        `Main Al-Badar Hosiery ke Online Portal se wholesale bulk quotation lena chahta hoon:\n` +
        `• Product: ${gInfo.name}\n` +
        `• Yarn Spec: ${yInfo.name}\n` +
        `• Order Volume: ${dozens} Dozen (${dozens * 12} pcs)\n` +
        `• Packaging: ${pInfo.name}\n` +
        `• Estimated Yarn: ${Math.round(grossYarnKg)} kg (${bagsRequired} Bags)\n` +
        `• Est. Quotation: Rs. ${pricePerDozen.toLocaleString()}/Dozen (Total: Rs. ${totalQuotationPKR.toLocaleString()})\n\n` +
        `Meharbani karke Quaid-e-Azam Market Faisalabad office se delivery date aur sample confirmation schedule share karein.`
      );
      btnWhatsAppCalc.href = `https://wa.me/923007664070?text=${message}`;
    }
  }

  // Attach event listeners
  if (garmentSelect) garmentSelect.addEventListener('change', calculate);
  if (yarnSelect) yarnSelect.addEventListener('change', calculate);
  if (packagingSelect) packagingSelect.addEventListener('change', calculate);
  if (qtyInput) qtyInput.addEventListener('input', calculate);

  // Initial run
  calculate();
})();
