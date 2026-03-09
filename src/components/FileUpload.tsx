import React, { useState } from 'react';
import { Upload, RefreshCw, Check, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploadProps {
  onCapture: (imageData: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onCapture }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setCapturedImage(null);
  };

  const confirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-[#1a1a1a]/5">
      <div className="p-10 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-serif text-stone-900">Sua Foto</h2>
          <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold">Busto • Fundo Neutro</p>
        </div>

        <div className="relative aspect-[3/4] bg-[#FDFCFB] rounded-3xl overflow-hidden border border-[#1a1a1a]/5 flex items-center justify-center shadow-inner">
          <AnimatePresence mode="wait">
            {!capturedImage ? (
              <motion.div 
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <label className="flex flex-col items-center cursor-pointer group">
                  <div className="p-10 bg-gold-gradient text-white rounded-full hover:scale-105 transition-transform shadow-xl shadow-[#C5A059]/20 mb-4">
                    <Upload size={40} />
                  </div>
                  <div className="flex items-center gap-2 text-stone-400 group-hover:text-[#C5A059] transition-colors">
                    <ImageIcon size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Selecionar Foto</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </motion.div>
            ) : (
              <motion.div 
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <img src={capturedImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-8">
                  <button 
                    onClick={reset}
                    className="flex-1 py-4 bg-white/90 backdrop-blur text-stone-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-white transition-colors"
                  >
                    <RefreshCw size={14} />
                    Trocar
                  </button>
                  <button 
                    onClick={confirm}
                    className="flex-1 py-4 bg-gold-gradient text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-[#C5A059]/20 hover:scale-[1.02] transition-transform"
                  >
                    <Check size={14} />
                    Confirmar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="pt-6 border-t border-stone-50">
          <div className="flex items-center justify-center gap-3 text-[9px] text-stone-300 uppercase tracking-[0.3em] font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            Privacidade • Excelência • Saúde
          </div>
        </div>
      </div>
    </div>
  );
};
