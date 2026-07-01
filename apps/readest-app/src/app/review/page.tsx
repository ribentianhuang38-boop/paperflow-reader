'use client';

import React, { useState, useEffect } from 'react';
import { MdQuiz, MdMic, MdMicOff, MdArrowForward, MdArrowBack } from 'react-icons/md';
import { useLibraryStore } from '@/store/libraryStore';

interface Paragraph {
  text: string;
  index: number;
}

export default function ReviewPage() {
  const { library } = useLibraryStore();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setCurrentAnswer((prev) => prev + ' ' + transcript);
          setIsListening(false);
        };
        rec.onerror = () => setIsListening(false);
        rec.onend = () => setIsListening(false);
        setRecognition(rec);
      }
    }
  }, []);

  const startReview = (bookHash: string) => {
    setSelectedBook(bookHash);
    const sampleParagraphs: Paragraph[] = [
      { text: 'This paper presents a novel approach to active reading comprehension. The authors propose using spaced repetition and recall testing to improve long-term retention of academic papers.', index: 0 },
      { text: 'The methodology involves three key components: (1) initial reading with annotation, (2) delayed recall testing where users summarize paragraphs from memory, and (3) AI-powered feedback on the accuracy of recall.', index: 1 },
      { text: 'Experimental results show a 40% improvement in retention compared to passive reading. The study involved 200 graduate students reading papers in computer science and biology.', index: 2 },
      { text: 'The key innovation is the integration of large language models for evaluating recall quality. Unlike simple keyword matching, the LLM can understand semantic equivalence and identify specific misconceptions.', index: 3 },
      { text: 'Future work will explore adaptive difficulty scheduling, where the system selects paragraphs for recall based on the user\'s historical performance and the semantic complexity of each section.', index: 4 },
    ];
    setParagraphs(sampleParagraphs);
    setAnswers(new Array(sampleParagraphs.length).fill(''));
    setCurrentIndex(0);
    setCurrentAnswer('');
    setReviewResult(null);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = currentAnswer;
    setAnswers(newAnswers);
    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer(newAnswers[currentIndex + 1] || '');
    }
  };

  const handlePrevious = () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = currentAnswer;
    setAnswers(newAnswers);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentAnswer(newAnswers[currentIndex - 1] || '');
    }
  };

  const handleSubmit = async () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = currentAnswer;
    setAnswers(newAnswers);
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setReviewResult({
      overallScore: 78,
      sectionScores: paragraphs.map((_, i) => ({
        index: i,
        score: Math.floor(Math.random() * 40) + 60,
        judgment: Math.random() > 0.3 ? 'correct' : 'partial',
        feedback: 'Good understanding of the main concept.',
      })),
      suggestions: [
        'Try to recall more specific details about the methodology.',
        'The experimental results section could use more attention.',
      ],
    });
    setIsSubmitting(false);
  };

  const toggleVoice = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!selectedBook) {
    const books = library.filter((b) => !b.deletedAt);
    return (
      <div className="flex flex-col h-full p-4">
        <h2 className="text-lg font-semibold mb-4">Select a Paper to Review</h2>
        {books.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-base-content/40">
            <div className="text-center">
              <MdQuiz size={48} className="mx-auto mb-2" />
              <p>No documents yet</p>
              <p className="text-sm">Import a paper to start reviewing</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto space-y-2">
            {books.map((book) => (
              <button
                key={book.hash}
                className="w-full text-left p-4 bg-base-100 rounded-xl border border-base-300 hover:border-primary transition-colors"
                onClick={() => startReview(book.hash)}
              >
                <div className="font-medium text-sm">{book.title}</div>
                {book.author && <div className="text-xs text-base-content/50 mt-1">{book.author}</div>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (reviewResult) {
    return (
      <div className="flex flex-col h-full p-4 overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Review Results</h2>
        <div className="card bg-base-100 border border-base-300 p-6 mb-4">
          <div className="text-center">
            <div className="text-sm text-base-content/50 mb-2">Overall Understanding</div>
            <div className="radial-progress text-primary text-3xl font-bold"
              style={{ '--value': reviewResult.overallScore, '--size': '120px' } as any}
              role="progressbar">
              {reviewResult.overallScore}%
            </div>
            <div className="text-sm mt-2 text-base-content/60">
              {reviewResult.overallScore >= 80 ? 'Well done!' : 'Keep going!'}
            </div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {reviewResult.sectionScores.map((s: any) => (
            <div key={s.index} className="flex items-center gap-3 p-3 bg-base-100 rounded-lg border border-base-300">
              <span className="text-sm font-medium w-8">#{s.index + 1}</span>
              <div className="flex-1">
                <div className={`badge badge-sm ${s.judgment === 'correct' ? 'badge-success' : 'badge-warning'}`}>{s.judgment}</div>
              </div>
              <span className="text-sm font-semibold">{s.score}%</span>
            </div>
          ))}
        </div>
        <div className="card bg-base-100 border border-base-300 p-4">
          <h3 className="font-semibold text-sm mb-2">Suggestions</h3>
          <ul className="space-y-1">
            {reviewResult.suggestions.map((s: string, i: number) => (
              <li key={i} className="text-sm text-base-content/70">• {s}</li>
            ))}
          </ul>
        </div>
        <button className="btn btn-primary mt-4" onClick={() => setSelectedBook(null)}>Review Another</button>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / paragraphs.length) * 100;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-2">
        <progress className="progress progress-primary w-full" value={progress} max={100}></progress>
        <div className="text-xs text-base-content/50 text-center mt-1">{currentIndex + 1} / {paragraphs.length}</div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-base-100 rounded-xl p-4 border border-base-300 mb-4">
          <p className="text-sm leading-relaxed">{paragraphs[currentIndex]?.text}</p>
        </div>
        <h3 className="font-semibold text-sm mb-2">What does this paragraph mean?</h3>
        <p className="text-xs text-base-content/50 mb-3">Describe what the author is expressing here.</p>
        <textarea
          className="textarea textarea-bordered w-full h-32 text-sm"
          placeholder="Write your recall here..."
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
        />
        <button
          className={`btn btn-outline btn-sm gap-2 mt-3 ${isListening ? 'btn-error' : ''}`}
          onClick={toggleVoice}
        >
          {isListening ? <MdMicOff size={16} /> : <MdMic size={16} />}
          {isListening ? 'Listening...' : 'Voice Input'}
        </button>
      </div>
      <div className="p-4 flex gap-2 border-t border-base-300">
        <button className="btn btn-outline flex-1" onClick={handlePrevious} disabled={currentIndex === 0}>
          <MdArrowBack size={18} /> Previous
        </button>
        {currentIndex < paragraphs.length - 1 ? (
          <button className="btn btn-primary flex-1" onClick={handleNext}>Next <MdArrowForward size={18} /></button>
        ) : (
          <button className="btn btn-primary flex-1" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Finish Review'}
          </button>
        )}
      </div>
    </div>
  );
}
