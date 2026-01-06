import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { assignmentService } from '../services/assignmentService';
import { submissionService } from '../services/submissionService';
import { dbService } from '../services/dbService';
import { Assignment, Submission, CreateAssignmentRequest, GradeSubmissionRequest } from '../types';
import Toast from '../components/Toast';

const TeacherDashboard: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [averages, setAverages] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [newAssignment, setNewAssignment] = useState<CreateAssignmentRequest>({
    title: '',
    description: '',
    dueDate: ''
  });
  const [gradeData, setGradeData] = useState<GradeSubmissionRequest>({
    grade: 0,
    feedback: ''
  });
  
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'Teacher') {
      navigate('/login');
      return;
    }
    checkDBConnection();
    loadData();
  }, [user, navigate]);

  const checkDBConnection = async () => {
    try {
      const connected = await dbService.checkConnection();
      setDbConnected(connected);
      if (!connected) {
        setToast({ message: '⚠️ בעיה בחיבור למסד הנתונים', type: 'error' });
      }
    } catch (error) {
      setDbConnected(false);
      setToast({ message: '❌ שגיאה בחיבור למסד הנתונים', type: 'error' });
    }
  };

  const loadData = async () => {
    try {
      const [assignmentsData, submissionsData, averagesData] = await Promise.all([
        assignmentService.getAssignments(),
        submissionService.getAllSubmissions(),
        assignmentService.getAssignmentAverages()
      ]);
      
      setAssignments(assignmentsData);
      setSubmissions(submissionsData);
      setAverages(averagesData);
    } catch (error: any) {
      setToast({ message: 'שגיאה בטעינת הנתונים', type: 'error' });
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignmentService.createAssignment(newAssignment);
      setToast({ message: 'מטלה נוצרה בהצלחה', type: 'success' });
      setShowCreateForm(false);
      setNewAssignment({ title: '', description: '', dueDate: '' });
      loadData();
    } catch (error: any) {
      setToast({ message: 'שגיאה ביצירת המטלה', type: 'error' });
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    
    try {
      await submissionService.gradeSubmission(selectedSubmission._id, gradeData);
      setToast({ message: 'ציון נשמר בהצלחה', type: 'success' });
      setSelectedSubmission(null);
      setGradeData({ grade: 0, feedback: '' });
      loadData();
    } catch (error: any) {
      setToast({ message: 'שגיאה בשמירת הציון', type: 'error' });
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>דשבורד מרצה</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 300 }}>שלום, {user?.name}</span>
          <button className="luxury-button" onClick={handleLogout}>יציאה</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>מטלות</h2>
            <button 
              className="luxury-button"
              onClick={() => setShowCreateForm(true)}
            >
              יצירת מטלה חדשה
            </button>
          </div>
          
          {assignments.length > 0 ? (
            assignments.map(assignment => (
              <div key={assignment._id} className="table-row">
                <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{assignment.title}</h3>
                <p style={{ fontWeight: 300, marginBottom: '0.5rem' }}>{assignment.description}</p>
                <p style={{ fontWeight: 300, fontSize: '0.9rem' }}>
                  תאריך הגשה: {new Date(assignment.dueDate).toLocaleDateString('he-IL')}
                </p>
                <p style={{ fontWeight: 300, fontSize: '0.9rem' }}>
                  סטטוס: {assignment.isOpen ? 'פתוח' : 'סגור'}
                </p>
              </div>
            ))
          ) : (
            <div className="table-row">
              <p style={{ textAlign: 'center', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>
                אין מטלות עדיין. צור מטלה חדשה כדי להתחיל
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>הגשות</h2>
          {submissions.map(submission => (
            <div 
              key={submission._id} 
              className="table-row"
              onClick={() => setSelectedSubmission(submission)}
              style={{ cursor: 'pointer' }}
            >
              <p style={{ fontWeight: 800 }}>
                {typeof submission.studentId === 'object' ? submission.studentId.name : 'סטודנט'}
              </p>
              <p style={{ fontWeight: 300 }}>
                מטלה: {typeof submission.assignmentId === 'object' ? submission.assignmentId.title : 'מטלה'}
              </p>
              <p style={{ fontWeight: 300 }}>
                ציון: {submission.grade || 'לא הוערך'}
              </p>
              <a 
                href={submission.githubLink} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#000', textDecoration: 'underline' }}
              >
                קישור GitHub
              </a>
            </div>
          ))}
        </div>
      </div>

      {averages && (
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>ממוצעים</h2>
          <div className="table-row">
            <p>ממוצע כללי: {averages.overall || 'אין נתונים'}</p>
          </div>
        </div>
      )}

      {/* טופס יצירת מטלה */}
      {showCreateForm && (
        <div className="slide-drawer open">
          <div style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>יצירת מטלה חדשה</h3>
            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="כותרת המטלה"
                className="luxury-input"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                required
              />
              <textarea
                placeholder="תיאור המטלה"
                className="luxury-input"
                rows={4}
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                required
              />
              <input
                type="datetime-local"
                className="luxury-input"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                required
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="luxury-button">יצירה</button>
                <button 
                  type="button" 
                  className="luxury-button"
                  onClick={() => setShowCreateForm(false)}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* טופס מתן ציון */}
      {selectedSubmission && (
        <div className="slide-drawer open">
          <div style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>מתן ציון</h3>
            <p style={{ marginBottom: '1rem' }}>
              סטודנט: {typeof selectedSubmission.studentId === 'object' ? selectedSubmission.studentId.name : 'סטודנט'}
            </p>
            <form onSubmit={handleGradeSubmission} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="number"
                placeholder="ציון (0-100)"
                className="luxury-input"
                min="0"
                max="100"
                value={gradeData.grade}
                onChange={(e) => setGradeData({ ...gradeData, grade: Number(e.target.value) })}
                required
              />
              <textarea
                placeholder="משוב (אופציונלי)"
                className="luxury-input"
                rows={4}
                value={gradeData.feedback}
                onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="luxury-button">שמירת ציון</button>
                <button 
                  type="button" 
                  className="luxury-button"
                  onClick={() => setSelectedSubmission(null)}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;