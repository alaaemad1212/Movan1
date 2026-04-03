import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Smartphone, 
  Trophy, 
  ChevronRight, 
  Users, 
  Activity,
  Menu,
  X,
  Zap,
  Target,
  Truck,
  Video,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { RegistrationForm } from './components/RegistrationForm';
import { AdminDashboard } from './components/AdminDashboard';

// --- Components ---

/**
 * Navigation Bar
 * Sticky, transparent to solid on scroll.
 */
const Navbar = ({ onOpenRegistration }: { onOpenRegistration: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Programmatic scroll handler to prevent URL hash issues and ensure smooth scrolling
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      setMobileMenuOpen(false);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-12 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="text-3xl font-black tracking-tighter text-movanNavy">
            <span className="text-movanGreen">M</span>OVAN
          </div>
        </div>

        {/* Desktop Links */}
        <div className={`hidden md:flex gap-8 font-semibold ${scrolled ? 'text-gray-700' : 'text-movanNavy'}`}>
          <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="hover:text-movanGreen transition-colors cursor-pointer">الرئيسية</a>
          <a href="#problem" onClick={(e) => scrollToSection(e, 'problem')} className="hover:text-movanGreen transition-colors cursor-pointer">لماذا موفان؟</a>
          <a href="#solution" onClick={(e) => scrollToSection(e, 'solution')} className="hover:text-movanGreen transition-colors cursor-pointer">الحل</a>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-movanGreen transition-colors cursor-pointer">التطبيق</a>
          <a href="#roadmap" onClick={(e) => scrollToSection(e, 'roadmap')} className="hover:text-movanGreen transition-colors cursor-pointer">خارطة الطريق</a>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button 
            onClick={onOpenRegistration}
            className="bg-movanGreen hover:bg-movanDarkGreen text-white px-6 py-2 rounded-full font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            سجلي اهتمامك
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-movanNavy" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4 text-center font-semibold text-movanNavy">
              <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="block py-2">الرئيسية</a>
              <a href="#problem" onClick={(e) => scrollToSection(e, 'problem')} className="block py-2">لماذا موفان؟</a>
              <a href="#solution" onClick={(e) => scrollToSection(e, 'solution')} className="block py-2">الحل</a>
              <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="block py-2">التطبيق</a>
              <a href="#roadmap" onClick={(e) => scrollToSection(e, 'roadmap')} className="block py-2">خارطة الطريق</a>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenRegistration(); }}
                className="bg-movanGreen text-white px-6 py-2 rounded-full w-full mt-2"
              >
                سجلي اهتمامك
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/**
 * Hero Section
 * High impact, Motion Graphics, Typography focused.
 */
