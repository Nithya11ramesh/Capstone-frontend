
import PrivateRoute from './PrivateRoute';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './Styles/Main.css';
import './App.css';
//ContextApi's
import { AuthProvider } from './ContextAPI/AuthContext';
import { CourseProvider } from './ContextAPI/CourseContext';
import { EnrollmentProvider } from './ContextAPI/EnrollmentContext';
import { AssignmentProvider } from './ContextAPI/AssignmentContext';
import { LessonProvider } from './ContextAPI/LessonContext';
import { QuizProvider } from './ContextAPI/QuizContext';

//Pages
import Home from './Pages/Home';
import About from './Pages/About';
import Header from './Pages/Header';
import PaymentSuccessPage from './Pages/PaymentSuccessPage';
import Footer from './Pages/Footer';
//Auth
import Register from './Auth/Register';
import Login from './Auth/Login';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import Users from './Auth/Users';
//DashBoards
import AdminDashboard from './DashBoards/AdminDashboard';
import StudentDashboard from './DashBoards/StudentDashboard';
import InstructorDashBoard from './DashBoards/InstructorDashBoard'
//Enrollments
import EnrollmentForm from './Enrollment/EnrollmentForm';
import EnrollmentList from './Enrollment/EnrollmentList';
import EnrollmentDetails from './Enrollment/EnrollmentDetails';
import EnrollmentEditForm from './Enrollment/EnrollmentEditForm';
//Course
import CourseList from './Course/CourseList';
import CourseDetails from './Course/CourseDetails';
import CourseEditForm from './Course/CourseEditForm';
import CreateCourseForm from './Course/CreateCourseForm';
//Lessons
import LessonList from './Lessons/LessonList';
import CreateLesson from './Lessons/CreateLesson';
import LessonEditForm from './Lessons/LessonEditForm';
import LessonDetailed from './Lessons/LessonDetailed';
//Assignments
import AssignmentList from './Assignment/AssignmentList';
import CreateAssignmentForm from './Assignment/CreateAssignmentForm';
//Assignment-Submission
import SubmissionForm from './Assignment/SubmissionForm';
import SubmissionList from './Assignment/SubmissionList';
//Quizzes
import QuizList from './Quiz/QuizList';
import CreateQuizForm from './Quiz/CreateQuizForm';
import EditQuizForm from './Quiz/EditQuizForm';
import QuizSubmissionForm from './Quiz/QuizSubmissionForm';
import QuizSubmissionList from './Quiz/QuizSubmissionList';
//Payments
import PaymentPage from './Payment/PaymentPage';
//Progress Report
import CourseProgress from './DashBoards/CourseProgress';

function App() {
 
  return (
    <AuthProvider>
      <CourseProvider>
        <LessonProvider>
          <QuizProvider>
            <EnrollmentProvider>
              <AssignmentProvider>
                <Router>
                  <Header />
                  <div className='App asap-bold'>
                    <Routes>
                      <Route path='/' element={<Home />} />
                      <Route path='/Home' element={<Home />} />
                      <Route path='/About' element={<About />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/login" element={<Login />} />
                      <Route path='/forgot-password' element={<ForgotPassword />} />
                      <Route path='/reset-password/:token' element={<ResetPassword />} />
                      <Route path='/courses' element={<CourseList />} />
                    
                     

                      {/* Private Routes */}
                      <Route path='/users-details' element={<PrivateRoute><Users /></PrivateRoute>} />
                      <Route path='/admin-dashboard' element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                      <Route path='/instructor-dashboard' element={<PrivateRoute><InstructorDashBoard /></PrivateRoute>} />
                      <Route path='/student-dashboard' element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
                      <Route path='/courses/:courseId' element={<PrivateRoute><CourseDetails /></PrivateRoute>} />
                      <Route path='/create-course' element={<PrivateRoute><CreateCourseForm /></PrivateRoute>} />
                      <Route path='/course-edit/:courseId' element={<PrivateRoute><CourseEditForm /></PrivateRoute>} />
                      <Route path='/enroll/:courseId' element={<PrivateRoute><EnrollmentForm /></PrivateRoute>} />
                      <Route path='/enroll' element={<PrivateRoute><EnrollmentList /></PrivateRoute>} />
                      <Route path='/enroll-details' element={<PrivateRoute><EnrollmentDetails /></PrivateRoute>} />
                      <Route path='/enroll-edit/:enrollmentId' element={<PrivateRoute><EnrollmentEditForm /></PrivateRoute>} />
                      <Route path='/assignments/:courseId' element={<PrivateRoute><AssignmentList /></PrivateRoute>} />
                      <Route path='/create-assignment/:courseId' element={<PrivateRoute><CreateAssignmentForm /></PrivateRoute>} />
                      <Route path='/submit/:assignmentId' element={<PrivateRoute><SubmissionForm /></PrivateRoute>} />
                      <Route path='/submissionList/:assignmentId' element={<PrivateRoute><SubmissionList /></PrivateRoute>} />
                      <Route path='/quizzes/:courseId' element={<PrivateRoute><QuizList /></PrivateRoute>} />
                      <Route path='/create-quiz/:courseId' element={<PrivateRoute><CreateQuizForm /></PrivateRoute>} />
                      <Route path='/quiz-edit/:quizId' element={<PrivateRoute><EditQuizForm /></PrivateRoute>} />
                      <Route path='/quiz-submission/:quizId' element={<PrivateRoute><QuizSubmissionForm /></PrivateRoute>} />
                      <Route path='//quiz-submission-list/:quizId' element={<PrivateRoute><QuizSubmissionList /></PrivateRoute>} />
                      <Route path='/payment/:enrollmentId' element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
                      <Route path='/lessons/:courseId' element={<PrivateRoute><LessonList /></PrivateRoute>} />
                      <Route path='/create-lesson/:courseId' element={<PrivateRoute><CreateLesson /></PrivateRoute>} />
                      <Route path='/edit-lesson/:lessonId' element={<PrivateRoute><LessonEditForm /></PrivateRoute>} />
                      <Route path='/lesson-detailed/:lessonId' element={<PrivateRoute><LessonDetailed /></PrivateRoute>} />
                      <Route path='/progress-report/:courseId' element={<PrivateRoute><CourseProgress /></PrivateRoute>} />
                      <Route path="/payment-success" element={<PrivateRoute><PaymentSuccessPage /></PrivateRoute>} />

                      {/* Redirect non-authenticated users */}
                      <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                  </div>
                  <Footer />
                </Router>
              </AssignmentProvider>
            </EnrollmentProvider>
          </QuizProvider>
        </LessonProvider>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;