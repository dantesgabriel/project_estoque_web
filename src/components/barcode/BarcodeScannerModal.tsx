import { useEffect, useRef, useState } from "react";
import { Modal } from "../ui/Modal";

interface BarcodeScannerModalProps {
  onClose: () => void;
  onScan: (barcode: string) => Promise<void> | void;
}

// Leitor reutilizável: a dependência é carregada apenas quando o modal é aberto.
// Isso mantém o bundle inicial leve para quem não usa a câmera.
export function BarcodeScannerModal({ onClose, onScan }: BarcodeScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const didReadRef = useRef(false);
  const [manualCode, setManualCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function stopCamera() {
    controlsRef.current?.stop();
    controlsRef.current = null;
  }

  async function useCode(code: string) {
    const normalized = code.trim();
    if (!normalized || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onScan(normalized);
      stopCamera();
      onClose();
    } catch (scanError) {
      didReadRef.current = false;
      setError(scanError instanceof Error ? scanError.message : "Produto não encontrado para este código");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    let active = true;
    async function startCamera() {
      try {
        const { BarcodeFormat, BrowserMultiFormatReader } = await import("@zxing/browser");
        if (!active || !videoRef.current) return;
        const reader = new BrowserMultiFormatReader();
        // Formatos mais frequentes em produtos. A lista pode ser expandida depois
        // sem alterar a experiência do usuário.
        reader.possibleFormats = [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.CODE_128,
        ];
        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: "environment" } }, audio: false },
          videoRef.current,
          (result) => {
            if (result && !didReadRef.current) {
              didReadRef.current = true;
              void useCode(result.getText());
            }
          }
        );
        if (active) controlsRef.current = controls;
        else controls.stop();
      } catch {
        if (active) {
          setError("Não foi possível acessar a câmera. Verifique a permissão ou use a digitação manual.");
        }
      } finally {
        if (active) setStarting(false);
      }
    }
    void startCamera();
    return () => { active = false; stopCamera(); };
  }, []);

  return (
    <Modal title="Escanear código de barras" onClose={() => { stopCamera(); onClose(); }}>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl bg-slate-950 aspect-video">
          <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
        </div>
        {starting && <p className="text-center text-sm text-slate-500">Abrindo câmera...</p>}
        <p className="text-center text-xs text-slate-500">Aponte a câmera para o código de barras do produto.</p>
        <div className="border-t border-slate-200 pt-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">Não conseguiu ler? Digite o código</label>
          <div className="flex gap-2">
            <input value={manualCode} onChange={(event) => setManualCode(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void useCode(manualCode); } }} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Código de barras" />
            <button type="button" onClick={() => void useCode(manualCode)} disabled={!manualCode.trim() || submitting} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">Usar</button>
          </div>
        </div>
        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </div>
    </Modal>
  );
}
