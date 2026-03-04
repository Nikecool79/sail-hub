import OptimistBoat from '@/components/OptimistBoat';
import WaveDivider from '@/components/WaveDivider';

const tiers = [
  { name: 'Gold', price: '500 SEK/month', color: '#D4AF37', boatSize: 56, benefits: ['Logo on all event pages', 'Featured card on Dashboard', 'News feed sponsored posts', 'Footer ribbon placement', 'Social media mentions'] },
  { name: 'Silver', price: '300 SEK/month', color: '#9CA3AF', boatSize: 40, benefits: ['Sidebar sponsor rotation', 'Footer ribbon placement', 'Logo on Sponsors page', 'Social media mention (quarterly)'] },
  { name: 'Bronze', price: '150 SEK/month', color: '#B45309', boatSize: 28, benefits: ['Logo on Sponsors page', 'Footer ribbon placement'] },
];

const BecomeSponsor = () => (
  <div className="space-y-8">
    {/* Hero */}
    <div className="relative rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-10 text-center overflow-hidden">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Support Local Youth Sailing</h1>
      <p className="text-lg text-muted-foreground">Stöd lokal ungdomssegling</p>
      <WaveDivider className="absolute bottom-0 left-0" />
    </div>

    {/* Tiers */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map(tier => (
        <div key={tier.name} className="rounded-xl border-2 border-dashed p-6 text-center card-hover" style={{ borderColor: tier.color }}>
          <OptimistBoat size={tier.boatSize} color={tier.color} className="mx-auto mb-3" />
          <h2 className="font-heading text-xl font-bold mb-1" style={{ color: tier.color }}>{tier.name}</h2>
          <p className="font-heading text-2xl font-bold mb-4">{tier.price}</p>
          <ul className="text-sm text-left space-y-2">
            {tier.benefits.map(b => (
              <li key={b} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: tier.color }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Contact */}
    <div className="rounded-xl bg-card border p-6 max-w-lg mx-auto">
      <h2 className="font-heading text-lg font-semibold mb-4 text-center">Interested? Get in touch</h2>
      <div className="space-y-3">
        <input placeholder="Your name" className="w-full px-3 py-2 rounded-md border bg-background text-sm" />
        <input placeholder="Business name" className="w-full px-3 py-2 rounded-md border bg-background text-sm" />
        <input placeholder="your@email.com" type="email" className="w-full px-3 py-2 rounded-md border bg-background text-sm" />
        <textarea placeholder="Message..." rows={3} className="w-full px-3 py-2 rounded-md border bg-background text-sm resize-none" />
        <button className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Send Message
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-3">Or email us at ads@klubben.se</p>
    </div>
  </div>
);

export default BecomeSponsor;
