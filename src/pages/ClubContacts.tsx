import { contacts } from '@/data/sampleData';
import { Phone, Mail } from 'lucide-react';
import WaveDivider from '@/components/WaveDivider';

const ClubContacts = () => (
  <div className="space-y-6">
    {/* Welcome banner */}
    <div className="relative rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-8 text-center overflow-hidden">
      <h1 className="font-heading text-3xl font-bold mb-2">Welcome to the club!</h1>
      <p className="text-lg text-muted-foreground">Välkommen till klubben!</p>
      <WaveDivider className="absolute bottom-0 left-0" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map(c => (
        <div key={c.name} className="rounded-xl bg-card border p-5 card-hover" style={{ borderLeft: '3px solid hsl(var(--ocean-blue))' }}>
          <p className="font-heading font-semibold">{c.name}</p>
          <p className="text-sm text-muted-foreground mb-3">{c.role}</p>
          <div className="flex flex-col gap-1 text-sm">
            <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-primary hover:underline">
              <Phone size={14} /> {c.phone}
            </a>
            <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-primary hover:underline">
              <Mail size={14} /> {c.email}
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ClubContacts;
