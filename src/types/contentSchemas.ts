// src/types/contentSchemas.ts
// EPEDE 2.0 Authoritative Content Schemas (Task T-201)
// Enforces technical provenance, normative standards, bilingual clarity, and didactic boundaries.

import { z } from 'zod';

export const BilingualTextSchema = z.object({
  fr: z.string().min(1, 'French text is required'),
  en: z.string().min(1, 'English text is required'),
});
export type BilingualText = z.infer<typeof BilingualTextSchema>;

export const StandardReferenceSchema = z.object({
  standard: z.string().min(3, 'Standard code required (e.g. IEC 60909-0:2016)'),
  clause: z.string().min(1, 'Clause reference required (e.g. Clause 4.3.2)'),
  title: BilingualTextSchema,
  normativeType: z.enum(['IEC', 'IEEE', 'NF_C', 'ISO', 'EN', 'ARSEL_NATIONAL']),
  editionYear: z.number().int().min(1970).max(2030),
  url: z.string().url().optional(),
});
export type StandardReference = z.infer<typeof StandardReferenceSchema>;

export const InputParameterSchema = z.object({
  symbol: z.string().min(1),
  unit: z.string().min(1),
  value: z.number(),
  description: BilingualTextSchema,
  tolerance: z.string().optional(),
});
export type InputParameter = z.infer<typeof InputParameterSchema>;

export const SolutionStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  title: BilingualTextSchema,
  governingFormula: z.string().min(1),
  substitutionAndCalculation: z.string().min(1),
  resultWithUnit: z.string().min(1),
  explanation: BilingualTextSchema,
});
export type SolutionStep = z.infer<typeof SolutionStepSchema>;

export const WorkedExampleSchema = z.object({
  id: z.string().min(2),
  domainCode: z.string().regex(/^D(0[1-9]|1[0-6])$/, 'Must be canonical domain D01-D16'),
  title: BilingualTextSchema,
  problemStatement: BilingualTextSchema,
  primaryStandard: StandardReferenceSchema,
  inputs: z.array(InputParameterSchema).min(1, 'At least one input parameter required'),
  steps: z.array(SolutionStepSchema).min(1, 'At least one step required'),
  finalVerification: BilingualTextSchema,
  didacticNotice: z.string().default(
    'Didactic worked example for instructional purposes. Sizing for real facilities requires site engineering study.'
  ),
});
export type WorkedExample = z.infer<typeof WorkedExampleSchema>;

export const CanonicalPowerStageSchema = z.object({
  id: z.string().min(1),
  stageNumber: z.string().regex(/^\d{2}$/, 'Two digits (e.g. 01)'),
  stageKey: z.enum([
    'generation',
    'step-up',
    'transmission',
    'primary-substation',
    'mv-distribution',
    'secondary-substation',
    'tgbt-installations',
    'motor-control',
    'final-loads',
  ]),
  journeyStageId: z.enum([
    'generation',
    'switchyard',
    'transmission',
    'substation',
    'distribution',
    'consumption',
  ]),
  domainCode: z.string().regex(/^D(0[1-9]|1[0-6])$/),
  voltage: z.string().min(1),
  title: BilingualTextSchema,
  shortTitle: BilingualTextSchema,
  physicalPrinciple: BilingualTextSchema,
  purpose: BilingualTextSchema,
  keyEquipment: z.array(z.string()).min(1),
  cameroonContext: BilingualTextSchema,
  imageUrl: z.string().min(1),
  upstreamStageId: z.string().optional(),
  downstreamStageId: z.string().optional(),
});
export type ValidatedCanonicalPowerStage = z.infer<typeof CanonicalPowerStageSchema>;

export const CameroonGridAssetSchema = z.object({
  assetId: z.string().min(2),
  name: z.string().min(2),
  category: z.enum([
    'HYDRO_PLANT',
    'GAS_THERMAL',
    'HEAVY_FUEL_THERMAL',
    'SOLAR_PV',
    'TRANSMISSION_LINE',
    'PRIMARY_SUBSTATION',
    'REGIONAL_INTERCONNECTOR',
  ]),
  gridSubsystem: z.enum(['RIS', 'RIN', 'RIE', 'ISOLATED']),
  nominalVoltageKv: z.number().positive(),
  installedCapacityMvaOrMw: z.number().positive(),
  status: z.enum(['COMMISSIONED', 'UNDER_CONSTRUCTION', 'PLANNED']),
  commissioningYear: z.number().int().min(1950).max(2035),
  ownerOperator: z.enum(['ENEO', 'SONATREL', 'EDC', 'NHPC', 'GLOBELEQ', 'ALUCAM', 'INDEPENDENT']),
  primarySourceCitation: z.string().min(5, 'Must cite primary document (e.g. SONATREL RPT 2024, ARSEL 2023)'),
  dataAsOfDate: z.string().regex(/^\d{4}(-\d{2})?$/, 'YYYY or YYYY-MM date'),
});
export type CameroonGridAsset = z.infer<typeof CameroonGridAssetSchema>;

