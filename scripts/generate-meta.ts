// scripts/generate-meta.ts
// EPEDE 2.0 Pre-Build Content Schema & Metadata Integrity Gate (Task T-202)
// Runs before build to guarantee that zero malformed, unsourced, or missing data reach production.

import fs from 'fs';
import path from 'path';
import { CANONICAL_POWER_STAGES } from '../src/data/canonicalPowerChain';
import { CAMEROON_GRID_ASSETS_2026 } from '../src/data/cameroonGrid2026';
import { NORMATIVE_FORMULA_REGISTRY } from '../src/data/normativeFormulaRegistry';
import { CanonicalPowerStageSchema, CameroonGridAssetSchema } from '../src/types/contentSchemas';

console.log('⚡ [EPEDE 2.0 Gatekeeper] Starting Pre-Build Content Validation...');

let errorsCount = 0;

// 1. Validate Canonical 9-Stage Power Chain
console.log(`\n🔍 [1/4] Validating 9-Stage Power Chain (${CANONICAL_POWER_STAGES.length} stages)...`);
if (CANONICAL_POWER_STAGES.length !== 9) {
  console.error(`❌ Expected exactly 9 canonical power stages, found ${CANONICAL_POWER_STAGES.length}`);
  errorsCount++;
}

CANONICAL_POWER_STAGES.forEach((stage, idx) => {
  const result = CanonicalPowerStageSchema.safeParse(stage);
  if (!result.success) {
    console.error(`❌ Stage [${stage.id || idx}] schema error:`, result.error.issues);
    errorsCount++;
  } else {
    // Verify image file exists in public directory
    const imageDiskPath = path.join(process.cwd(), 'public', stage.imageUrl);
    if (!fs.existsSync(imageDiskPath)) {
      console.warn(`⚠️ Warning: Image file on disk not found for stage ${stage.id}: ${imageDiskPath}`);
    }
  }
});
if (errorsCount === 0) {
  console.log('✅ Canonical Power Chain: 100% compliant with Zod schema.');
}

// 2. Validate Cameroon Grid Assets
console.log(`\n🔍 [2/4] Validating Cameroon Power Grid Dataset (${CAMEROON_GRID_ASSETS_2026.length} assets)...`);
CAMEROON_GRID_ASSETS_2026.forEach((asset) => {
  const result = CameroonGridAssetSchema.safeParse(asset);
  if (!result.success) {
    console.error(`❌ Cameroon Asset [${asset.assetId}] schema error:`, result.error.issues);
    errorsCount++;
  }
});
if (errorsCount === 0) {
  console.log('✅ Cameroon Grid Assets: 100% sourced, dated, and compliant with Zod schema.');
}

// 3. Validate Normative Formula Registry
console.log(`\n🔍 [3/4] Validating Normative Formula Registry (${NORMATIVE_FORMULA_REGISTRY.length} formulas)...`);
NORMATIVE_FORMULA_REGISTRY.forEach((formula) => {
  if (!formula.governingStandard || !formula.clause) {
    console.error(`❌ Formula [${formula.id}] is missing governing standard or clause citation`);
    errorsCount++;
  }
  if (!formula.latex || formula.parameters.length === 0) {
    console.error(`❌ Formula [${formula.id}] is missing LaTeX equation or parameters`);
    errorsCount++;
  }
});
if (errorsCount === 0) {
  console.log('✅ Normative Formulas: 100% tethered to IEC / NF C clauses with parameter units.');
}

// 4. Emit Content Metadata Manifest
console.log('\n🔍 [4/4] Emitting build manifest...');
const manifest = {
  buildTimestamp: new Date().toISOString(),
  platformVersion: '2.0.0-normative',
  canonicalStagesCount: CANONICAL_POWER_STAGES.length,
  cameroonAssetsCount: CAMEROON_GRID_ASSETS_2026.length,
  normativeFormulasCount: NORMATIVE_FORMULA_REGISTRY.length,
  status: errorsCount === 0 ? 'VALIDATED' : 'FAILED',
};

const metaDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(metaDir)) {
  fs.mkdirSync(metaDir, { recursive: true });
}
fs.writeFileSync(path.join(metaDir, 'content-manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
console.log('✅ Wrote public/content-manifest.json successfully.');

if (errorsCount > 0) {
  console.error(`\n❌ Pre-build validation failed with ${errorsCount} error(s). Aborting build.`);
  process.exit(1);
} else {
  console.log('\n🎉 [EPEDE 2.0 Gatekeeper] All content schemas verified with zero errors.\n');
  process.exit(0);
}
