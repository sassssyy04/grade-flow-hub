
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

export interface Student {
  id: string;
  user_id: string;
  grade?: string;
  parent_email?: string;
  subjects: string[];
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  subjects: string[];
  department?: string;
  hire_date?: string;
  created_at: string;
  updated_at: string;
}
