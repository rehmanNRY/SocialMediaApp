import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalPortal from "@/components/common/ModalPortal";
import { useDispatch, useSelector } from "react-redux";
import { editPost } from "@/redux/posts/postsSlice";
import { FiX, FiSave, FiEdit2, FiFeather, FiCheck, FiAlertCircle } from "react-icons/fi";
import { patternStyles } from "@/constants";

// Edit Post Modal Component
const EditPostModal = ({ isOpen, onClose, post }) => {
  const dispatch = useDispatch();
  const [editContent, setEditContent] = useState(post.content);
  const [editBackgroundColor, setEditBackgroundColor] = useState(post.backgroundColor || 'bg-white');
  const { userDetails } = useSelector((state) => state.auth);
  const [charCount, setCharCount] = useState(post.content.length);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);

  // Reset state when modal opens with new post
  useEffect(() => {
    if (isOpen) {
      setEditContent(post.content);
      setEditBackgroundColor(post.backgroundColor || 'bg-white');
      setCharCount(post.content.length);
    }
  }, [isOpen, post]);

  const handleSaveEdit = async (newContent, newBackgroundColor) => {
    setIsSaving(true);
    await dispatch(editPost({
      postId: post._id,
      content: newContent,
      backgroundColor: newBackgroundColor
    }));
    setEditContent(newContent);
    setEditBackgroundColor(newBackgroundColor);
    setIsSaving(false);
    setShowSuccessIndicator(true);
    setTimeout(() => setShowSuccessIndicator(false), 1000);
  };

  const handleSave = () => {
    handleSaveEdit(editContent, editBackgroundColor);
    setTimeout(() => onClose(), 1200);
  };

  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setEditContent(text);
      setCharCount(text.length);
    }
  };

  const getColorPreviewClass = (color) => {
    return `w-full h-full rounded-lg ${color}`;
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`${editBackgroundColor} rounded-2xl p-7 w-full max-w-[42rem] shadow-2xl mx-4 border border-gray-100`}
            style={editBackgroundColor?.includes('pattern-') ? patternStyles[editBackgroundColor.split(' ').find(cls => cls.startsWith('pattern-'))] : {}}
          >
            <div className="flex justify-between items-center mb-7">
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <img
                    className="w-16 h-16 object-cover rounded-full shadow-lg ring-3 ring-indigo-100"
                    src={userDetails?.profilePicture || 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg'}
                    alt={userDetails?.fullName}
                  />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white"
                  ></motion.div>
                </motion.div>
                <div>
                  <motion.h3 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-bold text-2xl text-gray-900"
                  >
                    Edit Post
                  </motion.h3>
                  <motion.p 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-gray-500"
                  >
                    Refine your thoughts and make them shine
                  </motion.p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white/80 p-2 rounded-full shadow-sm"
              >
                <FiX className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FiFeather className="text-indigo-500" />
                    Your Thoughts
                  </label>
                  <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    charCount > 90 ? 'bg-red-100 text-red-600' : 
                    charCount > 70 ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-green-100 text-green-600'
                  }`}>
                    {charCount}/100
                  </span>
                </div>
                <motion.div
                  whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  className="relative"
                >
                  <motion.textarea
                    initial={{ height: "150px" }}
                    animate={{ height: editContent.length > 80 ? "180px" : "150px" }}
                    value={editContent}
                    onChange={handleContentChange}
                    rows={3}
                    className="w-full p-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-gray-700 shadow-sm"
                    placeholder="Share your thoughts..."
                  />
                  {charCount >= 100 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-3 bottom-3 text-red-500 flex items-center gap-1 text-sm bg-white/90 px-2 py-1 rounded-lg"
                    >
                      <FiAlertCircle />
                      <span>Character limit reached</span>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Background Style</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                  {[
                    { value: 'bg-white', label: 'Clean White' },
                    { value: 'bg-blue-50', label: 'Soft Blue' },
                    { value: 'bg-purple-50', label: 'Lavender' },
                    { value: 'bg-green-50', label: 'Mint' },
                    { value: 'bg-yellow-50', label: 'Warm Yellow' }
                  ].map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ y: -2, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setEditBackgroundColor(option.value)}
                      className={`cursor-pointer h-12 rounded-lg border-2 ${
                        editBackgroundColor === option.value 
                          ? 'border-indigo-500 shadow-md' 
                          : 'border-gray-200'
                      } overflow-hidden relative`}
                    >
                      <div className={getColorPreviewClass(option.value)}></div>
                      {editBackgroundColor === option.value && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1 right-1 bg-indigo-500 rounded-full p-0.5"
                        >
                          <FiCheck className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <motion.select
                  whileHover={{ scale: 1.01 }}
                  value={editBackgroundColor}
                  onChange={(e) => setEditBackgroundColor(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer shadow-sm"
                >
                  <option value="bg-white">Clean White</option>
                  <option value="bg-blue-50">Soft Blue</option>
                  <option value="bg-purple-50">Lavender Mist</option>
                  <option value="bg-green-50">Mint Green</option>
                  <option value="bg-yellow-50">Warm Yellow</option>
                  <option value="bg-pink-50">Rose Pink</option>
                  <option value="pattern-dots bg-white">Playful Dots</option>
                  <option value="pattern-grid bg-white">Modern Grid</option>
                  <option value="pattern-stars bg-white">Starry Night</option>
                  <option value="pattern-waves bg-white">Ocean Waves</option>
                  <option value="pattern-hearts bg-white">Lovely Hearts</option>
                </motion.select>
              </motion.div>
            </div>

            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end gap-3 mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#4338ca" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md relative overflow-hidden ${isSaving ? 'opacity-90' : ''}`}
              >
                {showSuccessIndicator ? (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </>
                )}
                {isSaving && (
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1 }}
                    className="absolute bottom-0 left-0 h-1 bg-white/30"
                  />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ModalPortal>
  );
};

export default EditPostModal;