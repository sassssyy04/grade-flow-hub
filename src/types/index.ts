
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  totalPoints: number;
}

export interface StudentAssignment {
  id: string;
  assignmentId: string;
  studentId: string;
  teacherId: string;
  status: 'assigned' | 'in_progress' | 'submitted' | 'graded';
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  editedPdfUrl?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  grade: string;
  subjects: string[];
  parentEmail?: string;
  createdAt: string;
}
