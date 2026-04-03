import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Plus, MessageSquare, Edit2, Trash2, CheckCircle, Clock, FileText, Database, FolderOpen, Target, Download, ChevronDown, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_SDD_DATA } from '../sddData';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}

interface DDItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'draft' | 'review' | 'final';
  sources?: string[];
  expertNotes?: string;
  authorId: string;
  authorName: string;
  comments: Comment[];
  createdAt: any;
  updatedAt: any;
  order?: number;
}

const CATEGORIES = [
  'Vision, Market & Strategy',
  'Business Model & Technology',
  'Team & Operations',
  'Funding & Growth',
  'أخرى'
];

const stripHtml = (html: string) => {
  if (!html) return '';
  let text = html.replace(/<br\s*[\/]?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n');
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return (doc.body.textContent || "").trim();
};

interface DDItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  editingItem: DDItem | null;
}

function DDItemModal({ isOpen, onClose, onSave, editingItem }: DDItemModalProps) {
  const [question, setQuestion] = useState(editingItem?.question || '');
  const [answer, setAnswer] = useState(editingItem?.answer || '');
  const [category, setCategory] = useState(editingItem?.category || CATEGORIES[0]);
  const [status, setStatus] = useState<'draft' | 'review' | 'final'>(editingItem?.status || 'draft');
  const [sources, setSources] = useState(editingItem?.sources?.join(', ') || '');
  const [expertNotes, setExpertNotes] = useState(editingItem?.expertNotes || '');
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setQuestion(editingItem.question || '');
      setAnswer(editingItem.answer ? stripHtml(editingItem.answer) : '');
      setCategory(editingItem.category || CATEGORIES[0]);
      setStatus(editingItem.status || 'draft');
      setSources(editingItem.sources?.join(', ') || '');
      setExpertNotes(editingItem.expertNotes || '');
      setIsEditingAnswer(false);
    } else {
      setQuestion('');
      setAnswer('');
      setCategory(CATEGORIES[0]);
      setStatus('draft');
      setSources('');
      setExpertNotes('');
      setIsEditingAnswer(true);
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      question,
      answer: isEditingAnswer ? answer : (editingItem?.answer || ''),
      category,
      status,
      sources: sources.split(',').map(s => s.trim()).filter(Boolean),
      expertNotes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-bold mb-4">{editingItem ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">التصنيف</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-movanGreen"
              dir="ltr"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">السؤال (Question)</label>
            <input 
              type="text" 
              required
              value={question} 
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-movanGreen"
              placeholder="e.g. What is Movan’s long‑term vision?"
              dir="ltr"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-gray-700">الإجابة المقترحة (Answer)</label>
              {editingItem && !isEditingAnswer && (
                <button 
                  type="button" 
                  onClick={() => setIsEditingAnswer(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <Edit2 size={12} />
                  تعديل الإجابة
                </button>
              )}
              {editingItem && isEditingAnswer && (
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditingAnswer(false);
                    setAnswer(editingItem.answer ? stripHtml(editingItem.answer) : '');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 font-semibold"
                >
                  إلغاء تعديل الإجابة
                </button>
              )}
            </div>
            {!isEditingAnswer && editingItem ? (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 overflow-hidden break-words max-w-full whitespace-pre-wrap" dir="auto">
                {editingItem.answer ? stripHtml(editingItem.answer) : <span className="text-gray-400 italic">No answer provided yet...</span>}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-300 focus-within:border-movanGreen overflow-hidden">
                <textarea 
                  value={answer} 
                  onChange={(e) => setAnswer(e.target.value)} 
                  placeholder="Write the answer here..."
                  className="w-full min-h-[16rem] p-4 outline-none resize-y"
                  dir="auto"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">المصادر (Sources - مفصولة بفاصلة)</label>
            <input 
              type="text" 
              value={sources} 
              onChange={(e) => setSources(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-movanGreen"
              placeholder="e.g. Vision 2030, Market Analysis"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ملاحظات</label>
            <textarea 
              rows={2}
              value={expertNotes} 
              onChange={(e) => setExpertNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-movanGreen"
              placeholder="Add any expert notes..."
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">الحالة</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-movanGreen"
            >
              <option value="draft">مسودة</option>
              <option value="review">للمراجعة</option>
              <option value="final">نهائي</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="submit"
              className="flex-1 bg-movanGreen text-white py-2 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
            >
              حفظ
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function FoundersHome() {
  const [activeTab, setActiveTab] = useState<'sdd' | 'planning' | 'documents'>('sdd');
  const exportRef = useRef<HTMLDivElement>(null);
  
  // SDD State
  const [items, setItems] = useState<DDItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmingSeed, setIsConfirmingSeed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DDItem | null>(null);

  // Comment State
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  
  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirm Modal State
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

  // User Permissions State
  const [currentUserRole, setCurrentUserRole] = useState<'founder' | 'admin' | 'pending' | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('مستخدم');
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const role = data.role;
        setCurrentUserRole(role);
        setCurrentUserName(data.name || auth.currentUser?.displayName || 'مستخدم');
        
        // Check if user is the main founder or has temporary access
        const isMainFounder = auth.currentUser?.email === 'alaaemad.dev12@gmail.com';
        
        // Check temporary access expiry
        let hasTempAccess = false;
        if (data.founderAccessUntil) {
          const expiryDate = data.founderAccessUntil.toDate ? data.founderAccessUntil.toDate() : new Date(data.founderAccessUntil);
          if (expiryDate > new Date()) {
            hasTempAccess = true;
          }
        }
        
        setCanEdit(isMainFounder || hasTempAccess);
      }
    });

    return () => unsubscribeUser();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'due_diligence'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: DDItem[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as DDItem);
      });
      
      // Sort by order if available
      data.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return 0;
      });
      
      setItems(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleExportPDF = () => {
    if (!canEdit) return;
    setIsExporting(true);

    setTimeout(() => {
      if (!exportRef.current) {
        setIsExporting(false);
        return;
      }

      const opt = {
        margin:       15,
        filename:     'Movan_Checklist.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: true, backgroundColor: '#ffffff' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      try {
        // Handle potential Vite import issues with CommonJS modules
        const generatePdf = typeof html2pdf === 'function' ? html2pdf : (html2pdf as any).default || html2pdf;
        
        generatePdf().set(opt).from(exportRef.current).save().then(() => {
          setIsExporting(false);
        }).catch((err: any) => {
          console.error("PDF Export Error:", err);
          setConfirmModal({
            isOpen: true,
            title: 'خطأ',
            message: 'حدث خطأ أثناء تصدير ملف PDF. يرجى المحاولة مرة أخرى.',
            isAlert: true,
            onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
          });
          setIsExporting(false);
        });
      } catch (err) {
        console.error("PDF Export Sync Error:", err);
        setConfirmModal({
          isOpen: true,
          title: 'خطأ',
          message: 'حدث خطأ في مكتبة التصدير. يرجى المحاولة مرة أخرى.',
          isAlert: true,
          onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
        });
        setIsExporting(false);
      }
    }, 500); // Wait for React to render the template
  };

  const handleExportExcel = () => {
    if (!canEdit) return;
    const data = items.map(item => ({
      'القسم (Category)': item.category,
      'الترتيب (Order)': item.order || '',
      'السؤال (Question)': item.question,
      'الإجابة (Answer)': item.answer ? stripHtml(item.answer) : 'No answer provided yet...',
      'ملاحظات (Notes)': item.expertNotes || '',
      'المصادر (Sources)': item.sources ? item.sources.join(', ') : ''
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movan Checklist");
    XLSX.writeFile(wb, "Movan_Checklist.xlsx");
  };

  const handleExportWord = async () => {
    if (!canEdit) return;
    setIsExporting(true);
    try {
      const children: any[] = [
        new Paragraph({ text: "Movan Checklist", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ 
          text: "This document compiles the key checklist questions and answers for the Movan project.",
          spacing: { after: 400 }
        })
      ];

      CATEGORIES.forEach((category, index) => {
        const categoryItems = items.filter(item => item.category === category);
        if (categoryItems.length === 0) return;

        children.push(new Paragraph({
          text: `Section ${index + 1} — ${category}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }));

        categoryItems.forEach(item => {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: item.order ? `${item.order}. ` : '', bold: true, color: "2563eb" }),
              new TextRun({ text: item.question, bold: true, color: "2563eb" })
            ],
            spacing: { before: 200, after: 100 }
          }));

          children.push(new Paragraph({
            text: item.answer ? stripHtml(item.answer) : "No answer provided yet...",
            spacing: { after: 100 }
          }));

          if (item.expertNotes) {
            children.push(new Paragraph({
              children: [
                new TextRun({ text: "ملاحظات: ", bold: true, color: "854d0e" }),
                new TextRun({ text: item.expertNotes, color: "713f12" })
              ],
              spacing: { after: 100 }
            }));
          }

          if (item.sources && item.sources.length > 0) {
            children.push(new Paragraph({
              children: [
                new TextRun({ text: "المصادر (Sources): ", bold: true, color: "1e40af" }),
                new TextRun({ text: item.sources.join(', '), color: "1e3a8a" })
              ],
              spacing: { after: 200 }
            }));
          }
        });
      });

      const doc = new Document({
        sections: [{ properties: {}, children }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "Movan_Checklist.docx");
    } catch (err) {
      console.error("Word Export Error:", err);
      setConfirmModal({
        isOpen: true,
        title: 'خطأ',
        message: 'حدث خطأ أثناء تصدير ملف Word. يرجى المحاولة مرة أخرى.',
        isAlert: true,
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSeedData = () => {
    if (!auth.currentUser || !canEdit) return;
    if (items.length > 0) {
      setIsConfirmingSeed(true);
    } else {
      executeSeedData();
    }
  };

  const executeSeedData = async () => {
    if (!auth.currentUser || !canEdit) return;
    setIsConfirmingSeed(false);
    setLoading(true);
    try {
      const batch = writeBatch(db);
      
      // Delete existing items first
      items.forEach((item) => {
        batch.delete(doc(db, 'due_diligence', item.id));
      });
      
      INITIAL_SDD_DATA.forEach((item, index) => {
        const docRef = doc(collection(db, 'due_diligence'));
        batch.set(docRef, {
          ...item,
          order: index + 1,
          authorId: auth.currentUser!.uid,
          authorName: currentUserName,
          comments: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      setToastMessage('تم استيراد جميع الأسئلة (38 سؤال) بنجاح!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      console.error('Error seeding data:', error);
      setToastMessage('حدث خطأ أثناء إضافة البيانات. تأكد من صلاحياتك.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (itemData: any) => {
    if (!auth.currentUser || !canEdit) return;

    const finalItemData = {
      ...itemData,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingItem) {
        await updateDoc(doc(db, 'due_diligence', editingItem.id), finalItemData);
      } else {
        const newDocRef = doc(collection(db, 'due_diligence'));
        await setDoc(newDocRef, {
          ...finalItemData,
          order: items.length + 1,
          authorId: auth.currentUser.uid,
          authorName: currentUserName,
          comments: [],
          createdAt: serverTimestamp(),
        });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving DD item:", error);
      setConfirmModal({
        isOpen: true,
        title: 'خطأ',
        message: 'حدث خطأ أثناء الحفظ',
        isAlert: true,
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!canEdit) return;
    setConfirmModal({
      isOpen: true,
      title: 'تأكيد الحذف',
      message: 'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'due_diligence', id));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error("Error deleting DD item:", error);
        }
      }
    });
  };

  const handleAddComment = async (itemId: string, currentComments: Comment[]) => {
    if (!commentText.trim() || !auth.currentUser) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      authorId: auth.currentUser.uid,
      authorName: currentUserName,
      createdAt: new Date().toISOString(),
    };

    try {
      await updateDoc(doc(db, 'due_diligence', itemId), {
        comments: [...currentComments, newComment],
        updatedAt: serverTimestamp()
      });
      setCommentText('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (itemId: string, currentComments: Comment[], commentId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'تأكيد الحذف',
      message: 'هل أنت متأكد من حذف هذا التعليق؟',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const updatedComments = currentComments.filter(c => c.id !== commentId);
          await updateDoc(doc(db, 'due_diligence', itemId), {
            comments: updatedComments,
            updatedAt: serverTimestamp()
          });
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      }
    });
  };

  const handleQuickStatusChange = async (id: string, newStatus: 'draft' | 'review' | 'final') => {
    if (!canEdit) return;
    try {
      await updateDoc(doc(db, 'due_diligence', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating status:", error);
      setToastMessage('حدث خطأ أثناء تحديث الحالة');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const openModal = (item?: DDItem) => {
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'final': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1"><CheckCircle size={12}/> نهائي</span>;
      case 'review': return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1"><Clock size={12}/> للمراجعة</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1"><FileText size={12}/> مسودة</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">بوابة المؤسسين (Founders Home)</h2>
          <p className="text-gray-500 text-sm mt-1">المساحة الخاصة بالمؤسسين لإدارة ومناقشة كافة تفاصيل المشروع</p>
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('sdd')}
          className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'sdd' 
              ? 'border-movanNavy text-movanNavy' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Database size={18} />
          Project Checklist
        </button>
        <button
          onClick={() => setActiveTab('planning')}
          className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'planning' 
              ? 'border-movanNavy text-movanNavy' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Target size={18} />
          التخطيط (Planning)
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'documents' 
              ? 'border-movanNavy text-movanNavy' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <FolderOpen size={18} />
          المستندات (Documents)
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'sdd' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {canEdit && !loading && (
                  <button 
                    onClick={handleSeedData}
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Database size={18} />
                    {items.length > 0 ? 'إعادة استيراد وترتيب الأسئلة' : 'استيراد أسئلة الـ PDF (38 سؤال)'}
                  </button>
                )}
                {canEdit && items.length > 0 && (
                  <div className="relative">
                    <button 
                      onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                      disabled={isExporting}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <Download size={18} />
                      {isExporting ? 'جاري التصدير...' : 'تصدير'}
                      <ChevronDown size={16} />
                    </button>
                    {isExportMenuOpen && !isExporting && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setIsExportMenuOpen(false)}
                        />
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 overflow-hidden">
                          <button 
                            onClick={() => { setIsExportMenuOpen(false); handleExportPDF(); }} 
                            className="w-full text-right px-4 py-3 hover:bg-gray-50 text-gray-700 flex items-center gap-3 transition-colors"
                          >
                            <FileText size={18} className="text-red-500" /> تصدير PDF
                          </button>
                          <button 
                            onClick={() => { setIsExportMenuOpen(false); handleExportExcel(); }} 
                            className="w-full text-right px-4 py-3 hover:bg-gray-50 text-gray-700 flex items-center gap-3 transition-colors border-t border-gray-100"
                          >
                            <FileSpreadsheet size={18} className="text-green-600" /> تصدير Excel
                          </button>
                          <button 
                            onClick={() => { setIsExportMenuOpen(false); handleExportWord(); }} 
                            className="w-full text-right px-4 py-3 hover:bg-gray-50 text-gray-700 flex items-center gap-3 transition-colors border-t border-gray-100"
                          >
                            <FileText size={18} className="text-blue-600" /> تصدير Word
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {canEdit && (
                  <button 
                    onClick={() => openModal()}
                    className="bg-movanNavy hover:bg-opacity-90 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Plus size={18} />
                    إضافة سؤال جديد
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">جاري تحميل البيانات...</div>
            ) : (
              <div className="grid gap-6">
                {items.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {item.category}
                        </span>
                        {canEdit ? (
                          <select
                            value={item.status}
                            onChange={(e) => handleQuickStatusChange(item.id, e.target.value as any)}
                            className={`px-2 py-1 rounded text-xs font-bold outline-none cursor-pointer border-0 ${
                              item.status === 'final' ? 'bg-green-100 text-green-800' :
                              item.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="draft">مسودة</option>
                            <option value="review">للمراجعة</option>
                            <option value="final">نهائي</option>
                          </select>
                        ) : (
                          getStatusBadge(item.status)
                        )}
                      </div>
                      <div className="flex gap-2">
                        {canEdit && (
                          <button onClick={() => openModal(item)} className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit2 size={18} />
                          </button>
                        )}
                        {canEdit && (
                          <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2" dir="ltr">
                      {item.order ? `${item.order}. ` : ''}{item.question}
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 text-gray-700 overflow-hidden break-words max-w-full whitespace-pre-wrap" dir="auto">
                      {item.answer ? stripHtml(item.answer) : <span className="text-gray-400 italic">No answer provided yet...</span>}
                    </div>

                    {(item.expertNotes || (item.sources && item.sources.length > 0)) && (
                      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item.expertNotes && (
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                            <p className="text-xs font-bold text-yellow-800 mb-1">ملاحظات:</p>
                            <p className="text-sm text-yellow-900" dir="ltr">{item.expertNotes}</p>
                          </div>
                        )}
                        {item.sources && item.sources.length > 0 && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <p className="text-xs font-bold text-blue-800 mb-1">المصادر (Sources):</p>
                            <ul className="list-disc list-inside text-sm text-blue-900" dir="ltr">
                              {item.sources.map((src, idx) => <li key={idx}>{src}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4 border-b pb-4">
                      <span>بواسطة: {item.authorName}</span>
                      <button 
                        onClick={() => setActiveCommentId(activeCommentId === item.id ? null : item.id)}
                        className="flex items-center gap-1 hover:text-movanGreen transition-colors font-semibold"
                      >
                        <MessageSquare size={16} />
                        النقاشات ({item.comments?.length || 0})
                      </button>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {activeCommentId === item.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                            {item.comments?.map((comment) => (
                              <div key={comment.id} className="bg-white p-3 rounded border border-gray-100">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-semibold text-sm text-gray-800">{comment.authorName}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">
                                      {new Date(comment.createdAt).toLocaleDateString('ar-SA')}
                                    </span>
                                    {auth.currentUser?.uid === comment.authorId && (
                                      <button onClick={() => handleDeleteComment(item.id, item.comments, comment.id)} className="text-red-400 hover:text-red-600">
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm">{comment.text}</p>
                              </div>
                            ))}

                            <div className="flex gap-2 mt-4">
                              <input 
                                type="text" 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="أضف تعليقاً أو اقتراحاً..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-movanGreen"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(item.id, item.comments || [])}
                              />
                              <button 
                                onClick={() => handleAddComment(item.id, item.comments || [])}
                                className="bg-movanGreen text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90"
                              >
                                إرسال
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-500">
                    لا توجد أسئلة حالياً. ابدأ بإضافة سؤال جديد للمناقشة أو استورد الأسئلة الافتراضية.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'planning' && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <Target size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">قسم التخطيط (Planning)</h3>
            <p className="text-gray-500">هذا القسم قيد التطوير. سيتم إضافة أدوات تخطيط المهام والمراحل قريباً.</p>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">قسم المستندات (Documents)</h3>
            <p className="text-gray-500">هذا القسم قيد التطوير. سيتم إضافة إمكانية رفع ومشاركة الملفات قريباً.</p>
          </div>
        )}
      </div>

      {/* Hidden PDF Export Template */}
      {isExporting && (
        <div id="pdf-export-wrapper" style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '800px' }}>
          <style>{`
            #pdf-export-wrapper * {
              border-color: transparent;
              outline-color: transparent;
              text-decoration-color: transparent;
              box-shadow: none;
            }
          `}</style>
          <div ref={exportRef} className="p-8 text-left w-full" dir="ltr" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', color: '#1f2937' }}>
            <div className="mb-12 border-b-2 pb-6" style={{ borderColor: '#2563eb' }}>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#111827' }}>Movan Checklist</h1>
            <p style={{ color: '#4b5563' }}>
              This document compiles the key checklist questions and answers for the Movan project.
              Language intentionally mixes Arabic and English for clarity with international investors and regional stakeholders.
            </p>
          </div>

          {CATEGORIES.map((category, index) => {
            const categoryItems = items.filter(item => item.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="mb-10">
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b" style={{ color: '#1e40af', borderColor: '#e5e7eb' }}>
                  Section {index + 1} — {category}
                </h2>
                
                <div className="space-y-8">
                  {categoryItems.map((item, itemIndex) => (
                    <div key={item.id} className="break-inside-avoid" style={{ marginBottom: '32px' }}>
                      <h3 className="text-lg font-bold mb-3 break-words" style={{ color: '#2563eb' }}>
                        {item.order ? `${item.order}. ` : ''}{item.question}
                      </h3>
                      <div className="pl-4 border-l-2 overflow-hidden break-words max-w-full whitespace-pre-wrap" dir="auto" style={{ color: '#1f2937', borderColor: '#e5e7eb', marginBottom: '16px' }}>
                        {item.answer ? stripHtml(item.answer) : <span className="italic" style={{ color: '#9ca3af' }}>No answer provided yet...</span>}
                      </div>

                      {(item.expertNotes || (item.sources && item.sources.length > 0)) && (
                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                          {item.expertNotes && (
                            <div style={{ flex: 1, backgroundColor: '#fefce8', padding: '12px', borderRadius: '8px', border: '1px solid #fef08a' }}>
                              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#854d0e', marginBottom: '4px' }}>ملاحظات:</p>
                              <p style={{ fontSize: '14px', color: '#713f12', margin: 0 }} dir="ltr">{item.expertNotes}</p>
                            </div>
                          )}
                          {item.sources && item.sources.length > 0 && (
                            <div style={{ flex: 1, backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', marginBottom: '4px' }}>المصادر (Sources):</p>
                              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                                {item.sources.map((source, idx) => (
                                  <li key={idx} style={{ fontSize: '14px', color: '#1e3a8a' }} dir="ltr">{source}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2"
          >
            <CheckCircle size={20} className="text-green-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
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

      {isConfirmingSeed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md text-center"
          >
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">إعادة استيراد الأسئلة</h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من رغبتك في إعادة استيراد الأسئلة الافتراضية (38 سؤال)؟ 
              <br/><br/>
              <span className="text-red-500 font-semibold">تحذير: سيتم مسح جميع الأسئلة الحالية وإجاباتها ونقاشاتها بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.</span>
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsConfirmingSeed(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={executeSeedData}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
              >
                نعم، مسح واستيراد
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isModalOpen && (
        <DDItemModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}
