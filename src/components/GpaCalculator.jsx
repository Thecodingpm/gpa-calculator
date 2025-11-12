import React, { useState } from 'react';
import { getPunjabUniGPA } from '../utils/gradingScale';
import './GpaCalculator.css';

const GpaCalculator = () => {
  const [calculationType, setCalculationType] = useState('gpa'); // 'gpa' or 'cgpa'
  const [semesters, setSemesters] = useState([
    {
      id: 1,
      name: 'Semester 1',
      courses: [
        { id: 1, name: '', marks: '', credits: 3, grade: '', gradePoints: 0 }
      ]
    }
  ]);
  
  // CGPA mode: stores semester GPAs and credit hours
  const [cgpaSemesters, setCgpaSemesters] = useState([
    {
      id: 1,
      name: 'Semester 1',
      gpa: '',
      credits: ''
    }
  ]);

  const gradeScale = [
    { percentage: '85 & Above', letter: 'A', points: 4.00 },
    { percentage: '80-84', letter: 'A-', points: 3.70 },
    { percentage: '75-79', letter: 'B+', points: 3.30 },
    { percentage: '70-74', letter: 'B', points: 3.00 },
    { percentage: '65-69', letter: 'B-', points: 2.70 },
    { percentage: '61-64', letter: 'C+', points: 2.30 },
    { percentage: '58-60', letter: 'C', points: 2.00 },
    { percentage: '55-57', letter: 'C-', points: 1.70 },
    { percentage: '50-54', letter: 'D', points: 1.00 },
    { percentage: 'Below 50', letter: 'F', points: 0.00 }
  ];

  const calculateGradePoints = (marks) => {
    return getPunjabUniGPA(parseFloat(marks) || 0);
  };

  const calculateSemesterGPA = (courses) => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.marks && course.credits && course.credits > 0) {
        const gradePoints = calculateGradePoints(course.marks);
        totalPoints += gradePoints * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const calculateCGPAFromSemesters = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    cgpaSemesters.forEach(semester => {
      const gpa = parseFloat(semester.gpa) || 0;
      const credits = parseFloat(semester.credits) || 0;
      if (gpa > 0 && credits > 0) {
        totalPoints += gpa * credits;
        totalCredits += credits;
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const calculateCurrentGPA = () => {
    if (calculationType === 'cgpa') {
      return calculateCGPAFromSemesters();
    }
    
    // For GPA calculation, only consider the first semester
    if (semesters.length > 0) {
      return calculateSemesterGPA(semesters[0].courses);
    }
    return 0;
  };

  const updateCourse = (semesterId, courseId, field, value) => {
    setSemesters(prev => prev.map(semester => {
      if (semester.id === semesterId) {
        return {
          ...semester,
          courses: semester.courses.map(course => {
            if (course.id === courseId) {
              const updatedCourse = { ...course, [field]: value };
              if (field === 'marks') {
                updatedCourse.gradePoints = calculateGradePoints(value);
                updatedCourse.grade = gradeScale.find(g => 
                  g.points === updatedCourse.gradePoints
                )?.letter || '';
              } else if (field === 'grade') {
                const selectedGrade = gradeScale.find(g => g.letter === value);
                if (selectedGrade) {
                  updatedCourse.gradePoints = selectedGrade.points;
                  // Convert grade back to approximate marks for display
                  const gradeToMarks = {
                    'A': 90, 'A-': 82, 'B+': 77, 'B': 72, 'B-': 67,
                    'C+': 62, 'C': 59, 'C-': 56, 'D': 52, 'F': 0
                  };
                  updatedCourse.marks = gradeToMarks[value] || '';
                }
              }
              return updatedCourse;
            }
            return course;
          })
        };
      }
      return semester;
    }));
  };

  const addCourse = (semesterId) => {
    setSemesters(prev => prev.map(semester => {
      if (semester.id === semesterId) {
        const newCourseId = Math.max(...semester.courses.map(c => c.id)) + 1;
        return {
          ...semester,
          courses: [...semester.courses, {
            id: newCourseId,
            name: '',
            marks: '',
            credits: 3,
            grade: '',
            gradePoints: 0
          }]
        };
      }
      return semester;
    }));
  };

  const removeCourse = (semesterId, courseId) => {
    setSemesters(prev => prev.map(semester => {
      if (semester.id === semesterId) {
        return {
          ...semester,
          courses: semester.courses.filter(course => course.id !== courseId)
        };
      }
      return semester;
    }));
  };

  const addSemester = () => {
    const newSemesterId = Math.max(...semesters.map(s => s.id)) + 1;
    setSemesters(prev => [...prev, {
      id: newSemesterId,
      name: `Semester ${newSemesterId}`,
      courses: [{
        id: 1,
        name: '',
        marks: '',
        credits: 3,
        grade: '',
        gradePoints: 0
      }]
    }]);
  };

  const removeSemester = (semesterId) => {
    if (semesters.length > 1) {
      setSemesters(prev => prev.filter(semester => semester.id !== semesterId));
    }
  };

  // CGPA mode functions
  const updateCgpaSemester = (semesterId, field, value) => {
    setCgpaSemesters(prev => prev.map(semester => {
      if (semester.id === semesterId) {
        return { ...semester, [field]: value };
      }
      return semester;
    }));
  };

  const addCgpaSemester = () => {
    const newSemesterId = Math.max(...cgpaSemesters.map(s => s.id)) + 1;
    setCgpaSemesters(prev => [...prev, {
      id: newSemesterId,
      name: `Semester ${newSemesterId}`,
      gpa: '',
      credits: ''
    }]);
  };

  const removeCgpaSemester = (semesterId) => {
    if (cgpaSemesters.length > 1) {
      setCgpaSemesters(prev => prev.filter(semester => semester.id !== semesterId));
    }
  };

  const currentGPA = calculateCurrentGPA();

  return (
    <div className="gpa-calculator">
      <div className="header">
        <div className="logo">
          <h1>
            <span className="logo-10x">10x</span>
            <span className="logo-text">GPA Calculator</span>
          </h1>
        </div>
        <p className="subtitle">Calculate your Punjab University GPA and CGPA with precision</p>
      </div>

      {/* Calculation Type Toggle - Moved to top */}
      <div className="calculation-type-header">
        <div className="calculation-toggle-top">
          <div className="toggle-container-top">
            <button 
              className={`toggle-btn-top ${calculationType === 'gpa' ? 'active' : ''}`}
              onClick={() => setCalculationType('gpa')}
            >
              GPA
            </button>
            <button 
              className={`toggle-btn-top ${calculationType === 'cgpa' ? 'active' : ''}`}
              onClick={() => setCalculationType('cgpa')}
            >
              CGPA
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="semesters-container">
          {calculationType === 'gpa' ? (
            // GPA Mode: Course-based input
            <>
              {semesters.map((semester, index) => (
                <div key={semester.id} className="semester-card">
                  <div className="semester-header">
                    <h3>{semester.name}</h3>
                    <div className="semester-actions">
                      <span className="semester-gpa">
                        {semester.name} GPA: {calculateSemesterGPA(semester.courses)}
                      </span>
                      {semesters.length > 1 && (
                        <button 
                          className="remove-semester-btn"
                          onClick={() => removeSemester(semester.id)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

              <div className="courses-table">
                <div className="table-header">
                  <div>Course Name</div>
                  <div>Marks</div>
                  <div>Grade</div>
                  <div>Credits</div>
                  <div>Grade Points</div>
                  <div></div>
                </div>

                {semester.courses.map(course => (
                  <div key={course.id} className="course-row">
                    <div className="course-field">
                      <label className="field-label-mobile">Course Name</label>
                      <input
                        type="text"
                        placeholder="Enter course name"
                        value={course.name}
                        onChange={(e) => updateCourse(semester.id, course.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="course-field">
                      <label className="field-label-mobile">Marks</label>
                      <input
                        type="number"
                        placeholder="Marks"
                        min="0"
                        max="100"
                        value={course.marks}
                        onChange={(e) => updateCourse(semester.id, course.id, 'marks', e.target.value)}
                      />
                    </div>
                    <div className="course-field">
                      <label className="field-label-mobile">Grade</label>
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(semester.id, course.id, 'grade', e.target.value)}
                        className="grade-select"
                      >
                        <option value="">Select Grade</option>
                        {gradeScale.map((grade, index) => (
                          <option key={index} value={grade.letter}>
                            {grade.letter}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="course-field">
                      <label className="field-label-mobile">Credits</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[1-6]"
                        placeholder="Credit Hours"
                        value={course.credits === 0 || course.credits === '' ? '' : course.credits}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          // Allow empty string for clearing
                          if (value === '') {
                            updateCourse(semester.id, course.id, 'credits', 0);
                            return;
                          }
                          // Only allow digits 1-6, no leading zeros
                          const numValue = parseInt(value, 10);
                          if (!isNaN(numValue) && numValue >= 1 && numValue <= 6) {
                            // Prevent leading zeros by using the parsed number directly
                            updateCourse(semester.id, course.id, 'credits', numValue);
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value.trim();
                          if (value === '' || value === '0' || parseInt(value, 10) === 0) {
                            updateCourse(semester.id, course.id, 'credits', 3);
                          }
                        }}
                      />
                    </div>
                    <div className="course-field">
                      <label className="field-label-mobile">Grade Points</label>
                      <span className="grade-points">{course.gradePoints.toFixed(2)}</span>
                    </div>
                    <div className="course-field course-actions">
                      <button
                        className="remove-course-btn"
                        onClick={() => removeCourse(semester.id, course.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  className="add-course-btn"
                  onClick={() => addCourse(semester.id)}
                >
                  + Add Course
                </button>
              </div>
            </div>
              ))}
              <button className="add-semester-btn" onClick={addSemester}>
                + Add Semester
              </button>
            </>
          ) : (
            // CGPA Mode: Semester GPA and Credit Hours input
            <>
              {cgpaSemesters.map((semester) => (
                <div key={semester.id} className="cgpa-semester-card">
                  <div className="cgpa-semester-header">
                    <h3>{semester.name}</h3>
                    {cgpaSemesters.length > 1 && (
                      <button 
                        className="remove-semester-btn"
                        onClick={() => removeCgpaSemester(semester.id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="cgpa-semester-inputs">
                    <div className="cgpa-input-field">
                      <label>Semester GPA</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00 - 4.00"
                        value={semester.gpa}
                        onChange={(e) => {
                          let inputValue = e.target.value.replace(/[^0-9.]/g, '');
                          // Prevent multiple decimal points
                          const parts = inputValue.split('.');
                          if (parts.length > 2) {
                            inputValue = parts[0] + '.' + parts.slice(1).join('');
                          }
                          // Limit to 2 decimal places
                          if (parts.length === 2 && parts[1].length > 2) {
                            inputValue = parts[0] + '.' + parts[1].substring(0, 2);
                          }
                          // Allow empty string or values between 0 and 4.00
                          if (inputValue === '' || inputValue === '.') {
                            updateCgpaSemester(semester.id, 'gpa', inputValue);
                          } else {
                            const numValue = parseFloat(inputValue);
                            if (!isNaN(numValue) && numValue >= 0 && numValue <= 4.0) {
                              updateCgpaSemester(semester.id, 'gpa', inputValue);
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="cgpa-input-field">
                      <label>Credit Hours</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Total Credit Hours"
                        value={semester.credits === 0 || semester.credits === '' ? '' : semester.credits}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          if (value === '') {
                            updateCgpaSemester(semester.id, 'credits', '');
                            return;
                          }
                          const numValue = parseInt(value, 10);
                          if (!isNaN(numValue) && numValue >= 1 && numValue <= 50) {
                            updateCgpaSemester(semester.id, 'credits', numValue);
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value.trim();
                          if (value === '' || value === '0' || parseInt(value, 10) === 0) {
                            updateCgpaSemester(semester.id, 'credits', '');
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="add-semester-btn" onClick={addCgpaSemester}>
                + Add Semester
              </button>
            </>
          )}
        </div>

        <div className="gpa-display">
          <div className="cumulative-gpa">
            <h3>{calculationType === 'gpa' ? 'Semester GPA' : 'Cumulative GPA'}</h3>
            <div className="gpa-circle">
              <span className="gpa-value">{currentGPA}</span>
              <div className="gpa-scale">0.0 - 4.0</div>
            </div>
          </div>

          <div className="grading-scale">
            <h4>Grading Scale</h4>
            <div className="scale-table">
              {gradeScale.map((grade, index) => (
                <div key={index} className="scale-row">
                  <span className="percentage">{grade.percentage}</span>
                  <span className="letter">{grade.letter}</span>
                  <span className="points">{grade.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="footer-content">
          <div className="footer-text">
            <p>Made with ❤️ by <a href="https://www.linkedin.com/in/muhammad-ahmad-b71483261/" target="_blank" rel="noopener noreferrer" className="footer-link">Ahmad</a></p>
            <p className="footer-subtitle">© 2024 10xGPA Calculator</p>
          </div>
          <div className="footer-social">
            <a href="https://github.com/Thecodingpm" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/muhammad-ahmad-b71483261/" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GpaCalculator;