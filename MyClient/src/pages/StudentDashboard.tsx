import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { assignmentService } from '../services/assignmentService';
import { submissionService } from '../services/submissionService';
import { Assignment, Submission, SubmitAssignmentRequest } from '../types';
import Toast from '../components/Toast';

const StudentDashboard: React.FC = () => {
  const [openAssignments, setOpenAssignments] = useState<Assignment[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [submissionData, setSubmissionData] = useState<SubmitAssignmentRequest>({
    assignmentId: '',
    githubLink: '',
    partner: ''
  });
  
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'Student') {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const [assignmentsData, submissionsData, studentsData] = await Promise.all([
        assignmentService.getOpenAssignments(),
        submissionService.getMySubmissions(),
        submissionService.getStudents()
      ]);
      
      setOpenAssignments(assignmentsData);
      setMySubmissions(submissionsData);
      setStudents(studentsData);
    } catch (error: any) {
      setToast({ message: 'שגיאה בטעינת הנתונים', type: 'error' });
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    
    try {
      const submitData = {
        assignmentId: selectedAssignment._id,
        githubLink: submissionData.githubLink,
        partner: submissionData.partner || undefined
      };
      
      await submissionService.submitAssignment(submitData);
      setToast({ message: 'המטלה הוגשה בהצלחה', type: 'success' });
      setSelectedAssignment(null);
      setSubmissionData({ assignmentId: '', githubLink: '', partner: '' });
      loadData();
    } catch (error: any) {
      setToast({ message: 'שגיאה בהגשת המטלה', type: 'error' });
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isAssignmentSubmitted = (assignmentId: string) => {
    return mySubmissions.some(sub => 
      typeof sub.assignmentId === 'object' 
        ? sub.assignmentId._id === assignmentId 
        : sub.assignmentId === assignmentId
    );
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>דשבורד סטודנט</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 300 }}>שלום, {user?.name}</span>
          <button className="luxury-button" onClick={handleLogout}>יציאה</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>מטלות פתוחות</h2>
          {openAssignments.map(assignment => (
            <div 
              key={assignment._id} 
              className="table-row"
              style={{ 
                opacity: isAssignmentSubmitted(assignment._id) ? 0.5 : 1,
                cursor: isAssignmentSubmitted(assignment._id) ? 'default' : 'pointer'
              }}
              onClick={() => !isAssignmentSubmitted(assignment._id) && setSelectedAssignment(assignment)}
            >
              <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>
                {assignment.title}
                {isAssignmentSubmitted(assignment._id) && ' ✓ הוגש'}
              </h3>
              <p style={{ fontWeight: 300, marginBottom: '0.5rem' }}>{assignment.description}</p>
              <p style={{ fontWeight: 300, fontSize: '0.9rem' }}>
                תאריך הגשה: {new Date(assignment.dueDate).toLocaleDateString('he-IL')}
              </p>
              {!isAssignmentSubmitted(assignment._id) && (
                <p style={{ fontWeight: 800, color: '#000', fontSize: '0.9rem' }}>
                  לחץ להגשה
                </p>
              )}
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>ההגשות שלי</h2>
          {mySubmissions.map(submission => (
            <div key={submission._id} className="table-row">
              <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>
                {typeof submission.assignmentId === 'object' ? submission.assignmentId.title : 'מטלה'}
              </h3>
              <p style={{ fontWeight: 300, marginBottom: '0.5rem' }}>
                סטטוס: {submission.isGraded ? `הוערך - ציון: ${submission.grade}` : 'ממתין להערכה'}
              </p>
              {submission.feedback && (
                <p style={{ fontWeight: 300, marginBottom: '0.5rem' }}>
                  משוב: {submission.feedback}
                </p>
              )}
              {submission.partner && (
                <p style={{ fontWeight: 300, marginBottom: '0.5rem' }}>
                  שותף: {typeof submission.partner === 'object' ? submission.partner.name : 'שותף'}
                </p>
              )}
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

      {/* טופס הגשת מטלה */}
      {selectedAssignment && (
        <div className="slide-drawer open">
          <div style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>
              הגשת מטלה: {selectedAssignment.title}
            </h3>
            <p style={{ fontWeight: 300, marginBottom: '2rem' }}>
              {selectedAssignment.description}
            </p>
            <p style={{ fontWeight: 300, marginBottom: '2rem' }}>
              תאריך הגשה: {new Date(selectedAssignment.dueDate).toLocaleDateString('he-IL')}
            </p>
            
            <form onSubmit={handleSubmitAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="url"
                placeholder="קישור GitHub"
                className="luxury-input"
                value={submissionData.githubLink}
                onChange={(e) => setSubmissionData({ ...submissionData, githubLink: e.target.value })}
                required
              />
              
              <select
                className="luxury-input"
                value={submissionData.partner}
                onChange={(e) => setSubmissionData({ ...submissionData, partner: e.target.value })}
              >
                <option value="">בחר שותף (אופציונלי)</option>
                {students
                  .filter(student => student._id !== user?._id)
                  .map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name}
                    </option>
                  ))
                }
              </select>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="luxury-button">הגשה</button>
                <button 
                  type="button" 
                  className="luxury-button"
                  onClick={() => setSelectedAssignment(null)}
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

export default StudentDashboard;