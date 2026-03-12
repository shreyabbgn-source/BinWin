import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-emerald-900">Support & Contact</h1>
        <p className="text-emerald-600">Have questions or found a broken bin? We're here to help.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Mail, title: 'Email Us', detail: 'support@binwin.eco', color: 'bg-blue-50 text-blue-600' },
          { icon: Phone, title: 'Call Us', detail: '+1 (555) 000-1234', color: 'bg-emerald-50 text-emerald-600' },
          { icon: MapPin, title: 'Office', detail: 'Eco Park, Green St, NY', color: 'bg-purple-50 text-purple-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm text-center">
            <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <item.icon size={24} />
            </div>
            <h3 className="font-bold text-emerald-900">{item.title}</h3>
            <p className="text-sm text-emerald-500 mt-1">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="p-8 md:p-12 flex-1 space-y-6">
          <h2 className="text-2xl font-bold text-emerald-900">Send us a message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-600 uppercase">Full Name</label>
                <input type="text" className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-600 uppercase">Email Address</label>
                <input type="email" className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-600 uppercase">Subject</label>
              <select className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option>General Inquiry</option>
                <option>Report Broken Bin</option>
                <option>Reward Issue</option>
                <option>Partnership</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-600 uppercase">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
              <Send size={20} />
              <span>Send Message</span>
            </button>
          </form>
        </div>
        <div className="bg-emerald-900 p-8 md:p-12 md:w-80 text-white flex flex-col justify-between">
          <div>
            <MessageSquare className="w-12 h-12 text-emerald-400 mb-6" />
            <h3 className="text-xl font-bold mb-4">Live Chat</h3>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Our support team is available Mon-Fri, 9am-6pm EST. Average response time is under 10 minutes.
            </p>
          </div>
          <button className="mt-8 bg-white text-emerald-900 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
}
