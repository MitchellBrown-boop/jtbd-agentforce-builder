'use client';

import { useState } from 'react';
// Framer Motion temporarily disabled for debugging
// import { motion, AnimatePresence } from 'framer-motion';
import { AppState } from '@/lib/types';
import { learningModules } from '@/data/sample-data';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, BookOpen, Target, Lightbulb, Award, Clock, Users, Zap, RotateCcw } from 'lucide-react';

interface LearningModeProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function LearningMode({ appState, updateAppState }: LearningModeProps) {
  const [currentView, setCurrentView] = useState<'overview' | 'module'>('overview');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const currentModule = learningModules[currentModuleIndex];
  const currentContent = currentModule?.content[currentContentIndex];
  const isLastContent = currentContentIndex === currentModule?.content.length - 1;
  const isLastModule = currentModuleIndex === learningModules.length - 1;

  const startModule = (moduleIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentContentIndex(0);
    setShowQuiz(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentView('module');
  };

  const backToOverview = () => {
    setCurrentView('overview');
  };

  const getModuleIcon = (moduleId: string) => {
    switch (moduleId) {
      case 'jtbd-basics': return BookOpen;
      case 'job-framework': return Target;
      case 'outcome-driven-innovation': return Users;
      case 'jtbd-to-agentforce': return Zap;
      case 'job-hierarchy': return Target;
      case 'job-discovery': return Lightbulb;
      case 'ai-opportunity-mapping': return Zap;
      default: return BookOpen;
    }
  };

  const totalEstimatedMinutes = learningModules.reduce((total, module) =>
    total + (module.estimatedMinutes || 5), 0
  );

  const handleNext = () => {
    if (isLastContent) {
      if (currentModule.quiz && !showQuiz) {
        setShowQuiz(true);
      } else {
        // Mark module as completed
        setCompletedModules(prev => {
          const updated = new Set(prev);
          updated.add(currentModule.id);
          return updated;
        });

        // Return to overview after completing module
        setCurrentView('overview');
      }
    } else {
      setCurrentContentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (showQuiz) {
      setShowQuiz(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else if (currentContentIndex > 0) {
      setCurrentContentIndex(prev => prev - 1);
    } else {
      // Go back to overview if at beginning of module
      setCurrentView('overview');
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
  };

  const resetAllProgress = () => {
    setCompletedModules(new Set());
    setCurrentView('overview');
    setCurrentModuleIndex(0);
    setCurrentContentIndex(0);
    setShowQuiz(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const renderContent = () => {
    if (!currentContent) return null;

    switch (currentContent.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed text-gray-700">
              {currentContent.content}
            </p>
          </div>
        );

      case 'example':
        return (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                {currentContent.content}
              </p>
            </div>

            {currentContent.examples?.map((example, index) => (
              <div key={index} className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Good Example</h4>
                      <p className="text-green-700 whitespace-pre-line">{example.good}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Circle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">Poor Example</h4>
                      <p className="text-red-700">{example.bad}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Why This Matters</h4>
                      <p className="text-blue-700">{example.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed text-gray-700">
              {currentContent.content}
            </p>
          </div>
        );
    }
  };

  const renderQuiz = () => {
    if (!currentModule.quiz || !showQuiz) return null;

    const question = currentModule.quiz[0]; // For now, just show first question

    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Target className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-4">Knowledge Check</h3>
              <p className="text-yellow-700 mb-6">{question.question}</p>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedAnswer === null
                        ? 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                        : selectedAnswer === index
                        ? index === question.correctAnswer
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-red-500 bg-red-50 text-red-800'
                        : index === question.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showExplanation && (
          <div
            className="bg-blue-50 border border-blue-200 rounded-lg p-6"
          >
            <div className="flex items-start space-x-3">
              <BookOpen className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Explanation</h4>
                <p className="text-blue-700">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderModuleOverview = () => (
    <div className="space-y-8">
      {/* Learning Path Header with Reset */}
      <div className="relative text-center">
        <div className="absolute top-0 right-0">
          <button
            onClick={resetAllProgress}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-500 hover:text-red-600 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Learning</span>
          </button>
        </div>

        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Master Jobs-to-be-Done to Agentforce Translation
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Learn authentic Jobs-to-be-Done methodology and discover how to translate customer and employee jobs
          into powerful Agentforce use cases that deliver measurable business value.
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
          <div className="text-sm text-gray-600">
            {completedModules.size} of {learningModules.length} modules completed
          </div>
        </div>

        <div className="flex space-x-2 mb-4">
          {learningModules.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full ${
                completedModules.has(learningModules[index].id)
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">~{totalEstimatedMinutes} minutes total</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">4 interactive modules</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span className="text-gray-600">Practical exercises</span>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningModules.map((module, index) => {
          const IconComponent = getModuleIcon(module.id);
          const isCompleted = completedModules.has(module.id);

          return (
            <div
              key={module.id}
              className="relative bg-white rounded-lg border p-6 transition-all hover:shadow-lg cursor-pointer hover:border-blue-300"
              onClick={() => startModule(index)}
            >
              {/* Module Status */}
              <div className="absolute top-4 right-4">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isCompleted ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    isCompleted ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {module.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {module.content.length} sections • {module.quiz?.length || 0} quiz • {module.estimatedMinutes || 5} min
                    </div>

                    <div className="flex items-center space-x-1 text-blue-600 text-sm font-medium">
                      <span>{isCompleted ? 'Review' : 'Start'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      {completedModules.size === learningModules.length && (
        <div
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-8 text-center"
        >
          <Award className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">🎉 Congratulations!</h3>
          <p className="text-lg mb-6">
            You've mastered the JTBD methodology for employee productivity.
            Ready to build your framework?
          </p>
          <button
            onClick={() => updateAppState({ currentMode: 'building' })}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Building Your Framework
          </button>
        </div>
      )}
    </div>
  );

  const renderModuleContent = () => (
    <div className="max-w-4xl mx-auto">
      {/* Module Header with Back Button and Reset */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={backToOverview}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </button>
          <div className="text-gray-300">•</div>
          <div className="text-sm text-gray-500">
            Module {currentModuleIndex + 1} of {learningModules.length}
          </div>
        </div>

        <button
          onClick={resetAllProgress}
          className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-500 hover:text-red-600 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Learning</span>
        </button>
      </div>

      {/* Progress Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{currentModule?.title}</h2>
          <div className="text-sm text-gray-500">
            {showQuiz ? 'Quiz' : `${currentContentIndex + 1} of ${currentModule?.content.length}`}
          </div>
        </div>

        <div className="flex space-x-4">
          {currentModule?.content.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full ${
                index < currentContentIndex || (isLastContent && showQuiz && showExplanation)
                  ? 'bg-green-500'
                  : index === currentContentIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
          {currentModule?.quiz && (
            <div className={`flex-1 h-2 rounded-full ${
              showQuiz && showExplanation ? 'bg-green-500' : showQuiz ? 'bg-blue-500' : 'bg-gray-200'
            }`} />
          )}
        </div>

        <div className="mt-4">
          <p className="text-gray-600">{currentModule?.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div>
          {showQuiz ? renderQuiz() : renderContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {showQuiz ? (
            <span>Complete quiz to continue</span>
          ) : (
            <span>Section {currentContentIndex + 1} of {currentModule?.content.length}</span>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={isLastModule && isLastContent && (!currentModule.quiz || showExplanation)}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>
            {isLastModule && isLastContent && showExplanation
              ? 'Complete Module'
              : showQuiz && !showExplanation
              ? 'Take Quiz'
              : 'Next'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Module Completion */}
      {isLastModule && isLastContent && showExplanation && (
        <div
          className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center"
        >
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Module Complete! 🎉
          </h3>
          <p className="text-green-700 mb-4">
            You've mastered {currentModule.title}. Ready to continue learning or start building?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={backToOverview}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Continue Learning
            </button>
            <button
              onClick={() => updateAppState({ currentMode: 'building' })}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
            >
              Start Building Framework
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      {currentView === 'overview' ? renderModuleOverview() : renderModuleContent()}
    </div>
  );
}