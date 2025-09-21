export const getUserAgentDeviceInfo = (userAgent?: string) => {
  if (!userAgent)
    return { device: 'Unknown Device', browser: 'Unknown Browser' };

  let device = 'Desktop';
  let browser = 'Unknown Browser';

  const ua = userAgent.toLowerCase();

  // Device detection
  if (
    ua.includes('mobile') ||
    ua.includes('android') ||
    ua.includes('iphone')
  ) {
    device = 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    device = 'Tablet';
  }

  // Browser detection
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';

  return { device, browser };
};
