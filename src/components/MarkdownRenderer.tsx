import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 border-b border-white/10 pb-6 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-16 mb-6 uppercase tracking-wider">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-gold-500 mt-10 mb-4 uppercase tracking-widest">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-slate-300 leading-relaxed text-lg mb-6 font-light">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-4 mb-8 text-slate-300">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="flex gap-3 items-start ml-4 group">
              <span className="text-gold-500 mt-1.5">•</span>
              <span className="group-hover:text-white transition-colors">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="bg-white/5 p-8 rounded-3xl italic border-l-4 border-gold-500 my-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H13.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.017C7.46472 8 7.017 8.44772 7.017 9V12C7.017 12.5523 6.56929 13 6.017 13H5.017V21H6.017Z" />
                </svg>
              </div>
              <div className="relative z-10">{children}</div>
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-gold-500 hover:text-gold-400 transition-colors underline decoration-gold-500/30 underline-offset-4 hover:decoration-gold-500"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-white/10 my-16" />,
          code: ({ children }) => (
            <code className="bg-slate-800 text-gold-400 px-1.5 py-0.5 rounded font-mono text-sm">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
