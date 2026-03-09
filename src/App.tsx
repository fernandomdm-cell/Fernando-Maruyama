import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUpload } from './components/FileUpload';
import { generateBeforeAfterImage } from './services/gemini';
import { Sparkles, Download, Share2, ArrowLeft, Loader2, MapPin, Phone, Instagram, ExternalLink } from 'lucide-react';

type AppState = 'initial' | 'capturing' | 'loading' | 'result';

export default function App() {
  const [state, setState] = useState<AppState>('initial');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (imageData: string) => {
    setOriginalImage(imageData);
    setState('loading');
    setError(null);

    try {
      const result = await generateBeforeAfterImage(imageData);
      setResultImage(result);
      setState('result');
    } catch (err: any) {
      console.error(err);
      setError("Ocorreu um erro ao processar sua imagem. Tente novamente.");
      setState('initial');
    }
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'emagrecentro-resultado.png';
      link.click();
    }
  };

  const shareResult = async () => {
    if (!resultImage) return;

    try {
      // Convert base64 to blob for sharing if supported
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const file = new File([blob], 'meu-resultado-emagrecentro.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Meu Resultado Emagrecentro',
          text: 'Confira minha simulação de transformação com o Método 4 Fases da Emagrecentro!',
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'Meu Resultado Emagrecentro',
          text: 'Confira minha simulação de transformação com o Método 4 Fases da Emagrecentro!',
          url: window.location.href,
        });
      } else {
        // Fallback: Copy link
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Fallback
      alert('Não foi possível compartilhar automaticamente. Você pode salvar a imagem e compartilhar manualmente.');
    }
  };

  const Logo = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="text-2xl md:text-3xl font-serif font-bold tracking-[0.1em] text-gold-gradient leading-none">
        EMAGRECENTRO
      </span>
      <span className="text-[7px] md:text-[8px] uppercase tracking-[0.15em] text-[#8B6B2D] font-medium mt-1">
        Centro Especializado em Emagrecimento e Saúde
      </span>
    </div>
  );

  const AboutSection = () => (
    <section id="sobre" className="py-32 bg-white border-t border-[#1a1a1a]/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">Nossa Essência</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">Sobre Nós</h2>
          </div>
          <div className="space-y-6">
            <p className="text-xl text-[#1a1a1a]/70 font-light leading-relaxed">
              Na <span className="font-medium text-[#1a1a1a]">Emagrecentro</span>, acreditamos que emagrecer não é sobre pressa, mas sobre fazer certo. Com mais de 30 anos de história e 3 milhões de atendimentos realizados, unimos a única metodologia com comprovação científica de eficácia a um acolhimento individualizado.
            </p>
            <p className="text-xl text-[#1a1a1a]/70 font-light leading-relaxed">
              Nosso compromisso é com a sua segurança e com resultados que respeitem o seu momento metabólico atual. <span className="italic font-serif text-[#C5A059]">Quem confia, não precisa gritar.</span>
            </p>
          </div>
          <div className="pt-8 flex justify-center gap-12">
            <div className="text-center">
              <div className="text-4xl font-serif text-[#C5A059]">30+</div>
              <div className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold mt-2">Anos de História</div>
            </div>
            <div className="w-px h-12 bg-[#1a1a1a]/10" />
            <div className="text-center">
              <div className="text-4xl font-serif text-[#C5A059]">3M+</div>
              <div className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold mt-2">Atendimentos</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  const TreatmentSection = () => (
    <section id="tratamento" className="py-32 bg-[#FDFCFB] border-t border-[#1a1a1a]/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">A Metodologia</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">O Método 4 Fases</h2>
          </div>
          <div className="space-y-6">
            <p className="text-xl text-[#1a1a1a]/70 font-light leading-relaxed">
              O Método 4 Fases é uma metodologia estruturada que organiza seu processo de emagrecimento de forma lógica e segura. Diferente de abordagens genéricas, nosso tratamento é monitorado semanalmente por especialistas, focando na reeducação e na preservação da saúde.
            </p>
            <p className="text-xl text-[#1a1a1a]/70 font-light leading-relaxed">
              Aqui, não trabalhamos com fórmulas mágicas; o método se adapta ao seu corpo para garantir previsibilidade e bem-estar em cada etapa.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            {[
              "Monitoramento Semanal",
              "Comprovação Científica",
              "Reeducação Metabólica",
              "Acompanhamento Especializado"
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="p-4 rounded-2xl bg-white border border-[#1a1a1a]/5 shadow-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mx-auto mb-3" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#1a1a1a]/60 leading-tight block">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );

  const UnitsSection = () => (
    <section id="unidades" className="py-24 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif">Nossas Unidades</h2>
          <div className="h-px w-24 bg-gold-gradient mx-auto opacity-50" />
          <p className="text-sm text-[#1a1a1a]/50 uppercase tracking-[0.2em] font-bold">Rio de Janeiro</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recreio */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-[40px] border border-[#1a1a1a]/5 shadow-xl space-y-8 flex flex-col"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-serif">Recreio dos Bandeirantes</h3>
              <div className="h-0.5 w-12 bg-gold-gradient opacity-30" />
            </div>
            
            <div className="space-y-6 flex-grow">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-[#C5A059]" />
                </div>
                <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">
                  Estrada Benvindo de Novaes, 01825 - Loja B<br />
                  Recreio dos Bandeirantes, Rio de Janeiro - RJ<br />
                  CEP: 22790-381
                </p>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-[#C5A059]" />
                </div>
                <a href="tel:21994379065" className="text-sm text-[#1a1a1a]/60 hover:text-[#C5A059] transition-colors">
                  (21) 99437-9065
                </a>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center shrink-0">
                  <Instagram size={18} className="text-[#C5A059]" />
                </div>
                <a 
                  href="https://www.instagram.com/emagrecentrorecreio/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-[#1a1a1a]/60 hover:text-[#C5A059] transition-colors flex items-center gap-2"
                >
                  @emagrecentrorecreio
                  <ExternalLink size={12} className="opacity-50" />
                </a>
              </div>
            </div>

            <a 
              href="https://wa.me/5521994379065" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 bg-navy-deep text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#000030] transition-colors shadow-lg text-center block"
            >
              Agendar no Recreio
            </a>
          </motion.div>

          {/* Gávea */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-[40px] border border-[#1a1a1a]/5 shadow-xl space-y-8 flex flex-col"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-serif">Gávea</h3>
              <div className="h-0.5 w-12 bg-gold-gradient opacity-30" />
            </div>
            
            <div className="space-y-6 flex-grow">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-[#C5A059]" />
                </div>
                <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">
                  R. Marquês de São Vicente, N° 52<br />
                  Gávea, Rio de Janeiro - RJ<br />
                  CEP: 22451-901
                </p>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-[#C5A059]" />
                </div>
                <a href="tel:21999436776" className="text-sm text-[#1a1a1a]/60 hover:text-[#C5A059] transition-colors">
                  (21) 99943-6776
                </a>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center shrink-0">
                  <Instagram size={18} className="text-[#C5A059]" />
                </div>
                <a 
                  href="https://www.instagram.com/emagrecentrogavea/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-[#1a1a1a]/60 hover:text-[#C5A059] transition-colors flex items-center gap-2"
                >
                  @emagrecentrogavea
                  <ExternalLink size={12} className="opacity-50" />
                </a>
              </div>
            </div>

            <a 
              href="https://wa.me/5521999436776" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 bg-navy-deep text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#000030] transition-colors shadow-lg text-center block"
            >
              Agendar na Gávea
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1a1a1a] font-sans selection:bg-[#C5A059]/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#1a1a1a]/5 px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo className="!items-start" />
          <div className="hidden lg:flex gap-8 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/50">
            <a href="#sobre" className="hover:text-[#C5A059] transition-colors">Sobre Nós</a>
            <a href="#tratamento" className="hover:text-[#C5A059] transition-colors">Tratamentos</a>
            <a href="#unidades" className="hover:text-[#C5A059] transition-colors">Unidades</a>
            <a href="https://wa.me/5521994379065" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">Contato</a>
          </div>
          <a 
            href="https://wa.me/5521994379065" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:block px-5 py-2 bg-gold-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-[#C5A059]/20 hover:scale-105 transition-transform"
          >
            Agendar Agora
          </a>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {state === 'initial' && (
              <motion.div 
                key="initial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center text-center space-y-12 py-12"
              >
                <div className="space-y-4 max-w-2xl">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest border border-[#C5A059]/20"
                  >
                    <Sparkles size={12} />
                    Tecnologia Avançada
                  </motion.div>
                  <h1 className="text-5xl md:text-8xl font-serif font-light leading-[0.9] tracking-tight">
                    Sua nova <br /> <span className="italic text-gold-gradient">versão</span>
                  </h1>
                  <p className="text-base text-[#1a1a1a]/50 font-light max-w-md mx-auto leading-relaxed">
                    A excelência da Emagrecentro agora ao alcance de um clique. Simule seu resultado e comece sua jornada hoje.
                  </p>
                </div>

                <div className="w-full max-w-md">
                  <FileUpload onCapture={handleCapture} />
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                )}
              </motion.div>
            )}

            {state === 'loading' && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-2 border-[#C5A059]/20 rounded-full animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#C5A059]" size={40} />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-serif italic">Esculpindo sua imagem...</h2>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-[0.2em] font-bold">Processando dados biométricos</p>
                </div>
                <div className="w-64 h-0.5 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-full h-full bg-gold-gradient"
                  />
                </div>
              </motion.div>
            )}

            {state === 'result' && resultImage && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center space-y-12 py-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-serif">Simulação Concluída</h2>
                  <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Método 4 Fases • Resultado Estimado</p>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-8 bg-[#C5A059]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="relative bg-white p-3 rounded-3xl shadow-2xl border border-white/50">
                    <img 
                      src={resultImage} 
                      alt="Resultado Antes e Depois" 
                      className="max-w-full max-h-[70vh] rounded-2xl shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
                  <button 
                    onClick={() => setState('initial')}
                    className="flex-1 min-w-[140px] py-4 px-6 border border-[#1a1a1a]/5 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-95 text-[11px] uppercase tracking-widest"
                  >
                    <ArrowLeft size={16} />
                    Nova Foto
                  </button>
                  <button 
                    onClick={downloadImage}
                    className="flex-1 min-w-[140px] py-4 px-6 bg-white border border-[#1a1a1a]/5 text-[#1a1a1a] rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-stone-50 transition-all active:scale-95 text-[11px] uppercase tracking-widest"
                  >
                    <Download size={16} />
                    Salvar
                  </button>
                  <button 
                    onClick={shareResult}
                    className="flex-1 min-w-[140px] py-4 px-6 bg-gold-gradient text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#C5A059]/20 hover:scale-[1.02] transition-all active:scale-95 text-[11px] uppercase tracking-widest"
                  >
                    <Share2 size={16} />
                    Compartilhar
                  </button>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-[#1a1a1a]/5 shadow-xl max-w-2xl text-center space-y-8">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-serif">Sua jornada começa aqui</h3>
                    <p className="text-sm text-[#1a1a1a]/50 leading-relaxed font-light">
                      Esta simulação demonstra o potencial de transformação com o acompanhamento especializado da Emagrecentro. Agende uma consulta para um plano personalizado.
                    </p>
                  </div>
                  <a 
                    href="https://wa.me/5521994379065" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-navy-deep text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#000030] transition-colors shadow-xl shadow-navy-deep/10 text-center block"
                  >
                    Agendar Avaliação Gratuita
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <UnitsSection />
      <AboutSection />
      <TreatmentSection />

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a]/5 py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
          <Logo />
          <div className="flex flex-wrap justify-center gap-12 text-[10px] uppercase tracking-[0.3em] font-bold text-[#1a1a1a]/40">
            <a href="#sobre" className="hover:text-[#C5A059] transition-colors">Sobre Nós</a>
            <a href="#tratamento" className="hover:text-[#C5A059] transition-colors">Tratamentos</a>
            <a href="#unidades" className="hover:text-[#C5A059] transition-colors">Unidades</a>
            <a href="https://wa.me/5521994379065" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">Privacidade</a>
          </div>
          <div className="h-px w-24 bg-gold-gradient opacity-30" />
          <p className="text-[9px] text-[#1a1a1a]/30 uppercase tracking-[0.4em] text-center leading-loose">
            © 2024 Emagrecentro. Excelência em Emagrecimento e Saúde. <br />
            Simulação por Inteligência Artificial • Resultados Variam de Acordo com o Organismo.
          </p>
        </div>
      </footer>
    </div>
  );
}