const HeroSection = ({ onOpenRegistration }: { onOpenRegistration: () => void }) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Abstract Background Shapes (Motion Graphics) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-movanGreen/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] bg-movanNavy/5 rounded-full blur-3xl"
        />
        {/* The Curve from the Logo */}
        <svg className="absolute bottom-0 w-full text-white" viewBox="0 0 1440 320" fill="currentColor">
           <path fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,197.3C840,192,960,160,1080,149.3C1200,139,1320,149,1380,154.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-right">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-movanGreen/10 text-movanGreen px-4 py-1 rounded-full text-sm font-bold inline-block mb-4">
                 رؤية 2030 🇸🇦
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-movanNavy leading-tight mb-2">
                جيل جديد... <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-movanGreen to-emerald-500">
                  يتحرّك نحو المستقبل
                </span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
            >
              موفان (MOVAN) هو مشروعك الأول لتمكين الرياضيات الواعدات في المملكة. 
              نصل إليكِ أينما كنتِ عبر أكاديميات متنقلة، وتطبيق ذكي، تحت إشراف نخبة من المدربات المعتمدات.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4"
            >
              <button 
                onClick={onOpenRegistration}
                className="flex items-center justify-center gap-2 bg-movanNavy text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                سجلي اهتمامك الآن
                <ArrowLeft size={20} />
              </button>
              <button 
                onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 bg-white text-movanNavy border-2 border-movanNavy/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
              >
                تعرفي على المزيد
              </button>
            </motion.div>
            
            {/* Stats / Trust Markers */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-6 justify-center md:justify-start pt-8 text-sm font-semibold text-gray-500"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-movanGreen" size={18} />
                <span>بيئة آمنة 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-movanGreen" size={18} />
                <span>مدربات معتمدات</span>
              </div>
            </motion.div>
          </div>

          {/* Visual Content (Image Masking/Composition) */}
          <div className="w-full md:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
               {/* Main Hero Image Container */}
               <div className="relative rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white h-[550px] group">
                  
                  {/* TRAINING FIELD IMAGE: Cones, Ball, Field, Training Atmosphere */}
                  <img 
                    src="https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2070&auto=format&fit=crop" 
                    alt="أدوات تدريب كرة قدم احترافية" 
                    className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                  />
                  
                  {/* 1. Brand Color Tint: Applied softly to harmonize stock photo with brand colors */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-movanNavy/20 to-movanGreen/10 mix-blend-multiply pointer-events-none"></div>

                  {/* 2. Gradient Overlay for text readability at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-movanNavy/60 via-transparent to-transparent"></div>
                  
                  {/* --- FLOATING UI ELEMENTS --- */}

                  {/* 1. The Mobile Unit Badge */}
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute top-8 left-8 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border-r-4 border-movanGreen flex items-center gap-3 z-20"
                  >
                     <div className="bg-movanNavy p-2 rounded-lg text-white">
                        <Truck size={20} />
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">الوحدة المتنقلة</p>
                        <p className="text-sm font-black text-movanNavy">MOVAN VAN-01</p>
                     </div>
                  </motion.div>

                  {/* 2. Team Stats */}
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.4, type: "spring" }}
                    className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl w-64 border border-gray-100 z-20"
                  >
                     <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-1.5">
                           <Award size={14} className="text-movanGreen" />
                           <span className="text-[10px] font-bold text-movanNavy">Training Intensity</span>
                        </div>
                        <span className="text-[10px] bg-movanNavy/10 text-movanNavy px-2 py-0.5 rounded-full font-bold">High</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-movanGreen">
                           <Activity size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] text-gray-400">حالة الملعب</p>
                           <p className="text-sm font-bold text-movanNavy">جاهز للتدريب</p>
                        </div>
                     </div>
                  </motion.div>

               </div>
            </motion.div>

            {/* Decorative Elements behind image */}
            <div className="absolute -top-6 -right-6 w-full h-full bg-movanGreen/10 rounded-3xl -z-10 transform rotate-3 border border-movanGreen/20"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-xl -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

/**
 * Problem Section
 * "The Gap"
 */
