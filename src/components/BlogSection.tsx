import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronRight, Clock, Tag, X } from "lucide-react";
import { BlogPost } from "../types";
import { playHoverSound, playClickSound } from "../utils/audio";
import Markdown from "react-markdown";

export default function BlogSection() {
  const { blogPosts } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  const categories = ["All", ...Array.from(new Set(blogPosts.map(post => post.category)))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="blog" className="py-16 md:py-24 px-4 md:px-8 bg-black/40 border-y border-white/5 relative z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-blue-500/20 text-indigo-400 text-xs font-mono mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Insights & Learning
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-sans font-bold text-white mb-6"
          >
            My <span className="text-indigo-400">Blog</span>
          </motion.h2>

          {/* Search and Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-full py-3 pl-12 pr-4 text-sm font-mono text-white outline-none placeholder-slate-500 transition"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHoverSound}
                  key={cat}
                  onClick={() => {
                    playClickSound();
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-1.5 rounded-full font-mono text-xs transition border backdrop-blur-md ${
                    selectedCategory === cat
                      ? "bg-blue-500 text-white border-indigo-400"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-[#030712]/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-indigo-500/50 transition-colors group backdrop-blur-md"
              >
                <div className="flex justify-between items-start text-xs font-mono text-slate-400">
                  <span className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded-full">
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHoverSound}
                  onClick={() => {
                    playClickSound();
                    setReadingPost(post);
                  }}
                  className="mt-4 flex items-center gap-2 text-sm font-mono text-indigo-400 hover:text-indigo-300 transition-colors w-fit"
                >
                  Read Article
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.article>
            ))}
          </AnimatePresence>
          {filteredPosts.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400 font-mono">
              No articles found matching your criteria.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {readingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReadingPost(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-[#030712] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-10 z-10 custom-scrollbar"
            >
              <button
                onClick={() => setReadingPost(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="mb-8 pr-12">
                 <span className="text-indigo-400 font-mono text-xs uppercase tracking-widest">{readingPost.category}</span>
                 <h2 className="text-3xl md:text-4xl font-sans font-bold text-white mt-3 mb-4">{readingPost.title}</h2>
                 <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                   <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {readingPost.readTime}</span>
                   <span>{readingPost.date}</span>
                 </div>
              </div>

              <div className="text-slate-300 font-sans leading-relaxed space-y-6 markdown-body">
                 <Markdown>{readingPost.content}</Markdown>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
