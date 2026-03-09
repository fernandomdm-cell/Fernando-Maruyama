import React, { useRef, useState, useCallback } from 'react';
import { Camera, Upload, RefreshCw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1920 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Não foi possível acessar a câmera. Por favor, verifique as permissões.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

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
    setIsCameraActive(false);
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
          <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold">Corpo inteiro • Fundo Neutro</p>
        </div>

        <div className="relative aspect-[3/4] bg-[#FDFCFB] rounded-3xl overflow-hidden border border-[#1a1a1a]/5 flex items-center justify-center shadow-inner">
          <AnimatePresence mode="wait">
            {!isCameraActive && !capturedImage && (
              <motion.div 
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <button 
                  onClick={startCamera}
                  className="p-8 bg-gold-gradient text-white rounded-full hover:scale-105 transition-transform shadow-xl shadow-[#C5A059]/20"
                >
                  <Camera size={32} />
                </button>
                <label className="flex flex-col items-center cursor-pointer group">
                  <div className="flex items-center gap-2 text-stone-400 group-hover:text-[#C5A059] transition-colors">
                    <Upload size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Ou envie um arquivo</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </motion.div>
            )}

            {isCameraActive && !capturedImage && (
              <motion.div 
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                  <button 
                    onClick={capturePhoto}
                    className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border-2 border-white flex items-center justify-center active:scale-90 transition-all"
                  >
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg" />
                  </button>
                </div>
              </motion.div>
            )}

            {capturedImage && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-8">
                  <button 
                    onClick={reset}
                    className="flex-1 py-4 bg-white/90 backdrop-blur text-stone-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-white transition-colors"
                  >
                    <RefreshCw size={14} />
                    Refazer
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

        <canvas ref={canvasRef} className="hidden" />
        
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
