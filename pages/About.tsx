
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Zap, Globe, Users } from 'lucide-react';

const About: React.FC = () => {
  const { lang } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-16 space-y-20">
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl font-serif font-bold text-slate-900">
          {lang === 'en' ? 'Redefining Tech Journalism' : 'Redefiniendo el periodismo tecnológico'}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          {lang === 'en' 
            ? 'We are a global team of developers, analysts, and writers dedicated to bringing you the most impactful news from the heart of Silicon Valley to the emerging tech hubs of the world.' 
            : 'Somos un equipo global de desarrolladores, analistas y escritores dedicados a brindarle las noticias más impactantes desde el corazón de Silicon Valley hasta los centros tecnológicos emergentes del mundo.'}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: <Zap className="text-blue-600" size={32} />, title: { en: 'Speed', es: 'Velocidad' }, text: { en: 'Live updates on the stories that matter right now.', es: 'Actualizaciones en vivo sobre las historias que importan ahora mismo.' } },
          { icon: <ShieldCheck className="text-emerald-600" size={32} />, title: { en: 'Accuracy', es: 'Exactitud' }, text: { en: 'Rigorous fact-checking and technical verification.', es: 'Verificación de hechos rigurosa y técnica.' } },
          { icon: <Globe className="text-indigo-600" size={32} />, title: { en: 'Global', es: 'Global' }, text: { en: 'Local insights from tech hubs across 5 continents.', es: 'Perspectivas locales de centros tecnológicos en 5 continentes.' } },
          { icon: <Users className="text-rose-600" size={32} />, title: { en: 'Community', es: 'Comunidad' }, text: { en: 'Engaging discussion platforms for verified tech enthusiasts.', es: 'Plataformas de discusión atractivas para entusiastas verificados.' } },
        ].map((feature, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title[lang]}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{feature.text[lang]}</p>
          </div>
        ))}
      </section>

      <section className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl font-serif font-bold">
            {lang === 'en' ? 'Our Vision for the Future' : 'Nuestra visión para el futuro'}
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            {lang === 'en' 
              ? 'As AI and emerging technologies evolve, we believe the role of high-quality journalism is more critical than ever. We leverage the very tools we report on—using AI to help summarize and synthesize complex topics for our readers.' 
              : 'A medida que evolucionan la IA y las tecnologías emergentes, creemos que el papel del periodismo de alta calidad es más crítico que nunca.'}
          </p>
          <div className="flex space-x-4 pt-4">
            <button className="px-8 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-colors">Join Our Team</button>
            <button className="px-8 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition-colors">Contact Support</button>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <img src="https://picsum.photos/seed/office1/400/300" className="rounded-2xl" alt="Office 1" />
          <img src="https://picsum.photos/seed/office2/400/300" className="rounded-2xl mt-8" alt="Office 2" />
        </div>
      </section>
    </div>
  );
};

export default About;
