import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="text-2xl font-bold mb-5 block">
            Game<span className="text-red-600">Tech</span>
          </Link>
          <p className="text-gray-400 leading-relaxed mb-5">
            Your ultimate destination for discovering, tracking, and exploring the world of gaming. We bring you the latest news, reviews, and updates.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:-translate-y-1">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:-translate-y-1">
              <Twitter size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:-translate-y-1">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:-translate-y-1">
              <Youtube size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:-translate-y-1">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xl mb-5 relative pb-2">
            Categories
            <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-red-600"></span>
          </h3>
          <ul className="space-y-2">
            <li><Link href="/category/action" className="text-gray-400 hover:text-red-600 transition-colors">Action</Link></li>
            <li><Link href="/category/adventure" className="text-gray-400 hover:text-red-600 transition-colors">Adventure</Link></li>
            <li><Link href="/category/rpg" className="text-gray-400 hover:text-red-600 transition-colors">RPG</Link></li>
            <li><Link href="/category/shooter" className="text-gray-400 hover:text-red-600 transition-colors">Shooter</Link></li>
            <li><Link href="/category/strategy" className="text-gray-400 hover:text-red-600 transition-colors">Strategy</Link></li>
            <li><Link href="/category/sports" className="text-gray-400 hover:text-red-600 transition-colors">Sports</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl mb-5 relative pb-2">
            Platforms
            <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-red-600"></span>
          </h3>
          <ul className="space-y-2">
            <li><Link href="/platform/pc" className="text-gray-400 hover:text-red-600 transition-colors">PC</Link></li>
            <li><Link href="/platform/playstation" className="text-gray-400 hover:text-red-600 transition-colors">PlayStation</Link></li>
            <li><Link href="/platform/xbox" className="text-gray-400 hover:text-red-600 transition-colors">Xbox</Link></li>
            <li><Link href="/platform/nintendo" className="text-gray-400 hover:text-red-600 transition-colors">Nintendo</Link></li>
            <li><Link href="/platform/mobile" className="text-gray-400 hover:text-red-600 transition-colors">Mobile</Link></li>
            <li><Link href="/platform/vr" className="text-gray-400 hover:text-red-600 transition-colors">VR</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl mb-5 relative pb-2">
            Company
            <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-red-600"></span>
          </h3>
          <ul className="space-y-2">
            <li><Link href="/about" className="text-gray-400 hover:text-red-600 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-red-600 transition-colors">Contact</Link></li>
            <li><Link href="/careers" className="text-gray-400 hover:text-red-600 transition-colors">Careers</Link></li>
            <li><Link href="/privacy" className="text-gray-400 hover:text-red-600 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-gray-400 hover:text-red-600 transition-colors">Terms of Service</Link></li>
            <li><Link href="/faq" className="text-gray-400 hover:text-red-600 transition-colors">FAQ</Link></li>
          </ul>
        </div>
      </div>

      <div className="text-center pt-8 mt-8 border-t border-[#333] text-gray-400 text-sm">
        © 2025 GameTech. All rights reserved. All trademarks are property of their respective owners.
      </div>
    </footer>
  );
}
