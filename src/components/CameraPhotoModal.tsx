import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, Trash2, Check, Sparkles } from 'lucide-react';
import { FUN_AVATARS } from '../data/defaultNames';
import { compressPlayerPhoto } from '../utils/imageCompressor';
import { playClick } from '../utils/audio';

interface CameraPhotoModalProps {
  isOpen: boolean;
  playerName: string;
  currentAvatar: string;
  currentPhotoUrl?: string;
  onSave: (avatar: string, photoUrl?: string) => void;
  onClose: () => void;
}

export const CameraPhotoModal: React.FC<CameraPhotoModalProps> = ({
  isOpen,
  playerName,
  currentAvatar,
  currentPhotoUrl,
  onSave,
  onClose,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(currentPhotoUrl);
  const [isProcessing, setIsProcessing] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      playClick();
      const compressed = await compressPlayerPhoto(file);
      setPhotoUrl(compressed);
    } catch (err) {
      console.error('Photo compression failed', err);
      alert('ഫോട്ടോ പ്രോസസ്സ് ചെയ്യാൻ സാധിച്ചില്ല. ദയവായി വേറെ ഫോട്ടോ ശ്രമിക്കുക.');
    } finally {
      setIsProcessing(false);
      // reset input
      e.target.value = '';
    }
  };

  const handleRemovePhoto = () => {
    playClick();
    setPhotoUrl(undefined);
  };

  const handleSelectEmoji = (emoji: string) => {
    playClick();
    setSelectedAvatar(emoji);
    setPhotoUrl(undefined);
  };

  const handleConfirm = () => {
    playClick();
    onSave(selectedAvatar, photoUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <h3 className="text-xl font-black text-slate-900 font-malayalam">
            ഫോട്ടോ / അവതാർ മാറ്റുക 📸
          </h3>
          <p className="text-xs text-slate-500 font-malayalam mt-0.5">
            "{playerName}" ന്റെ ഫോട്ടോ അല്ലെങ്കിൽ ഇമോജി
          </p>
        </div>

        {/* Live Preview Avatar */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative w-28 h-28 rounded-full border-4 border-emerald-500 shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={playerName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-6xl select-none">{selectedAvatar}</span>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold font-malayalam">
                ഫോട്ടോ ലോഡ് ചെയ്യുന്നു...
              </div>
            )}
          </div>

          {photoUrl && (
            <button
              onClick={handleRemovePhoto}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 transition-colors font-malayalam"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ഫോട്ടോ ഒഴിവാക്കുക</span>
            </button>
          )}
        </div>

        {/* Camera / Upload Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {/* Direct Camera Button */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl flex flex-col items-center justify-center shadow-md active:scale-95 transition-all"
          >
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold font-malayalam">ക്യാമറ തുറക്കൂ 📸</span>
            <span className="text-[10px] text-emerald-100">Take Photo</span>
          </button>

          {/* Gallery Button */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="p-3 bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-md active:scale-95 transition-all"
          >
            <ImageIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold font-malayalam">ഗാലറിയിൽ നിന്ന് 🖼️</span>
            <span className="text-[10px] text-amber-100">Upload Photo</span>
          </button>

          {/* Hidden HTML5 File Inputs with mobile camera triggers */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Emoji Avatars Grid */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-600 font-malayalam">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>അല്ലെങ്കിൽ ഇമോജി തിരഞ്ഞെടുക്കുക:</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
            {FUN_AVATARS.map((emoji, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectEmoji(emoji)}
                className={`p-1.5 text-2xl rounded-xl transition-transform active:scale-90 ${
                  !photoUrl && selectedAvatar === emoji
                    ? 'bg-emerald-500 text-white shadow'
                    : 'hover:bg-slate-200'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Done / Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all font-malayalam"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>ശരി, മാറ്റം വരുത്തുക ✅</span>
        </button>
      </div>
    </div>
  );
};
