export const demoProgramBanners = {
  BCOMP: '/program/hero-banner-computer-science.jpg',
  'BENG-SW': '/program/hero-banner-software-engineer.jpg',
  BDS: '/program/hero-banner-data-science.jpg',
  BCYBER: '/program/hero-banner-cyber-security.jpg',
};

const fallbackThemes = [
  'linear-gradient(135deg, #140f50 0%, #1e1870 52%, #314191 100%)',
  'linear-gradient(135deg, #0f3d5e 0%, #155e75 55%, #1d7f8c 100%)',
  'linear-gradient(135deg, #3f234d 0%, #5f2f73 55%, #7a4491 100%)',
  'linear-gradient(135deg, #1f4a3d 0%, #23634e 52%, #2f7d62 100%)',
  'linear-gradient(135deg, #4c2e14 0%, #744116 52%, #9b5b1e 100%)',
];

export function getProgramBanner(program) {
  if (!program) return '';
  return program.banner_url || demoProgramBanners[program.code] || '';
}

export function hasProgramBanner(program) {
  return Boolean(getProgramBanner(program));
}

export function getFallbackTheme(program) {
  const key = `${program?.faculty || ''}${program?.level || ''}${program?.code || ''}`;
  const index = key.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % fallbackThemes.length;
  return fallbackThemes[index];
}

export function getProgramMediaStyle(program) {
  const banner = getProgramBanner(program);
  if (banner) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(20, 15, 80, 0.08), rgba(20, 15, 80, 0.4)), url(${banner})`,
    };
  }

  return {
    background: getFallbackTheme(program),
  };
}
