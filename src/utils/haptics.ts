// Mobile Haptic Feedback helper using navigator.vibrate

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'reveal' | 'imposter') {
  if (typeof window === 'undefined' || !navigator.vibrate) return;

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(15);
        break;
      case 'medium':
        navigator.vibrate(35);
        break;
      case 'heavy':
        navigator.vibrate(60);
        break;
      case 'reveal':
        // Double pulse for suspense
        navigator.vibrate([40, 60, 80]);
        break;
      case 'imposter':
        // Dramatic triple pulse
        navigator.vibrate([70, 50, 70, 50, 120]);
        break;
    }
  } catch {
    // Ignore devices that block vibration without user gesture
  }
}
