import Image from "next/image";
import Link from "next/link";

export function FeaturedPros() {
  return (
    <section className="py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface mb-4">Top-rated Professionals</h2>
            <p className="text-on-surface-variant">Hand-picked experts with a proven track record of excellence.</p>
          </div>
          <Link href="/explore" className="text-primary font-bold flex items-center space-x-2 group">
            <span>View all professionals</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Featured Pro 1 (Large) */}
          <div className="md:col-span-8 bg-surface-container-low rounded-lg p-8 flex flex-col md:flex-row gap-8 items-center border border-transparent hover:border-primary/20 transition-all">
            <Image 
              width={192} height={192}
              className="w-48 h-48 rounded-lg object-cover shadow-lg" 
              alt="close-up portrait of a woman graphic designer with creative glasses in a colorful studio" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhejJ3iKTW2SFo0GLEkz52PMxXXr_b6VQzKWVrSFaGOD-k2D0SJFeCm45oW1GbUw0ZYYTNd-h9FmoP0i7DN0o9G-Z_6e4wZoJ7O207uxg9VXyXOuyC7XiOL7LwnUgTV-1acUqsZg4K8MDzx9jcQQ-fW0pXJVAxdvzDl5JH76eHAwIM0vb7g7HjlMUKlxLA7otobiqoGdw9G-y2EYAgR5mceFvvyEY2rey_us17PnUkvc6PDwJEHT5lkIwIFZHILAjtnWKMSM5hs3Y" 
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Top Rated Plus</span>
                <div className="flex items-center text-primary">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  <span className="font-bold ml-1">5.0</span>
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-on-surface mb-2">Elena Rodriguez</h3>
              <p className="text-primary font-bold mb-4">Senior UI/UX Designer</p>
              <p className="text-on-surface-variant mb-6 leading-relaxed">Helping startups build human-centered digital products that scale. 10+ years experience in fintech and healthcare UI.</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-surface-container-highest px-4 py-2 rounded-full text-sm font-medium">Figma Expert</span>
                <span className="bg-surface-container-highest px-4 py-2 rounded-full text-sm font-medium">Strategy</span>
                <span className="bg-surface-container-highest px-4 py-2 rounded-full text-sm font-medium">Design Systems</span>
              </div>
            </div>
          </div>
          
          {/* Featured Pro 2 */}
          <div className="md:col-span-4 bg-surface rounded-lg p-6 border border-outline-variant/15 flex flex-col hover:shadow-xl transition-all">
            <Image 
              width={64} height={64}
              className="w-16 h-16 rounded-full object-cover mb-4" 
              alt="portrait of a male full-stack developer in a casual setting with soft natural light" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb9znVFsG3oO1nd_JLgjAgiuXIUzs7jBuT7m3rTaaBNnjKxpwuu-1P2xze2GQbZUNFcqKOz5mHxFetmKlaSPL2dNdejcN1zbrbHgVbQ6Hg43VkjzyWzPAyzd6PScE6MvaSjMhbe8iUTAlKogrwpg_ULyr6FkNOiMKJZvsa67Tgu2OZQgzPUC9q7PAtEgj94zvUV-JOKqx37P-2d13A2OtIfrpfLKZ9yoLug6LRDTWeCA_f5KJaBIXTysyjNWyPqCt2__QPej4C36A" 
            />
            <div className="flex items-center text-primary mb-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
              <span className="font-bold ml-1">4.9</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">Marcus Chen</h3>
            <p className="text-on-surface-variant text-sm mb-4">Full-Stack Developer</p>
            <p className="text-on-surface-variant text-sm flex-1 leading-relaxed mb-6 italic">&quot;Expert in React, Node.js and scalable cloud architecture. Quick turnaround times.&quot;</p>
            <Link href="/explore" className="w-full text-center block bg-surface-container-highest text-primary py-3 rounded-full font-bold hover:bg-primary hover:text-on-primary transition-all">
              View Profile
            </Link>
          </div>
          
          {/* Featured Pro 3 */}
          <div className="md:col-span-4 bg-surface rounded-lg p-6 border border-outline-variant/15 flex flex-col hover:shadow-xl transition-all">
            <Image 
              width={64} height={64}
              className="w-16 h-16 rounded-full object-cover mb-4" 
              alt="professional woman digital marketer smiling confidently in a modern bright office environment" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEa1Fuip2ElzOdgU35LU1vvK9XzxVbSZz8mUyr0mzM3zEs6ZhUnoCXM-0puXmhquOCW2lPosVfbgJzgf6DyY1nwT8C7n0l-Ie0BdjP-FYGGHxLJgqeTwv6PLjH4INaPmr9q08WRIhw4nvYuMfvtPZ92OPjuDpLNdSuVhdqXGtYkcaa2YNqYo_vBj7JdcrvkWMz5bQltpC2_vEk0aTitI-I-n0UvmCBzETukKkXjhTPGtcECQ3QX4j_bgCRCaR9Jvo5hrcJ6ZPk1bI" 
            />
            <div className="flex items-center text-primary mb-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
              <span className="font-bold ml-1">4.8</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">Sarah Jenkins</h3>
            <p className="text-on-surface-variant text-sm mb-4">Digital Marketing Strategist</p>
            <p className="text-on-surface-variant text-sm flex-1 leading-relaxed mb-6 italic">&quot;SEO and Growth specialist. I help e-commerce brands double their organic traffic.&quot;</p>
            <Link href="/explore" className="w-full text-center block bg-surface-container-highest text-primary py-3 rounded-full font-bold hover:bg-primary hover:text-on-primary transition-all">
              View Profile
            </Link>
          </div>
          
          {/* Featured Pro 4 (Wide Content) */}
          <div className="md:col-span-8 bg-primary/5 rounded-lg p-8 flex flex-col justify-center">
            <h4 className="text-2xl font-bold text-primary mb-2">Want to join the elite?</h4>
            <p className="text-on-surface-variant mb-6 max-w-md">We&#39;re always looking for top-tier talent in design, development, and business services. Get vetted today.</p>
            <div className="flex space-x-4">
              <Link href="/signup" className="text-center block bg-gradient-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-sm active:scale-95 transition-all">
                Apply as a Pro
              </Link>
              <Link href="#" className="text-primary font-bold px-6 py-3 hover:bg-white rounded-full transition-all">
                Learn about vetting
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
