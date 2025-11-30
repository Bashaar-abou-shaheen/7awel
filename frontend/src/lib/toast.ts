// src/lib/toast.ts

export function showSuccess(message: string) {
  if (typeof window !== 'undefined') {
    alert(`✅ ${message}`);
  } else {
    console.log('SUCCESS:', message);
  }
}

export function showError(message: string) {
  if (typeof window !== 'undefined') {
    alert(`❌ ${message}`);
  } else {
    console.error('ERROR:', message);
  }
}
