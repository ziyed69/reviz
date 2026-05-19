"use client";

type Props = {
  loading: boolean;
  fileName?: string | null;
  onFile: (f: File) => void;
};

export function PdfUploader({ loading, fileName, onFile }: Props) {
  return (
    <div
      className="upload-zone"
      onClick={() => document.getElementById("reviz-pdf")?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
      role="button"
      tabIndex={0}
    >
      <input
        id="reviz-pdf"
        type="file"
        accept="application/pdf,.pdf"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      {loading ? (
        <p className="upload-title">Lecture du PDF…</p>
      ) : (
        <>
          <p className="upload-title">{fileName ? fileName : "Dépose ton PDF de cours"}</p>
          <p className="upload-sub">Tous les modules révision utilisent ce fichier</p>
        </>
      )}
    </div>
  );
}
