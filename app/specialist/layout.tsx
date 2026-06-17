import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'INA — Espace Spécialiste',
  description: 'Tableau de bord de suivi des patients assisté par IA',
};

export default function SpecialistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
