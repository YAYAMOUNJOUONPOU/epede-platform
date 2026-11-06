// src/components/common/EditorialImage.tsx
// Art-directed responsive image component for EPEDE ProCode Editorial Redesign

import React from 'react';
import { EDITORIAL_ASSET_MANIFEST, type EditorialAssetEntry } from '../../data/assets/editorialAssetManifest';

interface EditorialImageProps {
  assetId?: string;
  asset?: EditorialAssetEntry;
  src?: string;
  mobileSrc?: string;
  alt?: string;
  locale?: 'en' | 'fr';
  priority?: boolean;
  decorative?: boolean;
  aspectRatio?: string;
  className?: string;
  imgClassName?: string;
  showCredit?: boolean;
  fit?: 'cover' | 'contain';
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  assetId,
  asset: propAsset,
  src: propSrc,
  mobileSrc: propMobileSrc,
  alt: propAlt,
  locale = 'en',
  priority = false,
  decorative = false,
  aspectRatio,
  className = '',
  imgClassName = '',
  showCredit = false,
  fit = 'cover',
}) => {
  const entry = propAsset || (assetId ? EDITORIAL_ASSET_MANIFEST[assetId] : undefined);
  const resolvedSrc = propSrc || entry?.src || '/images/homepage_uploads/batch_07_image_031_hydro_turbine_hall.jpg';
  const resolvedMobileSrc = propMobileSrc || entry?.mobileSrc;
  const resolvedAlt = decorative
    ? ''
    : propAlt ?? (entry ? entry.alt[locale] : 'Electrical power engineering infrastructure');
  const resolvedRatio = aspectRatio || entry?.aspectRatio;
  const focalDesktop = entry?.focalDesktop || '50% 50%';

  return (
    <figure
      className={`relative overflow-hidden bg-[#E9E5DA] m-0 ${className}`}
      style={resolvedRatio ? { aspectRatio: resolvedRatio } : undefined}
    >
      <picture className="block w-full h-full">
        {resolvedMobileSrc && (
          <source media="(max-width: 767px)" srcSet={resolvedMobileSrc} />
        )}
        <img
          src={resolvedSrc}
          alt={resolvedAlt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          className={`w-full h-full block epede-photo-grade ${
            fit === 'contain' ? 'object-contain' : 'object-cover'
          } ${imgClassName}`}
          style={{ objectPosition: focalDesktop }}
        />
      </picture>
      {showCredit && entry?.credit && (
        <figcaption className="mt-2 font-mono text-[11px] text-[#5C6C70] leading-snug">
          {entry.credit}
        </figcaption>
      )}
    </figure>
  );
};

