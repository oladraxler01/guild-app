import Image from "next/image";
import { SearchBar } from "./SearchBar";

export function Hero() {
  return (
    <section className="relative px-8 py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface leading-tight tracking-tight mb-6">
            Find the right pro for any job, <span className="text-primary">securely.</span>
          </h1>
          <p className="text-xl text-on-surface-variant mb-10 max-w-lg leading-relaxed">
            The human-centered marketplace for elite freelancers and specialized service providers. Trusted by thousands.
          </p>
          
          {/* Search Bar */}
          <SearchBar />
          
          <div className="mt-8 flex items-center space-x-6">
            <div className="flex -space-x-3">
              <Image 
                width={48} height={48}
                className="w-12 h-12 rounded-full border-4 border-surface object-cover" 
                alt="close-up portrait of a smiling professional woman in a modern office setting" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMez7IvNDXiWMGWs14-raZj6aog27_8C5VDLnUTdoC5uR0qxYEMdWZpvhn0hJAsPZNGxeQGpN4t_9Hv5ezPwm6srfU8B1myzQsq2suZDuZL2Ma1DCag5KGV5HtkM7Eif15uBroa2bDhdGoF1-syUB8rwJrMeaq1HkBYTajT19k89eSczkBTVzUaU1nYDDfaYvCpj7IDWLrfoZhqG9byckKwAsbjcngkHeIQPpWzNtGkBKFG5AZo4SslVi1UqdgVBPctsM5_OsMlWQ" 
              />
              <Image 
                width={48} height={48}
                className="w-12 h-12 rounded-full border-4 border-surface object-cover" 
                alt="portrait of a confident creative professional man with short beard in a bright studio" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc1nzWfyZo2hkJX-8ejnzhIcJM7bnlhZAt7LLcNeQYh7_oQsJ7qszZH0F3IVkg4AHARVDosawmsJh3xkyP-o9ZgiTUVcR9CZE9FTSZnzBfZKZIYm0sz3ybIx-VQSIt4s9fF_H22-nwt8k4GqfTm7QjnJUXApf-dI4rQ4gq1jgKeL3349xuqqAj4Q4w3RKxh2851X9D4PjTX3LUhwezGxmGmwh9BjhJXeVRQ3FUdvN70YxENa7QyduM5D3vuioG5SJbY3Ho3NhMcGE" 
              />
              <Image 
                width={48} height={48}
                className="w-12 h-12 rounded-full border-4 border-surface object-cover" 
                alt="professional smiling young woman looking directly at the camera in a clean minimalist environment" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI2utEa0HPWuRvVjTDVv7VU6yyMo6q0igb-cWNrajlsSoUqHbinrwnveIqje8Jtq2kXdDWImx-eWETERoXdOajW4E8jnD6vUHGaOs-SI6YE983u_LqxYXChhCnD02cWsA1OaINR8CRcZLFC_sOplrA-AO8e6IQg8Ahm-OjoxVIVp-RAcgG5CLesUnEfss0RD28zgRDmT-e6Ldp61p0bd5t_pacFfFoEe2zV7qn7rBrCYn2xwWTZA4QsjLfuXxYBlrCVaBF5WXUlgg" 
              />
            </div>
            <p className="text-sm font-medium text-on-surface-variant">
              <span className="text-primary font-bold">500+</span> pros available right now
            </p>
          </div>
        </div>
        
        <div className="relative hidden lg:block">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary-container/20 rounded-full blur-3xl"></div>
          
          <Image 
            width={800} height={500}
            className="relative z-10 rounded-xl shadow-2xl w-full h-[500px] object-cover" 
            alt="modern collaborative workspace with diverse professionals working on laptops and talking in a bright airy room" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiQ0Srmo-699LdREMc5Ya9a7Gm5KFt20GaLySlHPZroBYauGqIWriD0uJSFtHrLQSTIOnGLM43__7GszczBAsG5WIpeP3LpVymxGAMeLyu7TTMF_vQqERIDR_sMQHPdjutudzd9JjfcK94nSgO_3S5SrWKf2BcOdOc_YCbTokArHMq0MuoMnH8gRCOZymtyQohG6q-PdtVl0Xyp4lpQnVaEJ7NxieE2U-v_SinaFi7v3LxQiV_51QHHS3HV70hqzM3tGdI1rLl1eM" 
          />
          
          {/* Floating Stats Card */}
          <div className="absolute bottom-10 -left-10 z-20 bg-surface-container-lowest/80 backdrop-blur-md p-6 rounded-lg shadow-xl border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
              </div>
              <div>
                <div className="text-xs font-bold text-outline uppercase tracking-wider">Verified Satisfaction</div>
                <div className="text-xl font-extrabold text-on-surface">4.9/5 Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
