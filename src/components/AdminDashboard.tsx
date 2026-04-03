import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, Timestamp, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { LogOut, Users, Calendar, MapPin, Download, Shield, ShieldAlert, Trash2, UserCog, Home, Briefcase, Crown } from 'lucide-react';
import { FoundersHome } from './FoundersHome';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Registration {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  interestType: string;
  notes: string;
  createdAt: Timestamp;
}

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'founder' | 'admin' | 'pending';
  createdAt: Timestamp;
  founderAccessUntil?: Timestamp;
}

export const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'registrations' | 'team' | 'dd'>('registrations');
  const [currentUserRole, setCurrentUserRole] = useState<'founder' | 'admin' | 'pending' | null>(null);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [newUsername, setNewUsername] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
    isAlert?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsAuthReady(true);
      if (!user) {
        setRegistrations([]);
        setTeamMembers([]);
        setCurrentUserRole(null);
        setLoading(false);
      } else {
        // Fetch current user role
        getDoc(doc(db, 'users', user.uid)).then(async docSnap => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Force upgrade the main email to founder if they are currently just admin
            if (user.email === 'alaaemad.dev12@gmail.com' && data.role !== 'founder') {
              await updateDoc(doc(db, 'users', user.uid), { role: 'founder' });
              setCurrentUserRole('founder');
            } else {
              setCurrentUserRole(data.role);
            }
          } else {
            // User document doesn't exist, prompt for username
            setPendingUser(user);
            setNewUsername(user.displayName || '');
            setShowUsernamePrompt(true);
            
            if (user.email === 'alaaemad.dev12@gmail.com') {
              setCurrentUserRole('founder');
            }
          }
        }).catch(err => {
          console.error("Error fetching user role:", err);
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Registration[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Registration);
      });
      setRegistrations(data);
      setLoading(false);
      setError('');
    }, (err) => {
      console.error("Error fetching registrations:", err);
      setError('ليس لديك صلاحية للوصول إلى هذه البيانات. يجب أن تكون مديراً.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'users'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: TeamMember[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as TeamMember);
      });
      setTeamMembers(data);
    }, (err) => {
      console.error("Error fetching team members:", err);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      // Create user document if it doesn't exist
      const userDocRef = doc(db, 'users', loggedInUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        setPendingUser(loggedInUser);
        setNewUsername(loggedInUser.displayName || '');
        setShowUsernamePrompt(true);
      } else {
        const data = userDoc.data();
        if (loggedInUser.email === 'alaaemad.dev12@gmail.com' && data.role !== 'founder') {
          await updateDoc(userDocRef, { role: 'founder' });
          setCurrentUserRole('founder');
        } else {
          setCurrentUserRole(data.role);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setConfirmModal({
        isOpen: true,
        title: 'خطأ في تسجيل الدخول',
        message: 'تعذر تسجيل الدخول. يرجى التأكد من السماح بالنوافذ المنبثقة (Pop-ups) أو استخدام متصفح لا يحظر ملفات تعريف الارتباط للجهات الخارجية.',
        isAlert: true,
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const handleSaveUsername = async () => {
    if (!pendingUser || !newUsername.trim()) return;
    
    try {
      const userDocRef = doc(db, 'users', pendingUser.uid);
      const isFounder = pendingUser.email === 'alaaemad.dev12@gmail.com';
      await setDoc(userDocRef, {
        email: pendingUser.email,
        name: newUsername.trim(),
        role: isFounder ? 'founder' : 'pending',
        createdAt: serverTimestamp()
      });
      setCurrentUserRole(isFounder ? 'founder' : 'pending');
      setShowUsernamePrompt(false);
      setPendingUser(null);
    } catch (error) {
      console.error("Error saving username:", error);
      setConfirmModal({
        isOpen: true,
        title: 'خطأ',
        message: 'حدث خطأ أثناء حفظ اسم المستخدم',
        isAlert: true,
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Don't redirect, just let onAuthStateChanged handle it
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleRole = async (memberId: string, currentRole: string) => {
    try {
      // Main founder can't be demoted
      const member = teamMembers.find(m => m.id === memberId);
      if (member?.email === 'alaaemad.dev12@gmail.com') return;
      
      let newRole = 'pending';
      if (currentRole === 'pending') newRole = 'admin';
      else if (currentRole === 'admin') newRole = 'founder';
      else if (currentRole === 'founder') newRole = 'pending';

      await updateDoc(doc(db, 'users', memberId), { role: newRole });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${memberId}`);
    }
  };

  const grantTemporaryAccess = async (memberId: string, days: number) => {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);
      await updateDoc(doc(db, 'users', memberId), { 
        founderAccessUntil: Timestamp.fromDate(expiryDate) 
      });
      setConfirmModal({
        isOpen: true,
        title: 'نجاح',
        message: `تم منح صلاحية التعديل المؤقتة لمدة ${days} أيام بنجاح.`,
        isAlert: true,
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${memberId}`);
    }
  };

  const revokeTemporaryAccess = async (memberId: string) => {
    try {
      await updateDoc(doc(db, 'users', memberId), { 
        founderAccessUntil: null 
      });
      setConfirmModal({
        isOpen: true,
        title: 'نجاح',
        message: 'تم سحب صلاحية التعديل المؤقتة بنجاح.',
        isAlert: true,
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${memberId}`);
    }
  };

  const deleteMember = async (memberId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'تأكيد الحذف',
      message: 'هل أنت متأكد من حذف هذا العضو نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'users', memberId));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `users/${memberId}`);
        }
      }
    });
  };

  const exportToCSV = () => {
    const headers = ['الاسم', 'رقم الجوال', 'المدينة', 'نوع الاهتمام', 'ملاحظات', 'تاريخ التسجيل'];
    const csvData = registrations.map(reg => [
      reg.fullName,
      reg.phone,
      reg.city,
      reg.interestType,
      reg.notes || '',
      reg.createdAt?.toDate?.()?.toLocaleDateString('ar-SA') || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `movan_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-movanGreen"></div>
      </div>
    );
  }

  if (!user || showUsernamePrompt) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center"
        >
          <div className="text-4xl font-black tracking-tighter text-movanNavy mb-6">
            <span className="text-movanGreen">M</span>OVAN
          </div>
          
          {showUsernamePrompt ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">أهلاً بك في موڤن!</h2>
              <p className="text-gray-500 mb-6">يرجى إدخال اسم المستخدم الخاص بك لإكمال التسجيل</p>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="اسم المستخدم"
                className="w-full p-4 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-movanNavy text-right"
                dir="rtl"
              />
              <button
                onClick={handleSaveUsername}
                disabled={!newUsername.trim()}
                className="w-full bg-movanNavy hover:bg-blue-900 text-white px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                حفظ ومتابعة
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">لوحة الإدارة</h2>
              <p className="text-gray-500 mb-8">يرجى تسجيل الدخول بحساب الإدارة للوصول إلى البيانات.</p>
              
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl mb-6 text-sm text-right border border-yellow-200">
                <strong>ملاحظة هامة:</strong> إذا كنت تواجه مشكلة في تسجيل الدخول (يعود بك إلى هذه الصفحة)، يرجى التأكد من <strong>السماح بالنوافذ المنبثقة (Pop-ups)</strong> و<strong>عدم حظر ملفات تعريف الارتباط للجهات الخارجية (Third-party cookies)</strong> في متصفحك، أو قم بفتح التطبيق في نافذة جديدة.
              </div>

              <button 
                onClick={handleLogin}
                className="w-full bg-movanNavy hover:bg-blue-900 text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                تسجيل الدخول باستخدام Google
              </button>
            </>
          )}
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              dir="rtl"
            >
              <h3 className={`text-xl font-bold mb-2 ${confirmModal.isDestructive ? 'text-red-600' : 'text-gray-900'}`}>
                {confirmModal.title}
              </h3>
              <p className="text-gray-600 mb-6">{confirmModal.message}</p>
              
              <div className="flex gap-3 justify-end">
                {!confirmModal.isAlert && (
                  <button
                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                  >
                    إلغاء
                  </button>
                )}
                <button
                  onClick={confirmModal.onConfirm}
                  className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                    confirmModal.isDestructive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {confirmModal.isAlert ? 'حسناً' : 'تأكيد'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <a href="#/" className="text-3xl font-black tracking-tighter text-movanNavy hover:opacity-80 transition-opacity">
              <span className="text-movanGreen">M</span>OVAN
            </a>
            <div className="h-8 w-px bg-gray-200"></div>
            <h1 className="text-xl font-bold text-gray-800">لوحة الإدارة</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden md:block">
              مرحباً، {user.email}
            </div>
            <a 
              href="#/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Home size={18} />
              <span className="hidden sm:inline">الرئيسية</span>
            </a>
            <button 
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        {!error && (
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'registrations' 
                  ? 'bg-movanNavy text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users size={20} />
              التسجيلات
            </button>
            {user.email === 'alaaemad.dev12@gmail.com' && (
              <button
                onClick={() => setActiveTab('team')}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'team' 
                    ? 'bg-movanNavy text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <UserCog size={20} />
                فريق العمل
              </button>
            )}
            {currentUserRole === 'founder' && (
              <button
                onClick={() => setActiveTab('dd')}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'dd' 
                    ? 'bg-movanNavy text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Briefcase size={20} />
                بوابة المؤسسين (Founders Home)
              </button>
            )}
          </div>
        )}

        {error ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-8 text-center text-red-500 bg-red-50">
            {error}
            <div className="mt-4 text-gray-600 text-sm">
              إذا كنت من فريق العمل، يرجى تسجيل الدخول ثم الطلب من المدير الرئيسي تفعيل حسابك كمدير من تبويب "فريق العمل".
            </div>
          </div>
        ) : activeTab === 'registrations' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between border-r-4 border-movanGreen">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-movanGreen/10 text-movanGreen rounded-full flex items-center justify-center">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">إجمالي المسجلين</p>
                    <p className="text-3xl font-black text-movanNavy">{registrations.length}</p>
                  </div>
                </div>
                <button 
                  onClick={exportToCSV}
                  disabled={registrations.length === 0}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Download size={18} />
                  تصدير CSV
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-movanNavy">سجل الاهتمامات</h2>
              </div>
              
              {loading ? (
                <div className="p-12 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-movanGreen"></div>
                </div>
              ) : registrations.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  لا توجد تسجيلات حتى الآن.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-600 text-sm">
                      <tr>
                        <th className="p-4 font-semibold">الاسم</th>
                        <th className="p-4 font-semibold">رقم الجوال</th>
                        <th className="p-4 font-semibold">المدينة</th>
                        <th className="p-4 font-semibold">نوع الاهتمام</th>
                        <th className="p-4 font-semibold">تاريخ التسجيل</th>
                        <th className="p-4 font-semibold">ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-semibold text-movanNavy">{reg.fullName}</td>
                          <td className="p-4 text-gray-600" dir="ltr">{reg.phone}</td>
                          <td className="p-4 text-gray-600">
                            <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm">
                              <MapPin size={14} />
                              {reg.city}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 bg-movanGreen/10 text-movanGreen px-2 py-1 rounded-md text-sm font-semibold">
                              {reg.interestType}
                            </span>
                          </td>
                          <td className="p-4 text-gray-500 text-sm">
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={14} />
                              {reg.createdAt?.toDate?.()?.toLocaleDateString('ar-SA')}
                            </span>
                          </td>
                          <td className="p-4 text-gray-500 text-sm max-w-xs truncate" title={reg.notes}>
                            {reg.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'dd' && currentUserRole === 'founder' ? (
          <FoundersHome />
        ) : activeTab === 'team' && user.email === 'alaaemad.dev12@gmail.com' ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-movanNavy">إدارة صلاحيات الفريق</h2>
              <p className="text-sm text-gray-500">يمكن للمدراء فقط رؤية البيانات وتعديل الصلاحيات.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="p-4 font-semibold">الاسم</th>
                    <th className="p-4 font-semibold">البريد الإلكتروني</th>
                    <th className="p-4 font-semibold">الصلاحية</th>
                    <th className="p-4 font-semibold">تاريخ الانضمام</th>
                    <th className="p-4 font-semibold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-semibold text-movanNavy">{member.name}</td>
                      <td className="p-4 text-gray-600" dir="ltr">{member.email}</td>
                      <td className="p-4">
                        {member.role === 'founder' ? (
                          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                            <Crown size={14} />
                            مؤسس
                          </span>
                        ) : member.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                            <Shield size={14} />
                            مدير
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                            <ShieldAlert size={14} />
                            قيد الانتظار
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {member.createdAt?.toDate?.()?.toLocaleDateString('ar-SA')}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {currentUserRole === 'founder' && member.role === 'founder' && member.email !== 'alaaemad.dev12@gmail.com' && (
                            <div className="flex flex-col gap-1">
                              {member.founderAccessUntil && member.founderAccessUntil.toDate?.() > new Date() ? (
                                <button
                                  onClick={() => revokeTemporaryAccess(member.id)}
                                  className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold"
                                >
                                  سحب صلاحية التعديل
                                </button>
                              ) : (
                                <button
                                  onClick={() => grantTemporaryAccess(member.id, 7)}
                                  className="px-2 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-xs font-semibold"
                                >
                                  منح تعديل (7 أيام)
                                </button>
                              )}
                            </div>
                          )}
                          <button
                            onClick={() => toggleRole(member.id, member.role)}
                            disabled={member.email === 'alaaemad.dev12@gmail.com' || member.id === user.uid}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                              member.email === 'alaaemad.dev12@gmail.com' || member.id === user.uid
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : member.role === 'founder'
                                  ? 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                                  : member.role === 'admin'
                                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                            }`}
                          >
                            {member.role === 'pending' ? 'ترقية لمدير' : member.role === 'admin' ? 'ترقية لمؤسس' : 'إلغاء الصلاحيات'}
                          </button>
                          <button
                            onClick={() => deleteMember(member.id)}
                            disabled={member.email === 'alaaemad.dev12@gmail.com' || member.id === user.uid}
                            className={`p-1.5 rounded-lg transition-colors ${
                              member.email === 'alaaemad.dev12@gmail.com' || member.id === user.uid
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-red-500 hover:bg-red-50'
                            }`}
                            title="حذف المستخدم"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              dir="rtl"
            >
              <h3 className={`text-xl font-bold mb-2 ${confirmModal.isDestructive ? 'text-red-600' : 'text-gray-900'}`}>
                {confirmModal.title}
              </h3>
              <p className="text-gray-600 mb-6">{confirmModal.message}</p>
              
              <div className="flex gap-3 justify-end">
                {!confirmModal.isAlert && (
                  <button
                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                  >
                    إلغاء
                  </button>
                )}
                <button
                  onClick={confirmModal.onConfirm}
                  className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                    confirmModal.isDestructive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {confirmModal.isAlert ? 'حسناً' : 'تأكيد'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
