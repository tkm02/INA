export default function Home() {
  if (typeof window !== 'undefined') {
    window.location.href = '/onboarding';
  }
  return null;
}
