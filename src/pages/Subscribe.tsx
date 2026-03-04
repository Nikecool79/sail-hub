import { Bell, MessageCircle, Facebook, Instagram } from 'lucide-react';

const Subscribe = () => (
  <div className="space-y-8 max-w-2xl mx-auto">
    <h1 className="font-heading text-2xl font-bold text-center">Subscribe & Alerts</h1>

    {/* Email signup */}
    <div className="rounded-xl bg-card border p-6 team-border-top">
      <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
        <Bell size={18} className="text-primary" />
        Email Updates
      </h2>
      <div className="space-y-3">
        <input placeholder="Your name" className="w-full px-3 py-2 rounded-md border bg-background text-sm" />
        <input placeholder="your@email.com" type="email" className="w-full px-3 py-2 rounded-md border bg-background text-sm" />
        <select className="w-full px-3 py-2 rounded-md border bg-background text-sm">
          <option>All Teams</option>
          <option>Green Team</option>
          <option>Blue Team</option>
          <option>Red Team</option>
        </select>
        <button className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Subscribe
        </button>
      </div>
    </div>

    {/* Push notifications */}
    <div className="rounded-xl bg-card border p-6">
      <h2 className="font-heading text-lg font-semibold mb-2">Push Notifications</h2>
      <p className="text-sm text-muted-foreground mb-3">Get browser notifications for new events and cancellations.</p>
      <div className="flex items-center justify-between">
        <span className="text-sm">Enable notifications</span>
        <div className="w-12 h-6 rounded-full bg-muted relative cursor-pointer">
          <div className="w-5 h-5 rounded-full bg-card shadow absolute top-0.5 left-0.5 transition-transform" />
        </div>
      </div>
    </div>

    {/* WhatsApp */}
    <div className="rounded-xl bg-card border p-6">
      <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
        <MessageCircle size={18} />
        WhatsApp Groups
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Green Team', bg: 'bg-green-600 hover:bg-green-700' },
          { label: 'Blue Team', bg: 'bg-blue-600 hover:bg-blue-700' },
          { label: 'Red Team', bg: 'bg-red-600 hover:bg-red-700' },
          { label: 'All Club', bg: 'bg-emerald-600 hover:bg-emerald-700' },
        ].map(g => (
          <button key={g.label} className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${g.bg}`} style={{ color: 'white' }}>
            <MessageCircle size={14} className="inline mr-1.5" />
            {g.label}
          </button>
        ))}
      </div>
    </div>

    {/* Social */}
    <div className="flex justify-center gap-3">
      <button className="p-3 rounded-md border hover:bg-secondary transition-colors" aria-label="Facebook">
        <Facebook size={20} />
      </button>
      <button className="p-3 rounded-md border hover:bg-secondary transition-colors" aria-label="Instagram">
        <Instagram size={20} />
      </button>
    </div>
  </div>
);

export default Subscribe;
