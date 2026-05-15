import React, { useState, useRef } from 'react';
import { 
  Printer, 
  Settings, 
  FileText, 
  Plus, 
  Trash2, 
  Sparkles, 
  Download, 
  ChevronRight,
  School,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Subject, ExamType, Question, ExamData } from './types';
import { generateHOTSQuestions } from './services/geminiService';

export default function App() {
  const [config, setConfig] = useState({
    subject: Subject.BIndonesia,
    examType: ExamType.STS_GANJIL,
    grade: "I (Satu)",
    schoolYear: "2024/2025",
    timeLimit: "90 Menit",
    numPG: 15,
    numIsian: 10,
    numUraian: 5,
    topics: ""
  });

  const gradeOptions = [
    "I (Satu)",
    "II (Dua)",
    "III (Tiga)",
    "IV (Empat)",
    "V (Lima)",
    "VI (Enam)"
  ];

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const questions = await generateHOTSQuestions({
        subject: config.subject,
        examType: config.examType,
        grade: config.grade,
        numPG: config.numPG,
        numIsian: config.numIsian,
        numUraian: config.numUraian,
        topics: config.topics
      });
      
      setExamData({
        subject: config.subject,
        examType: config.examType,
        grade: config.grade,
        schoolYear: config.schoolYear,
        timeLimit: config.timeLimit,
        questions
      });
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat membuat soal. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Sidebar / Editor - Hidden on Print */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm no-print">
        <div className="p-6 border-b border-slate-100 bg-slate-900 text-white leading-tight">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-xs">AI</div>
            <h2 className="font-bold text-lg tracking-tight uppercase">Sipeci</h2>
          </div>
          <p className="text-[10px] opacity-70 uppercase tracking-widest leading-none">SDN 1 CEMPAKA • KURIKULUM MERDEKA</p>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto no-scroll-bar">
          <section>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-3 block">
              Informasi Dasar
            </label>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-[10px] text-slate-400 mb-1 font-semibold block">TAHUN PELAJARAN</label>
                <input 
                  type="text" 
                  value={config.schoolYear}
                  onChange={(e) => setConfig({...config, schoolYear: e.target.value})}
                  className="w-full bg-transparent font-semibold outline-none text-sm"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-[10px] text-slate-400 mb-1 font-semibold block">KELAS</label>
                <select 
                  value={config.grade}
                  onChange={(e) => setConfig({...config, grade: e.target.value})}
                  className="w-full bg-transparent font-semibold outline-none text-sm cursor-pointer"
                >
                  {gradeOptions.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-[10px] text-slate-400 mb-1 font-semibold block text-ellipsis overflow-hidden">ALOKASI WAKTU</label>
                <input 
                  type="text" 
                  value={config.timeLimit}
                  onChange={(e) => setConfig({...config, timeLimit: e.target.value})}
                  className="w-full bg-transparent font-semibold outline-none text-sm"
                />
              </div>
            </div>
          </section>

          <section>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-3 block">
              Mata Pelajaran & Ujian
            </label>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-[10px] text-slate-400 mb-1 font-semibold block">MATA PELAJARAN</label>
                <select 
                  value={config.subject}
                  onChange={(e) => setConfig({...config, subject: e.target.value as Subject})}
                  className="w-full bg-transparent font-semibold outline-none text-sm cursor-pointer"
                >
                  {Object.values(Subject).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-[10px] text-slate-400 mb-1 font-semibold block uppercase">Jenis Ujian</label>
                <select 
                  value={config.examType}
                  onChange={(e) => setConfig({...config, examType: e.target.value as ExamType})}
                  className="w-full bg-transparent font-semibold outline-none text-sm cursor-pointer"
                >
                  {Object.values(ExamType).map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-3 block">
              Jumlah Soal
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-[10px] text-slate-400 block font-semibold">PG</label>
                <input 
                  type="number" 
                  value={config.numPG}
                  onChange={(e) => setConfig({...config, numPG: parseInt(e.target.value)})}
                  className="w-full bg-transparent font-semibold outline-none text-sm"
                />
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-[10px] text-slate-400 block font-semibold">ISIAN</label>
                <input 
                  type="number" 
                  value={config.numIsian}
                  onChange={(e) => setConfig({...config, numIsian: parseInt(e.target.value)})}
                  className="w-full bg-transparent font-semibold outline-none text-sm"
                />
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-[10px] text-slate-400 block font-semibold">URAIAN</label>
                <input 
                  type="number" 
                  value={config.numUraian}
                  onChange={(e) => setConfig({...config, numUraian: parseInt(e.target.value)})}
                  className="w-full bg-transparent font-semibold outline-none text-sm"
                />
              </div>
            </div>
          </section>

          <section>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">
              Topik Spesifik (Opsional)
            </label>
            <textarea 
              placeholder="Contoh: Bab 1 Puisi, Bab 2 Cerpen..."
              value={config.topics}
              onChange={(e) => setConfig({...config, topics: e.target.value})}
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
            />
          </section>

          <div className="space-y-3 pt-2">
            <button 
              disabled={isGenerating}
              onClick={handleGenerate}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
              {isGenerating ? "Menyusun..." : "Generate Soal HOTS"}
            </button>

            {examData && (
              <>
                <button 
                  onClick={handlePrint}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs uppercase tracking-widest border border-slate-200 flex items-center justify-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Cetak PDF (F4)
                </button>
                <button 
                  onClick={() => setShowKeys(!showKeys)}
                  className="w-full py-2 text-slate-400 hover:text-slate-800 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className={`w-3 h-3 ${showKeys ? 'text-green-500' : ''}`} />
                  {showKeys ? "Sembunyikan Kunci" : "Lihat Kunci Jawaban"}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="p-6 text-[10px] text-slate-400 border-t border-slate-100 text-center uppercase tracking-widest italic">
          Deep Learning Ready
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 bg-slate-200 p-4 md:p-12 overflow-y-auto no-scroll-bar flex justify-center">
        {!examData && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl shadow-slate-300">
              <FileText className="text-slate-400 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">Edukasi Siap Cetak</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Atur parameter ujian Bapak/Ibu di panel kiri, kemudian sistem AI kami akan menyusun soal Kurikulum Merdeka yang mendalam untuk Anda.
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full shadow-lg shadow-emerald-100"
            />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Menyusun Naskah...</h3>
              <p className="text-slate-500 text-sm animate-pulse tracking-wide uppercase">AI Sedang Merancang Pertanyaan HOTS</p>
            </div>
          </div>
        )}

        {examData && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="paper-f4 bg-white paper-shadow p-[15mm] md:p-[20mm] border border-slate-300 relative print:shadow-none print:p-0 print-container"
              id="print-area"
              ref={printRef}
            >
              <div className="absolute top-0 right-0 p-1 bg-yellow-400 text-[8px] font-bold uppercase rotate-45 translate-x-5 translate-y-2 w-28 text-center shadow no-print">
                HOTS Level
              </div>

              {/* Kop Surat (Header) */}
              <div className="border-b-4 border-double border-slate-800 pb-4 mb-6 relative">
                <div className="flex items-center gap-6">
                  {/* Placeholder for School Logo */}
                  <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border border-slate-300 rounded text-slate-400 italic text-[10px] text-center">
                    Logo<br/>Dinas
                  </div>
                  <div className="flex-1 text-center uppercase">
                    <h2 className="text-[11px] font-bold leading-tight">Pemerintah Kabupaten Cempaka</h2>
                    <h2 className="text-[11px] font-bold leading-tight">Dinas Pendidikan dan Kebudayaan</h2>
                    <h1 className="text-xl font-black tracking-tight mt-1">SD NEGERI 1 CEMPAKA</h1>
                    <p className="text-[9px] italic normal-case mt-1 font-normal">Alamat: Jl. Bunga Melati No. 123, Kec. Cempaka, Kabupaten Cempaka</p>
                  </div>
                  <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border border-slate-300 rounded text-slate-400 italic text-[10px] text-center">
                     Logo<br/>Sekolah
                  </div>
                </div>
              </div>

              {/* Exam Info Header & Nilai Table */}
              <div className="flex justify-between items-start mb-6 text-[10px]">
                <div className="space-y-1.5 flex-1">
                  <div className="flex gap-2"><span className="w-24 font-bold">Nama Siswa</span><span>: .................................................</span></div>
                  <div className="flex gap-2"><span className="w-24 font-bold">Nomor Absen</span><span>: .................................................</span></div>
                  <div className="flex gap-2"><span className="w-24 font-bold">Mata Pelajaran</span><span className="font-bold">: {examData.subject}</span></div>
                  <div className="flex gap-2"><span className="w-24 font-bold">Kelas / Waktu</span><span>: {examData.grade} / {examData.timeLimit}</span></div>
                </div>
                
                {/* Score Section */}
                <div className="w-40 border-2 border-slate-800">
                  <div className="bg-slate-50 border-b-2 border-slate-800 text-center font-bold py-1">NILAI</div>
                  <div className="grid grid-cols-3 divide-x-2 divide-slate-800 h-10">
                    <div className="flex flex-col items-center">
                      <span className="text-[7px] font-bold bg-slate-50 w-full text-center border-b border-slate-800">PG</span>
                      <div className="flex-1"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[7px] font-bold bg-slate-50 w-full text-center border-b border-slate-800">ISIAN</span>
                      <div className="flex-1"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[7px] font-bold bg-slate-50 w-full text-center border-b border-slate-800">URAIAN</span>
                      <div className="flex-1"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 py-1.5 text-center font-bold uppercase text-[11px] border border-slate-300 mb-8 leading-tight">
                {examData.examType} - Tahun Ajaran {examData.schoolYear}
              </div>

              {/* Questions Section I: Pilihan Ganda */}
              <div className="mb-8 text-[11px]">
                <h4 className="font-bold mb-3 italic">I. Berilah tanda silang (X) pada huruf A, B, C, atau D pada jawaban yang benar!</h4>
                <div className="space-y-4 pl-2">
                  {examData.questions.filter(q => q.type === 'PG').map((q, idx) => (
                    <div key={q.id}>
                      <div className="flex gap-2">
                        <span className="font-bold w-4 text-right">{idx + 1}.</span>
                        <div className="flex-1">
                          <p className="leading-relaxed mb-2 list-outside">{q.question}</p>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                            <span>A. {(q as any).options.A}</span>
                            <span>B. {(q as any).options.B}</span>
                            <span>C. {(q as any).options.C}</span>
                            <span>D. {(q as any).options.D}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions Section II: Isian */}
              <div className="mb-8 text-[11px]">
                <h4 className="font-bold mb-3 italic">II. Isilah titik-titik di bawah ini dengan jawaban yang singkat dan tepat!</h4>
                <div className="space-y-4 pl-2">
                  {examData.questions.filter(q => q.type === 'Isian').map((q, idx) => (
                    <div key={q.id} className="flex gap-2 items-start">
                      <span className="font-bold w-4 text-right">{idx + 1}.</span>
                      <p className="leading-relaxed">{q.question}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions Section III: Uraian */}
              <div className="mb-8 text-[11px]">
                <h4 className="font-bold mb-3 italic">III. Jawablah pertanyaan-pertanyaan di bawah ini dengan uraian yang jelas!</h4>
                <div className="space-y-8 pl-2">
                  {examData.questions.filter(q => q.type === 'Uraian').map((q, idx) => (
                    <div key={q.id}>
                      <div className="flex gap-2">
                        <span className="font-bold w-4 text-right">{idx + 1}.</span>
                        <p className="leading-relaxed">{q.question}</p>
                      </div>
                      <div className="mt-3 pl-6 space-y-3">
                        <div className="border-b border-dotted border-slate-300 h-5 w-full"></div>
                        <div className="border-b border-dotted border-slate-300 h-5 w-full"></div>
                        <div className="border-b border-dotted border-slate-300 h-5 w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <footer className="mt-auto flex justify-between text-[9px] pt-8 border-t border-slate-200 italic text-slate-400 no-print-footer">
                <span>Pencetak: Sipeci AI Integrated Guru Digital</span>
                <span>F4 Paper Mode • SDN 1 Cempaka</span>
              </footer>

              {/* Answer Keys */}
              {showKeys && (
                <div className="mt-12 pt-12 border-t-2 border-slate-300 page-break">
                  <h3 className="text-lg font-bold uppercase mb-6 text-center underline">Kunci Jawaban & Panduan Penilaian</h3>
                  
                  <div className="grid grid-cols-2 gap-8 text-[10px]">
                    <section>
                      <h4 className="font-bold mb-3 p-1 bg-slate-50 border border-slate-200 uppercase tracking-tighter">I. Pilihan Ganda</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 italic">
                        {examData.questions.filter(q => q.type === 'PG').map((q, idx) => (
                          <div key={q.id} className="flex gap-2">
                            <span className="w-4 font-bold text-right">{idx + 1}.</span>
                            <span>{q.answer}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                    
                    <section>
                      <h4 className="font-bold mb-3 p-1 bg-slate-50 border border-slate-200 uppercase tracking-tighter">II. Isian Singkat</h4>
                      <div className="space-y-1.5 italic">
                        {examData.questions.filter(q => q.type === 'Isian').map((q, idx) => (
                          <div key={q.id} className="flex gap-2">
                            <span className="w-4 font-bold text-right">{idx + 1}.</span>
                            <p>{q.answer}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <section className="mt-8 text-[10px]">
                    <h4 className="font-bold mb-3 p-1 bg-slate-50 border border-slate-200 uppercase tracking-tighter">III. Uraian</h4>
                    <div className="space-y-6 italic">
                      {examData.questions.filter(q => q.type === 'Uraian').map((q, idx) => (
                        <div key={q.id}>
                          <p className="font-bold text-slate-800">{idx + 1}. Panduan Jawaban:</p>
                          <p className="pl-4 border-l-2 border-slate-200 mt-1">{q.answer}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
