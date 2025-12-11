'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Home as HomeIcon, Info, MoreHorizontal, MapPin, ShoppingBag, HelpCircle, Menu, X, Lock, ExternalLink, Cpu, Zap, Globe, Shield, Rocket, Code } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  readTime: string;
  featured?: boolean;
}

export default function TechBlog() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Sample tech blog posts
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: '🔧 Unlocking AI Autonomy: Using Custom OpenWebUI Models with Your 3NS Agent Domain',
      excerpt: 'As the AI space rapidly evolves, power users and developers are moving toward self-hosted solutions—especially when it comes to personalization, privacy, and long-term scalability.',
      content: `As the AI space rapidly evolves, power users and developers are moving toward self-hosted solutions—especially when it comes to personalization, privacy, and long-term scalability. One such solution is OpenWebUI, a sleek, customizable interface for interacting with local or remote large language models (LLMs). When paired with 3NS domains, it unlocks a powerful new way to control your AI identity in Web3.

## What is OpenWebUI?

OpenWebUI is an open-source, self-hostable interface for LLMs like LLaMA, Mistral, Mixtral, Dolphin, Phi, DeepSeek, and more. Unlike ChatGPT or Gemini, it doesn't rely on a single cloud provider. You can run it locally using Ollama or Docker, load your own model, and fully customize the user interface and experience.

## Why Use Custom Models?

Running your own model gives you:

• **Privacy**: No third-party access to your queries or data
• **Speed**: Local models can respond faster for lightweight tasks  
• **Personalization**: Fine-tune your model to your niche (e.g. music, crypto, fashion)
• **Offline Access**: No internet? No problem.
• **Cost-efficiency**: No monthly token costs when running locally

## Integrating OpenWebUI Models into 3NS Domains

3NS (3ns.domain) lets you host AI agents under your own Web3 domain. With a setup like yourname.3ns.domain, you can:

• Point your domain to your locally-hosted OpenWebUI agent
• Use your favorite LLM under a clean, decentralized identity
• Share access to your AI agent via public or private gateways
• Build workflows, prompt stacks, or knowledge bases on your own terms

You can even sell your custom OpenWebUI workflows as NFTs via your 3NS domain—think of it as a new revenue stream for agents, researchers, and educators.

## Real-World Use Case

Imagine you're a UK rap researcher or underground music curator. You could train or fine-tune an open-source model on your data, host it on OpenWebUI, and link it to ifuno.3ns.domain . Fans, journalists, or collaborators can interact with your AI agent to get answers, prompts, or recommendations—built from your brain, not just the internet.

## Ready to Build Your Agent?

If you value control, flexibility, and identity, combining OpenWebUI + 3NS might be the most powerful move you make in 2025.

🔗 Join 3NS and claim your Web3 AI agent domain
Start building with your own custom models, today.`,
      author: 'IFUNO Tech',
      publishedAt: '2025-01-15',
      tags: ['3NS', 'AIagents', 'OpenWebUI', 'LLM', 'Web3', 'DecentralizedIdentity', 'Ollama', 'OpenSourceAI', 'SelfHostedLLM', 'PromptEngineering', 'CustomModels'],
      readTime: '5 min read',
      featured: true
    }
  ];

  // Scroll detection for navbar logo
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update page title
  useEffect(() => {
    document.title = 'IFUNO - Tech Blog | AI, Web3, and Emerging Technologies';
  }, []);

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen text-white bg-black overflow-hidden relative">
      {/* Screen Border - Shows video background */}
      <div className="fixed inset-0 z-[-1] p-4">
        <div className="w-full h-full border-4 border-ifuno-green rounded-lg overflow-hidden">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://ik.imagekit.io/vv1coyjgq/wadiz%20this%20snake%20anime2.mp4/ik-video.mp4?updatedAt=1751468769965" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Black overlay for content readability */}
      <div className="fixed inset-0 z-[-1] bg-black/60"></div>

      {/* Large Logo - Starts from very top, disappears on scroll */}
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen ? 'opacity-0 translate-y-[-30px] pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
        <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
          <img 
            src="https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754" 
            alt="IFUNO Logo" 
            className="h-20 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Horizontal Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            {/* Left Side - Back to Main */}
            <div className="flex items-center space-x-6 justify-start">
              <Link
                href="/"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-ifuno-pink transition-all duration-200"
              >
                <HomeIcon className="w-4 h-4" />
                <span className="text-sm font-medium uppercase hidden sm:inline">HOME</span>
              </Link>
              
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-ifuno-green text-black">
                <Cpu className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">TECH</span>
              </div>
            </div>
            
            {/* Center - Logo (only visible when scrolled) */}
            <div className="flex justify-center">
              <div className={`transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity duration-200">
                  <img 
                    src="https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754" 
                    alt="IFUNO Logo" 
                    className="h-10 w-auto object-contain"
                  />
                </Link>
              </div>
            </div>
            
            {/* Right Side - External Links */}
            <div className="flex items-center space-x-6 justify-end">
              <Link
                href="/about"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-ifuno-pink transition-all duration-200"
              >
                <span className="text-sm font-medium uppercase hidden sm:inline">ABOUT</span>
              </Link>
              
              <Link
                href="/shop"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-ifuno-pink transition-all duration-200"
              >
                <span className="text-sm font-medium uppercase hidden sm:inline">SHOP</span>
              </Link>
              
              <a
                href="https://3ns.domains/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-ifuno-pink transition-all duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium uppercase hidden sm:inline">3NS</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`min-h-screen flex flex-col content-wrapper transition-all duration-500 ${
        !isScrolled && !isMobileMenuOpen ? 'pt-28' : 'pt-16'
      }`}>
        <div className="flex-1 max-w-6xl mx-auto px-6 py-8 relative z-10">
          {selectedPost ? (
            /* Individual Blog Post View */
            <div className="max-w-4xl mx-auto">
              <button
                onClick={handleClosePost}
                className="flex items-center space-x-2 text-ifuno-green hover:text-ifuno-pink transition-colors duration-200 mb-8"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">Back to Tech Blog</span>
              </button>

              <article className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-ifuno-pink">
                {/* Post Header */}
                <header className="mb-8 pb-8 border-b border-ifuno-pink">
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                    <span>{selectedPost.author}</span>
                    <span>•</span>
                    <span>{formatDate(selectedPost.publishedAt)}</span>
                    <span>•</span>
                    <span>{selectedPost.readTime}</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-6 title-stroke leading-tight">
                    {selectedPost.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-ifuno-green/20 text-ifuno-green text-xs font-medium rounded-full border border-ifuno-green/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </header>

                {/* Post Content */}
                <div className="prose prose-lg prose-invert max-w-none">
                  {selectedPost.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4 title-stroke">
                          {paragraph.replace('## ', '')}
                        </h2>
                      );
                    } else if (paragraph.startsWith('• ')) {
                      const items = paragraph.split('\n• ').map(item => item.replace(/^• /, ''));
                      return (
                        <ul key={index} className="space-y-2 mb-6">
                          {items.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-gray-300 flex items-start">
                              <span className="text-ifuno-green mr-3 mt-1">•</span>
                              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                            </li>
                          ))}
                        </ul>
                      );
                    } else if (paragraph.includes('🔗')) {
                      return (
                        <div key={index} className="bg-ifuno-green/10 border border-ifuno-green/30 rounded-lg p-6 my-8">
                          <p className="text-ifuno-green font-medium text-center">
                            {paragraph}
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <p key={index} className="text-gray-300 leading-relaxed mb-6">
                          {paragraph}
                        </p>
                      );
                    }
                  })}
                </div>

                {/* Post Footer */}
                <footer className="mt-12 pt-8 border-t border-ifuno-pink">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-ifuno-green rounded-full flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedPost.author}</p>
                        <p className="text-gray-400 text-sm">Tech Writer & AI Researcher</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-ifuno-green text-sm font-medium">
                        Published {formatDate(selectedPost.publishedAt)}
                      </p>
                    </div>
                  </div>
                </footer>
              </article>
            </div>
          ) : (
            /* Blog List View */
            <div className="w-full">
              {/* Section Header */}
              <div className="text-center mb-12">
                <div className={`transition-all duration-300 ${!isScrolled && !isMobileMenuOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  <img 
                    src="https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754" 
                    alt="IFUNO Logo" 
                    className="h-20 w-auto object-contain mx-auto mb-6"
                  />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 title-stroke uppercase">
                  TECH BLOG
                </h1>
                <p className="text-gray-300 text-lg mb-6">
                  AI, Web3, and Emerging Technologies
                </p>
                <div className="w-24 h-1 bg-ifuno-green mx-auto opacity-50"></div>
              </div>

              {/* Featured Post */}
              {blogPosts.filter(post => post.featured).map((post) => (
                <div key={post.id} className="mb-12">
                  <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-ifuno-pink">
                    <div className="flex items-center space-x-2 mb-4">
                      <Zap className="w-5 h-5 text-ifuno-green" />
                      <span className="text-ifuno-green text-sm font-medium uppercase">Featured</span>
                    </div>
                    
                    <article 
                      className="cursor-pointer group"
                      onClick={() => handlePostClick(post)}
                    >
                      <header className="mb-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 title-stroke group-hover:text-ifuno-green transition-colors duration-200">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {post.tags.slice(0, 6).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-ifuno-green/20 text-ifuno-green text-xs font-medium rounded-full border border-ifuno-green/30"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 6 && (
                            <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs font-medium rounded-full">
                              +{post.tags.length - 6} more
                            </span>
                          )}
                        </div>
                      </header>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-ifuno-pink" />
                            <Shield className="w-4 h-4 text-ifuno-green" />
                            <Rocket className="w-4 h-4 text-ifuno-pink" />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-ifuno-green group-hover:text-ifuno-pink transition-colors duration-200">
                          <span className="text-sm font-medium uppercase">Read Full Article</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              ))}

              {/* Regular Posts Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {blogPosts.filter(post => !post.featured).map((post) => (
                  <article 
                    key={post.id}
                    className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-ifuno-pink cursor-pointer group hover:border-ifuno-green transition-colors duration-200"
                    onClick={() => handlePostClick(post)}
                  >
                    <header className="mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 title-stroke group-hover:text-ifuno-green transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-300 leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </header>
                    
                    <footer className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-ifuno-green/20 text-ifuno-green text-xs font-medium rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <span className="text-xs text-gray-400">{post.readTime}</span>
                    </footer>
                  </article>
                ))}
              </div>

              {/* Coming Soon Section */}
              <div className="mt-16 text-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-ifuno-pink">
                  <Code className="w-12 h-12 text-ifuno-green mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">More Tech Content Coming Soon</h3>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    We're working on bringing you more insights into AI, Web3, blockchain, 
                    decentralized identity, and the future of technology. Stay tuned for deep dives 
                    into the tools and platforms shaping tomorrow.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-ifuno-pink bg-black/80 backdrop-blur-sm py-6 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-4">
              <p className="text-ifuno-pink text-sm font-medium uppercase">
                TECH • INNOVATION • FUTURE
              </p>
              
              {/* Tech Blog Link */}
              <div className="pt-4 border-t border-ifuno-pink/30">
                <Link 
                  href="/tech"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-black/70 border border-ifuno-green rounded-lg text-ifuno-green hover:bg-ifuno-green hover:text-black transition-all duration-200 text-sm font-medium uppercase"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Tech Blog</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
