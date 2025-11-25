import React, { useState, useEffect } from 'react';
import SketchUploader from './components/SketchUploader';
import ChatInterface from './components/ChatInterface';
import GenerationControls from './components/GenerationControls';
import GalleryView from './components/GalleryView';
import ProjectGallery from './components/ProjectGallery';
import ConstructionGuide from './components/ConstructionGuide';
import { analyzeSketch, generateDesign, getConstructionGuide } from './utils/apiClient';

function App() {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sketchImages, setSketchImages] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [designDescription, setDesignDescription] = useState('');
  const [showConstructionGuide, setShowConstructionGuide] = useState(false);
  const [constructionGuideText, setConstructionGuideText] = useState('');
  const [projectName, setProjectName] = useState('');
  const [showProjectNameInput, setShowProjectNameInput] = useState(false);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('fashion-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('fashion-projects', JSON.stringify(projects));
    }
  }, [projects]);

  const handleSketchUpload = (images) => {
    setSketchImages(images);
  };

  const handleSketchAnalyze = async (images) => {
    setLoading(true);
    try {
      // Ensure images are in correct format for API
      const formattedImages = images.map(img => ({
        data: img.data,
        type: img.type
      }));

      const result = await analyzeSketch(formattedImages, messages);

      const newMessage = {
        role: 'assistant',
        content: result.analysis,
        timestamp: result.timestamp,
      };

      setMessages([...messages, newMessage]);
    } catch (error) {
      alert('Error analyzing sketch: ' + error.message);
      console.error('Analyze error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (userMessage) => {
    const userMsg = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    // Check if user is asking for construction guide
    if (userMessage.toLowerCase().includes('how to make') ||
        userMessage.toLowerCase().includes('construction') ||
        userMessage.toLowerCase().includes('how do i make')) {
      await handleConstructionGuideRequest();
      return;
    }

    // Check if user is asking for visual generation
    if (userMessage.toLowerCase().includes('show') ||
        userMessage.toLowerCase().includes('generate') ||
        userMessage.toLowerCase().includes('see') ||
        userMessage.toLowerCase().includes('color')) {

      // Extract design intent and generate
      setLoading(true);
      try {
        // Format images correctly
        const formattedImages = sketchImages.map(img => ({
          data: img.data,
          type: img.type
        }));

        // First get Claude's response about what to generate
        const analysisResult = await analyzeSketch(
          formattedImages,
          newMessages,
          userMessage
        );

        const assistantMsg = {
          role: 'assistant',
          content: analysisResult.analysis,
          timestamp: analysisResult.timestamp,
        };

        setMessages([...newMessages, assistantMsg]);

        // Extract design description for generation
        if (!designDescription && analysisResult.analysis.length > 0) {
          setDesignDescription(analysisResult.analysis.substring(0, 200));
        }

      } catch (error) {
        alert('Error: ' + error.message);
        console.error('Analysis error:', error);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Regular conversation
    setLoading(true);
    try {
      // Format images correctly
      const formattedImages = sketchImages.map(img => ({
        data: img.data,
        type: img.type
      }));

      const result = await analyzeSketch(
        formattedImages,
        newMessages,
        userMessage
      );

      const assistantMsg = {
        role: 'assistant',
        content: result.analysis,
        timestamp: result.timestamp,
      };

      setMessages([...newMessages, assistantMsg]);

      // Try to extract design description from first meaningful response
      if (!designDescription && messages.length < 3) {
        setDesignDescription(result.analysis.substring(0, 200));
      }

    } catch (error) {
      alert('Error: ' + error.message);
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async ({ prompt, size, style }) => {
    setLoading(true);
    try {
      const result = await generateDesign(prompt, { size, style });

      setGeneratedImages([...generatedImages, ...result.images]);

      // Add message about generation
      const msg = {
        role: 'assistant',
        content: `I've generated a visualization for you! Check it out in the gallery below. ${result.images[0].revisedPrompt ? `\n\nNote: ${result.images[0].revisedPrompt}` : ''}`,
        timestamp: result.timestamp,
      };
      setMessages([...messages, msg]);

    } catch (error) {
      alert('Error generating design: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConstructionGuideRequest = async () => {
    setLoading(true);
    try {
      const desc = designDescription || messages.find(m => m.role === 'assistant')?.content || 'the uploaded design';

      // Format images correctly
      const formattedImages = sketchImages.map(img => ({
        data: img.data,
        type: img.type
      }));

      const result = await getConstructionGuide(desc, formattedImages);

      setConstructionGuideText(result.guide);
      setShowConstructionGuide(true);

      const msg = {
        role: 'assistant',
        content: "I've created a detailed construction guide for you! It's opening in a new window. You can print it or copy it for reference.",
        timestamp: result.timestamp,
      };
      setMessages([...messages, msg]);

    } catch (error) {
      alert('Error generating construction guide: ' + error.message);
      console.error('Construction guide error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = () => {
    setShowProjectNameInput(true);
  };

  const confirmSaveProject = () => {
    const name = projectName || `Project ${projects.length + 1}`;

    const project = {
      id: currentProject?.id || Date.now().toString(),
      name,
      timestamp: currentProject?.timestamp || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      sketchImages,
      generatedImages,
      messages,
      designDescription,
      notes: '',
    };

    if (currentProject) {
      // Update existing project
      setProjects(projects.map(p => p.id === project.id ? project : p));
    } else {
      // Add new project
      setProjects([project, ...projects]);
    }

    setCurrentProject(project);
    setShowProjectNameInput(false);
    setProjectName('');
    alert('Project saved!');
  };

  const handleLoadProject = (project) => {
    setCurrentProject(project);
    setSketchImages(project.sketchImages || []);
    setGeneratedImages(project.generatedImages || []);
    setMessages(project.messages || []);
    setDesignDescription(project.designDescription || '');
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (currentProject?.id === projectId) {
      handleNewProject();
    }
  };

  const handleNewProject = () => {
    setCurrentProject(null);
    setSketchImages([]);
    setGeneratedImages([]);
    setMessages([]);
    setDesignDescription('');
    setProjectName('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border shadow-md backdrop-blur-lg bg-opacity-90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-5xl animate-float">✨</div>
            <div>
              <h1 className="font-heading text-3xl font-bold gradient-text">
                Jalah's Design Studio
              </h1>
              <p className="text-sm text-text-secondary mt-1 font-medium">
                Your AI fashion bestie 💕 Turn sketches into magic!
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button onClick={handleNewProject} className="btn-secondary flex items-center space-x-2">
              <span>✨</span>
              <span>New Vibe</span>
            </button>
            <button onClick={handleSaveProject} className="btn-primary flex items-center space-x-2">
              <span>💖</span>
              <span>Save This</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Projects */}
          <div className="lg:col-span-3">
            <div className="card h-[calc(100vh-200px)] overflow-hidden">
              <ProjectGallery
                projects={projects}
                onLoadProject={handleLoadProject}
                onDeleteProject={handleDeleteProject}
                currentProjectId={currentProject?.id}
              />
            </div>
          </div>

          {/* Center - Main Canvas */}
          <div className="lg:col-span-6 space-y-6">
            {/* Sketch Uploader */}
            <div className="card">
              <SketchUploader
                onUpload={handleSketchUpload}
                onAnalyze={handleSketchAnalyze}
              />
            </div>

            {/* Chat Interface */}
            <div className="h-[500px]">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                loading={loading}
              />
            </div>

            {/* Generated Images Gallery */}
            {generatedImages.length > 0 && (
              <div className="card">
                <GalleryView images={generatedImages} />
              </div>
            )}
          </div>

          {/* Right Sidebar - Controls */}
          <div className="lg:col-span-3">
            <div className="card sticky top-6">
              <GenerationControls
                onGenerate={handleGenerate}
                currentDesignDescription={designDescription}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Construction Guide Modal */}
      {showConstructionGuide && (
        <ConstructionGuide
          guide={constructionGuideText}
          onClose={() => setShowConstructionGuide(false)}
        />
      )}

      {/* Project Name Input Modal */}
      {showProjectNameInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-card p-6 max-w-md w-full">
            <h3 className="font-heading text-xl font-bold mb-4">Save Project</h3>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="input-field mb-4"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={confirmSaveProject}
                className="btn-primary flex-1"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowProjectNameInput(false);
                  setProjectName('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
