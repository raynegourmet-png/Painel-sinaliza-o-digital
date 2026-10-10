import React, { useEffect, useRef, useState } from 'react';

interface PinAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const REQUIRED_PIN = '0712';

export const PinAuthModal: React.FC<PinAuthModalProps> = ({
  isOpen,
  onSuccess,
  onClose
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [shake, setShake] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg('');
      setShake(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const verifyPin = (candidate: string) => {
    if (candidate === REQUIRED_PIN) {
      setErrorMsg('');
      setPin('');
      onSuccess();
    } else {
      setErrorMsg('PIN incorreto! Acesso negado ao Painel Administrativo.');
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 500);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(digitsOnly);
    if (errorMsg) setErrorMsg('');
    if (digitsOnly.length === 4) {
      verifyPin(digitsOnly);
    }
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length >= 4) return;
    const nextPin = (pin + digit).slice(0, 4);
    setPin(nextPin);
    if (errorMsg) setErrorMsg('');
    if (nextPin.length === 4) {
      verifyPin(nextPin);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPin(pin);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div
        className={`w-full max-w-md bg-[#1E2022] border-2 border-[#8A05BE] rounded-3xl shadow-[0_25px_80px_rgba(138,5,190,0.45)] overflow-hidden transition-transform ${
          shake ? 'translate-x-[-8px]' : ''
        }`}
      >
        {/* Top Header */}
        <div className="px-6 py-5 bg-[#2D3142] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8A05BE] text-white flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-shield-halved text-lg" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base lg:text-lg text-white">
                Acesso Restrito — PIN de Segurança
              </h2>
              <p className="text-xs text-[#F4F5F7]/70">
                Painel Administrativo • Consórcio Matupiri
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Cancelar (Esc)"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-xs lg:text-sm text-[#F4F5F7]/85">
              Digite o PIN de 4 dígitos para liberar as configurações da TV:
            </p>
          </div>

          {/* Visual 4-Digit Boxes + Hidden/Accessible Input */}
          <div className="relative flex justify-center">
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={handleInputChange}
              placeholder="••••"
              aria-label="Digite o PIN de segurança"
              className="w-48 text-center font-mono-tabular font-extrabold text-3xl tracking-[0.55em] py-3 px-4 rounded-2xl bg-[#2D3142] border-2 border-[#8A05BE] text-white outline-none focus:ring-4 focus:ring-[#8A05BE]/35"
            />
          </div>

          {/* Error Feedback Banner */}
          {errorMsg && (
            <div className="bg-red-500/15 border border-red-400/50 rounded-xl px-4 py-2.5 text-center flex items-center justify-center gap-2 text-xs font-bold text-red-300">
              <i className="fa-solid fa-triangle-exclamation" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Numeric Keypad for Smart TV Remote / Touch / Mouse */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitClick(digit)}
                className="py-3 rounded-xl bg-[#2D3142] hover:bg-[#8A05BE] text-white font-mono-tabular font-bold text-lg border border-white/10 transition-colors cursor-pointer shadow-sm"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPin('');
                setErrorMsg('');
              }}
              className="py-3 rounded-xl bg-[#2D3142]/70 hover:bg-red-500/30 text-red-300 font-display font-bold text-xs uppercase border border-white/10 transition-colors cursor-pointer"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={() => handleDigitClick('0')}
              className="py-3 rounded-xl bg-[#2D3142] hover:bg-[#8A05BE] text-white font-mono-tabular font-bold text-lg border border-white/10 transition-colors cursor-pointer shadow-sm"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-3 rounded-xl bg-[#2D3142]/70 hover:bg-white/15 text-[#F4F5F7] font-display font-bold text-sm border border-white/10 transition-colors cursor-pointer flex items-center justify-center"
              title="Apagar dígito"
            >
              <i className="fa-solid fa-delete-left" />
            </button>
          </div>

          {/* Submit / Cancel Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#8A05BE] hover:bg-[#7B1FA2] text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer shadow-lg flex items-center gap-2"
            >
              <i className="fa-solid fa-unlock-keyhole" />
              <span>Desbloquear Painel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
