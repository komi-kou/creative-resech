import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface UploaderProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onFileSelect, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("画像ファイルを選択してください。");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        className={`relative group rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
        } ${isAnalyzing ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleChange}
          accept="image/*"
          disabled={isAnalyzing}
        />
        
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          {preview ? (
            <div className="relative w-full max-w-md aspect-auto rounded-lg overflow-hidden shadow-md">
              <img src={preview} alt="Preview" className="w-full h-auto object-contain" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <p className="text-white font-medium flex items-center gap-2">
                   <UploadCloud size={20} /> 画像を変更
                 </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <ImageIcon size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                クリエイティブをアップロード
              </h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                ドラッグ＆ドロップ、またはクリックしてファイルを選択（JPG, PNG）
              </p>
            </>
          )}
        </div>
      </div>
      {isAnalyzing && (
        <div className="mt-4 text-center animate-pulse">
           <p className="text-blue-600 font-medium">Geminiがクリエイティブを分析中...しばらくお待ちください</p>
        </div>
      )}
    </div>
  );
};
