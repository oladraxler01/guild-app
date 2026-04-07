import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MagicJobForm } from "./MagicJobForm";

export default function PostJobPage() {
  return (
    <main className="min-h-screen bg-[#fcf8ff] selection:bg-primary/20 relative overflow-hidden">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <MagicJobForm />
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-40 left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-0 pointer-events-none"></div>
      <div className="absolute bottom-20 right-[-10%] w-[50%] h-[50%] bg-[#edd3ff]/30 rounded-full blur-[150px] -z-0 pointer-events-none"></div>

      <Footer />
    </main>
  );
}
