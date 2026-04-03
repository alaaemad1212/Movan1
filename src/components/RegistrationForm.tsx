import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

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

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAUDI_CITIES = [
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام',
  'الخبر',
  'الظهران',
  'الأحساء',
  'الطائف',
  'بريدة',
  'تبوك',
  'أبها',
  'خميس مشيط',
  'حائل',
  'نجران',
  'ينبع',
  'الجبيل',
  'أخرى'
];

const INTEREST_TYPES = [
  'متدربة / لاعبة',
  'مدربة رياضية',
  'أخصائية تغذية',
  'أخصائية لياقة بدنية',
  'شريك أو راعي',
  'أخرى'
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    interestType: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate basic fields
      if (formData.fullName.trim().length < 2) throw new Error('يرجى إدخال اسم صحيح');
      
      const phoneClean = formData.phone.replace(/[\s-]/g, '');
      const phoneRegex = /^(05[0-9]{8}|(\+966|966)5[0-9]{8})$/;
      if (!phoneRegex.test(phoneClean)) {
        throw new Error('يرجى إدخال رقم جوال سعودي صحيح (مثال: 05XXXXXXXX)');
      }

      if (!formData.city) throw new Error('يرجى اختيار المدينة');
      if (!formData.interestType) throw new Error('يرجى اختيار نوع الاهتمام');

      try {
        await addDoc(collection(db, 'registrations'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      } catch (firestoreError) {
        handleFirestoreError(firestoreError, OperationType.CREATE, 'registrations');
      }

      setIsSuccess(true);
      setFormData({
        fullName: '',
        phone: '',
        city: '',
        interestType: '',
        notes: ''
      });
    } catch (err: any) {
      console.error('Error submitting form:', err);
      // Parse the JSON error if it's from handleFirestoreError
      let errorMessage = err.message;
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error && parsed.error.includes('Missing or insufficient permissions')) {
          errorMessage = 'عذراً، لا تملك الصلاحية للتسجيل. يرجى التأكد من صحة البيانات.';
        } else {
          errorMessage = 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.';
        }
      } catch (e) {
        errorMessage = err.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.';
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-movanNavy/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* Header */}
            <div className="bg-movanNavy p-6 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-2xl font-black">سجلي اهتمامك</h3>
                <p className="text-sm text-gray-300 mt-1">كوني جزءاً من مجتمع موفان الرياضي</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-movanNavy mb-2">تم التسجيل بنجاح!</h4>
                  <p className="text-gray-600 mb-8">
                    شكراً لاهتمامك بموفان. لقد استلمنا بياناتك وسنتواصل معك قريباً جداً.
                  </p>
                  <button 
                    onClick={onClose}
                    className="bg-movanGreen hover:bg-movanDarkGreen text-white px-8 py-3 rounded-xl font-bold transition-colors w-full"
                  >
                    إغلاق
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-movanNavy mb-1">الاسم الكامل <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-movanGreen focus:ring-2 focus:ring-movanGreen/20 outline-none transition-all"
                      placeholder="الاسم الثلاثي"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-movanNavy mb-1">رقم الجوال / الواتساب <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      dir="ltr"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-movanGreen focus:ring-2 focus:ring-movanGreen/20 outline-none transition-all text-right"
                      placeholder="05XXXXXXXX"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-movanNavy mb-1">المدينة <span className="text-red-500">*</span></label>
                      <select 
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-movanGreen focus:ring-2 focus:ring-movanGreen/20 outline-none transition-all bg-white"
                      >
                        <option value="" disabled>اختر المدينة</option>
                        {SAUDI_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-movanNavy mb-1">نوع الاهتمام <span className="text-red-500">*</span></label>
                      <select 
                        name="interestType"
                        required
                        value={formData.interestType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-movanGreen focus:ring-2 focus:ring-movanGreen/20 outline-none transition-all bg-white"
                      >
                        <option value="" disabled>اختر النوع</option>
                        {INTEREST_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-movanNavy mb-1">ملاحظات إضافية (اختياري)</label>
                    <textarea 
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-movanGreen focus:ring-2 focus:ring-movanGreen/20 outline-none transition-all resize-none"
                      placeholder="أي استفسارات أو معلومات إضافية تودين مشاركتها..."
                    ></textarea>
                  </div>

                  <div className="pt-4 shrink-0">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-movanGreen hover:bg-movanDarkGreen text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={24} />
                          جاري التسجيل...
                        </>
                      ) : (
                        'تأكيد التسجيل'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
