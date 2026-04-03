import { useState, useEffect } from 'react';
import { Question, Comment, INITIAL_DATA, User, INITIAL_USERS } from './data';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import QuestionModal from './components/QuestionModal';
import { supabase } from './supabase';

type ViewState = 'login' | 'admin' | 'user';

export default function App() {
  const [view, setView] = useState<ViewState>('login');
  
  // Initialize state with fallback to localStorage if Supabase is not configured
  const [questions, setQuestions] = useState<Question[]>(() => {
    if (!supabase) {
      const saved = localStorage.getItem('app_questions');
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    }
    return [];
  });

  const [users, setUsers] = useState<User[]>(() => {
    if (!supabase) {
      const saved = localStorage.getItem('app_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('app_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Persist to localStorage if Supabase is not used
  useEffect(() => {
    if (!supabase) {
      localStorage.setItem('app_questions', JSON.stringify(questions));
    }
  }, [questions]);

  useEffect(() => {
    if (!supabase) {
      localStorage.setItem('app_users', JSON.stringify(users));
    }
  }, [users]);

  // Fetch data from Supabase on mount
  useEffect(() => {
    if (!supabase) return;

    const fetchData = async () => {
      try {
        // Fetch questions
        const { data: qData, error: qError } = await supabase
          .from('questions')
          .select('*')
          .order('id', { ascending: true });
        
        if (qError) throw qError;

        if (qData && qData.length > 0) {
          setQuestions(qData);
        } else {
          // Seed initial questions if table is empty
          const { data: seededQ, error: seedQError } = await supabase
            .from('questions')
            .insert(INITIAL_DATA)
            .select();
          
          if (seedQError) throw seedQError;
          if (seededQ) setQuestions(seededQ);
        }

        // Fetch users
        const { data: uData, error: uError } = await supabase
          .from('users')
          .select('*')
          .order('id', { ascending: true });

        if (uError) throw uError;

        if (uData && uData.length > 0) {
          setUsers(uData);
        } else {
          // Seed initial users if table is empty
          const { data: seededU, error: seedUError } = await supabase
            .from('users')
            .insert(INITIAL_USERS)
            .select();
          
          if (seedUError) throw seedUError;
          if (seededU) setUsers(seededU);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Persist currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('app_currentUser', JSON.stringify(currentUser));
      setView(currentUser.role);
    } else {
      localStorage.removeItem('app_currentUser');
      setView('login');
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedQuestion(null);
  };

  // Admin Actions - Questions
  const addQuestion = async (q: Omit<Question, 'id' | 'comments'>) => {
    const newQuestion = {
      ...q,
      id: Date.now().toString(),
      comments: []
    };

    if (supabase) {
      try {
        const { error } = await supabase
          .from('questions')
          .insert([newQuestion]);

        if (error) throw error;
        setQuestions([...questions, newQuestion]);
      } catch (error) {
        console.error('Error adding question:', error);
      }
    } else {
      setQuestions([...questions, newQuestion]);
    }
  };

  const editQuestion = async (updatedQ: Question) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('questions')
          .update(updatedQ)
          .eq('id', updatedQ.id);

        if (error) throw error;
        setQuestions(questions.map(q => q.id === updatedQ.id ? updatedQ : q));
      } catch (error) {
        console.error('Error updating question:', error);
      }
    } else {
      setQuestions(questions.map(q => q.id === updatedQ.id ? updatedQ : q));
    }
  };

  const deleteQuestion = async (id: string) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setQuestions(questions.filter(q => q.id !== id));
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    } else {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  // Admin Actions - Users
  const addUser = async (u: Omit<User, 'id'>) => {
    const newUser = {
      ...u,
      id: Date.now().toString()
    };

    if (supabase) {
      try {
        const { error } = await supabase
          .from('users')
          .insert([newUser]);

        if (error) throw error;
        setUsers([...users, newUser]);
      } catch (error) {
        console.error('Error adding user:', error);
      }
    } else {
      setUsers([...users, newUser]);
    }
  };

  const toggleUserStatus = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const updatedUser = { ...user, isActive: !user.isActive };

    if (supabase) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ isActive: updatedUser.isActive })
          .eq('id', id);

        if (error) throw error;
        setUsers(users.map(u => u.id === id ? updatedUser : u));
      } catch (error) {
        console.error('Error toggling user status:', error);
      }
    } else {
      setUsers(users.map(u => u.id === id ? updatedUser : u));
    }
  };

  const deleteUser = async (id: string) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    } else {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // User Actions
  const addComment = async (qId: string, commentData: Omit<Comment, 'id' | 'date'>) => {
    const question = questions.find(q => q.id === qId);
    if (!question) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...commentData
    };

    const updatedComments = [...question.comments, newComment];

    if (supabase) {
      try {
        const { error } = await supabase
          .from('questions')
          .update({ comments: updatedComments })
          .eq('id', qId);

        if (error) throw error;

        setQuestions(questions.map(q => {
          if (q.id === qId) {
            return { ...q, comments: updatedComments };
          }
          return q;
        }));
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    } else {
      setQuestions(questions.map(q => {
        if (q.id === qId) {
          return { ...q, comments: updatedComments };
        }
        return q;
      }));
    }
  };

  return (
    <>
      {view === 'login' && <Login onLogin={handleLogin} users={users} />}
      
      {view === 'admin' && (
        <AdminDashboard 
          questions={questions}
          users={users}
          currentUser={currentUser}
          onAdd={addQuestion}
          onEdit={editQuestion}
          onDelete={deleteQuestion}
          onAddUser={addUser}
          onToggleUserStatus={toggleUserStatus}
          onDeleteUser={deleteUser}
          onLogout={handleLogout}
        />
      )}

      {view === 'user' && (
        <>
          <UserDashboard 
            questions={questions}
            currentUser={currentUser}
            onSelectQuestion={setSelectedQuestion}
            onLogout={handleLogout}
          />
          <QuestionModal 
            question={selectedQuestion}
            isOpen={!!selectedQuestion}
            currentUser={currentUser}
            onClose={() => setSelectedQuestion(null)}
            onAddComment={addComment}
          />
        </>
      )}
    </>
  );
}
