import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#faecff] w-full py-12 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="text-xl font-bold text-[#3a264b]">Connect</div>
          <p className="text-sm text-[#69537b] leading-relaxed">The premium marketplace for meaningful connections and professional services.</p>
        </div>
        <div>
          <h4 className="font-bold text-[#3a264b] mb-4">Platform</h4>
          <ul className="space-y-2">
            <li><Link className="text-sm text-[#69537b] hover:text-[#702ae1] transition-colors" href="/explore">Find a Pro</Link></li>
            <li><Link className="text-sm text-[#69537b] hover:text-[#702ae1] transition-colors" href="/signup">Be a Pro</Link></li>
            <li><Link className="text-sm text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">How it Works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#3a264b] mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><Link className="text-sm text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">Help Center</Link></li>
            <li><Link className="text-sm text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">Safety</Link></li>
            <li><Link className="text-sm text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">Trust &amp; Quality</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#3a264b] mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link className="text-sm text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">Privacy Policy</Link></li>
            <li><Link className="text-sm text-[#69537b] hover:text-[#702ae1] transition-colors" href="#">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-[#3a264b]/10 max-w-7xl mx-auto px-8 text-center md:text-left">
        <p className="text-sm text-[#69537b]">&copy; 2024 Connect Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
}