const ProblemSection = () => {
  const problems = [
    { icon: <MapPin className="text-red-500" />, title: "قلة الأكاديميات", desc: "غياب الأكاديميات في المدن الصغيرة والمتوسطة." },
    { icon: <Users className="text-orange-500" />, title: "نقص الكوادر", desc: "ندرة المدربات المعتمدات في المناطق الطرفية." },
    { icon: <ShieldCheck className="text-blue-500" />, title: "البيئة الآمنة", desc: "تردد الأهالي بسبب غياب البيئة المقننة." },
  ];

  return (
    <section id="problem" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-movanGreen tracking-widest mb-2">الفجوة الحالية</h2>
          <h3 className="text-3xl md:text-4xl font-black text-movanNavy">الموهبة موجودة.. لكن الفرصة بعيدة؟</h3>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            رغم التقدم الكبير في الرياضة النسائية، لا تزال هناك فجوات تمنع آلاف الفتيات من تحقيق أحلامهن.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, index) => (
            <div key={index} className="group p-8 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-3xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-movanNavy mb-3">{item.title}</h4>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Solution Section
 * "Mobile Academies"
 */
const SolutionSection = () => {
  return (
    <section id="solution" className="py-20 bg-movanNavy text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-movanGreen/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center gap-16 relative z-10">
        <div className="w-full md:w-1/2">
          <div className="relative">
            {/* Concept Image representing the Mobile Van */}
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2136&auto=format&fit=crop" 
              alt="Sports Training" 
              className="rounded-3xl shadow-2xl border-4 border-movanGreen/30 object-cover h-[400px] w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-movanGreen text-white p-6 rounded-2xl shadow-lg">
              <p className="font-bold text-2xl">تغطية 10+ مدن</p>
              <p className="text-sm opacity-90">في المرحلة الأولى</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-snug">
            الأكاديمية تجيك.. <br />
            <span className="text-movanGreen">وين ما كنتِ</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            موفان يبتكر مفهوم "الأكاديميات المتنقلة". حافلات مجهزة بأحدث المعدات الرياضية والتقنية تتحول إلى ملعب تدريب متكامل في دقائق، لتصل إلى المناطق التي تفتقر للبنية التحتية.
          </p>

          <ul className="space-y-4">
            {[
              "تجهيزات رياضية احترافية.",
              "مدربات سعوديات مؤهلات.",
              "بيئة مغلقة وآمنة.",
              "ربط تقني فوري بالتطبيق."
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="bg-movanGreen/20 p-1 rounded-full">
                  <ChevronRight size={16} className="text-movanGreen" />
                </div>
                <span className="font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const SkillBar = ({ label, value, color = "bg-movanGreen", delay = 0 }: { label: string, value: number, color?: string, delay?: number }) => (
  <div className="mb-3">
    <div className="flex justify-between items-end mb-1">
      <span className="text-xs font-bold text-gray-600">{label}</span>
      <span className="text-sm font-black text-movanNavy">{value}</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut", delay: delay }}
        className={`h-2 rounded-full ${color}`} 
      ></motion.div>
    </div>
  </div>
);

/**
 * App Features Section
 */
const AppSection = () => {
  return (
    <section id="features" className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col-reverse md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 space-y-8">
            <div>
               <h2 className="text-sm font-bold text-movanGreen tracking-widest mb-2">التطبيق الذكي</h2>
               <h3 className="text-4xl font-black text-movanNavy mb-4">مدربك الرقمي.. في جيبك</h3>
               <p className="text-gray-600 text-lg">
                 منظومة تقنية متكاملة تربط بين اللاعبة، المدربة، وولي الأمر لمتابعة التطور واكتشاف المواهب.
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "ملف اللاعبة", desc: "تتبع الأداء والمهارات بالأرقام.", icon: <Users /> },
                { title: "لوحة تحكم", desc: "إدارة الحصص والتقييمات للمدربات.", icon: <Activity /> },
                { title: "إشعارات", desc: "تنبيهات فورية للأهالي.", icon: <Smartphone /> },
                { title: "نقاط ومكافآت", desc: "نظام تحفيزي لزيادة الحماس.", icon: <Trophy /> },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                   <div className="bg-white p-3 rounded-xl shadow-sm text-movanGreen border border-gray-100">
                     {feature.icon}
                   </div>
                   <div>
                     <h5 className="font-bold text-movanNavy">{feature.title}</h5>
                     <p className="text-sm text-gray-500">{feature.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Phone Side */}
          <div className="w-full md:w-1/2 flex justify-center relative perspective-[1000px]">
             {/* Abstract phone mockup styling */}
             <motion.div 
                initial={{ y: 200, opacity: 0, rotateX: 20, rotateY: -15 }}
                whileInView={{ y: 0, opacity: 1, rotateX: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
                className="relative w-72 h-[550px] bg-movanNavy rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden z-20"
             >
                <div className="absolute top-0 w-full h-full bg-white z-0"></div>
                
                {/* Scanning Light Effect */}
                <motion.div 
                  initial={{ top: "-20%", opacity: 0 }}
                  whileInView={{ top: ["-10%", "120%"], opacity: [0, 1, 0] }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, delay: 0.6, ease: "easeInOut" }}
                  className="absolute left-0 w-full h-32 bg-gradient-to-b from-transparent via-movanGreen/40 to-transparent z-40 pointer-events-none"
                />

                <div className="relative z-10 w-full h-full flex flex-col">
                   {/* Mockup Header - Slides Down */}
                   <motion.div 
                      initial={{ y: -100, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                      className="bg-gradient-to-b from-movanGreen to-movanDarkGreen p-6 rounded-b-3xl pb-8 shadow-md"
                   >
                      <div className="flex justify-between items-center text-white mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-white rounded-full border-2 border-white overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Profile" />
                          </div>
                          <div>
                            <span className="font-bold text-sm block">سارة محمد</span>
                            <span className="text-[10px] opacity-80 bg-white/20 px-2 py-0.5 rounded-full">مهاجم</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-black leading-none">92</div>
                          <div className="text-[8px] uppercase tracking-widest opacity-80">Overall</div>
                        </div>
                      </div>
                   </motion.div>
                   
                   {/* Mockup Body - FIFA Style Stats - Slides Up */}
                   <motion.div 
                      initial={{ y: 50, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.5, duration: 0.6 }}
                      className="p-5 -mt-6"
                   >
                      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 mb-4">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
                          <h4 className="font-bold text-movanNavy text-sm flex items-center gap-2">
                            <Activity size={14} className="text-movanGreen" />
                             تحليل الأداء
                          </h4>
                          <motion.span 
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 2, type: "spring" }}
                            className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"
                          >
                            ممتاز
                          </motion.span>
                        </div>
                        
                        {/* Stat Bars with Staggered Delays */}
                        <SkillBar label="السرعة (PAC)" value={94} delay={1.8} />
                        <SkillBar label="التسديد (SHO)" value={88} delay={1.9} />
                        <SkillBar label="المراوغة (DRI)" value={91} delay={2.0} />
                        <SkillBar label="التمرير (PAS)" value={82} delay={2.1} />
                        <SkillBar label="اللياقة (PHY)" value={85} color="bg-blue-500" delay={2.2} />
                      </div>

                      {/* Mini cards below */}
                      <div className="grid grid-cols-2 gap-3">
                         <motion.div 
                           initial={{ scale: 0, opacity: 0 }}
                           whileInView={{ scale: 1, opacity: 1 }}
                           viewport={{ once: true }}
                           transition={{ delay: 2.3 }}
                           className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center"
                         >
                            <Zap size={16} className="text-yellow-500 mx-auto mb-1" />
                            <div className="text-xs text-gray-500">الطاقة</div>
                            <div className="font-bold text-movanNavy">100%</div>
                         </motion.div>
                         <motion.div 
                           initial={{ scale: 0, opacity: 0 }}
                           whileInView={{ scale: 1, opacity: 1 }}
                           viewport={{ once: true }}
                           transition={{ delay: 2.4 }}
                           className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center"
                         >
                            <Target size={16} className="text-red-500 mx-auto mb-1" />
                            <div className="text-xs text-gray-500">الأهداف</div>
                            <div className="font-bold text-movanNavy">24</div>
                         </motion.div>
                      </div>
                   </motion.div>
                </div>
             </motion.div>
             {/* Decorative circles */}
             <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-movanGreen/20 rounded-full -z-10"
             ></motion.div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-movanGreen/10 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Roadmap Section
 */
const RoadmapSection = () => {
  const steps = [
    { phase: "المرحلة الأولى", time: "6-8 أشهر", title: "الانطلاق التجريبي", desc: "تأهيل 10 مدربات، تدريب 500 لاعبة، إطلاق 3 مدن قريبة من الرياض." },
    { phase: "المرحلة الثانية", time: "9-18 شهر", title: "التوسع الذكي", desc: "التوسع إلى 10 مدن، إضافة رياضات جديدة، إطلاق تحليل الذكاء الاصطناعي." },
    { phase: "المرحلة الثالثة", time: "السنة 2-3", title: "MOVAN Nation", desc: "إنشاء أكاديميات ثابتة، التوسع خليجياً، وتحقيق الاكتفاء الذاتي." },
  ];

  return (
    <section id="roadmap" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-movanNavy mb-16">رحلتنا إلى 2034 🇸🇦</h2>
        
        <div className="relative">
           {/* Connecting Line (Desktop) */}
           <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
           
           <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center group hover:-translate-y-2 transition-transform">
                   <div className="w-12 h-12 bg-movanNavy text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 ring-4 ring-white shadow-md">
                     {idx + 1}
                   </div>
                   <span className="text-movanGreen font-bold text-sm mb-1">{step.time}</span>
                   <h4 className="text-xl font-bold text-movanNavy mb-2">{step.title}</h4>
                   <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Footer Section
 */
const Footer = () => {
  return (
    <footer className="bg-movanNavy text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-3xl font-black tracking-tighter">
            <span className="text-movanGreen">M</span>OVAN
          </div>
          <div className="text-gray-400 text-sm text-center md:text-right">
            <p>جميع الحقوق محفوظة © مشروع MOVAN</p>
            <p className="mt-1">رؤية ولدت في السعودية - 2025</p>
            <a href="#/admin" className="mt-4 inline-block text-xs text-gray-600 hover:text-white transition-colors">دخول الإدارة</a>
          </div>
          <div className="flex gap-4">
            {/* Social Icons placeholders */}
            <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-movanGreen transition-colors cursor-pointer"></div>
            <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-movanGreen transition-colors cursor-pointer"></div>
            <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-movanGreen transition-colors cursor-pointer"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  // Simple routing based on hash
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentPath === '#/admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="antialiased text-gray-800 bg-white">
      <Navbar onOpenRegistration={() => setIsRegistrationOpen(true)} />
      <HeroSection onOpenRegistration={() => setIsRegistrationOpen(true)} />
      <ProblemSection />
      <SolutionSection />
      <AppSection />
      <RoadmapSection />
      
      {/* Call to Action Final */}
      <section className="py-20 bg-movanGreen text-center text-white">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl md:text-5xl font-black mb-6">جاهزة للانطلاق؟</h2>
           <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">كوني جزءاً من قصة النجاح القادمة. سجلي ابنتك الآن أو انضمي إلينا كمدربة.</p>
           <button 
             onClick={() => setIsRegistrationOpen(true)}
             className="bg-white text-movanGreen px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition-colors"
           >
             ابدئي الرحلة الآن
           </button>
        </div>
      </section>

      <Footer />
      
      <RegistrationForm 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)} 
      />
    </div>
  );
}