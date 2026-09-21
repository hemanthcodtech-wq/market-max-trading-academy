import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaBookOpen, FaClock, FaFilePdf, FaUser } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SEO from '../../components/common/SEO';

const getDriveFileId = (url) => {
  if (!url) return '';
  const match = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([^/?]+)/i);
  return match?.[1] || '';
};

const getPdfPreviewUrl = (url) => {
  const driveFileId = getDriveFileId(url);
  if (driveFileId) return `https://drive.google.com/file/d/${driveFileId}/preview`;
  return url || '';
};

const isEmbeddablePdf = (url) => Boolean(getDriveFileId(url) || /\.pdf(?:[?#]|$)/i.test(url || ''));

const BlogDetails = () => {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/blogs/${slug}`);
        setArticle(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'This blog could not be found.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-[#06080e] px-4 pt-28 text-center text-gray-400 sm:pt-32">Loading article...</div>;
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#06080e] px-4 pt-28 text-center sm:pt-32">
        <p className="text-red-400">{error || 'Blog not found.'}</p>
        <Link to="/blog" className="mt-5 inline-block text-sm font-bold text-[#D4AF37]">Back to blogs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080e] px-4 pb-20 pt-20 font-inter text-gray-300 sm:px-6 sm:pt-24">
      <SEO title={`${article.title} | MarketMax Trading Academy`} description={article.excerpt || article.title} />
      <article className="mx-auto w-full max-w-4xl">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-400 transition-colors hover:text-[#D4AF37] sm:mb-8">
          <FaArrowLeft size={12} /> Back to blogs
        </button>

        <header className="overflow-hidden rounded-3xl border border-gray-800 bg-[#111722]">
          {article.image ? (
            <img src={article.image} alt={article.title} className="h-48 w-full object-cover sm:h-80" />
          ) : (
            <div className="flex h-56 items-center justify-center bg-gradient-to-br from-[#172033] to-[#0B0F19] text-6xl font-black text-[#D4AF37]/30 sm:h-80">MM</div>
          )}
          <div className="p-5 sm:p-10">
            <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">{article.category || 'Market Insights'}</span>
            <h1 className="mt-5 break-words text-3xl font-black leading-tight text-white sm:text-5xl">{article.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="inline-flex items-center gap-2"><FaUser /> {article.author || 'MarketMax Research Desk'}</span>
              <span className="inline-flex items-center gap-2"><FaClock /> {article.readTime || 'Reading time varies'}</span>
            </div>
            {article.excerpt && <p className="mt-6 text-base leading-relaxed text-gray-400">{article.excerpt}</p>}
          </div>
        </header>

        <div className="mt-5 rounded-3xl border border-gray-800 bg-[#111722] p-5 sm:mt-6 sm:p-10">
          <div className="whitespace-pre-line break-words text-[15px] leading-7 text-gray-300 sm:text-base sm:leading-8">
            {article.content || article.excerpt || 'This article does not have additional content yet.'}
          </div>

          {article.pdfUrl && (
            <section className="mt-10 border-t border-gray-800 pt-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-white"><FaFilePdf className="text-[#D4AF37]" /> Supporting reading material</h2>
              {isEmbeddablePdf(article.pdfUrl) ? (
                <iframe src={getPdfPreviewUrl(article.pdfUrl)} title={`${article.title} PDF`} className="h-[420px] w-full rounded-xl border border-gray-700 bg-white sm:h-[620px]" loading="lazy" />
              ) : (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-gray-400">
                  This resource is a website link and cannot be embedded here.
                  <a href={article.pdfUrl} target="_blank" rel="noreferrer" className="ml-2 font-bold text-[#D4AF37] hover:underline">Open resource</a>
                </div>
              )}
            </section>
          )}

          <div className="mt-8 flex flex-wrap gap-2 border-t border-gray-800 pt-6">
            {(article.tags || []).map((tag) => <span key={tag} className="rounded bg-gray-800/70 px-2.5 py-1 text-xs text-gray-400">#{tag}</span>)}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetails;