export enum Subject {
  PAI = "Pendidikan Agama Islam dan Budi Pekerti",
  Pancasila = "Pendidikan Pancasila",
  BIndonesia = "Bahasa Indonesia",
  BInggris = "Bahasa Inggris",
  PJOK = "PJOK",
  BSunda = "Bahasa Sunda",
  Matematika = "Matematika",
  IPAS = "IPAS",
  Seni = "Seni"
}

export enum ExamType {
  STS_GANJIL = "Sumatif Tengah Semester (STS) Ganjil",
  STS_GENAP = "Sumatif Tengah Semester (STS) Genap",
  ASAS_GANJIL = "Asesmen Sumatif Akhir Semester (ASAS) Ganjil",
  ASAS_GENAP = "Asesmen Sumatif Akhir Semester (ASAS) Genap"
}

export interface QuestionPG {
  id: string;
  type: 'PG';
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string;
}

export interface QuestionIsian {
  id: string;
  type: 'Isian';
  question: string;
  answer: string;
}

export interface QuestionUraian {
  id: string;
  type: 'Uraian';
  question: string;
  answer: string;
}

export type Question = QuestionPG | QuestionIsian | QuestionUraian;

export interface ExamData {
  subject: Subject;
  examType: ExamType;
  grade: string;
  schoolYear: string;
  timeLimit: string;
  questions: Question[];
}
