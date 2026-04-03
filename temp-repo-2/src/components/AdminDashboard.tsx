import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, AlertTriangle, Users, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Question, User } from '../data';

interface AdminDashboardProps {
  questions: Question[];
  users: User[];
  currentUser: User | null;
  onAdd: (q: Omit<Question, 'id' | 'comments'>) => void;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  onAddUser: (u: Omit<User, 'id'>) => void;
  onToggleUserStatus: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({ 
  questions, 
  users,
  currentUser,
  onAdd, 
  onEdit, 
  onDelete, 
  onAddUser,
  onToggleUserStatus,
  onDeleteUser,
  onLogout 
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'questions' | 'users'>('questions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({});
  const [userFormState, setUserFormState] = useState<Partial<User>>({});
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'question' | 'user' | null>(null);

  // Question Modals
  const openAddModal = () => {
    setCurrentQuestion({ isVisible: true, sources: [], comments: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (q: Question) => {
    setCurrentQuestion({ ...q });
    setIsModalOpen(true);
  };

  const openDeleteQuestionModal = (id: string) => {
    setDeleteId(id);
    setDeleteType('question');
    setIsDeleteModalOpen(true);
  };

  // User Modals
  const openAddUserModal = () => {
    setUserFormState({ isActive: true, role: 'user' });
    setIsUserModalOpen(true);
  };

  const openDeleteUserModal = (id: string) => {
    setDeleteId(id);
    setDeleteType('user');
    setIsDeleteModalOpen(true);
  };

  // Save Handlers
  const handleSaveQuestion = () => {
    if (currentQuestion.text && currentQuestion.answer) {
      if (currentQuestion.id) {
        onEdit(currentQuestion as Question);
      } else {
        onAdd(currentQuestion as Omit<Question, 'id' | 'comments'>);
      }
      setIsModalOpen(false);
    }
  };

  const handleSaveUser = () => {
    if (userFormState.username && userFormState.password) {
      onAddUser(userFormState as Omit<User, 'id'>);
      setIsUserModalOpen(false);
    }
  };

  // Delete Handler
  const confirmDelete = () => {
    if (deleteId && deleteType) {
      if (deleteType === 'question') {
        onDelete(deleteId);
      } else {
        onDeleteUser(deleteId);
      }
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      setDeleteType(null);
    }
  };

  const toggleVisibility = (q: Question) => {
    onEdit({ ...q, isVisible: !q.isVisible });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-slate-900">AD</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-none">Admin Dashboard</h1>
              {currentUser && <p className="text-xs text-slate-400">Logged in as {currentUser.name}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'questions' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText size={16} />
              Questions
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'users' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users size={16} />
              Users
            </button>
          </div>

          <div className="flex items-center gap-4">
            {activeTab === 'questions' ? (
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                Add Question
              </button>
            ) : (
              <button 
                onClick={openAddUserModal}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                Add User
              </button>
            )}
            <button 
              onClick={onLogout}
              className="text-slate-400 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'questions' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">#</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">Question</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expert Notes</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {questions.map((q, idx) => (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleVisibility(q)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            q.isVisible 
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {q.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                          {q.isVisible ? 'Visible' : 'Hidden'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900 line-clamp-2">{q.text}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{q.answer}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                          {q.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-500 line-clamp-2 italic">
                          {q.expertNotes || 'No notes'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(q)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => openDeleteQuestionModal(q.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{u.name || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => onToggleUserStatus(u.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            u.isActive 
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {u.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {u.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openDeleteUserModal(u.id)}
                          disabled={u.role === 'admin'} // Prevent deleting main admin if needed, or implement logic to prevent self-delete
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Edit/Add Question Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-900">
                  {currentQuestion.id ? 'Edit Question' : 'New Question'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                    value={currentQuestion.category || ''}
                    onChange={e => setCurrentQuestion({...currentQuestion, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Question Text</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm h-20"
                    value={currentQuestion.text || ''}
                    onChange={e => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Enhanced Answer</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm h-32"
                    value={currentQuestion.answer || ''}
                    onChange={e => setCurrentQuestion({...currentQuestion, answer: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Expert Notes</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm h-20 bg-slate-50"
                    value={currentQuestion.expertNotes || ''}
                    onChange={e => setCurrentQuestion({...currentQuestion, expertNotes: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Sources (comma separated)</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                    value={currentQuestion.sources?.join(', ') || ''}
                    onChange={e => setCurrentQuestion({...currentQuestion, sources: e.target.value.split(',').map(s => s.trim())})}
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveQuestion}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsUserModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-900">Add New User</h3>
                <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                    value={userFormState.name || ''}
                    onChange={e => setUserFormState({...userFormState, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Username</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                    value={userFormState.username || ''}
                    onChange={e => setUserFormState({...userFormState, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                    value={userFormState.password || ''}
                    onChange={e => setUserFormState({...userFormState, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                    value={userFormState.role || 'user'}
                    onChange={e => setUserFormState({...userFormState, role: e.target.value as 'admin' | 'user'})}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm flex items-center gap-2"
                >
                  <Save size={16} />
                  Create User
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsDeleteModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirm Deletion</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete this {deleteType}? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm"
                >
                  Delete Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
